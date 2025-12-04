import { InfluxDBClient, Point } from "@influxdata/influxdb3-client";
import type {
  LocationModel,
  MeasurementModel,
  SensorModel,
} from "../models.js";
import {
  parseRawLocation,
  parseRawMeasurement,
  parseRawSensor,
} from "../utils/parser.js";
import type { Cache } from "./cache.js";
import { CacheError } from "../types/cacheError.js";
import type { FastifyBaseLogger } from "fastify";
import { InfluxError } from "../types/influxError.js";
import type { MeasurementWhereArgs } from "../types/measurementWhereArgs.js";
import type { Interval } from "../__generated__/types.js";

export class InfluxDB3Service {
  private client: InfluxDBClient;
  private cache: Cache;
  private table: string;
  private logger: FastifyBaseLogger | undefined;

  constructor({
    client,
    cache,
    table,
    logger,
  }: {
    client: InfluxDBClient;
    cache: Cache;
    table: string;
    logger?: FastifyBaseLogger | undefined;
  }) {
    this.client = client;
    this.cache = cache;
    this.table = table;
    this.logger = logger;
  }

  private buildMeasurementFilter({
    args,
  }: {
    args: MeasurementWhereArgs;
  }): string {
    const filterArray = [];

    if (args.interval?.days && args.interval.days > 0) {
      filterArray.push(
        `time > now() - INTERVAL '${args.interval.days} ${args.interval.days > 1 ? "DAYS" : "DAY"}'`,
      );
    } else if (args.interval?.hours) {
      filterArray.push(
        `time > now() - INTERVAL '${args.interval.hours} ${args.interval.hours > 1 ? "HOURS" : "HOUR"}'`,
      );
    }

    if (args.sensorId) filterArray.push(`sensor_id = '${args.sensorId}'`);
    if (args.locationId) filterArray.push(`location_id = '${args.locationId}'`);

    if (filterArray.length < 1) return "";

    const filter = `WHERE ${filterArray.join(" AND ")}`;

    return filter;
  }

  async getLatestMeasurement({
    sensorId,
  }: { sensorId?: string | null | undefined } = {}) {
    let cached = this.cache.getLatestMeasurement({ sensorId });

    if (cached) return cached;

    const filter = sensorId ? `WHERE sensor_id = '${sensorId}'` : "";

    const query = `
      SELECT *
      FROM "${this.table}"
      ${filter}
      ORDER BY time DESC
      LIMIT 1
    `;

    let measurement: MeasurementModel | null = null;
    const result = this.client.query(query);

    for await (const row of result) {
      measurement = parseRawMeasurement(row);
    }

    if (measurement === null) {
      throw new InfluxError("Could not find latest measurement");
    }

    return measurement;
  }

  // get specific measurement object by id
  async getMeasurement({ id }: { id: string }) {
    // try from cache before querying db
    let cached = this.cache.getMeasurement({ id });

    if (cached) return cached;

    const query = `
      SELECT *
      FROM "${this.table}"
      WHERE id = '${id}'
      LIMIT 1
    `;

    const result = this.client.query(query);

    let measurement: MeasurementModel | null = null;
    // only 1 row should
    for await (const row of result) {
      measurement = parseRawMeasurement(row);
    }

    if (measurement === null)
      throw new InfluxError(`Could not find Measurement with id: ${id}`);

    return measurement;
  }

  // get all measurements, optionally filter by location or sensorId
  async getMeasurements({
    sensorId,
    locationId,
    interval,
  }: {
    sensorId?: string | null | undefined;
    locationId?: string | null | undefined;
    interval?: Interval | null | undefined;
  } = {}) {
    // get cached measurements
    const cached = this.cache.getMeasurements({ sensorId, locationId });

    const filter = this.buildMeasurementFilter({
      args: { sensorId, locationId, interval },
    });

    const query = `
      SELECT *
      FROM "${this.table}"
      ${filter}
      ORDER BY time DESC
    `;

    const result = this.client.query(query);
    const measurements: MeasurementModel[] = [];

    for await (const row of result) {
      const measurement = parseRawMeasurement(row);
      measurements.push(measurement);
    }

    return [...cached, ...measurements];
  }

  async getMeasurementsInfo({
    sensorId,
    locationId,
    interval,
  }: {
    sensorId?: string | null | undefined;
    locationId?: string | null | undefined;
    interval?: Interval | null | undefined;
  } = {}): Promise<{
    avg: number;
    min: number;
    max: number;
    measurements: MeasurementModel[];
  }> {
    const measurements = await this.getMeasurements({
      sensorId,
      locationId,
      interval,
    });
    const temps = measurements.flatMap((measurement) => measurement.temp);
    const avg =
      temps.length > 0 ? temps.reduce((a, b) => a + b) / temps.length : 0;
    const min = temps.length > 0 ? Math.min(...temps) : 0;
    const max = temps.length > 0 ? Math.max(...temps) : 0;

    const result = {
      measurements,
      avg,
      min,
      max,
    };

    return result;
  }

  // get a sensor by id
  async getSensor({
    locationId,
    sensorId,
  }: {
    locationId: string;
    sensorId: string;
  }) {
    // try from cache before querying db
    const cached = this.cache.getSensor({ locationId, sensorId });

    if (cached) return cached;

    const query = `
      SELECT sensor_id,location_id
      FROM "${this.table}"
      WHERE sensor_id = '${sensorId}' AND location_id = '${locationId}'
      LIMIT 1
    `;

    const result = this.client.query(query);
    let sensor: SensorModel | null = null;

    for await (const row of result) {
      sensor = parseRawSensor(row);
    }

    if (sensor === null)
      throw new InfluxError(
        `Location "${locationId}" has no sensor with id: ${sensorId}`,
      );

    return sensor;
  }

  // get sensors, optionally fitler by location idj
  async getSensors({
    locationId,
  }: {
    locationId?: string | undefined | null;
  } = {}) {
    const cached = this.cache.getSensors({ locationId });
    const filter = locationId ? `WHERE location_id = '${locationId}'` : "";

    const query = `
      SELECT sensor_id,location_id
      FROM "${this.table}"
      ${filter}
    `;

    const result = this.client.query(query);
    const sensors: SensorModel[] = [];
    const seen: Set<string> = new Set<string>(
      cached.map((sensor) => `${sensor.locationId}:${sensor.id}`),
    ); // track sensors + add cached sensor ids to set

    for await (const row of result) {
      const sensor = parseRawSensor(row);
      const key = `${sensor.locationId}:${sensor.id}`;
      // only push unique sensors
      if (!seen.has(key)) {
        seen.add(key);
        sensors.push(sensor);
      }
    }

    return [...cached, ...sensors];
  }

  async getLocation({ id }: { id: string }) {
    // try cache before querying
    const cached = this.cache.getLocation({ id });

    if (cached) return cached;

    let query = `
      SELECT location_id
      FROM "${this.table}"
      WHERE location_id = '${id}'
      LIMIT 1
    `;

    const result = this.client.query(query);
    let location: LocationModel | null = null;

    for await (const row of result) {
      location = parseRawLocation(row);
    }

    if (location === null)
      throw new InfluxError(`Could not find Location with id: ${id}`);

    return location;
  }

  // TODO:
  // - I'm sure there is a better way to mix the locations from the db and the cached ones,
  // maybe a nice way to query the locations WHERE location_id !== cached location ids or something
  async getLocations() {
    const cached = this.cache.getLocations();
    let query = `
      SELECT location_id
      FROM "${this.table}"
    `;

    const result = this.client.query(query);
    const locations: LocationModel[] = [];
    const seen: Set<string> = new Set<string>(
      cached.map((location) => location.id),
    ); // track locations

    for await (const row of result) {
      const location = parseRawLocation(row);
      if (!seen.has(location.id)) {
        seen.add(location.id);
        locations.push(location); // only push unique locations
      }
    }

    return [...cached, ...locations];
  }

  // write a new measurement to db
  async writeMeasurement({ measurement }: { measurement: MeasurementModel }) {
    // cache location and sensor if not already done
    if (!this.cache.getLocation({ id: measurement.locationId })) {
      this.cache.addLocation({ location: { id: measurement.locationId } });
    }

    if (
      !this.cache.getSensor({
        locationId: measurement.locationId,
        sensorId: measurement.sensorId,
      })
    ) {
      this.cache.addSensor({
        sensor: {
          id: measurement.sensorId,
          locationId: measurement.locationId,
        },
      });
    }

    try {
      this.cache.writeToBuffer({ measurement });
    } catch (err) {
      // CacheError thrown if buffer is full
      if (err instanceof CacheError) {
        if (this.logger) this.logger.info("Flushing WriteBuffer");

        // get measurements from buffer + flush
        const measurements = [measurement, ...this.cache.flushBuffer()];

        // convert to points for writing to db
        const points: Point[] = measurements.map((m) =>
          Point.measurement(this.table)
            .setTag("id", m.id)
            .setTag("sensor_id", m.sensorId)
            .setTag("location_id", m.locationId)
            .setTag("unit", m.unit)
            .setFloatField("temp", m.temp)
            .setTimestamp(m.time.valueOf() * 1_000_000),
        );

        await this.client.write(points);
      } else {
        throw err;
      }
    }
  }
}

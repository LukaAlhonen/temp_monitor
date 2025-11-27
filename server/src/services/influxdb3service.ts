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
    logger?: FastifyBaseLogger;
  }) {
    this.client = client;
    this.cache = cache;
    this.table = table;
    this.logger = logger;
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
      throw new Error(`Could not find Measurement with id: ${id}`);

    return measurement;
  }

  // get all measurements, optionally filter by location or sensorId
  async getMeasurements({
    sensorId,
    locationId,
  }: {
    sensorId?: string | null | undefined;
    locationId?: string | null | undefined;
  } = {}) {
    // get cached measurements
    const cached = this.cache.getMeasurements();

    const filter =
      sensorId && locationId
        ? `WHERE sensor_id = '${sensorId}' AND location_id = '${locationId}'`
        : locationId
          ? `WHERE location_id = '${locationId}'`
          : sensorId
            ? `WHERE sensor_id = '${sensorId}'`
            : "";

    const query = `
      SELECT *
      FROM "${this.table}"
      ${filter}
    `;

    const result = this.client.query(query);
    const measurements: MeasurementModel[] = [];

    for await (const row of result) {
      measurements.push(parseRawMeasurement(row));
    }

    return [...measurements, ...cached];
  }

  // get a sensor by id
  async getSensor({ id }: { id: string }) {
    // try from cache before querying db
    const cached = this.cache.getSensor({ id });

    if (cached) return cached;

    const query = `
      SELECT sensor_id,location_id
      FROM "${this.table}"
      WHERE sensor_id = '${id}'
      LIMIT 1
    `;

    const result = this.client.query(query);
    let sensor: SensorModel | null = null;

    for await (const row of result) {
      sensor = parseRawSensor(row);
    }

    if (sensor === null)
      throw new Error(`Could not find Sensor with id: ${id}`);

    return sensor;
  }

  // get sensors, optionally fitler by location idj
  async getSensors({
    locationId,
  }: {
    locationId?: string | undefined | null;
  } = {}) {
    const filter = locationId ? `WHERE location_id = '${locationId}'` : "";

    const query = `
      SELECT sensor_id,location_id
      FROM "${this.table}"
      ${filter}
    `;

    const result = this.client.query(query);
    const sensors: SensorModel[] = [];

    for await (const row of result) {
      sensors.push(parseRawSensor(row));
    }

    return sensors;
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
      throw new Error(`Could not find Location with id: ${id}`);

    return location;
  }

  async getLocations() {
    let query = `
      SELECT location_id
      FROM "${this.table}"
    `;

    const result = this.client.query(query);
    const locations: LocationModel[] = [];

    for await (const row of result) {
      locations.push(parseRawLocation(row));
    }

    return locations;
  }

  // write a new measurement to db
  async writeMeasurement({ measurement }: { measurement: MeasurementModel }) {
    // cache location and sensor if not already done
    if (!this.cache.getLocation({ id: measurement.locationId }))
      this.cache.addLocation({ location: { id: measurement.locationId } });

    if (!this.cache.getSensor({ id: measurement.sensorId }))
      this.cache.addSensor({
        sensor: {
          id: measurement.sensorId,
          locationId: measurement.locationId,
        },
      });

    try {
      this.cache.writeToBuffer({ measurement });
    } catch (err) {
      // CacheError thrown if buffer is full
      if (err instanceof CacheError) {
        if (this.logger) this.logger.info("Flushing WriteBuffer");

        // get measurements from buffer + flush
        const measurements = [...this.cache.flushBuffer(), measurement];

        // convert to points for writing to db
        const points: Point[] = measurements.map((m) =>
          Point.measurement(this.table)
            .setTag("id", m.id)
            .setTag("sensor_id", m.sensorId)
            .setTag("location_id", m.locationId)
            .setTag("unit", m.unit)
            .setFloatField("temp", m.temp)
            .setTimestamp(m.time),
        );

        await this.client.write(points);
      } else {
        throw err;
      }
    }
  }
}

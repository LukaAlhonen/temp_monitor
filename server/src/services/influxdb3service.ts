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

export class InfluxDB3Service {
  private client: InfluxDBClient;
  private cache: Cache;
  private table: string;
  constructor({
    client,
    cache,
    table,
  }: {
    client: InfluxDBClient;
    cache: Cache;
    table: string;
  }) {
    this.client = client;
    this.cache = cache;
    this.table = table;
  }

  // get specific measurement object by id
  async getMeasurement({ id }: { id: string }) {
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
    let filter =
      sensorId && locationId
        ? `WHERE sensor_id = '${sensorId}' AND location_id = '${locationId}'`
        : locationId
          ? `WHERE location_id = '${locationId}'`
          : sensorId
            ? `WHERE sensor_id = '${sensorId}'`
            : "";

    let query = `
      SELECT *
      FROM "${this.table}"
      ${filter}
    `;

    const result = this.client.query(query);
    const measurements: MeasurementModel[] = [];

    for await (const row of result) {
      measurements.push(parseRawMeasurement(row));
    }

    return measurements;
  }

  // get a sensor by id
  async getSensor({ id }: { id: string }) {
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
    if (!this.cache.getLocation({ id: measurement.locationId }))
      this.cache.addLocation({ location: { id: measurement.locationId } });

    if (!this.cache.getSensor({ id: measurement.sensorId }))
      this.cache.addSensor({
        sensor: {
          id: measurement.sensorId,
          locationId: measurement.locationId,
        },
      });

    const p = Point.measurement(this.table)
      .setTag("id", measurement.id)
      .setTag("sensor_id", measurement.sensorId)
      .setTag("location_id", measurement.locationId)
      .setTag("unit", measurement.unit)
      .setFloatField("temp", measurement.temp)
      .setTimestamp(measurement.time.valueOf());

    await this.client.write(p);
  }
}

import { describe, test, expect, beforeEach } from "vitest";
import { InfluxDBClient } from "@influxdata/influxdb3-client";
import config from "../../config.js";
import { seed_db } from "../../utils/test/seed_db.js";
import { InfluxDB3Service } from "../influxDB3Service.js";
import { Cache } from "../cache.js";
import type { MeasurementModel } from "../../models.js";
import { InfluxError } from "../../types/influxError.js";

describe("influxdb3 integration tests", () => {
  const client = new InfluxDBClient({
    host: config.INFLUX_TEST_HOST,
    database: config.INFLUX_TEST_DATABASE,
    token: "",
  });
  const cache = new Cache({ bufSize: 0 });

  let influxdb3service: InfluxDB3Service;
  let table: string;

  beforeEach(async () => {
    table = `test_${Date.now()}`;
    influxdb3service = new InfluxDB3Service({
      client,
      cache,
      table,
    });
    await seed_db(client, table);
  });

  test("Queries a measurement", async () => {
    const result = await influxdb3service.getMeasurement({ id: "m_01" });

    expect(result.id).toBe("m_01");
    expect(result.locationId).toBeDefined();
    expect(result.sensorId).toBeDefined();
    expect(result.temp).toBeDefined();
    expect(result.unit).toBeDefined();
    expect(result.time).toBeDefined();
  });

  test("Queries a measurement with invalid id", async () => {
    await expect(
      influxdb3service.getMeasurement({ id: "NaN" }),
    ).rejects.toThrow(InfluxError);
  });

  test("Queries all measurements", async () => {
    const result = await influxdb3service.getMeasurements();

    expect(result).toHaveLength(4);
  });

  test("Queries measurements by sensor_id", async () => {
    const result = await influxdb3service.getMeasurements({ sensorId: "s_01" });
    expect(result).toHaveLength(2);
    for (const measurement of result) {
      expect(measurement.sensorId).toBe("s_01");
    }
  });

  test("Queries measurements with invalid sensor_id", async () => {
    await expect(
      influxdb3service.getMeasurements({ sensorId: "NaN" }),
    ).resolves.toHaveLength(0);
  });

  test("Queries measurements by location_id", async () => {
    const result = await influxdb3service.getMeasurements({
      locationId: "l_01",
    });
    expect(result).toHaveLength(2);
    for (const measurement of result) {
      expect(measurement.locationId).toBe("l_01");
    }
  });

  test("Queries measurements with invalid location_id", async () => {
    await expect(
      influxdb3service.getMeasurements({ locationId: "NaN" }),
    ).resolves.toHaveLength(0);
  });

  test("Queries measurements by location_id and sensor_id", async () => {
    const result = await influxdb3service.getMeasurements({
      sensorId: "s_01",
      locationId: "l_01",
    });

    expect(result).toHaveLength(2);
    for (const measurement of result) {
      expect(measurement.sensorId).toBe("s_01");
      expect(measurement.locationId).toBe("l_01");
    }
  });

  test("Queries measuremnts with invalid location_id and sensor_id", async () => {
    await expect(
      influxdb3service.getMeasurements({ locationId: "NaN", sensorId: "NaN" }),
    ).resolves.toHaveLength(0);
  });

  test("Queries a sensor", async () => {
    const result = await influxdb3service.getSensor({ id: "s_01" });

    expect(result.id).toBe("s_01");
    expect(result.locationId).toBeDefined();
  });

  test("Queries a sensors with invalid id", async () => {
    await expect(influxdb3service.getSensor({ id: "NaN" })).rejects.toThrow(
      InfluxError,
    );
  });

  test("Queries all sensors", async () => {
    const result = await influxdb3service.getSensors();
    expect(result).toHaveLength(2);
  });

  test("Queries sensors by location_id", async () => {
    const result = await influxdb3service.getSensors({ locationId: "l_01" });

    expect(result).toHaveLength(1);
    expect(result[0]?.locationId).toBe("l_01");
  });

  test("Queries sensors with invalid location_id", async () => {
    await expect(
      influxdb3service.getSensors({ locationId: "NaN" }),
    ).resolves.toHaveLength(0);
  });

  test("Queries a location", async () => {
    const result = await influxdb3service.getLocation({ id: "l_01" });

    expect(result.id).toBe("l_01");
  });

  test("Queries a location with invalid id", async () => {
    await expect(influxdb3service.getLocation({ id: "NaN" })).rejects.toThrow(
      InfluxError,
    );
  });

  test("Queries all locations", async () => {
    const result = await influxdb3service.getLocations();
    expect(result).toHaveLength(2);
  });

  test("Writes a measurement to the db", async () => {
    const measurement: MeasurementModel = {
      id: "m_10",
      time: new Date(),
      sensorId: "s_10",
      locationId: "l_10",
      unit: "C",
      temp: 30.1,
    };

    await influxdb3service.writeMeasurement({ measurement });

    // flush before querying
    await client.query("SELECT 1").next();

    const result = await influxdb3service.getMeasurement({ id: "m_10" });

    expect(result.id).toBe("m_10");
  });

  test("Queries the latest measurement", async () => {
    const result = await influxdb3service.getLatestMeasurement();
    expect(result.id).toBe("m_04");
  });

  test("Queries the latest measurement by sensorId", async () => {
    const result = await influxdb3service.getLatestMeasurement({
      sensorId: "s_01",
    });

    expect(result.id).toBe("m_02");
  });

  test("Fails to query latest measurement wiht invalid sensorId", async () => {
    await expect(
      influxdb3service.getLatestMeasurement({ sensorId: "NaN" }),
    ).rejects.toThrow(InfluxError);
  });
});

import { afterAll, describe, expect, test } from "vitest";
import { createTestServer } from "../../utils/test/test-server.js";
import { InfluxDB3Service } from "../../services/influxdb3service.js";
import config from "../../config.js";
import { InfluxDBClient } from "@influxdata/influxdb3-client";
import type { Services } from "../../services/index.js";
import { Cache } from "../../services/cache.js";
import { seed_db } from "../../utils/test/seed_db.js";
import type {
  GetSensorsQuery,
  GetMeasurementsQuery,
  GetMeasurementsQueryVariables,
  GetSensorsQueryVariables,
  GetSensorQuery,
  GetSensorQueryVariables,
  GetLocationsQuery,
  GetLocationsQueryVariables,
  GetLocationQuery,
  GetLocationQueryVariables,
} from "../../__generated__/graphql.js";
import { GET_MEASUREMENTS } from "../../utils/test/queries/measurements.graphql.js";
import { GET_SENSOR } from "../../utils/test/queries/sensor.graphql.js";
import { GET_SENSORS } from "../../utils/test/queries/sensors.graphql.js";
import { GET_LOCATIONS } from "../../utils/test/queries/locations.graphql.js";
import { GET_LOCATION } from "../../utils/test/queries/location.graphql.js";

describe("Resolvers integration tests", async () => {
  const cache = new Cache({ bufSize: 10 });

  const client = new InfluxDBClient({
    host: config.INFLUX_TEST_HOST,
    database: config.INFLUX_TEST_DATABASE,
    token: "",
  });

  const table = `test_${Date.now()}`;

  await seed_db(client, table);

  const influxdb3service = new InfluxDB3Service({ cache, client, table });

  const services: Services = { influxdb3service };

  const sensors = await services.influxdb3service.getSensors();
  cache.initSensors({ sensors });
  let server = await createTestServer({ services });

  afterAll(async () => {
    await server.stop();
  });

  describe("Measurements", () => {
    test("queries all measurements", async () => {
      const result = await server.execute<
        GetMeasurementsQuery,
        GetMeasurementsQueryVariables
      >({
        query: GET_MEASUREMENTS,
      });

      expect(result.body.kind).toBe("single");

      if (result.body.kind === "single") {
        const measurements = result.body.singleResult.data?.measurements;

        expect(measurements).toBeDefined();
        expect(measurements?.measurements).toHaveLength(4);
        expect(measurements?.avg).toBe(25.0);
        expect(measurements?.max).toBe(40.0);
        expect(measurements?.min).toBe(10.0);
      }
    });

    test("queries all measurements by sensor_id", async () => {
      const result = await server.execute<
        GetMeasurementsQuery,
        GetMeasurementsQueryVariables
      >({
        query: GET_MEASUREMENTS,
        variables: { sensorId: "s_01" },
      });

      expect(result.body.kind).toBe("single");

      if (result.body.kind === "single") {
        const measurements = result.body.singleResult.data?.measurements;

        expect(measurements).toBeDefined();
        expect(measurements?.measurements).toHaveLength(2);
        expect(measurements?.avg).toBe(15);
        expect(measurements?.max).toBe(20.0);
        expect(measurements?.min).toBe(10.0);
      }
    });

    test("queries all measurements by location_id", async () => {
      const result = await server.execute<
        GetMeasurementsQuery,
        GetMeasurementsQueryVariables
      >({
        query: GET_MEASUREMENTS,
        variables: { locationId: "l_01" },
      });

      expect(result.body.kind).toBe("single");

      if (result.body.kind === "single") {
        const measurements = result.body.singleResult.data?.measurements;

        expect(measurements).toBeDefined();
        expect(measurements?.measurements).toHaveLength(2);
        expect(measurements?.avg).toBe(15);
        expect(measurements?.max).toBe(20.0);
        expect(measurements?.min).toBe(10.0);
      }
    });

    test("queries all measurements by sensor_id + location_id", async () => {
      const result = await server.execute<
        GetMeasurementsQuery,
        GetMeasurementsQueryVariables
      >({
        query: GET_MEASUREMENTS,
        variables: { locationId: "l_01", sensorId: "s_01" },
      });

      expect(result.body.kind).toBe("single");

      if (result.body.kind === "single") {
        const measurements = result.body.singleResult.data?.measurements;

        expect(measurements).toBeDefined();
        expect(measurements?.measurements).toHaveLength(2);
        expect(measurements?.avg).toBe(15);
        expect(measurements?.max).toBe(20.0);
        expect(measurements?.min).toBe(10.0);
      }
    });

    test("queries all measurements within last hour", async () => {
      const result = await server.execute<
        GetMeasurementsQuery,
        GetMeasurementsQueryVariables
      >({
        query: GET_MEASUREMENTS,
        variables: { interval: { hours: 1 } },
      });

      expect(result.body.kind).toBe("single");

      if (result.body.kind === "single") {
        const measurements = result.body.singleResult.data?.measurements;

        expect(measurements).toBeDefined();
        expect(measurements?.measurements).toHaveLength(2);
        expect(measurements?.avg).toBe(15.0);
        expect(measurements?.max).toBe(20.0);
        expect(measurements?.min).toBe(10.0);
      }
    });

    test("queries all measurements within last day", async () => {
      const result = await server.execute<
        GetMeasurementsQuery,
        GetMeasurementsQueryVariables
      >({
        query: GET_MEASUREMENTS,
        variables: { interval: { days: 1 } },
      });

      expect(result.body.kind).toBe("single");

      if (result.body.kind === "single") {
        const measurements = result.body.singleResult.data?.measurements;

        expect(measurements).toBeDefined();
        expect(measurements?.measurements).toHaveLength(4);
        expect(measurements?.avg).toBe(25.0);
        expect(measurements?.max).toBe(40.0);
        expect(measurements?.min).toBe(10.0);
      }
    });

    test("fails to query measurements with invalid sensor_id", async () => {
      const result = await server.execute<
        GetMeasurementsQuery,
        GetMeasurementsQueryVariables
      >({
        query: GET_MEASUREMENTS,
        variables: { sensorId: "NaN" },
      });

      expect(result.body.kind).toBe("single");

      if (result.body.kind === "single") {
        const measurements = result.body.singleResult.data?.measurements;

        expect(measurements).toBeDefined();
        expect(measurements?.measurements).toHaveLength(0);
        expect(measurements?.avg).toBe(0);
        expect(measurements?.max).toBe(0);
        expect(measurements?.min).toBe(0);
      }
    });

    test("fails to query measurements with invalid location_id", async () => {
      const result = await server.execute<
        GetMeasurementsQuery,
        GetMeasurementsQueryVariables
      >({
        query: GET_MEASUREMENTS,
        variables: { locationId: "NaN" },
      });

      expect(result.body.kind).toBe("single");

      if (result.body.kind === "single") {
        const measurements = result.body.singleResult.data?.measurements;

        expect(measurements).toBeDefined();
        expect(measurements?.measurements).toHaveLength(0);
        expect(measurements?.avg).toBe(0);
        expect(measurements?.max).toBe(0);
        expect(measurements?.min).toBe(0);
      }
    });

    test("fails to query measurements with invalid sensor_id + location_id", async () => {
      const result = await server.execute<
        GetMeasurementsQuery,
        GetMeasurementsQueryVariables
      >({
        query: GET_MEASUREMENTS,
        variables: { locationId: "NaN", sensorId: "NaN" },
      });

      expect(result.body.kind).toBe("single");

      if (result.body.kind === "single") {
        const measurements = result.body.singleResult.data?.measurements;

        expect(measurements).toBeDefined();
        expect(measurements?.measurements).toHaveLength(0);
        expect(measurements?.avg).toBe(0);
        expect(measurements?.max).toBe(0);
        expect(measurements?.min).toBe(0);
      }
    });
  });

  describe("Sensors", () => {
    test("queries all sensors", async () => {
      const result = await server.execute<
        GetSensorsQuery,
        GetSensorsQueryVariables
      >({
        query: GET_SENSORS,
      });

      expect(result.body.kind).toBe("single");

      if (result.body.kind === "single") {
        const sensors = result.body.singleResult.data?.sensors;

        expect(sensors).toBeDefined();
        expect(sensors).toHaveLength(2);
        expect(sensors?.map((sensor) => sensor.id)).toContain("s_01");
        expect(sensors?.map((sensor) => sensor.id)).toContain("s_02");

        if (sensors)
          for (const sensor of sensors) {
            if (sensor.id === "s_01") {
              expect(sensor.latestMeasurement.temp).toBe(10.0);
            }
            if (sensor.id === "s_02") {
              expect(sensor.latestMeasurement.temp).toBe(30.0);
            }
          }
      }
    });

    test("queries all sensors by location_id", async () => {
      const result = await server.execute<
        GetSensorsQuery,
        GetSensorsQueryVariables
      >({
        query: GET_SENSORS,
        variables: { locationId: "l_01" },
      });

      expect(result.body.kind).toBe("single");

      if (result.body.kind === "single") {
        const sensors = result.body.singleResult.data?.sensors;

        expect(sensors).toBeDefined();
        expect(sensors).toHaveLength(1);
        expect(sensors?.map((sensor) => sensor.id)).toContain("s_01");
      }
    });

    test("fails to query sensors with invalid location_id", async () => {
      const result = await server.execute<
        GetSensorsQuery,
        GetSensorsQueryVariables
      >({
        query: GET_SENSORS,
        variables: { locationId: "NaN" },
      });

      expect(result.body.kind).toBe("single");

      if (result.body.kind === "single") {
        const sensors = result.body.singleResult.data?.sensors;

        expect(sensors).toBeDefined();
        expect(sensors).toHaveLength(0);
      }
    });

    test("queries sensor by sensor_id + location_id", async () => {
      const result = await server.execute<
        GetSensorQuery,
        GetSensorQueryVariables
      >({
        query: GET_SENSOR,
        variables: {
          sensorId: "s_01",
          locationId: "l_01",
        },
      });

      expect(result.body.kind).toBe("single");

      if (result.body.kind === "single") {
        const sensor = result.body.singleResult.data?.sensor;

        expect(sensor).toBeDefined();
        expect(sensor).toHaveProperty("id", "s_01");
        expect(sensor).toHaveProperty("location.id", "l_01");
      }
    });

    test("fails to query sensor with invalid id", async () => {
      const result = await server.execute<
        GetSensorQuery,
        GetSensorQueryVariables
      >({
        query: GET_SENSOR,
        variables: {
          sensorId: "NaN",
          locationId: "l_01",
        },
      });

      expect(result.body.kind).toBe("single");

      if (result.body.kind === "single") {
        const sensor = result.body.singleResult.data?.sensor;
        const errors = result.body.singleResult.errors;

        expect(sensor).toBeUndefined();
        expect(errors).toBeDefined();
      }
    });
  });

  describe("Locations", () => {
    test("queries all locations", async () => {
      const result = await server.execute<
        GetLocationsQuery,
        GetLocationsQueryVariables
      >({
        query: GET_LOCATIONS,
      });

      expect(result.body.kind).toBe("single");

      if (result.body.kind === "single") {
        const locations = result.body.singleResult.data?.locations;

        expect(locations).toBeDefined();
        expect(locations).toHaveLength(2);
      }
    });

    test("queries location by id", async () => {
      const result = await server.execute<
        GetLocationQuery,
        GetLocationQueryVariables
      >({
        query: GET_LOCATION,
        variables: {
          id: "l_01",
        },
      });

      expect(result.body.kind).toBe("single");

      if (result.body.kind === "single") {
        const location = result.body.singleResult.data?.location;

        expect(location).toBeDefined();
        expect(location).toHaveProperty("id", "l_01");
        expect(location?.sensors).toHaveLength(1);
      }
    });

    test("fails to query location with invalid id", async () => {
      const result = await server.execute<
        GetLocationQuery,
        GetLocationQueryVariables
      >({
        query: GET_LOCATION,
        variables: {
          id: "NaN",
        },
      });

      expect(result.body.kind).toBe("single");

      if (result.body.kind === "single") {
        const location = result.body.singleResult.data?.location;
        const errors = result.body.singleResult.errors;

        expect(location).toBeUndefined();
        expect(errors).toBeDefined();
      }
    });
  });
});

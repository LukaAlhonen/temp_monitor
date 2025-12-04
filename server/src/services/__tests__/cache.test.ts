import { describe, test, expect } from "vitest";
import { Cache } from "../cache.js";
import type {
  LocationModel,
  MeasurementModel,
  SensorModel,
} from "../../models.js";
import { CacheError } from "../../types/cacheError.js";

describe("cache unit tests", () => {
  test("Adds a new Sensor to the cache + checks that it was added", () => {
    const cache = new Cache();
    const sensor: SensorModel = {
      id: "sensor_01",
      locationId: "location_01",
    };
    cache.addSensor({ sensor });

    const cachedSensor = cache.getSensor({
      locationId: sensor.locationId,
      sensorId: sensor.id,
    });

    expect(cachedSensor).toStrictEqual(sensor);
  });

  test("Adds a new Location to the cache + checks that it was added", () => {
    const cache = new Cache();
    const location: LocationModel = {
      id: "location_01",
    };
    cache.addLocation({ location });

    const cachedLocation = cache.getLocation({ id: location.id });

    expect(cachedLocation).toStrictEqual(location);
  });

  test("Inits sensors + checks that all sensors where added to cache", () => {
    const cache = new Cache();
    const sensors: SensorModel[] = [
      {
        id: "sensor_01",
        locationId: "location_01",
      },
      {
        id: "sensor_02",
        locationId: "location_01",
      },
    ];

    cache.initSensors({ sensors });

    const sensor1 = cache.getSensor({
      locationId: "location_01",
      sensorId: "sensor_01",
    });
    const sensor2 = cache.getSensor({
      locationId: "location_01",
      sensorId: "sensor_02",
    });

    expect(sensor1).toStrictEqual(sensors[0]);
    expect(sensor2).toStrictEqual(sensors[1]);
  });

  test("Adds a measurement to the cache + checks that it was added", () => {
    const cache = new Cache();
    const measurement: MeasurementModel = {
      id: "m_01",
      sensorId: "s_01",
      locationId: "l_01",
      temp: 30.1,
      unit: "C",
      time: new Date(),
    };

    // should not throw
    cache.writeToBuffer({ measurement });

    expect(cache.getMeasurement({ id: "m_01" })).toStrictEqual(measurement);
  });

  test("Adds a set of measurements to the cache and checks that they are returned in descending order", () => {
    const cache = new Cache({ bufSize: 10 });
    const measurements: MeasurementModel[] = [
      {
        id: "m_01",
        sensorId: "s_01",
        locationId: "l_01",
        temp: 30.1,
        unit: "C",
        time: new Date(),
      },
      {
        id: "m_02",
        sensorId: "s_01",
        locationId: "l_01",
        temp: 30.1,
        unit: "C",
        time: new Date(),
      },
      {
        id: "m_03",
        sensorId: "s_01",
        locationId: "l_01",
        temp: 30.1,
        unit: "C",
        time: new Date(),
      },
      {
        id: "m_04",
        sensorId: "s_01",
        locationId: "l_01",
        temp: 30.1,
        unit: "C",
        time: new Date(),
      },
    ];

    // should not throw
    for (const measurement of measurements) {
      cache.writeToBuffer({ measurement });
    }

    const result = cache.getMeasurements();

    // last in first out is the correct order
    expect(result[0]).toStrictEqual(measurements[3]);
    expect(result[1]).toStrictEqual(measurements[2]);
    expect(result[2]).toStrictEqual(measurements[1]);
    expect(result[3]).toStrictEqual(measurements[0]);
  });

  test("Overflows the write buffer and checks that it throws a CacheError", () => {
    const cache = new Cache({ bufSize: 1 });
    const measurement1: MeasurementModel = {
      id: "m_01",
      sensorId: "s_01",
      locationId: "l_01",
      temp: 30.1,
      unit: "C",
      time: new Date(),
    };
    const measurement2: MeasurementModel = {
      id: "m_02",
      sensorId: "s_01",
      locationId: "l_01",
      temp: 30.1,
      unit: "C",
      time: new Date(),
    };

    // does not throw
    cache.writeToBuffer({ measurement: measurement1 });

    // throws (buffer overflows)
    expect(() => cache.writeToBuffer({ measurement: measurement2 })).toThrow(
      CacheError,
    );
  });

  test("Flushes the writebuffer and checks that it is empty", () => {
    const cache = new Cache({ bufSize: 4 });
    const measurements: MeasurementModel[] = [
      {
        id: "m_01",
        sensorId: "s_01",
        locationId: "l_01",
        temp: 30.1,
        unit: "C",
        time: new Date(),
      },
      {
        id: "m_02",
        sensorId: "s_01",
        locationId: "l_01",
        temp: 30.1,
        unit: "C",
        time: new Date(),
      },
      {
        id: "m_03",
        sensorId: "s_01",
        locationId: "l_01",
        temp: 30.1,
        unit: "C",
        time: new Date(),
      },
      {
        id: "m_04",
        sensorId: "s_01",
        locationId: "l_01",
        temp: 30.1,
        unit: "C",
        time: new Date(),
      },
    ];

    for (const measurement of measurements) {
      cache.writeToBuffer({ measurement });
    }

    // check returned array
    expect(cache.flushBuffer()).toStrictEqual(measurements.reverse());

    // make sure writeBuffer is empty
    expect(cache.getMeasurements()).toHaveLength(0);
  });

  test("Creates cache with buffersize exceeding the 10_000 limit, throwing an error", () => {
    expect(() => new Cache({ bufSize: 100_000 })).toThrow(CacheError);
  });

  test("Queries measurements from cache by sensorId", () => {
    const cache = new Cache({ bufSize: 4 });
    const measurements: MeasurementModel[] = [
      {
        id: "m_01",
        sensorId: "s_01",
        locationId: "l_01",
        temp: 30.1,
        unit: "C",
        time: new Date(),
      },
      {
        id: "m_02",
        sensorId: "s_01",
        locationId: "l_01",
        temp: 30.1,
        unit: "C",
        time: new Date(),
      },
      {
        id: "m_03",
        sensorId: "s_02",
        locationId: "l_02",
        temp: 30.1,
        unit: "C",
        time: new Date(),
      },
      {
        id: "m_04",
        sensorId: "s_02",
        locationId: "l_02",
        temp: 30.1,
        unit: "C",
        time: new Date(),
      },
    ];

    for (const measurement of measurements) {
      cache.writeToBuffer({ measurement });
    }

    const result = cache.getMeasurements({ sensorId: "s_01" });
    expect(result).toHaveLength(2);
    for (const measurement of result) {
      expect(measurement.sensorId).toBe("s_01");
    }
  });

  test("Queries measurements from cache by locationId", () => {
    const cache = new Cache({ bufSize: 4 });
    const measurements: MeasurementModel[] = [
      {
        id: "m_01",
        sensorId: "s_01",
        locationId: "l_01",
        temp: 30.1,
        unit: "C",
        time: new Date(),
      },
      {
        id: "m_02",
        sensorId: "s_01",
        locationId: "l_01",
        temp: 30.1,
        unit: "C",
        time: new Date(),
      },
      {
        id: "m_03",
        sensorId: "s_02",
        locationId: "l_02",
        temp: 30.1,
        unit: "C",
        time: new Date(),
      },
      {
        id: "m_04",
        sensorId: "s_02",
        locationId: "l_02",
        temp: 30.1,
        unit: "C",
        time: new Date(),
      },
    ];

    for (const measurement of measurements) {
      cache.writeToBuffer({ measurement });
    }

    const result = cache.getMeasurements({ locationId: "l_02" });
    expect(result).toHaveLength(2);
    for (const measurement of result) {
      expect(measurement.locationId).toBe("l_02");
    }
  });

  test("Queries latest measurement from writeBuffer", () => {
    const cache = new Cache({ bufSize: 4 });
    const measurements: MeasurementModel[] = [
      {
        id: "m_01",
        sensorId: "s_01",
        locationId: "l_01",
        temp: 30.1,
        unit: "C",
        time: new Date(),
      },
      {
        id: "m_02",
        sensorId: "s_01",
        locationId: "l_01",
        temp: 30.1,
        unit: "C",
        time: new Date(),
      },
      {
        id: "m_03",
        sensorId: "s_02",
        locationId: "l_02",
        temp: 30.1,
        unit: "C",
        time: new Date(),
      },
      {
        id: "m_04",
        sensorId: "s_02",
        locationId: "l_02",
        temp: 30.1,
        unit: "C",
        time: new Date(),
      },
    ];

    for (const measurement of measurements) {
      cache.writeToBuffer({ measurement });
    }

    const result = cache.getLatestMeasurement();
    expect(result?.id).toBe("m_04");
  });

  test("Queries latest measurement from writeBuffer by sensorId", () => {
    const cache = new Cache({ bufSize: 4 });
    const measurements: MeasurementModel[] = [
      {
        id: "m_01",
        sensorId: "s_01",
        locationId: "l_01",
        temp: 30.1,
        unit: "C",
        time: new Date(),
      },
      {
        id: "m_02",
        sensorId: "s_01",
        locationId: "l_01",
        temp: 30.1,
        unit: "C",
        time: new Date(),
      },
      {
        id: "m_03",
        sensorId: "s_02",
        locationId: "l_02",
        temp: 30.1,
        unit: "C",
        time: new Date(),
      },
      {
        id: "m_04",
        sensorId: "s_02",
        locationId: "l_02",
        temp: 30.1,
        unit: "C",
        time: new Date(),
      },
    ];

    for (const measurement of measurements) {
      cache.writeToBuffer({ measurement });
    }

    const result = cache.getLatestMeasurement({ sensorId: "s_01" });
    expect(result?.id).toBe("m_02");
  });

  test("Fails to query latest measurement from writeBuffer with invalid sensorId", () => {
    const cache = new Cache({ bufSize: 4 });
    const measurements: MeasurementModel[] = [
      {
        id: "m_01",
        sensorId: "s_01",
        locationId: "l_01",
        temp: 30.1,
        unit: "C",
        time: new Date(),
      },
      {
        id: "m_02",
        sensorId: "s_01",
        locationId: "l_01",
        temp: 30.1,
        unit: "C",
        time: new Date(),
      },
      {
        id: "m_03",
        sensorId: "s_02",
        locationId: "l_02",
        temp: 30.1,
        unit: "C",
        time: new Date(),
      },
      {
        id: "m_04",
        sensorId: "s_02",
        locationId: "l_02",
        temp: 30.1,
        unit: "C",
        time: new Date(),
      },
    ];

    for (const measurement of measurements) {
      cache.writeToBuffer({ measurement });
    }

    expect(cache.getLatestMeasurement({ sensorId: "NaN" })).toBeUndefined();
  });
});

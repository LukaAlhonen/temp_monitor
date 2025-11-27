import { describe, test, expect } from "vitest";
import { Cache } from "../cache.js";
import type { LocationModel, SensorModel } from "../../models.js";

describe("cache unit tests", () => {
  test("Adds a new Sensor to the cache + checks that it was added", () => {
    const cache = new Cache();
    const sensor: SensorModel = {
      id: "sensor_01",
      locationId: "location_01",
    };
    cache.addSensor({ sensor });

    const cachedSensor = cache.getSensor({ id: sensor.id });

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

    const sensor1 = cache.getSensor({ id: "sensor_01" });
    const sensor2 = cache.getSensor({ id: "sensor_02" });

    expect(sensor1).toStrictEqual(sensors[0]);
    expect(sensor2).toStrictEqual(sensors[1]);
  });

  test("Inits locations + checks that all locations where added to cache", () => {
    const cache = new Cache();
    const locations: LocationModel[] = [
      {
        id: "location_01",
      },
      {
        id: "location_02",
      },
    ];

    cache.initLocations({ locations });

    const location1 = cache.getLocation({ id: "location_01" });
    const location2 = cache.getLocation({ id: "location_02" });

    expect(location1).toStrictEqual(locations[0]);
    expect(location2).toStrictEqual(locations[1]);
  });
});

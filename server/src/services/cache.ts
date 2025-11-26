import type { SensorModel, LocationModel } from "../models.js";

export class Cache {
  sensors = new Map<string, SensorModel>();
  locations = new Map<string, LocationModel>();

  initSensors({ sensors }: { sensors: SensorModel[] }) {
    sensors.forEach((sensor) => {
      this.sensors.set(sensor.id, sensor);
    });
  }

  initLocations({ locations }: { locations: LocationModel[] }) {
    locations.forEach((location) => {
      this.locations.set(location.id, location);
    });
  }

  addSensor({ sensor }: { sensor: SensorModel }) {
    this.sensors.set(sensor.id, sensor);
  }

  addLocation({ location }: { location: LocationModel }) {
    this.locations.set(location.id, location);
  }

  getSensor({ id }: { id: string }): SensorModel | undefined {
    return this.sensors.get(id);
  }

  getLocation({ id }: { id: string }): LocationModel | undefined {
    return this.locations.get(id);
  }
}

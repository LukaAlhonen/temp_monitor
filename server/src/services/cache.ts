import type {
  SensorModel,
  LocationModel,
  MeasurementModel,
} from "../models.js";
import { CacheError } from "../types/cacheError.js";

export class Cache {
  private sensors: Map<string, SensorModel>;
  private locations: Map<string, LocationModel>;
  private writeBuffer: Map<string, MeasurementModel>;
  private bufSize: number;

  constructor({ bufSize = 100 }: { bufSize?: number } = {}) {
    this.sensors = new Map<string, SensorModel>();
    this.locations = new Map<string, LocationModel>();
    this.writeBuffer = new Map<string, MeasurementModel>();
    this.bufSize = bufSize;
  }

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

  getMeasurement({ id }: { id: string }): MeasurementModel | undefined {
    return this.writeBuffer.get(id);
  }

  getMeasurements({
    locationId,
    sensorId,
  }: { locationId?: string; sensorId?: string } = {}): MeasurementModel[] {
    let result: MeasurementModel[];
    if (locationId && sensorId) {
      result = Array.from(
        this.writeBuffer
          .values()
          .filter(
            (m) => m.locationId === locationId && m.sensorId === sensorId,
          ),
      );
    } else if (locationId) {
      result = Array.from(
        this.writeBuffer.values().filter((m) => m.locationId === locationId),
      );
    } else if (sensorId) {
      result = Array.from(
        this.writeBuffer.values().filter((m) => m.sensorId === sensorId),
      );
    } else {
      result = Array.from(this.writeBuffer.values());
    }

    return result;
  }

  writeToBuffer({ measurement }: { measurement: MeasurementModel }) {
    if (this.writeBuffer.size >= this.bufSize)
      throw new CacheError("Buffer is full");

    this.writeBuffer.set(measurement.id, measurement);
  }

  getBufferSize(): number {
    return this.writeBuffer.size;
  }

  // Returns measurements and flushes buffer
  flushBuffer() {
    const measurements = this.getMeasurements();
    this.writeBuffer.clear();

    return measurements;
  }
}

import type {
  SensorModel,
  LocationModel,
  MeasurementModel,
} from "../models.js";
import { CacheError } from "../types/cacheError.js";

export class Cache {
  private locations: Map<string, Map<string, SensorModel>>;
  private writeBuffer: Map<string, MeasurementModel>;
  private bufSize: number;

  constructor({ bufSize = 100 }: { bufSize?: number } = {}) {
    this.locations = new Map<string, Map<string, SensorModel>>();
    this.writeBuffer = new Map<string, MeasurementModel>();
    if (bufSize > 10_000)
      throw new CacheError("Write buffer size cannot exceed 10000");
    this.bufSize = bufSize;
  }

  initSensors({ sensors }: { sensors: SensorModel[] }) {
    sensors.forEach((sensor) => {
      this.addSensor({ sensor });
    });
  }

  addSensor({ sensor }: { sensor: SensorModel }) {
    const location = this.locations.get(sensor.locationId);
    if (!location) {
      this.locations.set(
        sensor.locationId,
        new Map<string, SensorModel>([[sensor.id, sensor]]),
      );
    } else {
      if (!location.has(sensor.id)) location.set(sensor.id, sensor);
    }
  }

  addLocation({ location }: { location: LocationModel }) {
    if (!this.locations.has(location.id))
      this.locations.set(location.id, new Map<string, SensorModel>());
  }

  getSensor({
    locationId,
    sensorId,
  }: {
    locationId: string;
    sensorId: string;
  }): SensorModel | undefined {
    return this.locations.get(locationId)?.get(sensorId);
  }

  getSensors({
    locationId,
  }: { locationId?: string | undefined | null } = {}): SensorModel[] {
    let sensors: SensorModel[] = [];
    if (!locationId) {
      for (const sensorMap of this.locations.values()) {
        sensors.push(...sensorMap.values());
      }
    } else {
      const sensorMap = this.locations.get(locationId);
      if (sensorMap) sensors.push(...sensorMap.values());
    }

    return sensors;
  }

  getLocation({ id }: { id: string }): LocationModel | undefined {
    const location = this.locations.get(id);
    if (location) return { id: id };
    return undefined;
  }

  getLocations(): LocationModel[] {
    return Array.from(this.locations.keys().map((id) => ({ id: id })));
  }

  getMeasurement({ id }: { id: string }): MeasurementModel | undefined {
    return this.writeBuffer.get(id);
  }

  getLatestMeasurement({
    sensorId,
  }: { sensorId?: string | undefined | null } = {}):
    | MeasurementModel
    | undefined {
    const cached: MeasurementModel[] = sensorId
      ? Array.from(
          this.writeBuffer.values().filter((m) => m.sensorId === sensorId),
        )
      : Array.from(this.writeBuffer.values());

    return cached[cached.length - 1];
  }

  getMeasurements({
    locationId,
    sensorId,
  }: {
    locationId?: string | null | undefined;
    sensorId?: string | null | undefined;
  } = {}): MeasurementModel[] {
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

    return result.reverse();
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

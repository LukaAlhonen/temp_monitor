import type { MeasurementModel } from "../models.js";
import type { MqttMeasurement } from "../types/mqttMeasurement.js";

export const normalizeMeasurement = ({
  jsonPayload,
}: {
  jsonPayload: MqttMeasurement;
}): MeasurementModel => {
  return {
    id: jsonPayload.id,
    time: jsonPayload.time,
    unit: jsonPayload.unit,
    sensorId: jsonPayload.sensor_id,
    locationId: jsonPayload.location_id,
    temp: jsonPayload.temp,
  };
};

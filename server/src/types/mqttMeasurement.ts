export interface MqttMeasurement {
  id: string;
  time: number;
  unit: string;
  sensor_id: string;
  location_id: string;
  temp: number;
}

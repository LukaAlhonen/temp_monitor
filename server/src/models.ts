export type MeasurementModel = {
  id: string;
  time: number;
  temp: number;
  unit: string;
  sensorId: string;
  locationId: string;
};

export type SensorModel = {
  id: string;
  locationId: string;
};

export type LocationModel = {
  id: string;
};

import type {
  LocationModel,
  MeasurementModel,
  SensorModel,
} from "../models.js";

const isString = (input: unknown): input is string => {
  return typeof input === "string" || input instanceof String;
};

const isNumber = (input: unknown): input is number => {
  return typeof input === "number" && Number.isFinite(input);
};

const isDate = (input: unknown): input is number => {
  const timestamp: number = isString(input)
    ? Number(input)
    : isNumber(input)
      ? input
      : NaN;

  return Number.isFinite(timestamp) && !isNaN(new Date(timestamp).getTime());
};

const parseString = (input: unknown): string => {
  if (!isString(input)) throw new Error(`Unable to parse '${input}' as string`);
  return input;
};

const parseNumber = (input: unknown): number => {
  if (!isNumber(input)) throw new Error(`Unable to parse '${input}' as number`);
  return input;
};

const parseDate = (input: unknown): Date => {
  if (!isDate(input)) throw new Error(`Unable to parse '${input}' as date`);
  return new Date(input);
};

export const parseRawMeasurement = (
  raw: Record<string, any>,
): MeasurementModel => {
  return {
    id: parseString(raw["id"]),
    time: parseDate(raw["time"]),
    unit: parseString(raw["unit"]),
    sensorId: parseString(raw["sensor_id"]),
    locationId: parseString(raw["location_id"]),
    temp: parseNumber(raw["temp"]),
  };
};

export const parseRawSensor = (raw: Record<string, any>): SensorModel => {
  return {
    id: raw["sensor_id"],
    locationId: raw["location_id"],
  };
};

export const parseRawLocation = (raw: Record<string, any>): LocationModel => {
  return {
    id: raw["location_id"],
  };
};

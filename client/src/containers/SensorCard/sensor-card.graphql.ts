import { gql } from "../../__generated__";

export const SENSOR_FRAGMENT = gql(`
  fragment SensorFragment on Sensor {
      id
      latestMeasurement {
          id
          temp
          unit
          time
      }
      location {
          id
      }
  }
`);

export const MEASUREMENT_ADDED = gql(`
  subscription MeasurementAdded($sensorId: ID $locationId: ID) {
    measurementAdded(sensorId: $sensorId locationId: $locationId) {
      id
      temp
      time
      unit
      location {
          id
      }
      sensor {
          id
      }
    }
  }
`);

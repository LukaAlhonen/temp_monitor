import { gql } from "../../__generated__";

export const GET_MEASUREMENTS = gql(`
  query GetMeasurements($sensorId: ID! $locationId: ID! $interval: Interval) {
      measurements(sensorId: $sensorId locationId: $locationId interval: $interval) {
          avg
          min
          max
      }
  }
`);

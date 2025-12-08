import { gql } from "graphql-tag";

export const GET_MEASUREMENTS = gql(`
  query GetMeasurements($sensorId: ID $locationId: ID $interval: Interval) {
      measurements(sensorId: $sensorId locationId: $locationId interval: $interval) {
          measurements {
              temp
              time
              unit
              sensor {
                  id
              }
              location {
                  id
              }
          }
          avg
          min
          max
      }
  }
`);

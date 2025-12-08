import { gql } from "graphql-tag";

export const GET_SENSORS = gql(`
  query GetSensors($locationId: ID $interval: Interval) {
      sensors(locationId: $locationId) {
          id
          location {
              id
          }
          latestMeasurement {
              id
              temp
              unit
              time
          }
          measurements(interval: $interval) {
              measurements {
                  id
                  temp
                  unit
                  time
              }
              avg
              min
              max
          }
      }
  }
`);

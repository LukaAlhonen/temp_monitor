import { gql } from "graphql-tag";

export const GET_SENSOR = gql(`
  query GetSensor($sensorId: ID! $locationId: ID! $interval: Interval) {
      sensor(sensorId: $sensorId locationId: $locationId) {
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

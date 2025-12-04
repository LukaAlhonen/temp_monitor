import { gql } from "../../__generated__";

export const GET_SENSOR = gql(`
  query GetSensor($sensorId: ID! $locationId: ID!) {
      sensor(sensorId: $sensorId locationId: $locationId) {
          id
          ...SensorFragment
      }
  }
`);

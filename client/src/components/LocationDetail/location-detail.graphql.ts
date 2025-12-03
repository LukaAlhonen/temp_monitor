import { gql } from "../../__generated__";

export const LOCATION_DETAIL_FRAGMENT = gql(`
  fragment LocationDetailFragment on Location {
      id
      sensors {
          id
          ...SensorFragment
      }
  }
`);

import { gql } from "../../__generated__";

export const LOCATION_OVERVIEW_FRAGMENT = gql(`
  fragment LocationOverviewFragment on Location {
      id
      sensors {
          id
      }
  }
`);

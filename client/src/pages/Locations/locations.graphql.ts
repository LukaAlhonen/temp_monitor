import { gql } from "../../__generated__";

export const GET_LOCATIONS = gql(`
  query GetLocations {
      locations {
          id
          ...LocationOverviewFragment
      }
  }
`);

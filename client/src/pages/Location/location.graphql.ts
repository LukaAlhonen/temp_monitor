import { gql } from "../../__generated__";

export const GET_LOCATION = gql(`
  query GetLocation($id: ID!) {
      location(id: $id) {
          id
          ...LocationDetailFragment
      }
  }
`);

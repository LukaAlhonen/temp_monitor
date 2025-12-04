import { gql } from "graphql-tag";

export const GET_LOCATION = gql(`
  query GetLocation($id: ID!) {
      location(id: $id) {
          id
          sensors {
              id
          }
      }
  }
`);

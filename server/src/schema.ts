import { makeExecutableSchema } from "@graphql-tools/schema";
import { resolvers } from "./resolvers.js";
import { gql } from "graphql-tag";

export const typeDefs = gql`
  scalar Date
  type Query {
    latestMeasurement(sensorId: ID): Measurement!
    measurements(sensorId: ID, locationId: ID): [Measurement!]!
    measurement(id: ID!): Measurement!
    sensor(id: ID!): Sensor!
    sensors(locationId: ID): [Sensor!]!
    location(id: ID!): Location!
    locations: [Location!]!
  }

  type Subscription {
    measurementAdded(sensorId: ID, locationId: ID): Measurement!
  }

  type Measurement {
    id: ID!
    time: Date!
    temp: Float!
    unit: String!
    sensor: Sensor!
    location: Location!
  }

  type Sensor {
    id: ID!
    location: Location!
    measurements: [Measurement!]!
    latestMeasurement: Measurement!
  }

  type Location {
    id: ID!
    sensors: [Sensor!]!
  }
`;

export const schema = makeExecutableSchema({ typeDefs, resolvers });

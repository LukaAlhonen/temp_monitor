import { makeExecutableSchema } from "@graphql-tools/schema";
import { resolvers } from "./resolvers/resolvers.js";
import { gql } from "graphql-tag";

export const typeDefs = gql`
  scalar Date
  type Query {
    latestMeasurement(sensorId: ID): Measurement!
    measurements(
      sensorId: ID
      locationId: ID
      interval: Interval
    ): MeasurementsInfo!
    measurement(id: ID!): Measurement!
    sensor(locationId: ID!, sensorId: ID!): Sensor!
    sensors(locationId: ID): [Sensor!]!
    location(id: ID!): Location!
    locations: [Location!]!
  }

  input Interval {
    hours: Int
    days: Int
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
    measurements(interval: Interval): MeasurementsInfo!
    latestMeasurement: Measurement!
  }

  type Location {
    id: ID!
    sensors: [Sensor!]!
  }

  type MeasurementsInfo {
    measurements: [Measurement!]!
    avg: Float!
    max: Float!
    min: Float!
  }
`;

export const schema = makeExecutableSchema({ typeDefs, resolvers });

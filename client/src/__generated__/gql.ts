/* eslint-disable */
import * as types from './graphql';
import type { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';

/**
 * Map of all GraphQL operations in the project.
 *
 * This map has several performance disadvantages:
 * 1. It is not tree-shakeable, so it will include all operations in the project.
 * 2. It is not minifiable, so the string of a GraphQL query will be multiple times inside the bundle.
 * 3. It does not support dead code elimination, so it will add unused operations.
 *
 * Therefore it is highly recommended to use the babel or swc plugin for production.
 * Learn more about it here: https://the-guild.dev/graphql/codegen/plugins/presets/preset-client#reducing-bundle-size
 */
type Documents = {
    "\n  fragment LocationDetailFragment on Location {\n      id\n      sensors {\n          id\n          ...SensorFragment\n      }\n  }\n": typeof types.LocationDetailFragmentFragmentDoc,
    "\n  fragment LocationOverviewFragment on Location {\n      id\n      sensors {\n          id\n      }\n  }\n": typeof types.LocationOverviewFragmentFragmentDoc,
    "\n  query GetMeasurements($sensorId: ID! $locationId: ID! $interval: Interval) {\n      measurements(sensorId: $sensorId locationId: $locationId interval: $interval) {\n          avg\n          min\n          max\n      }\n  }\n": typeof types.GetMeasurementsDocument,
    "\n  fragment SensorFragment on Sensor {\n      id\n      latestMeasurement {\n          id\n          temp\n          unit\n          time\n      }\n      location {\n          id\n      }\n  }\n": typeof types.SensorFragmentFragmentDoc,
    "\n  subscription MeasurementAdded($sensorId: ID $locationId: ID) {\n    measurementAdded(sensorId: $sensorId locationId: $locationId) {\n      id\n      temp\n      time\n      unit\n      location {\n          id\n      }\n      sensor {\n          id\n      }\n    }\n  }\n": typeof types.MeasurementAddedDocument,
    "\n  query GetLocation($id: ID!) {\n      location(id: $id) {\n          id\n          ...LocationDetailFragment\n      }\n  }\n": typeof types.GetLocationDocument,
    "\n  query GetLocations {\n      locations {\n          id\n          ...LocationOverviewFragment\n      }\n  }\n": typeof types.GetLocationsDocument,
    "\n  query GetSensor($sensorId: ID! $locationId: ID!) {\n      sensor(sensorId: $sensorId locationId: $locationId) {\n          id\n          ...SensorFragment\n      }\n  }\n": typeof types.GetSensorDocument,
};
const documents: Documents = {
    "\n  fragment LocationDetailFragment on Location {\n      id\n      sensors {\n          id\n          ...SensorFragment\n      }\n  }\n": types.LocationDetailFragmentFragmentDoc,
    "\n  fragment LocationOverviewFragment on Location {\n      id\n      sensors {\n          id\n      }\n  }\n": types.LocationOverviewFragmentFragmentDoc,
    "\n  query GetMeasurements($sensorId: ID! $locationId: ID! $interval: Interval) {\n      measurements(sensorId: $sensorId locationId: $locationId interval: $interval) {\n          avg\n          min\n          max\n      }\n  }\n": types.GetMeasurementsDocument,
    "\n  fragment SensorFragment on Sensor {\n      id\n      latestMeasurement {\n          id\n          temp\n          unit\n          time\n      }\n      location {\n          id\n      }\n  }\n": types.SensorFragmentFragmentDoc,
    "\n  subscription MeasurementAdded($sensorId: ID $locationId: ID) {\n    measurementAdded(sensorId: $sensorId locationId: $locationId) {\n      id\n      temp\n      time\n      unit\n      location {\n          id\n      }\n      sensor {\n          id\n      }\n    }\n  }\n": types.MeasurementAddedDocument,
    "\n  query GetLocation($id: ID!) {\n      location(id: $id) {\n          id\n          ...LocationDetailFragment\n      }\n  }\n": types.GetLocationDocument,
    "\n  query GetLocations {\n      locations {\n          id\n          ...LocationOverviewFragment\n      }\n  }\n": types.GetLocationsDocument,
    "\n  query GetSensor($sensorId: ID! $locationId: ID!) {\n      sensor(sensorId: $sensorId locationId: $locationId) {\n          id\n          ...SensorFragment\n      }\n  }\n": types.GetSensorDocument,
};

/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 *
 *
 * @example
 * ```ts
 * const query = gql(`query GetUser($id: ID!) { user(id: $id) { name } }`);
 * ```
 *
 * The query argument is unknown!
 * Please regenerate the types.
 */
export function gql(source: string): unknown;

/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  fragment LocationDetailFragment on Location {\n      id\n      sensors {\n          id\n          ...SensorFragment\n      }\n  }\n"): (typeof documents)["\n  fragment LocationDetailFragment on Location {\n      id\n      sensors {\n          id\n          ...SensorFragment\n      }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  fragment LocationOverviewFragment on Location {\n      id\n      sensors {\n          id\n      }\n  }\n"): (typeof documents)["\n  fragment LocationOverviewFragment on Location {\n      id\n      sensors {\n          id\n      }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  query GetMeasurements($sensorId: ID! $locationId: ID! $interval: Interval) {\n      measurements(sensorId: $sensorId locationId: $locationId interval: $interval) {\n          avg\n          min\n          max\n      }\n  }\n"): (typeof documents)["\n  query GetMeasurements($sensorId: ID! $locationId: ID! $interval: Interval) {\n      measurements(sensorId: $sensorId locationId: $locationId interval: $interval) {\n          avg\n          min\n          max\n      }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  fragment SensorFragment on Sensor {\n      id\n      latestMeasurement {\n          id\n          temp\n          unit\n          time\n      }\n      location {\n          id\n      }\n  }\n"): (typeof documents)["\n  fragment SensorFragment on Sensor {\n      id\n      latestMeasurement {\n          id\n          temp\n          unit\n          time\n      }\n      location {\n          id\n      }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  subscription MeasurementAdded($sensorId: ID $locationId: ID) {\n    measurementAdded(sensorId: $sensorId locationId: $locationId) {\n      id\n      temp\n      time\n      unit\n      location {\n          id\n      }\n      sensor {\n          id\n      }\n    }\n  }\n"): (typeof documents)["\n  subscription MeasurementAdded($sensorId: ID $locationId: ID) {\n    measurementAdded(sensorId: $sensorId locationId: $locationId) {\n      id\n      temp\n      time\n      unit\n      location {\n          id\n      }\n      sensor {\n          id\n      }\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  query GetLocation($id: ID!) {\n      location(id: $id) {\n          id\n          ...LocationDetailFragment\n      }\n  }\n"): (typeof documents)["\n  query GetLocation($id: ID!) {\n      location(id: $id) {\n          id\n          ...LocationDetailFragment\n      }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  query GetLocations {\n      locations {\n          id\n          ...LocationOverviewFragment\n      }\n  }\n"): (typeof documents)["\n  query GetLocations {\n      locations {\n          id\n          ...LocationOverviewFragment\n      }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  query GetSensor($sensorId: ID! $locationId: ID!) {\n      sensor(sensorId: $sensorId locationId: $locationId) {\n          id\n          ...SensorFragment\n      }\n  }\n"): (typeof documents)["\n  query GetSensor($sensorId: ID! $locationId: ID!) {\n      sensor(sensorId: $sensorId locationId: $locationId) {\n          id\n          ...SensorFragment\n      }\n  }\n"];

export function gql(source: string) {
  return (documents as any)[source] ?? {};
}

export type DocumentType<TDocumentNode extends DocumentNode<any, any>> = TDocumentNode extends DocumentNode<  infer TType,  any>  ? TType  : never;
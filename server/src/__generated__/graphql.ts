import type { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
export type GetLocationQueryVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type GetLocationQuery = { __typename?: 'Query', location: { __typename?: 'Location', id: string, sensors: Array<{ __typename?: 'Sensor', id: string }> } };

export type GetLocationsQueryVariables = Exact<{ [key: string]: never; }>;


export type GetLocationsQuery = { __typename?: 'Query', locations: Array<{ __typename?: 'Location', id: string, sensors: Array<{ __typename?: 'Sensor', id: string }> }> };

export type GetMeasurementsQueryVariables = Exact<{
  sensorId?: InputMaybe<Scalars['ID']['input']>;
  locationId?: InputMaybe<Scalars['ID']['input']>;
  interval?: InputMaybe<Interval>;
}>;


export type GetMeasurementsQuery = { __typename?: 'Query', measurements: { __typename?: 'MeasurementsInfo', avg: number, min: number, max: number, measurements: Array<{ __typename?: 'Measurement', temp: number, time: any, unit: string, sensor: { __typename?: 'Sensor', id: string }, location: { __typename?: 'Location', id: string } }> } };

export type GetSensorQueryVariables = Exact<{
  sensorId: Scalars['ID']['input'];
  locationId: Scalars['ID']['input'];
  interval?: InputMaybe<Interval>;
}>;


export type GetSensorQuery = { __typename?: 'Query', sensor: { __typename?: 'Sensor', id: string, location: { __typename?: 'Location', id: string }, latestMeasurement: { __typename?: 'Measurement', id: string, temp: number, unit: string, time: any }, measurements: { __typename?: 'MeasurementsInfo', avg: number, min: number, max: number, measurements: Array<{ __typename?: 'Measurement', id: string, temp: number, unit: string, time: any }> } } };

export type GetSensorsQueryVariables = Exact<{
  locationId?: InputMaybe<Scalars['ID']['input']>;
  interval?: InputMaybe<Interval>;
}>;


export type GetSensorsQuery = { __typename?: 'Query', sensors: Array<{ __typename?: 'Sensor', id: string, location: { __typename?: 'Location', id: string }, latestMeasurement: { __typename?: 'Measurement', id: string, temp: number, unit: string, time: any }, measurements: { __typename?: 'MeasurementsInfo', avg: number, min: number, max: number, measurements: Array<{ __typename?: 'Measurement', id: string, temp: number, unit: string, time: any }> } }> };

/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
  Date: { input: any; output: any; }
};

export type Interval = {
  days?: InputMaybe<Scalars['Int']['input']>;
  hours?: InputMaybe<Scalars['Int']['input']>;
};

export type Location = {
  __typename?: 'Location';
  id: Scalars['ID']['output'];
  sensors: Array<Sensor>;
};

export type Measurement = {
  __typename?: 'Measurement';
  id: Scalars['ID']['output'];
  location: Location;
  sensor: Sensor;
  temp: Scalars['Float']['output'];
  time: Scalars['Date']['output'];
  unit: Scalars['String']['output'];
};

export type MeasurementsInfo = {
  __typename?: 'MeasurementsInfo';
  avg: Scalars['Float']['output'];
  max: Scalars['Float']['output'];
  measurements: Array<Measurement>;
  min: Scalars['Float']['output'];
};

export type Query = {
  __typename?: 'Query';
  latestMeasurement: Measurement;
  location: Location;
  locations: Array<Location>;
  measurement: Measurement;
  measurements: MeasurementsInfo;
  sensor: Sensor;
  sensors: Array<Sensor>;
};


export type QueryLatestMeasurementArgs = {
  sensorId?: InputMaybe<Scalars['ID']['input']>;
};


export type QueryLocationArgs = {
  id: Scalars['ID']['input'];
};


export type QueryMeasurementArgs = {
  id: Scalars['ID']['input'];
};


export type QueryMeasurementsArgs = {
  interval?: InputMaybe<Interval>;
  locationId?: InputMaybe<Scalars['ID']['input']>;
  sensorId?: InputMaybe<Scalars['ID']['input']>;
};


export type QuerySensorArgs = {
  locationId: Scalars['ID']['input'];
  sensorId: Scalars['ID']['input'];
};


export type QuerySensorsArgs = {
  locationId?: InputMaybe<Scalars['ID']['input']>;
};

export type Sensor = {
  __typename?: 'Sensor';
  id: Scalars['ID']['output'];
  latestMeasurement: Measurement;
  location: Location;
  measurements: MeasurementsInfo;
};


export type SensorMeasurementsArgs = {
  interval?: InputMaybe<Interval>;
};

export type Subscription = {
  __typename?: 'Subscription';
  measurementAdded: Measurement;
};


export type SubscriptionMeasurementAddedArgs = {
  locationId?: InputMaybe<Scalars['ID']['input']>;
  sensorId?: InputMaybe<Scalars['ID']['input']>;
};


export const GetLocationDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetLocation"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"location"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"sensors"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]}}]} as unknown as DocumentNode<GetLocationQuery, GetLocationQueryVariables>;
export const GetLocationsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetLocations"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"locations"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"sensors"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]}}]} as unknown as DocumentNode<GetLocationsQuery, GetLocationsQueryVariables>;
export const GetMeasurementsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetMeasurements"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"sensorId"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"locationId"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"interval"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Interval"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"measurements"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"sensorId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"sensorId"}}},{"kind":"Argument","name":{"kind":"Name","value":"locationId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"locationId"}}},{"kind":"Argument","name":{"kind":"Name","value":"interval"},"value":{"kind":"Variable","name":{"kind":"Name","value":"interval"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"measurements"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"temp"}},{"kind":"Field","name":{"kind":"Name","value":"time"}},{"kind":"Field","name":{"kind":"Name","value":"unit"}},{"kind":"Field","name":{"kind":"Name","value":"sensor"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}},{"kind":"Field","name":{"kind":"Name","value":"location"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"avg"}},{"kind":"Field","name":{"kind":"Name","value":"min"}},{"kind":"Field","name":{"kind":"Name","value":"max"}}]}}]}}]} as unknown as DocumentNode<GetMeasurementsQuery, GetMeasurementsQueryVariables>;
export const GetSensorDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetSensor"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"sensorId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"locationId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"interval"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Interval"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"sensor"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"sensorId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"sensorId"}}},{"kind":"Argument","name":{"kind":"Name","value":"locationId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"locationId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"location"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}},{"kind":"Field","name":{"kind":"Name","value":"latestMeasurement"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"temp"}},{"kind":"Field","name":{"kind":"Name","value":"unit"}},{"kind":"Field","name":{"kind":"Name","value":"time"}}]}},{"kind":"Field","name":{"kind":"Name","value":"measurements"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"interval"},"value":{"kind":"Variable","name":{"kind":"Name","value":"interval"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"measurements"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"temp"}},{"kind":"Field","name":{"kind":"Name","value":"unit"}},{"kind":"Field","name":{"kind":"Name","value":"time"}}]}},{"kind":"Field","name":{"kind":"Name","value":"avg"}},{"kind":"Field","name":{"kind":"Name","value":"min"}},{"kind":"Field","name":{"kind":"Name","value":"max"}}]}}]}}]}}]} as unknown as DocumentNode<GetSensorQuery, GetSensorQueryVariables>;
export const GetSensorsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetSensors"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"locationId"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"interval"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Interval"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"sensors"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"locationId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"locationId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"location"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}},{"kind":"Field","name":{"kind":"Name","value":"latestMeasurement"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"temp"}},{"kind":"Field","name":{"kind":"Name","value":"unit"}},{"kind":"Field","name":{"kind":"Name","value":"time"}}]}},{"kind":"Field","name":{"kind":"Name","value":"measurements"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"interval"},"value":{"kind":"Variable","name":{"kind":"Name","value":"interval"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"measurements"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"temp"}},{"kind":"Field","name":{"kind":"Name","value":"unit"}},{"kind":"Field","name":{"kind":"Name","value":"time"}}]}},{"kind":"Field","name":{"kind":"Name","value":"avg"}},{"kind":"Field","name":{"kind":"Name","value":"min"}},{"kind":"Field","name":{"kind":"Name","value":"max"}}]}}]}}]}}]} as unknown as DocumentNode<GetSensorsQuery, GetSensorsQueryVariables>;
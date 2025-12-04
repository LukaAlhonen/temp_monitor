export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
  Date: { input: unknown; output: unknown; }
};

export type Interval = {
  days?: InputMaybe<Scalars['Int']['input']>;
  hours?: InputMaybe<Scalars['Int']['input']>;
};

export type Location = {
  __typename: 'Location';
  id: Scalars['ID']['output'];
  sensors: Array<Sensor>;
};

export type Measurement = {
  __typename: 'Measurement';
  id: Scalars['ID']['output'];
  location: Location;
  sensor: Sensor;
  temp: Scalars['Float']['output'];
  time: Scalars['Date']['output'];
  unit: Scalars['String']['output'];
};

export type MeasurementsInfo = {
  __typename: 'MeasurementsInfo';
  avg: Scalars['Float']['output'];
  max: Scalars['Float']['output'];
  measurements: Array<Measurement>;
  min: Scalars['Float']['output'];
};

export type Query = {
  __typename: 'Query';
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
  __typename: 'Sensor';
  id: Scalars['ID']['output'];
  latestMeasurement: Measurement;
  location: Location;
  measurements: MeasurementsInfo;
};


export type SensorMeasurementsArgs = {
  interval?: InputMaybe<Interval>;
};

export type Subscription = {
  __typename: 'Subscription';
  measurementAdded: Measurement;
};


export type SubscriptionMeasurementAddedArgs = {
  locationId?: InputMaybe<Scalars['ID']['input']>;
  sensorId?: InputMaybe<Scalars['ID']['input']>;
};

export type LocationDetailFragmentFragment = { __typename: 'Location', id: string, sensors: Array<{ __typename: 'Sensor', id: string, latestMeasurement: { __typename: 'Measurement', id: string, temp: number, unit: string, time: unknown }, location: { __typename: 'Location', id: string } }> };

export type LocationOverviewFragmentFragment = { __typename: 'Location', id: string, sensors: Array<{ __typename: 'Sensor', id: string }> };

export type GetMeasurementsQueryVariables = Exact<{
  sensorId: Scalars['ID']['input'];
  locationId: Scalars['ID']['input'];
  interval?: InputMaybe<Interval>;
}>;


export type GetMeasurementsQuery = { measurements: { __typename: 'MeasurementsInfo', avg: number, min: number, max: number } };

export type SensorFragmentFragment = { __typename: 'Sensor', id: string, latestMeasurement: { __typename: 'Measurement', id: string, temp: number, unit: string, time: unknown }, location: { __typename: 'Location', id: string } };

export type MeasurementAddedSubscriptionVariables = Exact<{
  sensorId?: InputMaybe<Scalars['ID']['input']>;
  locationId?: InputMaybe<Scalars['ID']['input']>;
}>;


export type MeasurementAddedSubscription = { measurementAdded: { __typename: 'Measurement', id: string, temp: number, time: unknown, unit: string, location: { __typename: 'Location', id: string }, sensor: { __typename: 'Sensor', id: string } } };

export type GetLocationQueryVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type GetLocationQuery = { location: { __typename: 'Location', id: string, sensors: Array<{ __typename: 'Sensor', id: string, latestMeasurement: { __typename: 'Measurement', id: string, temp: number, unit: string, time: unknown }, location: { __typename: 'Location', id: string } }> } };

export type GetLocationsQueryVariables = Exact<{ [key: string]: never; }>;


export type GetLocationsQuery = { locations: Array<{ __typename: 'Location', id: string, sensors: Array<{ __typename: 'Sensor', id: string }> }> };

export type GetSensorQueryVariables = Exact<{
  sensorId: Scalars['ID']['input'];
  locationId: Scalars['ID']['input'];
}>;


export type GetSensorQuery = { sensor: { __typename: 'Sensor', id: string, latestMeasurement: { __typename: 'Measurement', id: string, temp: number, unit: string, time: unknown }, location: { __typename: 'Location', id: string } } };

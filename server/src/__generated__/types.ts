import type { GraphQLResolveInfo, GraphQLScalarType, GraphQLScalarTypeConfig } from 'graphql';
import type { MeasurementModel, SensorModel, LocationModel } from '../models.js';
import type { MyContext } from '../types/context.js';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;
export type RequireFields<T, K extends keyof T> = Omit<T, K> & { [P in K]-?: NonNullable<T[P]> };
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



export type ResolverTypeWrapper<T> = Promise<T> | T;


export type ResolverWithResolve<TResult, TParent, TContext, TArgs> = {
  resolve: ResolverFn<TResult, TParent, TContext, TArgs>;
};
export type Resolver<TResult, TParent = Record<PropertyKey, never>, TContext = Record<PropertyKey, never>, TArgs = Record<PropertyKey, never>> = ResolverFn<TResult, TParent, TContext, TArgs> | ResolverWithResolve<TResult, TParent, TContext, TArgs>;

export type ResolverFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => Promise<TResult> | TResult;

export type SubscriptionSubscribeFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => AsyncIterable<TResult> | Promise<AsyncIterable<TResult>>;

export type SubscriptionResolveFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => TResult | Promise<TResult>;

export interface SubscriptionSubscriberObject<TResult, TKey extends string, TParent, TContext, TArgs> {
  subscribe: SubscriptionSubscribeFn<{ [key in TKey]: TResult }, TParent, TContext, TArgs>;
  resolve?: SubscriptionResolveFn<TResult, { [key in TKey]: TResult }, TContext, TArgs>;
}

export interface SubscriptionResolverObject<TResult, TParent, TContext, TArgs> {
  subscribe: SubscriptionSubscribeFn<any, TParent, TContext, TArgs>;
  resolve: SubscriptionResolveFn<TResult, any, TContext, TArgs>;
}

export type SubscriptionObject<TResult, TKey extends string, TParent, TContext, TArgs> =
  | SubscriptionSubscriberObject<TResult, TKey, TParent, TContext, TArgs>
  | SubscriptionResolverObject<TResult, TParent, TContext, TArgs>;

export type SubscriptionResolver<TResult, TKey extends string, TParent = Record<PropertyKey, never>, TContext = Record<PropertyKey, never>, TArgs = Record<PropertyKey, never>> =
  | ((...args: any[]) => SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>)
  | SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>;

export type TypeResolveFn<TTypes, TParent = Record<PropertyKey, never>, TContext = Record<PropertyKey, never>> = (
  parent: TParent,
  context: TContext,
  info: GraphQLResolveInfo
) => Maybe<TTypes> | Promise<Maybe<TTypes>>;

export type IsTypeOfResolverFn<T = Record<PropertyKey, never>, TContext = Record<PropertyKey, never>> = (obj: T, context: TContext, info: GraphQLResolveInfo) => boolean | Promise<boolean>;

export type NextResolverFn<T> = () => Promise<T>;

export type DirectiveResolverFn<TResult = Record<PropertyKey, never>, TParent = Record<PropertyKey, never>, TContext = Record<PropertyKey, never>, TArgs = Record<PropertyKey, never>> = (
  next: NextResolverFn<TResult>,
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => TResult | Promise<TResult>;





/** Mapping between all available schema types and the resolvers types */
export type ResolversTypes = {
  Boolean: ResolverTypeWrapper<Scalars['Boolean']['output']>;
  Date: ResolverTypeWrapper<Scalars['Date']['output']>;
  Float: ResolverTypeWrapper<Scalars['Float']['output']>;
  ID: ResolverTypeWrapper<Scalars['ID']['output']>;
  Int: ResolverTypeWrapper<Scalars['Int']['output']>;
  Interval: Interval;
  Location: ResolverTypeWrapper<LocationModel>;
  Measurement: ResolverTypeWrapper<MeasurementModel>;
  MeasurementsInfo: ResolverTypeWrapper<Omit<MeasurementsInfo, 'measurements'> & { measurements: Array<ResolversTypes['Measurement']> }>;
  Query: ResolverTypeWrapper<Record<PropertyKey, never>>;
  Sensor: ResolverTypeWrapper<SensorModel>;
  String: ResolverTypeWrapper<Scalars['String']['output']>;
  Subscription: ResolverTypeWrapper<Record<PropertyKey, never>>;
};

/** Mapping between all available schema types and the resolvers parents */
export type ResolversParentTypes = {
  Boolean: Scalars['Boolean']['output'];
  Date: Scalars['Date']['output'];
  Float: Scalars['Float']['output'];
  ID: Scalars['ID']['output'];
  Int: Scalars['Int']['output'];
  Interval: Interval;
  Location: LocationModel;
  Measurement: MeasurementModel;
  MeasurementsInfo: Omit<MeasurementsInfo, 'measurements'> & { measurements: Array<ResolversParentTypes['Measurement']> };
  Query: Record<PropertyKey, never>;
  Sensor: SensorModel;
  String: Scalars['String']['output'];
  Subscription: Record<PropertyKey, never>;
};

export interface DateScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['Date'], any> {
  name: 'Date';
}

export type LocationResolvers<ContextType = MyContext, ParentType extends ResolversParentTypes['Location'] = ResolversParentTypes['Location']> = {
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  sensors?: Resolver<Array<ResolversTypes['Sensor']>, ParentType, ContextType>;
};

export type MeasurementResolvers<ContextType = MyContext, ParentType extends ResolversParentTypes['Measurement'] = ResolversParentTypes['Measurement']> = {
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  location?: Resolver<ResolversTypes['Location'], ParentType, ContextType>;
  sensor?: Resolver<ResolversTypes['Sensor'], ParentType, ContextType>;
  temp?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  time?: Resolver<ResolversTypes['Date'], ParentType, ContextType>;
  unit?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
};

export type MeasurementsInfoResolvers<ContextType = MyContext, ParentType extends ResolversParentTypes['MeasurementsInfo'] = ResolversParentTypes['MeasurementsInfo']> = {
  avg?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  max?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  measurements?: Resolver<Array<ResolversTypes['Measurement']>, ParentType, ContextType>;
  min?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
};

export type QueryResolvers<ContextType = MyContext, ParentType extends ResolversParentTypes['Query'] = ResolversParentTypes['Query']> = {
  latestMeasurement?: Resolver<ResolversTypes['Measurement'], ParentType, ContextType, Partial<QueryLatestMeasurementArgs>>;
  location?: Resolver<ResolversTypes['Location'], ParentType, ContextType, RequireFields<QueryLocationArgs, 'id'>>;
  locations?: Resolver<Array<ResolversTypes['Location']>, ParentType, ContextType>;
  measurement?: Resolver<ResolversTypes['Measurement'], ParentType, ContextType, RequireFields<QueryMeasurementArgs, 'id'>>;
  measurements?: Resolver<ResolversTypes['MeasurementsInfo'], ParentType, ContextType, Partial<QueryMeasurementsArgs>>;
  sensor?: Resolver<ResolversTypes['Sensor'], ParentType, ContextType, RequireFields<QuerySensorArgs, 'locationId' | 'sensorId'>>;
  sensors?: Resolver<Array<ResolversTypes['Sensor']>, ParentType, ContextType, Partial<QuerySensorsArgs>>;
};

export type SensorResolvers<ContextType = MyContext, ParentType extends ResolversParentTypes['Sensor'] = ResolversParentTypes['Sensor']> = {
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  latestMeasurement?: Resolver<ResolversTypes['Measurement'], ParentType, ContextType>;
  location?: Resolver<ResolversTypes['Location'], ParentType, ContextType>;
  measurements?: Resolver<ResolversTypes['MeasurementsInfo'], ParentType, ContextType, Partial<SensorMeasurementsArgs>>;
};

export type SubscriptionResolvers<ContextType = MyContext, ParentType extends ResolversParentTypes['Subscription'] = ResolversParentTypes['Subscription']> = {
  measurementAdded?: SubscriptionResolver<ResolversTypes['Measurement'], "measurementAdded", ParentType, ContextType, Partial<SubscriptionMeasurementAddedArgs>>;
};

export type Resolvers<ContextType = MyContext> = {
  Date?: GraphQLScalarType;
  Location?: LocationResolvers<ContextType>;
  Measurement?: MeasurementResolvers<ContextType>;
  MeasurementsInfo?: MeasurementsInfoResolvers<ContextType>;
  Query?: QueryResolvers<ContextType>;
  Sensor?: SensorResolvers<ContextType>;
  Subscription?: SubscriptionResolvers<ContextType>;
};


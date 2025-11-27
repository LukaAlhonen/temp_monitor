import { withFilter } from "graphql-subscriptions";
import { type Resolvers } from "./__generated__/types.js";
import { pubsub } from "./pubsub.js";
import type { MeasurementModel } from "./models.js";

export const resolvers: Resolvers = {
  Query: {
    measurement: async (_, { id }, { services }) => {
      const measurement = await services.influxdb3service.getMeasurement({
        id,
      });
      return measurement;
    },

    measurements: (_, { sensorId, locationId }, { services }) => {
      return services.influxdb3service.getMeasurements({
        sensorId,
        locationId,
      });
    },

    sensor: (_, { id }, { services }) => {
      return services.influxdb3service.getSensor({ id });
    },

    sensors: (_, { locationId }, { services }) => {
      return services.influxdb3service.getSensors({ locationId });
    },

    location: (_, { id }, { services }) => {
      return services.influxdb3service.getLocation({ id });
    },

    locations: (_, __, { services }) => {
      return services.influxdb3service.getLocations();
    },
  },

  Subscription: {
    measurementAdded: {
      subscribe: (_, __, ___, ____) =>
        withFilter<
          { measurementAdded: MeasurementModel },
          { sensorId?: string | null }
        >(
          () => pubsub.asyncIterator("MEASUREMENT_ADDED"),
          (payload, variables) => {
            if (!variables?.sensorId) return true;
            return payload?.measurementAdded.sensorId === variables?.sensorId;
          },
        )(),
    },
  },

  Measurement: {
    sensor: ({ sensorId }, _, { services }) => {
      return services.influxdb3service.getSensor({ id: sensorId });
    },
    location: ({ locationId }, _, { services }) => {
      return services.influxdb3service.getLocation({ id: locationId });
    },
  },

  Sensor: {
    location: ({ locationId }, _, { services }) => {
      return services.influxdb3service.getLocation({ id: locationId });
    },
    measurements: ({ id }, _, { services }) => {
      return services.influxdb3service.getMeasurements({ sensorId: id });
    },
  },

  Location: {
    sensors: ({ id }, _, { services }) => {
      return services.influxdb3service.getSensors({ locationId: id });
    },
  },
};

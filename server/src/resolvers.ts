import { withFilter } from "graphql-subscriptions";
import { type Resolvers } from "./__generated__/types.js";
import { pubsub } from "./pubsub.js";
import type { MeasurementModel } from "./models.js";

export const resolvers: Resolvers = {
  Query: {
    latestMeasurement: async (_, { sensorId }, { services }) => {
      const measurement = await services.influxdb3service.getLatestMeasurement({
        sensorId,
      });

      return measurement;
    },
    measurement: async (_, { id }, { services }) => {
      const measurement = await services.influxdb3service.getMeasurement({
        id,
      });
      return measurement;
    },

    measurements: async (_, { sensorId, locationId }, { services }) => {
      const result = await services.influxdb3service.getMeasurements({
        sensorId,
        locationId,
      });

      return result;
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
      subscribe: (_, { sensorId, locationId }, ___, ____) =>
        withFilter<{ measurementAdded: MeasurementModel }>(
          // { sensorId?: string | null; locationId?: string | null }
          () => pubsub.asyncIterator("MEASUREMENT_ADDED"),
          (payload) => {
            if (!sensorId && !locationId) {
              console.log("hello");
              return true;
            } else if (!sensorId) {
              return payload?.measurementAdded.locationId === locationId;
            } else if (!locationId) {
              return payload?.measurementAdded.sensorId === sensorId;
            } else {
              return (
                payload?.measurementAdded.sensorId === sensorId &&
                payload?.measurementAdded.locationId === locationId
              );
            }
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
    latestMeasurement: ({ id }, _, { services }) => {
      return services.influxdb3service.getLatestMeasurement({ sensorId: id });
    },
  },

  Location: {
    sensors: ({ id }, _, { services }) => {
      return services.influxdb3service.getSensors({ locationId: id });
    },
  },
};

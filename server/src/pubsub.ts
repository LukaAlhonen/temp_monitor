import { PubSub } from "graphql-subscriptions";
import type { MeasurementModel } from "./models.js";

export type Events = {
  MEASUREMENT_ADDED: {
    measurementAdded: MeasurementModel;
  };
};

export class TypedPubSub<E> {
  private inner = new PubSub();

  publish<K extends keyof E>(event: K, payload: E[K]) {
    return this.inner.publish(event as string, payload);
  }

  asyncIterator<K extends keyof E>(event: K) {
    return this.inner.asyncIterableIterator(event as string) as AsyncIterator<
      E[K]
    >;
  }
}

export const pubsub = new TypedPubSub<Events>();

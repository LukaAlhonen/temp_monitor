import mqtt, { MqttClient } from "mqtt";
import { normalizeMeasurement } from "../utils/normalizeMeasurement.js";
import type { InfluxDB3Service } from "../services/influxDB3Service.js";
import { TypedPubSub, type Events } from "../pubsub.js";

export class MqttListener {
  private client: MqttClient;
  private influxdb3service: InfluxDB3Service;
  private pubsub: TypedPubSub<Events>;

  constructor({
    url,
    topic,
    influxdb3service,
    pubsub,
  }: {
    url: string;
    topic: string;
    influxdb3service: InfluxDB3Service;
    pubsub: TypedPubSub<Events>;
  }) {
    this.client = mqtt.connect(url);
    this.influxdb3service = influxdb3service;
    this.pubsub = pubsub;

    this.client.on("connect", () => {
      this.client.subscribe(topic, (err) => {
        if (err) throw new Error(`Error subscribing to topic ${topic}: `, err);
      });
    });
  }

  async listen() {
    this.client.on("message", async (_, payload) => {
      const jsonPayload = JSON.parse(payload.toString());
      const normaLizedMeasurement = normalizeMeasurement({ jsonPayload });

      this.influxdb3service.writeMeasurement({
        measurement: normaLizedMeasurement,
      });

      this.pubsub.publish("MEASUREMENT_ADDED", {
        measurementAdded: normaLizedMeasurement,
      });
    });
  }

  close() {
    return this.client.endAsync();
  }
}

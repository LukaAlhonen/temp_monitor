import mqtt, { MqttClient } from "mqtt";
import { normalizeMeasurement } from "../utils/normalizeMeasurement.js";
import { pubsub } from "../pubsub.js";
import type { InfluxDB3Service } from "../services/influxdb3service.js";

export class MqttListener {
  private client: MqttClient;
  private influxdb3service: InfluxDB3Service;

  constructor({
    url,
    topic,
    influxdb3service,
  }: {
    url: string;
    topic: string;
    influxdb3service: InfluxDB3Service;
  }) {
    this.client = mqtt.connect(url);
    this.influxdb3service = influxdb3service;

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

      pubsub.publish("MEASUREMENT_ADDED", {
        sensorLatest: normaLizedMeasurement,
      });
    });
  }

  close() {
    return this.client.endAsync();
  }
}

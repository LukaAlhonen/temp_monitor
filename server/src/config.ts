import dotenv from "dotenv";

dotenv.config();

interface ENV {
  INFLUX_TOKEN: string;
  INFLUX_HOST: string;
  INFLUX_TEST_HOST: string;
  INFLUX_DATABASE: string;
  INFLUX_TEST_DATABASE: string;
  MQTT_BROKER_ADDRESS: string;
  MQTT_TOPIC: string;
}

const getConfig = (): ENV => {
  return {
    INFLUX_TOKEN: process.env.INFLUX_TOKEN ?? "",
    INFLUX_HOST: process.env.INFLUX_HOST ?? "http://localhost:8181",
    INFLUX_TEST_HOST: process.env.INFLUX_TEST_HOST ?? "http://localhost:8182",
    INFLUX_DATABASE: process.env.INFLUX_DATABASE ?? "temperature",
    INFLUX_TEST_DATABASE: process.env.INFLUX_TEST_DATABASE ?? "test",
    MQTT_BROKER_ADDRESS: process.env.MQTT_BROKER_ADDRESS ?? "localhost:1883",
    MQTT_TOPIC: process.env.MQTT_TOPIC ?? "sensors/temp",
  };
};

const config = getConfig();
export default config;

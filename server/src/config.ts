import dotenv from "dotenv";

dotenv.config();

interface ENV {
  INFLUX_TOKEN: string | undefined;
  INFLUX_HOST: string | undefined;
  INFLUX_TEST_HOST: string | undefined;
  INFLUX_DATABASE: string | undefined;
  INFLUX_TEST_DATABASE: string | undefined;
  MQTT_BROKER_ADDRESS: string | undefined;
  MQTT_TOPIC: string | undefined;
}

interface Config {
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
    INFLUX_TOKEN: process.env.INFLUX_TOKEN,
    INFLUX_HOST: process.env.INFLUX_HOST,
    INFLUX_TEST_HOST: process.env.INFLUX_TEST_HOST,
    INFLUX_DATABASE: process.env.INFLUX_DATABASE,
    INFLUX_TEST_DATABASE: process.env.INFLUX_TEST_DATABASE,
    MQTT_BROKER_ADDRESS: process.env.MQTT_BROKER_ADDRESS,
    MQTT_TOPIC: process.env.MQTT_TOPIC,
  };
};

const getSanitizedConfig = (config: ENV): Config => {
  for (const [key, value] of Object.entries(config)) {
    if (value === undefined) {
      throw new Error(`Missing key ${key} in .env`);
    } else if (value instanceof String || typeof value === "string") {
      if (value.trim() === "") {
        throw new Error(`${key} cannot be empty`);
      }
    }
  }

  return config as Config;
};

const config = getConfig();
const sanitizedConfig = getSanitizedConfig(config);

export default sanitizedConfig;

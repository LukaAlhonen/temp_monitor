import Fastify, { type FastifyInstance } from "fastify";
import { ApolloServer } from "@apollo/server";
import fastifyApollo, {
  type ApolloFastifyContextFunction,
} from "@as-integrations/fastify";
import type { MyContext } from "./types/context.js";
import { schema } from "./schema.js";
import { createServices } from "./services/index.js";
import { InfluxDBClient } from "@influxdata/influxdb3-client";
import config from "./config.js";
import { WebSocketServer } from "ws";
import { useServer } from "graphql-ws/use/ws";
import { Cache } from "./services/cache.js";
import { MqttListener } from "./listeners/mqttListener.js";
import { pubsub } from "./pubsub.js";
import type { Disposable } from "graphql-ws";

let wsCleanup: Disposable;
let mqttListener: MqttListener;
let influxdbClient: InfluxDBClient;
let fastify: FastifyInstance;

const startApolloServer = async () => {
  fastify = Fastify({
    logger: true,
  });

  const logger = fastify.log;

  const apolloServer = new ApolloServer<MyContext>({
    schema,
  });

  await apolloServer.start();

  const cache = new Cache({ bufSize: 100 });
  influxdbClient = new InfluxDBClient({
    host: config.INFLUX_HOST,
    database: config.INFLUX_DATABASE,
    token: config.INFLUX_TOKEN,
  });
  const services = createServices({
    influxdbClient,
    cache,
    table: "temp_readings",
    logger,
  });

  // load sensor and location objects from influxdb into cache
  const sensors = await services.influxdb3service.getSensors();
  const locations = await services.influxdb3service.getLocations();

  cache.initLocations({ locations });
  cache.initSensors({ sensors });

  const myContextFunction: ApolloFastifyContextFunction<
    MyContext
  > = async () => ({
    services,
  });

  await fastify.register(fastifyApollo(apolloServer), {
    context: myContextFunction,
  });

  fastify.addHook("onReady", async () => {
    const wsServer = new WebSocketServer({
      server: fastify.server,
      path: "/graphql",
    });

    wsCleanup = useServer(
      {
        schema,
        context: async () => ({ services }),
      },
      wsServer,
    );

    fastify.log.info(
      "Websocket server listening on ws://localhost:4000/graphql",
    );

    mqttListener = new MqttListener({
      url: "mqtt://localhost:1883",
      topic: "sensors/temp",
      influxdb3service: services.influxdb3service,
      pubsub,
    });

    mqttListener
      .listen()
      .then(() => fastify.log.info("Mqtt listener started"))
      .catch((err) => fastify.log.error(err));
  });

  const start = async () => {
    try {
      await fastify.listen({ port: 4000 });
    } catch (err) {
      fastify.log.error(err);
      process.exit(1);
    }
  };
  start();
};

let isShuttingDown = false;

const shutdown = async (signal: string) => {
  if (isShuttingDown) return;
  isShuttingDown = true;
  console.log();
  console.log(`Received ${signal}, shutting down...`);

  try {
    if (wsCleanup) {
      await wsCleanup.dispose();
      console.log("WebSocket server closed");
    }
    if (influxdbClient) {
      await influxdbClient.close();
      console.log("InfluxDBClient closed");
    }
    if (mqttListener) {
      await mqttListener.close();
      console.log("Mqtt listener closed");
    }

    if (fastify) {
      await fastify.close();
      console.log("Server shut down");
    }

    process.exit(0);
  } catch (err) {
    console.error(`Error shutting down: ${err}`);
  }
};

process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);

startApolloServer();

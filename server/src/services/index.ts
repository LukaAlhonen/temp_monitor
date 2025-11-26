import type { Cache } from "./cache.js";
import { InfluxDB3Service } from "./influxdb3service.js";
import type { InfluxDBClient } from "@influxdata/influxdb3-client";

export type Services = {
  influxdb3service: InfluxDB3Service;
};

export const createServices = ({
  influxdbClient,
  cache,
  table,
}: {
  influxdbClient: InfluxDBClient;
  cache: Cache;
  table: string;
}): Services => {
  return {
    influxdb3service: new InfluxDB3Service({
      client: influxdbClient,
      cache,
      table,
    }),
  };
};

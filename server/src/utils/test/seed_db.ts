import { type InfluxDBClient, Point } from "@influxdata/influxdb3-client";

export async function seed_db(
  client: InfluxDBClient,
  table: string,
): Promise<void> {
  const measurements: Point[] = [
    Point.measurement(table)
      .setTag("id", "m_01")
      .setTag("sensor_id", "s_01")
      .setTag("location_id", "l_01")
      .setTag("unit", "C")
      .setFloatField("temp", 10.0)
      .setTimestamp(Date.now() * 1_000_000),

    Point.measurement(table)
      .setTag("id", "m_02")
      .setTag("sensor_id", "s_01")
      .setTag("location_id", "l_01")
      .setTag("unit", "C")
      .setFloatField("temp", 20.0)
      .setTimestamp((Date.now() - 1) * 1_000_000),

    Point.measurement(table)
      .setTag("id", "m_03")
      .setTag("sensor_id", "s_02")
      .setTag("location_id", "l_02")
      .setTag("unit", "C")
      .setFloatField("temp", 30.0)
      .setTimestamp((Date.now() - 2 * (60 * 60 * 1000)) * 1_000_000),

    Point.measurement(table)
      .setTag("id", "m_04")
      .setTag("sensor_id", "s_02")
      .setTag("location_id", "l_02")
      .setTag("unit", "C")
      .setFloatField("temp", 40.0)
      .setTimestamp((Date.now() - 3 * (60 * 60 * 1000)) * 1_000_000),
  ];

  await client.write(measurements);
  await client.query("SELECT 1").next();
}

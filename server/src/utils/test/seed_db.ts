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
      .setFloatField("temp", 30.0)
      .setTimestamp(Date.now()),

    Point.measurement(table)
      .setTag("id", "m_02")
      .setTag("sensor_id", "s_01")
      .setTag("location_id", "l_01")
      .setTag("unit", "C")
      .setFloatField("temp", 30.0)
      .setTimestamp(Date.now() + 1),

    Point.measurement(table)
      .setTag("id", "m_03")
      .setTag("sensor_id", "s_02")
      .setTag("location_id", "l_02")
      .setTag("unit", "C")
      .setFloatField("temp", 30.0)
      .setTimestamp(Date.now() + 2),

    Point.measurement(table)
      .setTag("id", "m_04")
      .setTag("sensor_id", "s_02")
      .setTag("location_id", "l_02")
      .setTag("unit", "C")
      .setFloatField("temp", 30.0)
      .setTimestamp(Date.now() + 3),
  ];

  await client.write(measurements);
  await client.query("SELECT 1").next();
}

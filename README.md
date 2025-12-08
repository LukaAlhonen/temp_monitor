# temp_monitor

## A simulated IoT temperature monitoring system

### Architecture

The system is composed of the following components

<strong>mqtt publisher</strong>
- "reads" temperature measurements from a sensors and publishes them to a given topic

<strong>database</strong>
- An influxdb3 core instance

<strong>server</strong>
- A graphql/fastify nodejs server written in typescript.
- For simplicity, the server functions both as an mqtt client subscriber that writes received data to the db and as a webserver
- Graphql subscriptions have been implemented using websockets to enable "real-time" monitoring of all the connected sensors

<strong>client</strong>
- A apollo-client/react app written in typescript that displays both real-time data and some historical aggregate data from the sensors

### Run the system

#### Database + Mqtt Broker
To start the mqtt broker and influxdb3 database just navigate to the /docker directory and start the containers
```bash
cd docker
docker compose up -d
```

Before data can be written to the inluxdb3 database, an auth token + a database and table have to be created, see:
https://docs.influxdata.com/influxdb3/core/

#### Server
With the db and broker running the server can be started with the following command:
```bash
docker run --init \
-e INFLUX_TOKEN="<INFLUXDB3-token>" \
-e INFLUX_HOST="http://<INFLUXDB3-address>:8181" \
-e INFLUX_DATABASE="<INFLUXDB3-database>" \
-e MQTT_BROKER_ADDRESS="<MQTT_BROKER_ADDRESS>:1883" \
-e MQTT_TOPIC="<MQTT_TOPIC>" \
-p 4000:4000 \
ghcr.io/lukaalhonen/temp_monitor-server:latest
```

#### Client
The client can be started with the command:
```bash
docker run \
-e GRAPHQL_URL="http://<SERVER_ADDRESS>:4000/graphql" \
-p 80:80 ghcr.io/lukaalhonen/temp_monitor-client:latest
```

#### Publisher
The mqtt_publishers can be started with the following command:
```bash
docker run --init \
-e MQTT_BROKER_ADDRESS="<MQTT_BROKER_ADDRESS>" \
-e MQTT_BROKER_PORT=1883 \
-e MQTT_TOPIC="<MQTT_TOPIC>" \
-e LOCATION_ID="<LOCATION_ID>" \
-e SENSOR_ID="<SENSOR_ID>" \
ghcr.io/lukaalhonen/temp_monitor-mqtt_publisher:latest
```

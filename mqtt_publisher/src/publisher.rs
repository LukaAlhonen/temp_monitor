use crate::temp_measurement::TemperatureMeasurement;
use log::{error, info};
use std::time::Duration;
use tokio::{task, time};

use crate::sensor::Sensor;
use rumqttc::v5::{AsyncClient, ClientError, Event, MqttOptions, mqttbytes::QoS};
use uuid::Uuid;

pub struct Publisher {
    client: AsyncClient,
    sensor: Sensor,
    location_id: String,
    sensor_id: String,
}

impl Publisher {
    pub fn new(
        broker_address: String,
        broker_port: u16,
        location_id: String,
        sensor_id: String,
    ) -> Self {
        let name = format!("pub:{}", Uuid::new_v4());
        let mut mqttoptions = MqttOptions::new(name, broker_address, broker_port);
        mqttoptions.set_keep_alive(Duration::from_secs(5));
        let (client, mut eventloop) = AsyncClient::new(mqttoptions, 10);

        // start background poll when client is created so published messages do not get stuck
        task::spawn(async move {
            loop {
                match eventloop.poll().await {
                    Ok(Event::Incoming(incoming)) => info!("Incoming: {:?}", incoming),
                    Ok(Event::Outgoing(outgoing)) => info!("Outgoing: {:?}", outgoing),
                    Err(err) => error!("Error: {}", err),
                }
            }
        });

        // create sensor
        let mut sensor = Sensor::new();
        sensor._seed(10.0);

        Publisher {
            client: client,
            sensor,
            location_id,
            sensor_id,
        }
    }

    // publish new message to a chosen topic
    pub async fn publish(&self, topic: &str, payload: String) -> Result<(), ClientError> {
        println!("{:?}", payload);
        self.client
            .publish(topic, QoS::AtLeastOnce, false, payload)
            .await
    }

    // start publishing loop
    pub async fn run(&mut self, topic: &str) {
        loop {
            let temp = self.sensor.read();
            let measurement: TemperatureMeasurement =
                TemperatureMeasurement::new(temp, "Celsius", &self.sensor_id, &self.location_id);

            match measurement.into_payload() {
                Ok(payload) => match &self.publish(topic, payload).await {
                    Ok(_) => info!("Message published to topic {}", topic),
                    Err(err) => error!("Error publishing message to topic {}: {:?}", topic, err),
                },
                Err(err) => error!("Error parsing measurement {:?}: {:?}", measurement, err),
            }

            // sleep for 30 seconds before publishing again
            time::sleep(Duration::from_millis(3000)).await;
        }
    }
}

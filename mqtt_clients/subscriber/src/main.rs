use log::{error, info};
use rumqttc::v5::{AsyncClient, Event, Incoming, MqttOptions, mqttbytes::QoS};
use std::time::Duration;

#[tokio::main]
async fn main() {
    env_logger::init();
    let broker_address = "localhost";
    let broker_port = 1883;
    let topic = "temp/reading";
    let mut mqttoptions = MqttOptions::new("sub-1", broker_address, broker_port);
    mqttoptions.set_keep_alive(Duration::from_secs(5));
    let (client, mut eventloop) = AsyncClient::new(mqttoptions, 10);

    // subscribe to topic and wait for suback before proceeding
    match client.subscribe(topic, QoS::AtLeastOnce).await {
        Ok(_) => info!("Subscribing to topic {}", topic),
        Err(err) => error!("Error subscribing to topic {:1}: {:2}", topic, err),
    }

    loop {
        match eventloop.poll().await {
            Ok(Event::Incoming(Incoming::SubAck(_))) => {
                info!("Succesfully subscribed to topic {}", topic);
                break;
            }
            Ok(_) => {}
            Err(err) => {
                error!("Error subscribing: {}", err)
            }
        }
    }

    // poll messages from eventloop and write to console
    loop {
        let message = eventloop.poll().await;

        match message {
            Ok(rumqttc::v5::Event::Incoming(rumqttc::v5::Incoming::Publish(publish))) => {
                info!("Incoming message on topic {}: {:?}", topic, publish)
            }
            Ok(_) => {
                info!("{:?}", message);
            }
            Err(e) => {
                error!("Connecion error: {:?}", e);
                break;
            }
        }
    }
}

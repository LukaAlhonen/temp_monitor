pub mod publisher;
pub mod sensor;
pub mod temp_measurement;

use std::env;

use dotenvy::dotenv;

use crate::publisher::Publisher;

#[tokio::main]
async fn main() {
    env_logger::init(); // init logger

    // load env vars
    dotenv().ok();
    let mqtt_broker_address =
        env::var("MQTT_BROKER_ADDRESS").expect("MQTT_BROKER_ADDRESS must be set");
    let mqtt_broker_port = env::var("MQTT_BROKER_PORT").expect("MQTT_BROKER_PORT must be set");
    let mqtt_topic = env::var("MQTT_TOPIC").expect("MQTT_TOPIC must be set");
    let location = env::var("LOCATION").expect("LOCATION must be set");

    let publisher = Publisher::new(
        mqtt_broker_address,
        mqtt_broker_port
            .parse()
            .expect("failed to parse mqtt_broker_port"),
        location,
    );

    // start publisher
    publisher.run(&mqtt_topic).await;
}

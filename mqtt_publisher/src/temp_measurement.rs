use anyhow::{Error, Result};
use serde::{Deserialize, Serialize};
use serde_json::{from_str, to_string};
use std::time::{SystemTime, UNIX_EPOCH};

#[derive(Serialize, Deserialize, Debug, PartialEq)]
pub struct TemperatureMeasurement {
    time: i64,
    data: f32,
    unit: String,
    id: String,
    sensor_id: String,
    location: String,
}

impl TemperatureMeasurement {
    pub fn new(data: f32, unit: &str, sensor_id: &str, location: &str) -> Self {
        let time = SystemTime::now()
            .duration_since(UNIX_EPOCH)
            .expect("Time has gone backwards")
            .as_nanos() as i64;

        TemperatureMeasurement {
            time,
            data,
            unit: String::from(unit),
            id: String::from(unit),
            sensor_id: String::from(sensor_id),
            location: String::from(location),
        }
    }

    // Convert mqtt payload into measurement
    pub fn from_payload(payload: &str) -> Result<Self, Error> {
        let measurement: TemperatureMeasurement = from_str(payload)?;
        Ok(measurement)
    }

    // Convert measurement into mqtt payload
    pub fn into_payload(&self) -> Result<String, Error> {
        let payload = to_string(&self)?;
        println!("{}", payload);
        Ok(payload)
    }
}

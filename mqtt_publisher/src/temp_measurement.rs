use anyhow::{Error, Result};
use serde::{Deserialize, Serialize};
use serde_json::{from_str, to_string};
use std::time::{SystemTime, UNIX_EPOCH};
use uuid::Uuid;

#[derive(Serialize, Deserialize, Debug, PartialEq)]
pub struct TemperatureMeasurement {
    time: i64,
    temp: f32,
    unit: String,
    id: String,
    sensor_id: String,
    location_id: String,
}

impl TemperatureMeasurement {
    pub fn new(temp: f32, unit: &str, sensor_id: &str, location_id: &str) -> Self {
        let time = SystemTime::now()
            .duration_since(UNIX_EPOCH)
            .expect("Time has gone backwards")
            .as_millis() as i64;

        TemperatureMeasurement {
            time,
            temp,
            unit: String::from(unit),
            id: Uuid::new_v4().to_string(),
            sensor_id: String::from(sensor_id),
            location_id: String::from(location_id),
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
        Ok(payload)
    }
}

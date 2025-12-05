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

#[cfg(test)]
mod tests {
    use crate::temp_measurement::TemperatureMeasurement;

    #[test]
    fn test_create_temp_measurement() {
        let temp: f32 = 30.0;
        let unit = "c";
        let sensor_id = "s_01";
        let location_id = "l_01";
        let measurement = TemperatureMeasurement::new(temp, unit, sensor_id, location_id);

        assert_eq!(measurement.temp, temp);
        assert_eq!(measurement.unit, unit);
        assert_eq!(measurement.sensor_id, sensor_id);
        assert_eq!(measurement.location_id, location_id);
    }

    #[test]
    fn test_create_measurement_from_payload() {
        let time: i64 = 1764932827557;
        let temp = 30.0;
        let unit = "c";
        let id = "998c3da3-ac52-4f20-8a7e-b0c4b0431349";
        let sensor_id = "s_01";
        let location_id = "l_01";

        let payload = format!(
            r#"{{"time":{},"temp":{:.1},"unit":"{}","id":"{}","sensor_id":"{}","location_id":"{}"}}"#,
            time, temp, unit, id, sensor_id, location_id
        );

        let measurement = TemperatureMeasurement::from_payload(payload.as_str()).unwrap();

        assert_eq!(
            measurement,
            TemperatureMeasurement {
                id: String::from(id),
                sensor_id: String::from(sensor_id),
                location_id: String::from(location_id),
                temp,
                time,
                unit: String::from(unit)
            }
        )
    }

    #[test]
    fn test_create_payload_from_measurement() {
        let temp: f32 = 30.0;
        let unit = "c";
        let sensor_id = "s_01";
        let location_id = "l_01";
        let measurement = TemperatureMeasurement::new(temp, unit, sensor_id, location_id);
        let payload = measurement.into_payload().unwrap();
        assert_eq!(
            payload,
            format!(
                r#"{{"time":{},"temp":{:.1},"unit":"{}","id":"{}","sensor_id":"{}","location_id":"{}"}}"#,
                measurement.time,
                measurement.temp,
                measurement.unit,
                measurement.id,
                measurement.sensor_id,
                measurement.location_id
            )
        );
    }
}

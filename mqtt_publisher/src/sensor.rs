use rand::Rng;

// Represent a soil moisture sensor
pub struct Sensor {
    seed: f32,
}

impl Sensor {
    pub fn new() -> Self {
        Sensor { seed: 30.0 }
    }

    // seed sensor
    pub fn _seed(&mut self, seed: f32) {
        self.seed = seed;
    }

    // read from sensor
    pub fn read(&mut self) -> f32 {
        let mut rng = rand::rng();
        let value = &self.seed + rng.random_range(-1.0..1.0);
        self.seed = value;
        value
    }
}

#include <Wire.h>
#include <Arduino.h>
#include <Adafruit_BMP085.h>
#include <DHT.h>

#define seaLevelPressure_hPa 1013.25
#define DHTPIN 4       // Pin where the DHT11 is connected
#define DHTTYPE DHT11  // DHT sensor type

DHT dht(DHTPIN, DHTTYPE);

Adafruit_BMP085 bmp;




//Ambient light sensor reading
#define LIGHTSENSORPIN 32


// Define the analog pin where the MQ135 sensor is connected
#define MQ135_PIN 34



void BMP_180_setup() {
  if (!bmp.begin()) {
    Serial.println("Could not find a valid BMP085 sensor, check wiring!");
    while (1) {}
  }
}


int32_t BMP_180(void) {

  int32_t reading;


  reading = bmp.readPressure();
  delay(100);

  return reading;
}

int32_t MQ135(void) {
  int sensorValue = analogRead(MQ135_PIN);
  delay(10);
  return sensorValue;
}


void temt6000_setup(void) {
  pinMode(LIGHTSENSORPIN, INPUT);
}


int32_t temt6000(void) {
  float reading = analogRead(LIGHTSENSORPIN);  //Read light level

  delay(100);
  return reading;
}

void DHT_setup() {
  pinMode(4, PULLUP);
  dht.begin();
}


void ReadDht(int* arr) {
  float t = dht.readTemperature();
  float h = dht.readHumidity();

  arr[0] = t;
  arr[1] = h;

  Serial.print("DHT.......");
  delay(10);  // Wait for 2 seconds before updating the values
}

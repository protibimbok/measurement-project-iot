#include <Adafruit_MPU6050.h>
#include <Adafruit_Sensor.h>
#include <ESP8266WiFi.h>
#include <WebSocketsClient.h>
#include <Wire.h>

const char* ssid = "WhyDoYouCare?";
const char* password = "001234567";

// WebSocket server URL and port
const char* ws_host = "192.168.107.183";  // Replace with your WebSocket server IP
const uint16_t ws_port = 3000;  // Replace with your WebSocket server port
const char* ws_path = "/";      // WebSocket server path

// Create a WebSocket client
WebSocketsClient webSocket;

Adafruit_MPU6050 mpu;

const int gasSensorPin = A0;  // MQ-2 connected to A0
const float Vcc = 3.3;  // Supply voltage (3.3V for NodeMCU, adjust for 5V systems)
const float RL = 10.0;  // Load resistance in kΩ (verify with your module)
const float Ro = 9.83;  // Calibrated value in clean air (adjust based on your calibration)

// Parameters from datasheet for specific gas
const float m = -0.45;  // Slope from MQ-2 datasheet for the gas (e.g., LPG, CO, etc.)
const float b = 2.3;    // Intercept from MQ-2 datasheet for the gas (e.g., LPG, CO, etc.)


void sensor_setup() {
  // Initialize MPU6050
  if (!mpu.begin()) {
    Serial.println("Failed to find MPU6050 chip!");
    while (1) {
      delay(10);
    }
  }
  Serial.println("MPU6050 Found!");

  // Configure MPU6050
  mpu.setAccelerometerRange(MPU6050_RANGE_8_G);
  mpu.setGyroRange(MPU6050_RANGE_500_DEG);
  mpu.setFilterBandwidth(MPU6050_BAND_21_HZ);

  pinMode(gasSensorPin, INPUT);

  delay(100);
}

// Handle WebSocket events
void webSocketEvent(WStype_t type, uint8_t* payload, size_t length) {
  switch (type) {
    case WStype_DISCONNECTED:
      Serial.println("WebSocket disconnected.");
      break;
    case WStype_CONNECTED:
      Serial.println("WebSocket connected.");
      // webSocket.sendTXT("Hello from ESP8266!");
      break;
    case WStype_TEXT:
      // Serial.printf("Message received: %s\n", payload);
      break;
    default:
      break;
  }
}

unsigned long previousMillis = 0;

void setup() {
  Serial.begin(9600);

  WiFi.begin(ssid, password);
  while (WiFi.status() != WL_CONNECTED) {
    delay(1000);
    Serial.println("Connecting to Wi-Fi...");
  }
  Serial.println("Connected to Wi-Fi!");
  sensor_setup();
  webSocket.begin(ws_host, ws_port, ws_path);

  // Attach WebSocket event handler
  webSocket.onEvent(webSocketEvent);

  // Enable reconnection
  webSocket.setReconnectInterval(3000);  // Attempt reconnect every 3 seconds
  previousMillis = millis();
}

void loop() {
  webSocket.loop();
  unsigned long currentMillis = millis();
  unsigned long diff = currentMillis - previousMillis;

  if (currentMillis - previousMillis < 300) {
    return;
  }
  previousMillis = currentMillis;
  // MPU6050 Readings
  sensors_event_t a, g, temp;
  mpu.getEvent(&a, &g, &temp);
  float accX = a.acceleration.x + 2;
  float accY = a.acceleration.y;
  float accZ = a.acceleration.z - 9.34;
  float gyroX = g.gyro.x + 0.08;
  float gyroY = g.gyro.y - 0.02;
  float gyroZ = g.gyro.z - 0.01;
  float temperature = temp.temperature;

  // Gas Sensor Reading
  int gasValue = analogRead(gasSensorPin);  // Read analog value from MQ-2
  float Vout = gasValue * (Vcc / 1023.0);  // Convert to voltage
  float Rs = RL * (Vcc - Vout) / Vout;  // Calculate sensor resistance
  float ratio = Rs / Ro;  // Rs / Ro ratio
  
  // Convert to ppm using logarithmic formula
  float ppm = pow(10, (log10(ratio) - b) / m);
    
  String message = "{\"accelarationX\":\"" + String(accX) + "\"," +
                    "\"accelarationY\":\"" + String(accY) + "\"," +
                    "\"accelarationZ\":\"" + String(accZ) + "\"," +
                    "\"gyroX\":\"" + String(gyroX) + "\"," +
                    "\"gyroY\":\"" + String(gyroY) + "\"," +
                    "\"gyroZ\":\"" + String(gyroZ) + "\"," +
                    "\"temperature\":\"" + String(temperature) + "\"," +
                    "\"gas\":\"" + String(ppm) + "\"," +
                    "\"interval\":\"" + String(diff) + "\"}";
  

  webSocket.sendTXT(message);
}

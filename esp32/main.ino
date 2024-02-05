#include <WiFi.h>
#include <HTTPClient.h>

const char *ssid = "Linear System";
const char *password = "Linear_System_508";
const char *url = "http://192.168.0.105:3000/"; // Replace with your actual URL

void setup()
{
  Serial.begin(115200);
  Serial.println("Serial BEGIN");
  // Connect to Wi-Fi
  WiFi.begin(ssid, password);
  while (WiFi.status() != WL_CONNECTED)
  {
    delay(1000);
    Serial.println("Connecting to WiFi...");
  }
  Serial.println("Connected to WiFi");
  BMP_180_setup();
  temt6000_setup();
  DHT_setup();
}

void loop()
{
  sendPostRequest();
  delay(100);
}

void sendPostRequest()
{
  int dhtVal[2];
  ReadDht(dhtVal);

  // Build JSON payload
  String jsonData = "{\"temp\":\"" + String(dhtVal[0]) + "\","
                                                         "\"humidity\":" +
                    String(dhtVal[1]) + ","
                                        "\"pressure\":" +
                    String(BMP_180()) + ","
                                        "\"light\":" +
                    String(temt6000()) + ","
                                         "\"co2\":" +
                    String(MQ135()) + "}";

  // Start the HTTP client
  HTTPClient http;
  http.begin(url);

  // Set content type to JSON
  http.addHeader("Content-Type", "application/json");

  // Send the POST request with the JSON payload
  int httpCode = http.POST(jsonData);

  // Check for successful response
  if (httpCode > 0)
  {
    Serial.printf("HTTP response code: %d\n", httpCode);
    String response = http.getString();
    Serial.println("Response: " + response);
  }
  else
  {
    Serial.printf("HTTP request failed, error: %s\n", http.errorToString(httpCode).c_str());
  }

  // Close the connection
  http.end();
}
#define NAME_OF_SSID "x"
#define PASSWORD_OF_SSID "x"

#include <Adafruit_BMP280.h>
#include <WiFiEspAT.h>

Adafruit_BMP280 bme;

WiFiServer server(80);

void setup()
{

  Serial.begin(115200);
  while (!Serial)
    ;

  if (!bme.begin(0x76)) // depending on the chip you have the i2c address is either 0x77 or 0x77
  {
    Serial.println("Could not find a valid BMP280 sensor, check wiring!");
    while (1)
      ;
  }

  Serial3.begin(115200);
  WiFi.init(Serial3);

  if (WiFi.status() == WL_NO_MODULE)
  {
    Serial.println("Communication with WiFi module failed!");
    // don't continue
    while (true)
      ;
  }

  WiFi.begin(NAME_OF_SSID, PASSWORD_OF_SSID);
  Serial.println("Waiting for connection to WiFi");
  while (WiFi.status() != WL_CONNECTED)
  {
    delay(1000);
    Serial.print('.');
  }
  Serial.println();

  server.begin();

  IPAddress ip = WiFi.localIP();
  Serial.println();
  Serial.println("Connected to WiFi network.");
  Serial.print("To access the server, enter \"http://");
  Serial.print(ip);
  Serial.println("/\" in web browser.");
}

void loop()
{
  float temp = (bme.readTemperature() * 1.8) + 32;
  float pressure = bme.readPressure();
  float altitude = bme.readAltitude(1010);

  WiFiClient client = server.available();

  if (client)
  {
    IPAddress ip = client.remoteIP();
    Serial.print("new client ");
    Serial.println(ip);

    while (client.connected())
    {
      if (client.available())
      {
        String line = client.readStringUntil('\n');
        line.trim();
        Serial.println(line);

        // if you've gotten to the end of the HTTP header (the line is blank),
        // the http request has ended, so you can send a reply
        if (line.length() == 0)
        {
          // send a standard http response header
          client.println("HTTP/1.1 200 OK");
          client.println("Content-Type: text/html");
          client.println("Connection: close"); // the connection will be closed after completion of the response
          client.println("Refresh: 5");        // refresh the page automatically every 5 sec
          client.println();
          client.println("<!DOCTYPE HTML>");
          client.println("<html>");

          client.print("<h4>Tempature: ");
          client.print(temp);
          client.print("F");
          client.print("</h4>");

          client.print("<h4>Pressure: ");
          client.print(pressure);
          client.print("</h4>");

          client.print("<h4>Altitude: ");
          client.print(altitude);
          client.print("</h4>");

          client.println("</html>");
          client.flush();
          break;
        }
      }
    }

    // close the connection:
    client.stop();
    Serial.println("client disconnected");
  }
}
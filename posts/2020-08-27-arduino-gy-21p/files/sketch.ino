#include <Wire.h>
#include <Adafruit_Sensor.h>
#include <Adafruit_GFX.h>
#include <Adafruit_SSD1306.h>
#include <Adafruit_BMP280.h>
#include "Adafruit_Si7021.h"

#define SCREEN_WIDTH 128
#define SCREEN_HEIGHT 64

Adafruit_SSD1306 display(SCREEN_WIDTH, SCREEN_HEIGHT, &Wire, -1);

Adafruit_BMP280 bme; // I2C
Adafruit_Si7021 si7021 = Adafruit_Si7021();

void setup()
{
    Serial.begin(115200);

    if (!bme.begin(0x76)) // depending on the chip you have the i2c address is either 0x77 or 0x77
    {
        Serial.println("Could not find a valid BMP280 sensor, check wiring!");
        while (1)
            ;
    }

    if (!si7021.begin())
    {
        Serial.println("Did not find Si7021 sensor!");
        while (true)
            ;
    }

    if (!display.begin(SSD1306_SWITCHCAPVCC, 0x3C))
    {
        Serial.println(F("SSD1306 allocation failed"));
        for (;;)
            ;
    }

    display.clearDisplay();
    display.setTextColor(WHITE);
}

void loop()
{
    delay(5000);

    display.clearDisplay();

    display.setTextSize(.75);
    display.setCursor(0, 0);
    display.print("Temp / Humidity: ");
    display.setCursor(0, 10);
    display.print((bme.readTemperature() * 1.8) + 32);
    display.print(" ");
    display.cp437(true);
    display.write(167);
    display.print("F");
    display.print(" / ");
    display.print(si7021.readHumidity());
    display.print("%");

    display.setCursor(0, 20);
    display.print("Pressure: ");
    display.setCursor(0, 30);
    display.print(bme.readPressure());
    display.print(" ");
    display.print("Pa");

    display.setCursor(0, 40);
    display.print("Approx altitude: ");
    display.setCursor(0, 50);
    display.print(bme.readAltitude(1010)); // this should be adjusted to your local air pressure at your current location.
    display.print(" ");
    display.print("m");

    display.display();
}
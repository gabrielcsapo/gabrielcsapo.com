#include "SPI.h"
#include "Adafruit_GFX.h"
#include "Adafruit_ILI9341.h"
#include "Adafruit_PM25AQI.h"

#define TFT_DC 5  // D1
#define TFT_RST 0 // D3
#define TFT_CS 4  // D2

Adafruit_ILI9341 tft = Adafruit_ILI9341(TFT_CS, TFT_DC, TFT_RST);

#include <SoftwareSerial.h>
SoftwareSerial pmSerial(2, 3);

Adafruit_PM25AQI aqi = Adafruit_PM25AQI();

#define pmsDataLen 32
uint8_t buf[pmsDataLen];
int idx = 0;
int pm10 = 0;
int last_pm25 = 0;
int pm25 = 0;
int pm100 = 0;

uint16_t pm25color[] = {
    0x9FF3,
    0x37E0,
    0x3660,
    0xFFE0,
    0xFE60,
    0xFCC0,
    0xFB2C,
    0xF800,
    0x9800,
    0xC99F};

void setup()
{
    Serial.begin(115200);
    while (!Serial)
        delay(10);

    // Wait one second for sensor to boot up!
    delay(1000);

    pmSerial.begin(9600);

    if (!aqi.begin_UART(&pmSerial))
    {
        Serial.println("Could not find PM 2.5 sensor!");
        while (1)
            delay(10);
    }

    Serial.println("PM25 found!");

    tft.begin();
    drawPictureFrames();
}

void loop()
{
    PM25_AQI_Data data;

    if (!aqi.read(&data))
    {
        Serial.println("Could not read from AQI");
        delay(500); // try again in a bit!
        return;
    }

    // This is used for debugging purposes and to show what additional data could potentially be rendered
    Serial.println(F("---------------------------------------"));
    Serial.println(F("Concentration Units (standard)"));
    Serial.println(F("---------------------------------------"));
    Serial.print(F("PM 1.0: "));
    Serial.print(data.pm10_standard);
    Serial.print(F("\t\tPM 2.5: "));
    Serial.print(data.pm25_standard);
    Serial.print(F("\t\tPM 10: "));
    Serial.println(data.pm100_standard);
    Serial.println(F("Concentration Units (environmental)"));
    Serial.println(F("---------------------------------------"));
    Serial.print(F("PM 1.0: "));
    Serial.print(data.pm10_env);
    Serial.print(F("\t\tPM 2.5: "));
    Serial.print(data.pm25_env);
    Serial.print(F("\t\tPM 10: "));
    Serial.println(data.pm100_env);
    Serial.println(F("---------------------------------------"));
    Serial.print(F("Particles > 0.3um / 0.1L air:"));
    Serial.println(data.particles_03um);
    Serial.print(F("Particles > 0.5um / 0.1L air:"));
    Serial.println(data.particles_05um);
    Serial.print(F("Particles > 1.0um / 0.1L air:"));
    Serial.println(data.particles_10um);
    Serial.print(F("Particles > 2.5um / 0.1L air:"));
    Serial.println(data.particles_25um);
    Serial.print(F("Particles > 5.0um / 0.1L air:"));
    Serial.println(data.particles_50um);
    Serial.print(F("Particles > 50 um / 0.1L air:"));
    Serial.println(data.particles_100um);
    Serial.println(F("---------------------------------------"));

    pm10 = data.pm10_standard;
    last_pm25 = pm25;
    pm25 = data.pm25_standard;
    pm100 = data.pm100_standard;

    updateValueToTftScreen();
}

void drawPictureFrames()
{
    tft.setRotation(1);
    tft.fillScreen(ILI9341_BLACK);

    tft.setTextSize(1);

    // Upper title
    tft.setTextSize(1);
    tft.setCursor(20, 20);
    tft.print("PM2.5 DETECTOR");

    // PM 2.5 Circle Frame
    tft.drawCircle(100, 130, 60, ILI9341_BLUE);
    tft.drawCircle(100, 130, 61, ILI9341_BLUE);

    tft.setTextSize(1);
    tft.setCursor(90, 85);
    tft.print("PM2.5");

    tft.setTextSize(1);
    tft.setCursor(90, 170);
    tft.print("um/m3");

    // PM 10 Circle Frame
    tft.drawCircle(220, 70, 40, ILI9341_BLUE);

    tft.setTextSize(1);
    tft.setCursor(210, 40);
    tft.print("PM10");

    tft.setTextSize(1);
    tft.setCursor(205, 95);
    tft.print("um/m3");

    // PM 1.0 Circle Frame
    tft.drawCircle(220, 170, 40, ILI9341_BLUE);

    tft.setTextSize(1);
    tft.setCursor(205, 140);
    tft.print("PM1.0");

    tft.setTextSize(1);
    tft.setCursor(205, 195);
    tft.print("um/m3");

    tft.fillRect(290, 30 + 0 * 2, 10, 12 * 2, pm25color[0]);  // 0~11
    tft.fillRect(290, 30 + 12 * 2, 10, 12 * 2, pm25color[1]); // 12-23
    tft.fillRect(290, 30 + 24 * 2, 10, 12 * 2, pm25color[2]); // 24-35
    tft.fillRect(290, 30 + 36 * 2, 10, 6 * 2, pm25color[3]);  // 36-41
    tft.fillRect(290, 30 + 42 * 2, 10, 6 * 2, pm25color[4]);  // 42-47
    tft.fillRect(290, 30 + 48 * 2, 10, 6 * 2, pm25color[5]);  // 48-53
    tft.fillRect(290, 30 + 54 * 2, 10, 6 * 2, pm25color[6]);  // 54-58
    tft.fillRect(290, 30 + 59 * 2, 10, 6 * 2, pm25color[7]);  // 59-64
    tft.fillRect(290, 30 + 65 * 2, 10, 6 * 2, pm25color[8]);  // 65-70
    tft.fillRect(290, 30 + 71 * 2, 10, 10 * 2, pm25color[9]); // >=71

    tft.setCursor(302, 30);
    tft.setTextSize(1);
    tft.print("0");
    tft.setCursor(302, 30 + 36 * 2);
    tft.print("36");
    tft.setCursor(302, 30 + 54 * 2);
    tft.print("54");
    tft.setCursor(302, 30 + 71 * 2);
    tft.print("71");

    updateValueToTftScreen();
}

void updateValueToTftScreen()
{
    tft.setCursor(60, 111);
    tft.setTextSize(5);
    tft.setTextColor(getPm25Color(pm25), ILI9341_BLACK);
    if (pm25 < 10)
    {
        tft.print("  ");
    }
    else if (pm25 < 100)
    {
        tft.print(" ");
    }
    tft.print(pm25);

    tft.setCursor(195, 60);
    tft.setTextSize(3);
    if (pm100 < 10)
    {
        tft.print("  ");
    }
    else if (pm100 < 100)
    {
        tft.print(" ");
    }
    tft.print(pm100);

    tft.setCursor(198, 160);
    if (pm10 < 10)
    {
        tft.print("  ");
    }
    else if (pm10 < 100)
    {
        tft.print(" ");
    }
    tft.print(pm10);

    tft.setTextSize(1);
    tft.setTextColor(ILI9341_WHITE, ILI9341_BLACK);
    if (last_pm25 > 80)
    {
        tft.fillRect(275, 80 * 2 + 30 - 3, 12, 8, ILI9341_BLACK);
    }
    else
    {
        tft.fillRect(275, last_pm25 * 2 + 30 - 3, 12, 8, ILI9341_BLACK);
    }
    if (pm25 > 80)
    {
        tft.setCursor(275, 80 * 2 + 30 - 3);
    }
    else
    {
        tft.setCursor(275, pm25 * 2 + 30 - 3);
    }
    tft.print("=>");
}

uint16_t getPm25Color(int v)
{
    if (v < 12)
    {
        return pm25color[0];
    }
    else if (v < 24)
    {
        return pm25color[1];
    }
    else if (v < 36)
    {
        return pm25color[2];
    }
    else if (v < 42)
    {
        return pm25color[3];
    }
    else if (v < 48)
    {
        return pm25color[4];
    }
    else if (v < 54)
    {
        return pm25color[5];
    }
    else if (v < 59)
    {
        return pm25color[6];
    }
    else if (v < 65)
    {
        return pm25color[7];
    }
    else if (v < 71)
    {
        return pm25color[8];
    }
    else
    {
        return pm25color[9];
    }
}
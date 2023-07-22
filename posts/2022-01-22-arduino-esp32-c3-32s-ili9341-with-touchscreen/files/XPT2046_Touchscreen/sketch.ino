#include "Adafruit_GFX.h"
#include "Adafruit_ILI9341.h"
#include <XPT2046_Touchscreen.h>
#include <SPI.h>

#define SCLK_PIN              12
#define MISO_PIN              13
#define MOSI_PIN              11

#define TOUCH_CS 34

#define TFT_DC 14
#define TFT_CS 10
#define TFT_RST  15

XPT2046_Touchscreen ts(TOUCH_CS);

Adafruit_ILI9341 tft = Adafruit_ILI9341(TFT_CS, TFT_DC, TFT_RST);

void setup() {
  Serial.begin(38400);
  
  SPI.begin( SCLK_PIN, MISO_PIN, MOSI_PIN );
  SPI.setFrequency( 40000000 );
  
  tft.begin(4000000);
  tft.setRotation(1);
  tft.fillScreen(ILI9341_BLACK);
  ts.begin();
  ts.setRotation(1);
  while (!Serial && (millis() <= 1000));
}

boolean wastouched = true;

void loop() {
  boolean istouched = ts.touched();
  if (istouched) {
    TS_Point p = ts.getPoint();
    if (!wastouched) {
      tft.fillScreen(ILI9341_BLACK);
      tft.setTextColor(ILI9341_YELLOW);
      tft.setCursor(60, 80);
      tft.print("Touch");
    }
    tft.fillRect(100, 150, 140, 60, ILI9341_BLACK);
    tft.setTextColor(ILI9341_GREEN);
    tft.setCursor(100, 150);
    tft.print("X = ");
    tft.print(p.x);
    tft.setCursor(100, 180);
    tft.print("Y = ");
    tft.print(p.y);
    Serial.print(", x = ");
    Serial.print(p.x);
    Serial.print(", y = ");
    Serial.println(p.y);
  } else {
    if (wastouched) {
      tft.fillScreen(ILI9341_BLACK);
      tft.setTextColor(ILI9341_RED);
      tft.setCursor(120, 50);
      tft.print("No");
      tft.setCursor(80, 120);
      tft.print("Touch");
    }
    Serial.println("no touch");
  }
  wastouched = istouched;
  delay(100);
}
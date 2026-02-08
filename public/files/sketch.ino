#include <Wire.h>
#include <Adafruit_SSD1306.h>

#define SCREEN_WIDTH 128
#define SCREEN_HEIGHT 64

Adafruit_SSD1306 display(SCREEN_WIDTH, SCREEN_HEIGHT, &Wire, -1);

void setup() {
  Serial.begin(115200);

  Wire.begin(D1, D2);

  if (!display.begin(SSD1306_SWITCHCAPVCC, 0x3C)) {
    Serial.println(F("SSD1306 allocation failed"));
    for (;;);
  }

  display.clearDisplay();
  display.setTextColor(WHITE);
}

void Scanner() {
  Serial.println();
  Serial.println("I2C scanner. Scanning ...");
  byte count = 0;

  display.setTextSize(.75);
  display.setCursor(0, 0);
  display.println("Found Addresses:");

  Wire.begin();
  for (byte i = 8; i < 120; i++) {
    Wire.beginTransmission(i); // Begin I2C transmission Address (i)
    if (Wire.endTransmission() == 0) // Receive 0 = success (ACK response) 
    {
      display.print(i, DEC);
      display.print(" (0x");
      display.print(i, HEX); // PCF8574 7 bit address
      display.println(")");

      Serial.print("Found address: ");
      Serial.print(i, DEC);
      Serial.print(" (0x");
      Serial.print(i, HEX); // PCF8574 7 bit address
      Serial.println(")");
      count++;
    }
  }
  Serial.print("Found ");
  Serial.print(count, DEC); // numbers of devices
  Serial.println(" device(s).");

  display.display();
}

void loop() {
  Scanner();
  delay(3000);
}
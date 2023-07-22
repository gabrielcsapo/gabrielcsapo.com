const int AirValue = 0;   // This is the value of your sensor when you place it in the open air
const int WaterValue = 0; // This is the value when you place your sensor in a glass of water

int value = 0;
int percent = 0;

void setup()
{
    Serial.begin(9600); // open serial port, set the baud rate to 9600 bps
}

void loop()
{
    value = analogRead(A0);

    percent = map(value, AirValue, WaterValue, 0, 100);

    if (percent > 100)
    {
        Serial.print(value);
        Serial.print(" | ");
        Serial.println("100 %");
    }
    else if (percent < 0)
    {
        Serial.print(value);
        Serial.print(" | ");
        Serial.println("0 %");
    }
    else if (percent > 0 && percent < 100)
    {
        Serial.print(value);
        Serial.print(" | ");
        Serial.print(percent);
        Serial.println("%");
    }
    delay(250);
}
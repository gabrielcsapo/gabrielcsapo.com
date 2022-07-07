---
title: Arduino - Web Server (ESP-32)
slug: arduino-web-server-esp-32
tags: [Arduino, ESP32]
excerpt: This tutorial goes over how to create an access point and serve web pages from a esp32 ☁️!
authors: gabrielcsapo
image: ./images/IMG_251049CF765A-1.jpeg
---

This tutorial goes over how to create an access point and serve web pages from an esp32 ☁️!

<!-- truncate -->

## Supplies

- (1) esp32

![](./images/ESP32-38-PIN-DEVBOARD.png)

## Code

For this project, we are using the following libraries:

- Wifi.h (built-in)
- WebServer.h [(built-in provided by espressif with the esp32 firmware)](https://github.com/espressif/arduino-esp32/blob/master/libraries/WebServer/src/WebServer.h).
- SPIFFS.h (built-in)

```cpp showLineNumbers
#include <WiFi.h>
#include <WebServer.h>

// SSID & Password
const char* ssid = "ArduinoWebServer";
const char* password = "123456789";

// IP Address details
IPAddress local_ip(192, 168, 1, 1);
IPAddress gateway(192, 168, 1, 1);
IPAddress subnet(255, 255, 255, 0);

WebServer server(80);

void setup() {
  Serial.begin(115200);

  // Create SoftAP
  WiFi.softAP(ssid, password);
  WiFi.softAPConfig(local_ip, gateway, subnet);


  Serial.print("Access point available to connect to: ");
  Serial.println(ssid);

  server.on("/", handle_root);

  server.begin();
  Serial.println("HTTP server started");
  delay(100);
}

void loop() {
  server.handleClient();
}

String HTML = "<!DOCTYPE html>\
  <html>\
  <body>\
  <h1>Arduino ESP32 Web Server &#9729;</h1>\
  </body>\
  </html>";

// Handle root url (/)
void handle_root() {
  server.send(200, "text/html", HTML);
}
```

> If you are uploading this via Arduino IDE, you might see a timeout. An easy way to fix this is to press the boot button on the ESP32 when trying to upload.

Once this has been uploaded, you should be able to see the following in the serial monitor output:
![Arduino IDE showing the serial monitor output once the sketch above has been uploaded](./images/Screen-Shot-2021-04-24-at-10.23.17-PM.png)

Arduino IDE showing the serial monitor output once the sketch above has been uploaded. When connecting to the access point via your computer or your phone, you should see the following once you navigate to `192.168.1.1` via your browser after connecting:

![Navigating to 192.168.1.1 you should be able to see the output for the html described in the sketch.](./images/IMG_80B783FB4FDD-1-1.jpeg)

Navigating to 192.168.1.1, you should see the output for the HTML described in the sketch.
There you go! We can successfully serve web traffic when a device connects to the ESP32 and then navigates to `192.168.1.1`!

Writing any application or serving just a web page will not be enough for working on projects. With the ESP32, we have access to [SPIFFS](https://github.com/espressif/arduino-esp32/blob/master/libraries/SPIFFS/src/SPIFFS.h); this is built-in and provided by espressif, which gives you access to the filesystem.

## Serving from the file system

To serve things from the file system, getting things on the file system for the ESP32 is the first requirement. Fortunately, there is a [plugin that allows this for the Arduino IDE.](https://github.com/me-no-dev/arduino-esp32fs-plugin/releases/)

> If you are using a esp32-c3 or esp-s2 please use the patched plugin as the one mentioned previously does not work with those modules [https://github.com/lorol/arduino-esp32fs-plugin](https://github.com/lorol/arduino-esp32fs-plugin)

Following the[instructions on the README](https://github.com/me-no-dev/arduino-esp32fs-plugin) will allow you to have a new option in the tools dropdown called `ESP32 Sketch Data Upload` menu item. Once the plugin is installed, creating a folder in your sketch directory called `data` will be transferred to the ESP32's file system when executed.

> [Note that this tool works with the Java IDE for Arduino and is currently an open issue with the rewrite for Arduino IDE 2.0](https://github.com/arduino/arduino-ide/issues/58)

Creating an `index.html` in the data directory with the contents of:

```html showLineNumbers
<!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Arduino Web Server &#9729;</title>

    <style>
      html {
        font-size: 62.5%;
      }

      body {
        font-size: 1.4rem;
      }

      h1 {
        font-size: 2.4rem;
      }

      .container__item {
        margin: 0 auto 40px;
      }

      .landing-page-container {
        width: 100%;
        min-height: 100%;
        height: 90rem;
        background-image: url("https://s29.postimg.org/vho8xb2pj/landing_bg.jpg");
        background-repeat: no-repeat;
        background-size: cover;
        background-position: bottom;
        overflow: hidden;
        font-family: "Montserrat", sans-serif;
        color: #09383e;
      }

      .content__wrapper {
        max-width: 1200px;
        width: 90%;
        height: 100%;
        margin: 0 auto;
        position: relative;
      }

      .ellipses-container {
        width: 25rem;
        height: 25rem;
        border-radius: 50%;
        margin: 0 auto;
        position: relative;
        top: 10.5rem;
      }

      .ellipses-container .greeting {
        position: absolute;
        top: 7rem;
        left: 4rem;
        right: 0;
        margin: 0 auto;
        text-transform: uppercase;
        letter-spacing: 2rem;
        font-size: 0.15rem;
        font-weight: 400;
        opacity: 0.5;
        line-height: 4em;
      }

      .ellipses-container .greeting:after {
        content: "";
        width: 0.3rem;
        height: 0.3rem;
        border-radius: 50%;
        display: inline-block;
        background-color: #0c383e;
        position: relative;
        top: -0.65rem;
        left: -5.05rem;
      }

      .ellipses {
        border-radius: 50%;
        position: absolute;
        top: 0;
        border-style: solid;
      }

      .ellipses__outer--thin {
        width: 100%;
        height: 100%;
        border-width: 1px;
        border-color: rgba(9, 56, 62, 0.1);
        -webkit-animation: ellipsesOrbit 15s ease-in-out infinite;
        animation: ellipsesOrbit 15s ease-in-out infinite;
      }

      .ellipses__outer--thin:after {
        content: "";
        background-image: url("https://s29.postimg.org/5h0r4ftkn/ellipses_dial.png");
        background-repeat: no-repeat;
        background-position: center;
        top: 0;
        left: 0;
        bottom: 0;
        right: 0;
        position: absolute;
        opacity: 0.15;
      }

      .ellipses__outer--thick {
        width: 99.5%;
        height: 99.5%;
        border-color: #09383e transparent;
        border-width: 2px;
        transform: rotate(-45deg);
        -webkit-animation: ellipsesRotate 15s ease-in-out infinite;
        animation: ellipsesRotate 15s ease-in-out infinite;
      }

      .ellipses__orbit {
        width: 2.5rem;
        height: 2.5rem;
        border-width: 2px;
        border-color: #09383e;
        top: 5rem;
        right: 6.75rem;
      }

      .ellipses__orbit:before {
        content: "";
        width: 0.7rem;
        height: 0.7rem;
        border-radius: 50%;
        display: inline-block;
        background-color: #09383e;
        margin: 0 auto;
        left: 0;
        right: 0;
        position: absolute;
        top: 50%;
        transform: translateY(-50%);
      }

      @-webkit-keyframes ellipsesRotate {
        0% {
          transform: rotate(-45deg);
        }

        100% {
          transform: rotate(-405deg);
        }
      }

      @keyframes ellipsesRotate {
        0% {
          transform: rotate(-45deg);
        }

        100% {
          transform: rotate(-405deg);
        }
      }

      @-webkit-keyframes ellipsesOrbit {
        0% {
          transform: rotate(0);
        }

        100% {
          transform: rotate(360deg);
        }
      }

      @keyframes ellipsesOrbit {
        0% {
          transform: rotate(0);
        }

        100% {
          transform: rotate(360deg);
        }
      }
    </style>
  </head>

  <body>
    <div class="container">
      <div class="container__item landing-page-container">
        <div class="content__wrapper">
          <div class="ellipses-container">
            <h2 class="greeting">Hello from Arduino</h2>
            <div class="ellipses ellipses__outer--thin">
              <div class="ellipses ellipses__orbit"></div>
            </div>
            <div class="ellipses ellipses__outer--thick"></div>
          </div>
        </div>
      </div>
    </div>
  </body>
</html>
```

And also updating our sketch to include the `SPIFFS` code below;

```cpp showLineNumbers
#include <WiFi.h>
#include <WebServer.h>
#include <SPIFFS.h>

// SSID & Password
const char* ssid = "ArduinoWebServer";
const char* password = "123456789";

// IP Address details
IPAddress local_ip(192, 168, 1, 1);
IPAddress gateway(192, 168, 1, 1);
IPAddress subnet(255, 255, 255, 0);

WebServer server(80);

void setup() {
  Serial.begin(115200);

  if(!SPIFFS.begin(true)){
    Serial.println("An Error has occurred while mounting SPIFFS");
    return;
  }

  // Create SoftAP
  WiFi.softAP(ssid, password);
  WiFi.softAPConfig(local_ip, gateway, subnet);


  Serial.print("Access point available to connect to: ");
  Serial.println(ssid);

  server.on("/", handle_root);

  server.begin();
  Serial.println("HTTP server started");

  delay(100);
}

void loop() {
  server.handleClient();
}

void handleNotFound() {
  String message = "File Not Found\n\n";
  message += "URI: ";
  message += server.uri();
  message += "\nMethod: ";
  message += (server.method() == HTTP_GET) ? "GET" : "POST";
  message += "\nArguments: ";
  message += server.args();
  message += "\n";

  for (uint8_t i = 0; i < server.args(); i++) {
    message += " " + server.argName(i) + ": " + server.arg(i) + "\n";
  }

  server.send(404, "text/plain", message);
}

bool loadFromSPIFFS(String path) {
  String dataType = "text/html";

  Serial.print("Requested page -> ");
  Serial.println(path);
  if (SPIFFS.exists(path)){
      File dataFile = SPIFFS.open(path, "r");
      if (!dataFile) {
          handleNotFound();
          return false;
      }

      if (server.streamFile(dataFile, dataType) != dataFile.size()) {
        Serial.println("Sent less data than expected!");
      } else {
          Serial.println("Page served!");
      }

      dataFile.close();
  } else{
      handleNotFound();
      return false;
  }
  return true;
}

// Handle root url (/)
void handle_root() {
  loadFromSPIFFS("/index.html");
}
```

Uploading the new sketch and then running the tool to upload the index.html in the data directory `ESP32 Sketch Data Upload` will yield the following results when visiting `192.168.1.1`.

![](./images/demo.gif)

The full sketch can be found at <https://github.com/gabrielcsapo/gabrielcsapo.com/tree/main/arduino-web-server-esp-32/sketch>.

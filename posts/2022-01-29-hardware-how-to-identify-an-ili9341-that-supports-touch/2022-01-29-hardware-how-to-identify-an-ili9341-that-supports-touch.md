---
title: Hardware - How to identify an ILI9341 that supports touch?
slug: hardware-how-to-identify-an-ili9341-that-supports-touch
date_published: 2022-01-29T17:35:31.000Z
date_updated: 2022-02-25T02:55:37.000Z
tags: [XPT2046, ILI9341, Touchscreen]
excerpt: This article is meant to help you identify an ILI9341 screen that contains all the proper components to support touch.
authors: gabrielcsapo
image: ./images/IMG_5623_ROTATED.gif
---

:::info
This article is meant to help you identify an ILI9341 screen that contains all the proper components to support touch.
:::

<!-- truncate -->

One of the essential things is identifying an ILI9341 capable of touch! When you buy a new display, the package might have the required information it, is it touch or not.

![An ILI9341 display that is capable of touch!](./images/IMG_5508.jpeg)

If the screen was loose, it might have the pins to support touch but missing the XPT2046 chip that makes it capable of touch. As seen below, the display on the left is missing the XPT2046 chip, while the display on the right has the chip and can support touch.

![Two seemingly similar ILI9341 displays. The display on the left is missing the required XPT2046 chip.](./images/IMG_5506-1.jpeg)

["The **_XPT2046_** is a 4-wire resistive touch screen controller that incorporates a 12-bit 125 kHz sampling SAR type"](https://www.google.com/url?sa=t&rct=j&q=&esrc=s&source=web&cd=&ved=2ahUKEwi_uZmw1sT1AhXfIEQIHXrFAncQFnoECAYQAQ&url=https%3A%2F%2Fldm-systems.ru%2Ff%2Fdoc%2Fcatalog%2FHY-TFT-2%2C8%2FXPT2046.pdf&usg=AOvVaw3zbUPXSfkIyFFoCL1HGraq) it is a small chip but unlocks being able to use the touch screen!

![A close-up view of the XPT2046](./images/IMG_5510.jpeg)

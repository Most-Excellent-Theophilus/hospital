"use client";

import { useEffect, useState } from "react";
import { UAParser } from "ua-parser-js";

export function useDeviceInfo() {
  const [info, setInfo] = useState({
    os: "",
    osVersion: "",
    browser: "",
    browserVersion: "",
    deviceType: "",
    model: "",
    vendor: "",
    screenWidth: 0,
    screenHeight: 0,
    isTouch: false,
  });

  useEffect(() => {
    const parser = new UAParser(window.navigator.userAgent);
    const result = parser.getResult();

    setInfo({
      os: result.os.name || "",
      osVersion: result.os.version || "",
      browser: result.browser.name || "",
      browserVersion: result.browser.version || "",
      deviceType: result.device.type || "desktop",
      model: result.device.model || "",
      vendor: result.device.vendor || "",
      screenWidth: window.innerWidth,
      screenHeight: window.innerHeight,
      isTouch: "ontouchstart" in window,
    });
  }, []);

  return info;
}


"use client"
import { useEffect, useState } from "react";

export function useDeviceVendor() {
  const [info, setInfo] = useState({
    os: "Unknown",
    vendor: "Unknown",
    deviceType: "Unknown" as "Desktop" | "Mobile" | "Tablet" | "Unknown",
  });

  useEffect(() => {
    if (typeof navigator === "undefined") return;

    const ua = navigator.userAgent.toLowerCase();
    let os = "Unknown";
    let vendor = "Unknown";
    let deviceType: "Desktop" | "Mobile" | "Tablet" | "Unknown" = "Unknown";

    // --------------------
    // Detect OS
    // --------------------
    if (/windows nt/i.test(ua)) os = "Windows";
    else if (/mac os x/i.test(ua)) os = "macOS";
    else if (/linux/i.test(ua) && !/android/i.test(ua)) os = "Linux";
    else if (/cros/i.test(ua)) os = "ChromeOS";
    else if (/android/i.test(ua)) os = "Android";
    else if (/iphone|ipod/i.test(ua)) os = "iOS";
    else if (/ipad/i.test(ua)) os = "iPadOS";

    // --------------------
    // Detect Device Type
    // --------------------
    if (os === "Windows" || os === "macOS" || os === "Linux" || os === "ChromeOS") {
      deviceType = "Desktop";
    } else if (os === "iOS" && /iphone|ipod/i.test(ua)) {
      deviceType = "Mobile";
    } else if (os === "iPadOS" || (os === "iOS" && /ipad/i.test(ua))) {
      deviceType = "Tablet";
    } else if (os === "Android") {
      // Android tablets are tricky - use screen size heuristic
      deviceType = /mobile/i.test(ua) ? "Mobile" : "Tablet";
    }

    // --------------------
    // Detect Vendor (Mobile/Tablet first)
    // --------------------
    if (os === "iOS" || os === "iPadOS") {
      vendor = "Apple";
    } else if (os === "Android" || deviceType === "Mobile" || deviceType === "Tablet") {
      if (/samsung|sm-/i.test(ua)) vendor = "Samsung";
      else if (/huawei|honor/i.test(ua)) vendor = "Huawei";
      else if (/xiaomi|mi\s|redmi|poco/i.test(ua)) vendor = "Xiaomi";
      else if (/oppo/i.test(ua)) vendor = "Oppo";
      else if (/vivo/i.test(ua)) vendor = "Vivo";
      else if (/oneplus/i.test(ua)) vendor = "OnePlus";
      else if (/motorola|moto/i.test(ua)) vendor = "Motorola";
      else if (/nokia/i.test(ua)) vendor = "Nokia";
      else if (/lg-|lge/i.test(ua)) vendor = "LG";
      else if (/pixel/i.test(ua)) vendor = "Google";
      else if (/realme/i.test(ua)) vendor = "Realme";
      else if (/tecno/i.test(ua)) vendor = "Tecno";
      else if (/infinix/i.test(ua)) vendor = "Infinix";
      else if (/itel/i.test(ua)) vendor = "Itel";
      else if (/sony/i.test(ua)) vendor = "Sony";
      else if (/asus/i.test(ua)) vendor = "Asus";
      else if (/lenovo/i.test(ua)) vendor = "Lenovo";
      else if (os === "Android") vendor = "Unknown Android";
    }

    // --------------------
    // Desktop vendors (only if not already assigned)
    // --------------------
    if (deviceType === "Desktop" && vendor === "Unknown") {
      if (os === "Windows") vendor = "Microsoft (PC)";
      else if (os === "macOS") vendor = "Apple (Mac)";
      else if (os === "Linux") vendor = "PC / Linux";
      else if (os === "ChromeOS") vendor = "Google (Chromebook)";
    }

    setInfo({ os, vendor, deviceType });
  }, []);

  return info;
}
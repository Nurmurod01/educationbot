"use client";
import { useEffect } from "react";

export default function ClientViewportFix() {
  useEffect(() => {
    document.documentElement.style.setProperty("--tg-viewport-height", "100vh");
    document.documentElement.style.setProperty(
      "--tg-viewport-stable-height",
      "100vh"
    );
  }, []);

  return null;
}

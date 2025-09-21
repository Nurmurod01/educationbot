"use client";
import { useState, useEffect, useRef } from "react";

export function usePersistedState<T>(key: string, defaultValue: T) {
  const [state, setState] = useState<T>(() => {
    // Client-side da localStorage'dan o'qish
    if (typeof window !== "undefined") {
      try {
        const stored = localStorage.getItem(key);
        if (stored !== null) {
          return JSON.parse(stored);
        }
      } catch (e) {
        console.error("localStorage read error:", e);
      }
    }
    return defaultValue;
  });

  const isInitialMount = useRef(true);

  // Faqat state o'zgarganida localStorage'ga yozish
  useEffect(() => {
    // Birinchi mount'da yozmaslik (chunki o'qish allaqachon bo'lgan)
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }

    if (typeof window !== "undefined") {
      try {
        localStorage.setItem(key, JSON.stringify(state));
      } catch (e) {
        console.error("localStorage write error:", e);
      }
    }
  }, [key, state]);

  return [state, setState] as const;
}

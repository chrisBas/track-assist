"use client";

import { useEffect, useState } from "react";

export default function useLocalStorage<T>(
  key: string,
  defaultValue: T
): [T, (callback: (value: T) => T) => void] {
  const [value, setValue] = useState<T>(defaultValue);

  useEffect(() => {
    const newVal = localStorage.getItem(key);
    if (newVal) setValue(JSON.parse(newVal) as T);
  }, [key]);

  return [
    value,
    (callback) => {
      const newValue: T = callback(value);
      localStorage.setItem(key, JSON.stringify(newValue));
      setValue(newValue);
    },
  ];
}

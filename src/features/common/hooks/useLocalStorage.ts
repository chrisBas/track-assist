'use client';

import { useEffect } from "react";
import { createStore, useStore } from "zustand";
import { useStoreWithEqualityFn } from "zustand/traditional";

interface LocalStorageState {
  data: { [key: string]: string };
  setData: (key: string, value: string) => void;
}

const store = createStore<LocalStorageState>((set) => ({
  data: {},
  setData: (key: string, value: string) => set((state) => ({ data: { ...state.data, [key]: value } })),
}));

export default function useLocalStorage<T>(key: string, defaultValue: T): [T, (callback: (value: T) => T) => void] {
  const value = useStore(store, (s) => s.data[key]) || JSON.stringify(defaultValue);
  const { func: setValue } = useStoreWithEqualityFn(
    store,
    (s) => ({
      func: (v: string) => {
        s.setData(key, v);
      },
      eqCheck: key,
    }),
    (a, b) => a.eqCheck === b.eqCheck
  );

  useEffect(() => {
    const newVal = localStorage.getItem(key);
    if (newVal) setValue(newVal);
  }, [key, setValue]);

  return [
    JSON.parse(value),
    (callback) => {
      const newValue: T = callback(JSON.parse(value));
      const stringValue = JSON.stringify(newValue);
      localStorage.setItem(key, stringValue);
      setValue(stringValue);
    },
  ];
}

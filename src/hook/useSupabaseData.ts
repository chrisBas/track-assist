import { useEffect } from "react";
import { StoreApi, createStore, useStore } from "zustand";
import supabase from "../util/supabase-client";
import { useSession } from "./useSession";

export type OwnedRecord = { created_by: string; id: string };
export type SpecificRecord<T extends OwnedRecord> = Omit<T, "created_by">;
export type AnonymousSpecificRecord<T extends OwnedRecord> = Omit<
  T,
  "id" | "created_by"
>;

interface SupabaseDataState<T extends OwnedRecord> {
  isLoaded: boolean;
  setIsLoaded: (isLoaded: boolean) => void;
  items: SpecificRecord<T>[];
  setItems: (dietLineItems: SpecificRecord<T>[]) => void;
}
const STORES_BY_TABLE_NAME: Record<string, StoreApi<any>> = {};

function getStore<T extends OwnedRecord>(
  tableName: string
): StoreApi<SupabaseDataState<T>> {
  if (STORES_BY_TABLE_NAME[tableName] === undefined) {
    STORES_BY_TABLE_NAME[tableName] = createStore<SupabaseDataState<T>>(
      (set) => ({
        isLoaded: false,
        setIsLoaded: (isLoaded) => set({ isLoaded }),
        items: [],
        setItems: (items) => set({ items }),
      })
    );
  }
  return STORES_BY_TABLE_NAME[tableName];
}

export function useSupabaseData<T extends OwnedRecord>(
  tableName: string
): {
  isLoaded: boolean;
  items: SpecificRecord<T>[];
  update: (record: SpecificRecord<T>) => void;
  add: (record: AnonymousSpecificRecord<T>) => PromiseLike<SpecificRecord<T>>;
  delete: (id: string) => void;
} {
  const [session] = useSession();
  const { isLoaded, setIsLoaded, items, setItems } = useStore(
    getStore<T>(tableName)
  );

  useEffect(() => {
    if (session != null) {
      supabase
        .from(tableName)
        .select("*")
        .then((response) => {
          setItems(
            (response.data as T[]).map(
              ({ created_by: _created_by, ...speciticDietLineItem }) => {
                return speciticDietLineItem;
              }
            )
          );
          setIsLoaded(true);
        });
    }
  }, [tableName, setIsLoaded, session, setItems]);

  return {
    isLoaded,
    items: items,
    update: (item) => {
      supabase
        .from(tableName)
        .update({ ...item, created_by: session?.user.id })
        .eq("id", item.id)
        .select()
        .then((_response) => {
          setItems(items.map((a) => (a.id === item.id ? item : a)));
        });
    },
    add: (item) => {
      return supabase
        .from(tableName)
        .insert({ ...item, created_by: session?.user.id })
        .select()
        .then((response) => {
          const newItem = response.data![0] as T;
          const { created_by: _created_by, ...specificItem } = newItem;
          setItems([...items, newItem]);
          return specificItem;
        });
    },
    delete: (id) => {
      supabase
        .from(tableName)
        .delete()
        .eq("id", id)
        .then(() => {
          setItems(items.filter((item) => item.id !== id));
        });
    },
  };
}

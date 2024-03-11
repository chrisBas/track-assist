import { useEffect } from "react";
import { StoreApi, createStore, useStore } from "zustand";
import supabase from "../util/supabase-client";
import { useSession } from "./useSession";

type OwnedRecord<T> = T & { created_by: string; id: number };
type SpecificRecord<T> = Omit<OwnedRecord<T>, "created_by">;
type AnonymousSpecificRecord<T> = Omit<SpecificRecord<T>, "id">;

interface SupabaseDataState<T> {
  isLoaded: boolean;
  setIsLoaded: (isLoaded: boolean) => void;
  items: SpecificRecord<T>[];
  setItems: (dietLineItems: SpecificRecord<T>[]) => void;
}
const STORES_BY_TABLE_NAME: Record<string, StoreApi<any>> = {};

function getStore<T>(tableName: string): StoreApi<SupabaseDataState<T>> {
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

export function useSupabaseData<T>(tableName: string): {
  isLoaded: boolean;
  items: SpecificRecord<T>[];
  update: (record: SpecificRecord<T>) => void;
  add: (record: AnonymousSpecificRecord<T>) => void;
  delete: (id: number) => void;
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
        .order("datetime")
        .then((response) => {
          setItems(
            (response.data as OwnedRecord<T>[]).map(
              ({ created_by: _created_by, ...speciticDietLineItem }) => {
                return speciticDietLineItem as SpecificRecord<T>;
              }
            )
          );
          setIsLoaded(true);
        });
    }
  }, [tableName, setIsLoaded, session, setItems]);

  return {
    isLoaded,
    items,
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
      supabase
        .from(tableName)
        .insert({ ...item, created_by: session?.user.id })
        .select()
        .then((response) => {
          const newItem = response.data![0] as OwnedRecord<T>;
          setItems([
            ...items,
            { ...item, id: newItem.id } as SpecificRecord<T>,
          ]);
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

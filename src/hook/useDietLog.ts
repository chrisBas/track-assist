import { useEffect } from "react";
import { createStore, useStore } from "zustand";
import supabase from "../util/supabase-client";
import { useSession } from "./useSession";

const TABLE_NAME = "diet-log";

type DietLineItem = {
  id: number;
  unit_qty: number;
  datetime: string;
  food_id: number;
  created_by: string;
};

type SpecificDietLineItem = Omit<DietLineItem, "created_by">;
type AnonymousSpecificDietLineItem = Omit<SpecificDietLineItem, "id">;

interface DietLogState {
  isLoaded: boolean;
  setIsLoaded: (isLoaded: boolean) => void;
  dietLineItems: SpecificDietLineItem[];
  setDietLineItems: (dietLineItems: SpecificDietLineItem[]) => void;
}

const store = createStore<DietLogState>((set) => ({
  isLoaded: false,
  setIsLoaded: (isLoaded) => set({ isLoaded }),
  dietLineItems: [],
  setDietLineItems: (dietLineItems) => set({ dietLineItems }),
}));

export function useDietLog(): {
  isLoaded: boolean;
  items: SpecificDietLineItem[];
  update: (dietLineItem: SpecificDietLineItem) => void;
  add: (dietLineItem: AnonymousSpecificDietLineItem) => void;
  delete: (id: number) => void;
} {
  const [session] = useSession();
  const { isLoaded, setIsLoaded, dietLineItems, setDietLineItems } =
    useStore(store);

  useEffect(() => {
    if (session != null) {
      supabase
        .from(TABLE_NAME)
        .select("*")
        .order("datetime")
        .then((response) => {
          setDietLineItems(
            (response.data as DietLineItem[]).map(
              ({ created_by: _created_by, ...speciticDietLineItem }) => {
                return speciticDietLineItem;
              }
            )
          );
          setIsLoaded(true);
        });
    }
  }, [setIsLoaded, session, setDietLineItems]);

  return {
    isLoaded,
    items: dietLineItems,
    update: (dietLineItem) => {
      supabase
        .from(TABLE_NAME)
        .update({ ...dietLineItem, created_by: session?.user.id })
        .eq("id", dietLineItem.id)
        .select()
        .then((_response) => {
          setDietLineItems(
            dietLineItems.map((a) =>
              a.id === dietLineItem.id ? dietLineItem : a
            )
          );
        });
    },
    add: (dietLineItem) => {
      supabase
        .from(TABLE_NAME)
        .insert({ ...dietLineItem, created_by: session?.user.id })
        .select()
        .then((response) => {
          const newItem = response.data![0] as DietLineItem;
          setDietLineItems([
            ...dietLineItems,
            { ...dietLineItem, id: newItem.id },
          ]);
        });
    },
    delete: (id) => {
      supabase
        .from(TABLE_NAME)
        .delete()
        .eq("id", id)
        .then(() => {
          setDietLineItems(
            dietLineItems.filter((dietLineItem) => dietLineItem.id !== id)
          );
        });
    },
  };
}

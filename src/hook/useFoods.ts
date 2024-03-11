import { useEffect } from "react";
import { createStore, useStore } from "zustand";
import supabase from "../util/supabase-client";
import { useSession } from "./useSession";

type Food = {
  id: number;
  name: string;
  unit_id: number;
  unit_qty: number;
  calories: number;
  created_by: string;
};

type SpecificFood = Omit<Food, "created_by">;
type AnonymousSpecificFood = Omit<SpecificFood, "id">;

interface FoodState {
  isLoaded: boolean;
  setIsLoaded: (isLoaded: boolean) => void;
  foods: SpecificFood[];
  setFoods: (foods: SpecificFood[]) => void;
}

const store = createStore<FoodState>((set) => ({
  isLoaded: false,
  setIsLoaded: (isLoaded) => set({ isLoaded }),
  foods: [],
  setFoods: (foods) => set({ foods }),
}));

export function useFoods(): {
  isLoaded: boolean;
  foods: SpecificFood[];
  addFood: (food: AnonymousSpecificFood) => PromiseLike<SpecificFood>;
} {
  const [session] = useSession();
  const { isLoaded, setIsLoaded, foods, setFoods } = useStore(store);

  useEffect(() => {
    if (session != null) {
      supabase
        .from("foods")
        .select("*")
        .order("name")
        .then((response) => {
          setFoods(
            (response.data as Food[]).map(
              ({ created_by: _created_by, ...specificFood }) => {
                return specificFood;
              }
            )
          );
          setIsLoaded(true);
        });
    }
  }, [setIsLoaded, session, setFoods]);

  return {
    isLoaded,
    foods,
    addFood: (food) => {
      return supabase
        .from("foods")
        .insert({ ...food, created_by: session?.user.id })
        .select()
        .then((response) => {
          const newFood = response.data![0] as Food;
          const updatedFood: SpecificFood = { ...food, id: newFood.id };
          setFoods([...foods, updatedFood]);
          return updatedFood;
        });
    },
  };
}

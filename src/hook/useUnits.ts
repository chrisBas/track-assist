import { useEffect } from "react";
import { createStore, useStore } from "zustand";
import supabase from "../util/supabase-client";
import { useSession } from "./useSession";

type UOM = {
  id: number;
  name: string;
  abbreviation: string;
  created_by: string;
};

type SpecificUOM = Omit<UOM, "created_by">;
type AnonymousSpecificUOM = Omit<SpecificUOM, "id">;

interface UOMState {
  isLoaded: boolean;
  setIsLoaded: (isLoaded: boolean) => void;
  unitsOfMeasurement: SpecificUOM[];
  setUnitsOfMeasurement: (uom: SpecificUOM[]) => void;
}

const store = createStore<UOMState>((set) => ({
  isLoaded: false,
  setIsLoaded: (isLoaded) => set({ isLoaded }),
  unitsOfMeasurement: [],
  setUnitsOfMeasurement: (unitsOfMeasurement) => set({ unitsOfMeasurement }),
}));

export function useUnits(): {
  isLoaded: boolean;
  unitsOfMeasurement: SpecificUOM[];
  addUom: (uom: AnonymousSpecificUOM) => PromiseLike<SpecificUOM>;
} {
  const [session] = useSession();
  const { isLoaded, setIsLoaded, unitsOfMeasurement, setUnitsOfMeasurement } =
    useStore(store);

  useEffect(() => {
    supabase
      .from("units-of-measurement")
      .select("*")
      .order("name")
      .then((response) => {
        setUnitsOfMeasurement(
          (response.data as UOM[]).map(
            ({ created_by: _created_by, ...specificUom }) => {
              return specificUom;
            }
          )
        );
        setIsLoaded(true);
      });
  }, [setIsLoaded, session, setUnitsOfMeasurement]);

  return {
    isLoaded,
    unitsOfMeasurement,
    addUom: (uom) => {
      return supabase
        .from("units-of-measurement")
        .insert({ ...uom, created_by: session?.user.id })
        .select()
        .then((response) => {
          const newUom = response.data![0] as UOM;
          const updatedUom: SpecificUOM = { ...uom, id: newUom.id };
          setUnitsOfMeasurement([...unitsOfMeasurement, updatedUom]);
          return updatedUom;
        });
    },
  };
}

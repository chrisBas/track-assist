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
  unitsOfMeasurement: SpecificUOM[];
  setUnitsOfMeasurement: (uom: SpecificUOM[]) => void;
}

const store = createStore<UOMState>((set) => ({
  unitsOfMeasurement: [],
  setUnitsOfMeasurement: (unitsOfMeasurement) => set({ unitsOfMeasurement }),
}));

export function useUnits(): {
  unitsOfMeasurement: SpecificUOM[];
  addUom: (uom: AnonymousSpecificUOM) => PromiseLike<SpecificUOM>;
} {
  const [session] = useSession();
  const { unitsOfMeasurement, setUnitsOfMeasurement } = useStore(store);

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
      });
  }, [session, setUnitsOfMeasurement]);

  return {
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

import supabase from "../../common/utils/supabase-client";

export type UOM = {
    id: number;
    name: string;
    abbreviation: string;
    created_by: string;
  };

export type Food = {
    id: number;
    name: string;
    unit_id: number;
    unit_qty: number;
    calories: number;
    created_by: string;
  };

  export type FoodExpanded = {
    id: number;
    name: string;
    unit_qty: number;
    calories: number;
    created_by: string;
    'units-of-measurement': UOM;
  }

export type DietLogItem = {
    id: number;
    servings: number;
    datetime: string;
    food_id: number;
    created_by: string;
  };

  export type DietLogItemExpanded = {
    id: number;
    servings: number;
    datetime: string;
    created_by: string;
    foods: FoodExpanded;
  };



export function getDietLogs(date: string) {
    const tableName = 'diet-log'
    const query = 'id, created_by, datetime, servings, foods( id, name, unit_qty, calories, created_by, units-of-measurement( id, name, abbreviation, created_by ) )';

    return supabase
    .from(tableName)
    .select(query as '*')
    .lt('datetime', `${date} 23:59`)
    .gte('datetime', `${date} 00:00`)
    .then(response => 
        response.data as DietLogItemExpanded[]
    );
}
import { useEffect } from "react";
import { createStore, useStore } from "zustand";
import supabase from "../util/supabase-client";
import { useSession } from "./useSession";

export type Activity = {
  id: number;
  activity: string;
  start_time: string | null;
  end_time: string | null;
  notes: string | null;
  user_id: string;
};

export type SpecificActivity = Omit<Activity, "activity" | "user_id">;
export type AnonymousSpecificActivity = Omit<SpecificActivity, "id">;

interface WorkActivityState {
  activities: SpecificActivity[];
  setActivities: (activities: SpecificActivity[]) => void;
}

const store = createStore<WorkActivityState>((set) => ({
  activities: [],
  setActivities: (activities) => set({ activities }),
}));

export function useWorkActivity(): {
  activities: SpecificActivity[];
  updateActivity: (activity: SpecificActivity) => void;
  addActivity: (activity: AnonymousSpecificActivity) => void;
  deleteActivity: (id: number) => void;
} {
  const [session] = useSession();
  const { activities, setActivities } = useStore(store);

  useEffect(() => {
    if (session != null) {
      supabase
        .from("activity-log")
        .select("*")
        .eq("activity", "work")
        .order("start_time")
        .then((response) => {
          setActivities(
            (response.data as Activity[]).map(
              ({
                activity: _activity,
                user_id: _user_id,
                ...specificActivity
              }) => {
                return specificActivity;
              }
            )
          );
        });
    }
  }, [session, setActivities]);

  return {
    activities,
    updateActivity: (activity) => {
      supabase
        .from("activity-log")
        .update({ ...activity, activity: "work", user_id: session?.user.id })
        .eq("id", activity.id)
        .select()
        .then((response) => {
          setActivities(
            activities.map((a) => (a.id === activity.id ? activity : a))
          );
        });
    },
    addActivity: (activity) => {
      supabase
        .from("activity-log")
        .insert({ ...activity, activity: "work", user_id: session?.user.id })
        .select()
        .then((response) => {
          const newActivity = response.data![0] as Activity;
          setActivities([...activities, { ...activity, id: newActivity.id }]);
        });
    },
    deleteActivity: (id) => {
      supabase
        .from("activity-log")
        .delete()
        .eq("id", id)
        .then(() => {
          setActivities(activities.filter((activity) => activity.id !== id));
        });
    },
  };
}

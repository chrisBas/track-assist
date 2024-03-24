import useLocalStorage from "./useLocalStorage";

export default function useActiveApp() {
  const [activeApp, setActiveApp] = useLocalStorage<{
    app: string;
    nav: string;
    page: string;
  }>("active-app", { app: "Workout Tracker", nav: "Dashboard", page: "Workout Dashboard" });

  return { activeApp, setActiveApp };
}

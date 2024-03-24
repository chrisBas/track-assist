import useLocalStorage from "./useLocalStorage";

export default function useActiveApp() {
  const [activeApp, setActiveApp] = useLocalStorage<{
    app: string;
    nav: string;
    page: string;
  }>("active-app", { app: "Health and Fitness", nav: "Dashboard", page: "Fitness Dashboard" });

  return { activeApp, setActiveApp };
}

import { Page } from "../../../legacy/types/Pages";
import useLocalStorage from "./useLocalStorage";

export default function useActivePage() {
  const [activePage, setActivePage] = useLocalStorage<Page>("active-page", "");

  return { activePage, setActivePage };
}

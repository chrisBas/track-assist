import Layout from "./component/Layout";
import useActivePage from "./hook/useActivePage";
import CrystalUrchinCalculator from "./page/CrystalUrchinCalculator";
import DropChanceCalculator from "./page/DropChanceCalculator";
import Home from "./page/Home";
import MortgageCalculator from "./page/MortgageCalculator";
import ProgrammingCheatSheet from "./page/ProgrammingCheatSheet";
import { Page } from "./type/Pages";

export const navigationItems: {
  section: string;
  content: { text: string; path: Page; element: JSX.Element }[];
}[] = [
  {
    section: "Finance",
    content: [
      {
        text: "Mortgage Calculator",
        path: "mortgage-calc",
        element: <MortgageCalculator />,
      },
    ],
  },
  {
    section: "Programming",
    content: [
      {
        text: "Cheat Sheet",
        path: "programming-cheat-sheet",
        element: <ProgrammingCheatSheet />,
      },
    ],
  },
  {
    section: "Runescape",
    content: [
      {
        text: "Crystal Urchin Calculator",
        path: "crystal-urchin-calc",
        element: <CrystalUrchinCalculator />,
      },
      {
        text: "Drop Chance Calculator",
        path: "drop-chance-calc",
        element: <DropChanceCalculator />,
      },
    ],
  },
];

function App() {
  const { activePage } = useActivePage();
  const page: JSX.Element =
    activePage === "" ? (
      <Home />
    ) : (
      navigationItems
        .flatMap((ni) => ni.content)
        .find((c) => c.path === activePage)?.element!
    );

  return <Layout>{page}</Layout>;
}

export default App;

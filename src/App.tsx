import { BrowserRouter, Route, Routes } from "react-router-dom";
import Layout from "./component/Layout";
import CrystalUrchinCalculator from "./page/CrystalUrchinCalculator";
import DropChanceCalculator from "./page/DropChanceCalculator";
import Home from "./page/Home";
import MortgageCalculator from "./page/MortgageCalculator";
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
//needed to properly path github pages
const basename = document.querySelector("base")?.getAttribute("href") ?? "/";

function App() {
  return (
    <BrowserRouter basename={basename}>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          {navigationItems
            .flatMap((ni) => ni.content)
            .map(({ path, element }) => (
              <Route key={path} path={path} element={element} />
            ))}
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;

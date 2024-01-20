import Layout from "./component/Layout";
import useActivePage from "./hook/useActivePage";
import Home from "./page/Home";
import MinikubeGuide from "./page/MinikubeGuide";
import MortgageCalculator from "./page/MortgageCalculator";
import ProgrammingCheatSheet from "./page/ProgrammingCheatSheet";
import TimeTracker from "./page/TimeTracker";
import { Page } from "./type/Pages";

export const navigationItems: {
  section: string;
  content: { text: string; path: Page; element: JSX.Element }[];
}[] = [
  {
    section: "Time Management",
    content: [
      {
        text: "Time Tracker",
        path: "time-tracker",
        element: <TimeTracker />,
      },
    ],
  },
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
    section: "Guides",
    content: [
      {
        text: "Minikube",
        path: "minikube",
        element: <MinikubeGuide />,
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

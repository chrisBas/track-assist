import { FitnessCenter, Restaurant } from "@mui/icons-material";
import DashboardIcon from "@mui/icons-material/Dashboard";
import Layout from "./component/Layout";
import MobileLayout from "./component/MobileLayout";
import useActivePage from "./hook/useActivePage";
import DietTracker from "./page/DietTracker";
import FitnessTracker from "./page/FitnessTracker";
import Home from "./page/Home";
import MinikubeGuide from "./page/MinikubeGuide";
import MortgageCalculator from "./page/MortgageCalculator";
import ProgrammingCheatSheet from "./page/ProgrammingCheatSheet";
import TimeTracker from "./page/TimeTracker";
import WeightTracker from "./page/WeightTracker";
import { App as AppType } from "./type/App";
import { Page } from "./type/Pages";

import MobileFitnessTracker from "./mobile/page/FitnessTracker";
import MobileDietTracker from "./mobile/page/DietTracker";
import MobileFitnessDashboard from "./mobile/page/FitnessDashboard";

export const apps: AppType[] = [
  {
    name: "Health and Fitness",
    nav: [
      {
        label: "Dashboard",
        icon: <DashboardIcon />,
        pages: [
          {
            label: "Fitness Dashboard",
            page: <MobileFitnessDashboard />,
          },
        ],
      },
      {
        label: "Fitness",
        icon: <FitnessCenter />,
        pages: [
          {
            label: "Fitness Tracker",
            page: <MobileFitnessTracker />,
          },
        ],
      },
      {
        label: "Diet",
        icon: <Restaurant />,
        pages: [
          {
            label: "Diet Tracker",
            page: <MobileDietTracker />,
          },
        ],
      },
    ],
  },
];

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
    section: "Health",
    content: [
      {
        text: "Diet Tracker",
        path: "diet-tracker",
        element: <DietTracker />,
      },
      {
        text: "Fitness Tracker",
        path: "fitness-tracker",
        element: <FitnessTracker />,
      },
      {
        text: "Weight Tracker",
        path: "weight-tracker",
        element: <WeightTracker />,
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
  const pageContent: { text: string; path: Page; element: JSX.Element } =
    activePage === ""
      ? { text: "Home", path: "", element: <Home /> }
      : navigationItems
          .flatMap((ni) => ni.content)
          .find((c) => c.path === activePage)!;

  const userAgent = navigator.userAgent.toLowerCase();
  const isMobile = /iphone|ipad|ipod|android|windows phone/g.test(userAgent);

  if (isMobile) {
    return <MobileLayout apps={apps} />;
  }

  return <Layout title={pageContent.text}>{pageContent.element}</Layout>;
}

export default App;

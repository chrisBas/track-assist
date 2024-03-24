import { CalendarToday, FitnessCenter, Restaurant, Schedule } from "@mui/icons-material";
import DashboardIcon from "@mui/icons-material/Dashboard";
import Layout from "./component/Layout";
import MobileLayout from "./component/MobileLayout";
import useActivePage from "./hook/useActivePage";
import FitnessTracker from "./page/FitnessTracker";
import Home from "./page/Home";
import MinikubeGuide from "./page/MinikubeGuide";
import MortgageCalculator from "./page/MortgageCalculator";
import ProgrammingCheatSheet from "./page/ProgrammingCheatSheet";
import TimeTracker from "./page/TimeTracker";
import WeightTracker from "./page/WeightTracker";
import { Applet } from "./type/Applet";
import { Page } from "./type/Pages";

import DietCalendar from "./mobile/page/DietCalendar";
import DietDashboard from "./mobile/page/DietDashboard";
import DietTracker from "./mobile/page/DietTracker";
import WorkoutCalendar from "./mobile/page/WorkoutCalendar";
import WorkoutDashboard from "./mobile/page/WorkoutDashboard";
import WorkoutTracker from "./mobile/page/WorkoutTracker";
import TimeManagementDashboard from "./mobile/page/TimeManagementDashboard";
import TimeManagementTracker from "./mobile/page/TimeManagementTracker";
import TimeManagementCalendar from "./mobile/page/TimeManagementCalendar";

export const apps: Applet[] = [
  {
    name: "Workout Tracker",
    img: "/mustupdate/fitness.png",
    description: "Monitor and analyze your workouts.",
    nav: [
      {
        label: "Dashboard",
        icon: <DashboardIcon />,
        pages: [
          {
            label: "Workout Dashboard",
            page: <WorkoutDashboard />,
          },
        ],
      },
      {
        label: "Workout",
        icon: <FitnessCenter />,
        pages: [
          {
            label: "Workout Tracker",
            page: <WorkoutTracker />,
          },
        ],
      },
      {
        label: "Calendar",
        icon: <CalendarToday />,
        pages: [
          {
            label: "Workout Calendar",
            page: <WorkoutCalendar />,
          },
        ],
      },
    ],
  },
  {
    name: "Diet Tracker",
    img: "/mustupdate/healthy-diet.png",
    description: "Monitor and analyze your food consumption.",
    nav: [
      {
        label: "Dashboard",
        icon: <DashboardIcon />,
        pages: [
          {
            label: "Diet Dashboard",
            page: <DietDashboard />,
          },
        ],
      },
      {
        label: "Diet",
        icon: <Restaurant />,
        pages: [
          {
            label: "Diet Tracker",
            page: <DietTracker />,
          },
        ],
      },
      {
        label: "Calendar",
        icon: <CalendarToday />,
        pages: [
          {
            label: "Diet Calendar",
            page: <DietCalendar />,
          },
        ],
      },
    ],
  },
  {
    name: "Time Management",
    img: "/mustupdate/time-management.png",
    description: "Manage and view how effectively you spend your time.",
    nav: [
      {
        label: "Dashboard",
        icon: <DashboardIcon />,
        pages: [
          {
            label: "Time Management Dashboard",
            page: <TimeManagementDashboard />,
          },
        ],
      },
      {
        label: "Time",
        icon: <Schedule />,
        pages: [
          {
            label: "Time Management Tracker",
            page: <TimeManagementTracker />,
          },
        ],
      },
      {
        label: "Calendar",
        icon: <CalendarToday />,
        pages: [
          {
            label: "Time Management Calendar",
            page: <TimeManagementCalendar />,
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

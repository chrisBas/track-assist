import {
  Assignment,
  CalendarToday,
  FitnessCenter,
  Restaurant,
  Schedule,
} from "@mui/icons-material";
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
import { Applet } from "./type/Applet";
import { Page } from "./type/Pages";

import DietCalendar from "./mobile/page/diet/DietCalendar";
import DietDashboard from "./mobile/page/diet/DietDashboard";
import DietTracker from "./mobile/page/diet/DietTracker";
import NewDietRecord from "./mobile/page/diet/NewDietRecord";
import NewFood from "./mobile/page/diet/NewFood";
import TimeManagementCalendar from "./mobile/page/time-management/TimeManagementCalendar";
import TimeManagementDashboard from "./mobile/page/time-management/TimeManagementDashboard";
import TimeManagementTracker from "./mobile/page/time-management/TimeManagementTracker";
import TodoCalendar from "./mobile/page/todo/TodoCalendar";
import TodoDashboard from "./mobile/page/todo/TodoDashboard";
import TodoTasks from "./mobile/page/todo/TodoTasks";
import NewWeightEntry from "./mobile/page/weight/NewWeightEntry";
import WeightDashboard from "./mobile/page/weight/WeightDashboard";
import WeightTracker from "./mobile/page/weight/WeightTracker";
import NewExercise from "./mobile/page/workout/NewExercise";
import NewWorkout from "./mobile/page/workout/NewWorkout";
import WorkoutCalendar from "./mobile/page/workout/WorkoutCalendar";
import WorkoutDashboard from "./mobile/page/workout/WorkoutDashboard";
import WorkoutTracker from "./mobile/page/workout/WorkoutTracker";
import props from "./util/props";

export const apps: Applet[] = [
  {
    name: "Todo List",
    img: `${props.srcPrefix}/mustupdate/todo-list.png`,
    description: "Manage, track, and collaborate your tasks with others.",
    nav: [
      {
        label: "Dashboard",
        icon: <DashboardIcon />,
        pages: [
          {
            label: "Todo Dashboard",
            page: <TodoDashboard />,
          },
        ],
      },
      {
        label: "Tasks",
        icon: <Assignment />,
        pages: [
          {
            label: "Todo Tasks",
            page: <TodoTasks />,
          },
        ],
      },
      {
        label: "Calendar",
        icon: <CalendarToday />,
        pages: [
          {
            label: "Todo Calendar",
            page: <TodoCalendar />,
          },
        ],
      },
    ],
  },
  {
    name: "Workout Tracker",
    img: `${props.srcPrefix}/mustupdate/fitness.png`,
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
          {
            label: "New Workout",
            page: <NewWorkout />,
          },
          {
            label: "New Exercise",
            page: <NewExercise />,
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
    img: `${props.srcPrefix}/mustupdate/healthy-diet.png`,
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
          {
            label: "New Diet Record",
            page: <NewDietRecord />,
          },
          {
            label: "New Food",
            page: <NewFood />,
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
    img: `${props.srcPrefix}/mustupdate/time-management.png`,
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
  {
    name: "Weight Loss",
    img: `${props.srcPrefix}/mustupdate/weight-loss.png`,
    description: "Monitor and analyze your weight loss progress.",
    nav: [
      {
        label: "Dashboard",
        icon: <DashboardIcon />,
        pages: [
          {
            label: "Weight Loss Dashboard",
            page: <WeightDashboard />,
          },
        ],
      },
      {
        label: "Weight",
        icon: <Schedule />,
        pages: [
          {
            label: "Weight Tracker",
            page: <WeightTracker />,
          },
          {
            label: "New Weight Entry",
            page: <NewWeightEntry />,
          },
        ],
      },
      {
        label: "Calendar",
        icon: <CalendarToday />,
        pages: [
          {
            label: "Weight Loss Calendar",
            page: <WeightDashboard />,
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

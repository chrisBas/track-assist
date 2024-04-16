import { Assignment, CalendarToday, FitnessCenter, Groups, Restaurant, Schedule } from '@mui/icons-material';
import DashboardIcon from '@mui/icons-material/Dashboard';

import MobileLayout from './features/common/components/MobileLayout';
import useActivePage from './features/common/hooks/useActivePage';
import { Applet } from './features/common/types/Applet';
import props from './features/common/utils/props';
import DietCalendar from './features/diet/pages/DietCalendar';
import DietDashboard from './features/diet/pages/DietDashboard';
import DietTracker from './features/diet/pages/DietTracker';
import NewDietRecord from './features/diet/pages/NewDietRecord';
import NewFood from './features/diet/pages/NewFood';
import GroupAssign from './features/profile/pages/GroupAssign';
import GroupCreation from './features/profile/pages/GroupCreation';
import GroupUserCreation from './features/profile/pages/GroupUserCreation';
import TagCreation from './features/profile/pages/TagCreation';
import TimeManagementCalendar from './features/time-management/pages/TimeManagementCalendar';
import TimeManagementDashboard from './features/time-management/pages/TimeManagementDashboard';
import TimeManagementTracker from './features/time-management/pages/TimeManagementTracker';
import TodoCalendar from './features/todo/pages/TodoCalendar';
import TodoCreation from './features/todo/pages/TodoCreation';
import TodoDashboard from './features/todo/pages/TodoDashboard';
import TodoTasks from './features/todo/pages/TodoTasks';
import NewWeightEntry from './features/weight/pages/NewWeightEntry';
import WeightDashboard from './features/weight/pages/WeightDashboard';
import WeightTracker from './features/weight/pages/WeightTracker';
import NewExercise from './features/workout/pages/NewExercise';
import NewWorkout from './features/workout/pages/NewWorkout';
import WorkoutCalendar from './features/workout/pages/WorkoutCalendar';
import WorkoutDashboard from './features/workout/pages/WorkoutDashboard';
import WorkoutTracker from './features/workout/pages/WorkoutTracker';
import Layout from './legacy/components/Layout';
import Home from './legacy/pages/Home';
import MortgageCalculator from './legacy/pages/MortgageCalculator';
import ProgrammingCheatSheet from './legacy/pages/ProgrammingCheatSheet';
import TimeTracker from './legacy/pages/TimeTracker';
import { Page } from './legacy/types/Pages';

export const apps: Applet[] = [
  {
    name: 'Profile',
    img: `${props.srcPrefix}/mustupdate/profile.png`,
    description: 'View and manage your profile.',
    nav: [
      {
        label: 'Groups',
        icon: <Groups />,
        pages: [
          {
            label: 'Group Assign',
            page: <GroupAssign />,
          },
          {
            label: 'Group Creation',
            page: <GroupCreation />,
          },
          {
            label: 'Group User Creation',
            page: <GroupUserCreation />,
          },
          {
            label: 'Tag Creation',
            page: <TagCreation />,
          },
        ],
      },
    ],
  },
  {
    name: 'Todo List',
    img: `${props.srcPrefix}/mustupdate/todo-list.png`,
    description: 'Manage, track, and collaborate your tasks with others.',
    nav: [
      {
        label: 'Dashboard',
        icon: <DashboardIcon />,
        pages: [
          {
            label: 'Todo Dashboard',
            page: <TodoDashboard />,
          },
        ],
      },
      {
        label: 'Tasks',
        icon: <Assignment />,
        pages: [
          {
            label: 'Todo Tasks',
            page: <TodoTasks />,
          },
          {
            label: 'Todo Creation',
            page: <TodoCreation />,
          },
        ],
      },
      {
        label: 'Calendar',
        icon: <CalendarToday />,
        pages: [
          {
            label: 'Todo Calendar',
            page: <TodoCalendar />,
          },
        ],
      },
    ],
  },
  {
    name: 'Workout Tracker',
    img: `${props.srcPrefix}/mustupdate/fitness.png`,
    description: 'Monitor and analyze your workouts.',
    nav: [
      {
        label: 'Dashboard',
        icon: <DashboardIcon />,
        pages: [
          {
            label: 'Workout Dashboard',
            page: <WorkoutDashboard />,
          },
        ],
      },
      {
        label: 'Workout',
        icon: <FitnessCenter />,
        pages: [
          {
            label: 'Workout Tracker',
            page: <WorkoutTracker />,
          },
          {
            label: 'New Workout',
            page: <NewWorkout />,
          },
          {
            label: 'New Exercise',
            page: <NewExercise />,
          },
        ],
      },
      {
        label: 'Calendar',
        icon: <CalendarToday />,
        pages: [
          {
            label: 'Workout Calendar',
            page: <WorkoutCalendar />,
          },
        ],
      },
    ],
  },
  {
    name: 'Diet Tracker',
    img: `${props.srcPrefix}/mustupdate/healthy-diet.png`,
    description: 'Monitor and analyze your food consumption.',
    nav: [
      {
        label: 'Dashboard',
        icon: <DashboardIcon />,
        pages: [
          {
            label: 'Diet Dashboard',
            page: <DietDashboard />,
          },
        ],
      },
      {
        label: 'Diet',
        icon: <Restaurant />,
        pages: [
          {
            label: 'Diet Tracker',
            page: <DietTracker />,
          },
          {
            label: 'New Diet Record',
            page: <NewDietRecord />,
          },
          {
            label: 'New Food',
            page: <NewFood />,
          },
        ],
      },
      {
        label: 'Calendar',
        icon: <CalendarToday />,
        pages: [
          {
            label: 'Diet Calendar',
            page: <DietCalendar />,
          },
        ],
      },
    ],
  },
  {
    name: 'Time Management',
    img: `${props.srcPrefix}/mustupdate/time-management.png`,
    description: 'Manage and view how effectively you spend your time.',
    nav: [
      {
        label: 'Dashboard',
        icon: <DashboardIcon />,
        pages: [
          {
            label: 'Time Management Dashboard',
            page: <TimeManagementDashboard />,
          },
        ],
      },
      {
        label: 'Time',
        icon: <Schedule />,
        pages: [
          {
            label: 'Time Management Tracker',
            page: <TimeManagementTracker />,
          },
        ],
      },
      {
        label: 'Calendar',
        icon: <CalendarToday />,
        pages: [
          {
            label: 'Time Management Calendar',
            page: <TimeManagementCalendar />,
          },
        ],
      },
    ],
  },
  {
    name: 'Weight Loss',
    img: `${props.srcPrefix}/mustupdate/weight-loss.png`,
    description: 'Monitor and analyze your weight loss progress.',
    nav: [
      {
        label: 'Dashboard',
        icon: <DashboardIcon />,
        pages: [
          {
            label: 'Weight Loss Dashboard',
            page: <WeightDashboard />,
          },
        ],
      },
      {
        label: 'Weight',
        icon: <Schedule />,
        pages: [
          {
            label: 'Weight Tracker',
            page: <WeightTracker />,
          },
          {
            label: 'New Weight Entry',
            page: <NewWeightEntry />,
          },
        ],
      },
      {
        label: 'Calendar',
        icon: <CalendarToday />,
        pages: [
          {
            label: 'Weight Loss Calendar',
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
    section: 'Time Management',
    content: [
      {
        text: 'Time Tracker',
        path: 'time-tracker',
        element: <TimeTracker />,
      },
    ],
  },
  {
    section: 'Finance',
    content: [
      {
        text: 'Mortgage Calculator',
        path: 'mortgage-calc',
        element: <MortgageCalculator />,
      },
    ],
  },
  {
    section: 'Programming',
    content: [
      {
        text: 'Cheat Sheet',
        path: 'programming-cheat-sheet',
        element: <ProgrammingCheatSheet />,
      },
    ],
  },
];

function App() {
  const { activePage } = useActivePage();
  const pageContent: { text: string; path: Page; element: JSX.Element } =
    activePage === ''
      ? { text: 'Home', path: '', element: <Home /> }
      : navigationItems.flatMap((ni) => ni.content).find((c) => c.path === activePage)!;

  const userAgent = navigator.userAgent.toLowerCase();
  const isMobile = /iphone|ipad|ipod|android|windows phone/g.test(userAgent);

  if (isMobile) {
    return <MobileLayout apps={apps} />;
  }

  return <Layout title={pageContent.text}>{pageContent.element}</Layout>;
}

export default App;

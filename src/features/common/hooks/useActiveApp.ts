import { useEffect } from 'react';

import useLocalStorage from './useLocalStorage';

const stack: { app: string; nav: string; page: string }[] = [];

export default function useActiveApp() {
  const [activeApp, setActiveApp] = useLocalStorage<{
    app: string;
    nav: string;
    page: string;
  }>('active-app', {
    app: 'Workout Tracker',
    nav: 'Dashboard',
    page: 'Workout Dashboard',
  });

  useEffect(() => {
    if (
      stack.length === 0 ||
      !(
        stack[stack.length - 1].app === activeApp.app &&
        stack[stack.length - 1].nav === activeApp.nav &&
        stack[stack.length - 1].page === activeApp.page
      )
    ) {
      stack.push(activeApp);
    }
  }, [activeApp]);

  return {
    activeApp,
    setActiveApp,
    goBack: () => {
      if (stack.length > 1) {
        stack.pop()!;
        const prev = stack.pop()!;
        setActiveApp(() => prev);
      }
    },
  };
}

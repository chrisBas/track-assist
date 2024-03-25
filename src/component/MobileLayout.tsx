import MenuIcon from "@mui/icons-material/Menu";
import {
  BottomNavigation,
  BottomNavigationAction,
  CssBaseline,
  Paper,
} from "@mui/material";
import Box from "@mui/material/Box";
import useActiveApp from "../hook/useActiveApp";
import MainMenu from "../mobile/page/MainMenu";
import { Applet } from "../type/Applet";

const COMMON_PAGES: Record<string, React.ReactNode> = {
  "Main Menu": <MainMenu />,
};

interface Props {
  apps: Applet[];
}

export default function MobileLayout({ apps }: Props) {
  // global state
  const { activeApp, setActiveApp } = useActiveApp();

  // local vars
  const app = apps.find((app) => app.name === activeApp.app)!;
  const commonPage = COMMON_PAGES[activeApp.page];
  const navIdx =
    commonPage === undefined
      ? app.nav.findIndex((nav) => nav.label === activeApp.nav)!
      : app.nav.length;
  const nav = commonPage === undefined ? app.nav[navIdx]! : undefined;
  const page =
    commonPage === undefined
      ? nav!.pages.find((page) => page.label === activeApp.page)!
      : { label: activeApp.page, page: commonPage };

  return (
    <Box>
      <CssBaseline />
      {/* pb=18 is 144px, 56px bottomnav + 16px fab bottom padding + 56px fab size + 16px fab top padding */}
      <Box component="main" pb={18}>
        {page.page}
      </Box>
      <Paper
        sx={{ position: "fixed", bottom: 0, left: 0, right: 0 }}
        elevation={3}
      >
        <BottomNavigation showLabels value={navIdx}>
          {app.nav.map((navItem, index) => (
            <BottomNavigationAction
              key={navItem.label}
              label={navItem.label}
              icon={navItem.icon}
              onClick={() => {
                setActiveApp(() => ({
                  app: app.name,
                  nav: navItem.label,
                  page: navItem.pages[0].label,
                }));
              }}
            />
          ))}
          <BottomNavigationAction
            label="Menu"
            icon={<MenuIcon />}
            onClick={() => {
              setActiveApp((prev) => ({
                ...prev,
                page: "Main Menu",
              }));
            }}
          />
        </BottomNavigation>
      </Paper>
    </Box>
  );
}

import { ListSubheader } from "@mui/material";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import Toolbar from "@mui/material/Toolbar";
import { Page } from "../type/Pages";
import Link from "./Link";

const drawerWidth = 240;

const navigationItems: {
  section: string;
  content: { text: string; link: Page }[];
}[] = [
  {
    section: "Finance",
    content: [{ text: "Mortgage Calculator", link: "mortgage-calc" }],
  },
  {
    section: "Runescape",
    content: [
      { text: "Crystal Urchin Calculator", link: "crystal-urchin-calc" },
    ],
  },
];

export default function LeftNavDrawer() {
  return (
    <Drawer
      variant="permanent"
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        [`& .MuiDrawer-paper`]: {
          width: drawerWidth,
          boxSizing: "border-box",
        },
      }}
    >
      <Toolbar />
      <Box sx={{ overflow: "auto" }}>
        <List dense>
          {navigationItems.map((navigationItem) => (
            <ListItem
              key={navigationItem.section}
              sx={{ display: "block" }}
              disablePadding
            >
              <List
                subheader={
                  <ListSubheader
                    component="div"
                    sx={{ textTransform: "uppercase", lineHeight: 2 }}
                  >
                    {navigationItem.section}
                  </ListSubheader>
                }
                dense
              >
                {navigationItem.content.map((contentItem) => (
                  <ListItem
                    key={contentItem.text}
                    sx={{ display: "block" }}
                    disablePadding
                  >
                    <Link to={contentItem.link}>
                      <ListItemButton>
                        <ListItemText primary={contentItem.text} />
                      </ListItemButton>
                    </Link>
                  </ListItem>
                ))}
              </List>
            </ListItem>
          ))}
        </List>
      </Box>
    </Drawer>
  );
}

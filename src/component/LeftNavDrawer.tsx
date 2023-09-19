import { ListSubheader, Typography, useMediaQuery } from "@mui/material";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import Toolbar from "@mui/material/Toolbar";
import { navigationItems } from "../App";
import useActivePage from "../hook/useActivePage";

const drawerWidth = 240;

export default function LeftNavDrawer({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const { activePage, setActivePage } = useActivePage();
  const matches = useMediaQuery("(min-width:600px)");

  return (
    <Drawer
      open={open}
      onClose={onClose}
      container={window !== undefined ? window.document.body : undefined}
      variant={matches ? "permanent" : "temporary"}
      ModalProps={{
        keepMounted: true, // Better open performance on mobile.
      }}
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
                {navigationItem.content.map((contentItem) => {
                  const isCurrentPath = activePage === contentItem.path;
                  return (
                    <ListItem
                      key={contentItem.text}
                      sx={{ display: "block", py: 0, px: 1 }}
                    >
                      <ListItemButton
                        onClick={() => {
                          setActivePage((_old) => contentItem.path);
                          onClose();
                        }}
                        sx={[
                          {
                            "&:hover": {
                              color: "primary.main",
                            },
                          },
                          {
                            color: isCurrentPath
                              ? "primary.contrastText"
                              : undefined,
                            backgroundColor: isCurrentPath
                              ? "primary.main"
                              : undefined,
                          },
                        ]}
                      >
                        <ListItemText
                          disableTypography
                          primary={
                            <Typography
                              variant="body2"
                              sx={{ fontWeight: "light" }}
                            >
                              {contentItem.text}
                            </Typography>
                          }
                        />
                      </ListItemButton>
                    </ListItem>
                  );
                })}
              </List>
            </ListItem>
          ))}
        </List>
      </Box>
    </Drawer>
  );
}

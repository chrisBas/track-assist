import { Close, Search } from "@mui/icons-material";
import {
    Box,
    Divider,
    Drawer,
    IconButton,
    InputBase,
    Paper,
} from "@mui/material";
import { useEffect, useState } from "react";

interface Props {
  open: boolean;
  children: React.ReactNode;
  onClose: () => void;
  onSearch?: (value: string) => void;
}

export default function FullPageDrawer({
  open,
  children,
  onClose,
  onSearch,
}: Props) {
  // local state
  const [search, setSearch] = useState("");

  // local vars
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
  };

  // effects
  useEffect(() => {
    if (open === true && onSearch !== undefined) {
      const searchTimeout = setTimeout(() => {
        onSearch?.(search);
      }, 400);
      return () => {
        clearTimeout(searchTimeout);
      };
    }
  }, [open, search, onSearch]);

  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={onClose}
      sx={{
        "& .MuiDrawer-paper": {
          width: "100vw",
          height: "calc(100vh - 56px)",
          top: "56px",
          "@media (min-width: 0px) and (orientation: landscape)": {
            height: "calc(100vh - 48px)",
            top: "48px",
          },
          "@media (min-width: 600px)": {
            height: "calc(100vh - 64px)",
            top: "64px",
          },
        },
      }}
      keepMounted
    >
      <Paper
        sx={{
          p: "2px 4px",
          display: "flex",
          alignItems: "center",
          width: "100%",
        }}
      >
        <InputBase
          sx={{ ml: 1, flex: 1 }}
          placeholder="Search/Create New"
          onChange={handleSearch}
          inputRef={(input) => input?.focus()}
        />
        <Search color="disabled" sx={{ mx: "10px" }} />
        <Divider sx={{ height: 28, m: 0.5 }} orientation="vertical" />
        <IconButton color="primary" sx={{ p: "10px" }} onClick={onClose}>
          <Close />
        </IconButton>
      </Paper>
      <Box
        sx={{
          overflowY: "scroll",
        }}
      >
        {children}
      </Box>
    </Drawer>
  );
}

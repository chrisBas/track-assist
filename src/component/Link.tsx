import { Link as MuiLink } from "@mui/material";
import { type ReactNode } from "react";
import { Link as RouterLink } from "react-router-dom";
import { Page } from "../type/Pages";

interface LinkProps {
  to: Page;
  children?: ReactNode;
}

export default function Link({ to, children }: LinkProps) {
  return (
    <MuiLink
      component={RouterLink}
      to={to}
      sx={{ textDecoration: "none", color: "inherit" }}
    >
      {children}
    </MuiLink>
  );
}

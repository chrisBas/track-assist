import { Grid } from "@mui/material";
import { type ReactNode } from "react";

interface TableProps {
  children?: ReactNode;
}

export function Table({ children }: TableProps) {
  return <Grid container>{children}</Grid>;
}

interface RowProps {
  children?: ReactNode;
}

export function Row({ children }: RowProps) {
  return (
    <Grid item xs={12}>
      <Table>{children}</Table>
    </Grid>
  );
}

interface TdProps {
  span?: number;
  children?: ReactNode;
}

export function Td({ span = 1, children }: TdProps) {
  return (
    <Grid item xs={span}>
      {children}
    </Grid>
  );
}

export function Th({ children, ...props }: TdProps) {
  return (
    <Td {...props}>
      <b>{children}</b>
    </Td>
  );
}

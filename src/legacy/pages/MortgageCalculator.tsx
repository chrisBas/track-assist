import { Box, Grid, TextField, Typography } from "@mui/material";
import moment from "moment";
import useLocalStorage from "../../features/common/hooks/useLocalStorage";

function formatNum(n: number) {
  let [s, d] = `${n}`.split(".");
  for (let i = s.length - 3; i > 0; i -= 3) {
    s = s.slice(0, i) + "," + s.slice(i);
  }
  return d ? `${s}.${d.substring(0, 2)}` : s;
}

function monthsAsText(months: number) {
  const completionDate = moment().add(months, "months").format('MMM, YYYY');
  if (months < 12) {
    return `${months} month(s) (${completionDate})`;
  } else {
    const years = Math.floor(months / 12);
    const monthsLeft = months % 12;
    return `${years} years${monthsLeft ? ` and ${monthsLeft} month(s)` : ""} (${completionDate})`;
  }
}

export default function MortgageCalculator() {
  const [{ loanAmt, interestRate, monthlyPayment }, set] = useLocalStorage<{
    loanAmt: "" | number;
    interestRate: "" | number;
    monthlyPayment: "" | number;
  }>("mortgage", {
    loanAmt: "",
    interestRate: "",
    monthlyPayment: "",
  });
  const setLoanAmt = (loanAmt: number) => set((old) => ({ ...old, loanAmt }));
  const setInterestRate = (interestRate: number) =>
    set((old) => ({ ...old, interestRate }));
  const setMonthlyPayment = (monthlyPayment: number) =>
    set((old) => ({ ...old, monthlyPayment }));

  const monthlyInterestPct = (interestRate || 0) / 12;
  const firstMonthInterest = (loanAmt || 0) * (monthlyInterestPct / 100);
  let totalLeft = loanAmt || 0;
  let totalOwed: number | null = 0;
  if (monthlyPayment && firstMonthInterest < monthlyPayment) {
    while (totalLeft > 0) {
      const interest = totalLeft * (monthlyInterestPct / 100);
      const payment = Math.min(monthlyPayment || 0, totalLeft);
      totalOwed += payment;
      totalLeft = totalLeft - payment + interest;
    }
  } else {
    totalOwed = null;
  }

  return (
    <Box>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <TextField
            label="Loan Amount"
            type="number"
            value={loanAmt}
            onChange={(e) => setLoanAmt(parseFloat(e.currentTarget.value))}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            label="Interest Rate %"
            type="number"
            value={interestRate}
            onChange={(e) => setInterestRate(parseFloat(e.currentTarget.value))}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            label="Monthly Payment"
            type="number"
            value={monthlyPayment}
            onChange={(e) =>
              setMonthlyPayment(parseFloat(e.currentTarget.value))
            }
          />
        </Grid>
        <Grid item xs={12}>
          <Typography variant="body1">
            {totalOwed == null
              ? `Monthly payment could not cover monthly interest`
              : `Total Money Owed: $${formatNum(
                  totalOwed
                )} (principal + $${formatNum(
                  totalOwed - (loanAmt || 0)
                )} interest)`}
          </Typography>
          {totalOwed != null && (
            <Typography variant="body1">{`Paid off in ${monthsAsText(
              Math.ceil(totalOwed / (monthlyPayment || 0))
            )}`}</Typography>
          )}
        </Grid>
      </Grid>
    </Box>
  );
}

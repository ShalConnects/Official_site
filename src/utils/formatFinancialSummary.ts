export interface FinancialSummaryData {
  income: number;
  expenses: number;
  firstTx: string;
  lastTx: string;
}

const C = '৳';
const fmt = (n: number) => n.toLocaleString('en', { minimumFractionDigits: 2 });
const validDate = (s: string) => !isNaN(new Date(s).getTime());
const d = (s: string) => validDate(s) ? new Date(s).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : '—';

export function formatFinancialSummary({ income, expenses, firstTx, lastTx }: FinancialSummaryData) {
  const net = income - expenses;
  const netStr = net >= 0 ? `${C}${fmt(net)}` : `−${C}${fmt(-net)}`;
  return {
    line1: `Income ${C}${fmt(income)} | Expenses ${C}${fmt(expenses)} | Net ${netStr}`,
    line2: `${d(firstTx)} → ${d(lastTx)}`
  };
}

import { useState } from 'react';
import { Copy, Check } from 'lucide-react';
import PageLayout from '../components/PageLayout';
import PageContainer from '../components/PageContainer';
import PageSection from '../components/PageSection';
import { usePageTitle } from '../hooks/usePageTitle';
import { useMetaTags } from '../hooks/useMetaTags';
import FinancialSummary from '../components/FinancialSummary';
import { formatFinancialSummary } from '../utils/formatFinancialSummary';

const DEMO = { income: 3161603.75, expenses: 3401225.5, firstTx: '2025-07-01', lastTx: '2026-03-02' };

export default function FinanceSummaryPage() {
  usePageTitle('Finance Summary');
  useMetaTags({ title: 'Finance Summary - All-Time Income & Expenses | ShalConnects', description: 'Format and display your all-time income, expenses, net, and date range in a clean summary.', keywords: 'finance summary, income, expenses, budget', ogTitle: 'Finance Summary', ogDescription: 'Format income, expenses, and net in a clean summary.', ogImage: '/logo.png', twitterTitle: 'Finance Summary', twitterDescription: 'Format income, expenses, and net.', twitterImage: '/logo.png' });

  const [income, setIncome] = useState(DEMO.income);
  const [expenses, setExpenses] = useState(DEMO.expenses);
  const [firstTx, setFirstTx] = useState(DEMO.firstTx);
  const [lastTx, setLastTx] = useState(DEMO.lastTx);
  const [copied, setCopied] = useState(false);

  const { line1, line2 } = formatFinancialSummary({ income, expenses, firstTx, lastTx });
  const summaryText = `All-Time Summary: ${line1} | ${line2}`;

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(summaryText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  };

  return (
    <PageLayout title="Finance Summary" backTo={{ href: '/tools', label: 'Back to Tools' }}>
      <PageSection>
        <PageContainer>
          <div className="max-w-2xl space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <label htmlFor="fs-income" className="flex flex-col gap-1">
                <span className="text-sm text-gray-400">Income (৳)</span>
                <input id="fs-income" type="number" step="0.01" value={income} onChange={e => setIncome(Number(e.target.value) || 0)} className="rounded-lg border border-gray-600 bg-gray-800 px-3 py-2 text-white" />
              </label>
              <label htmlFor="fs-expenses" className="flex flex-col gap-1">
                <span className="text-sm text-gray-400">Expenses (৳)</span>
                <input id="fs-expenses" type="number" step="0.01" value={expenses} onChange={e => setExpenses(Number(e.target.value) || 0)} className="rounded-lg border border-gray-600 bg-gray-800 px-3 py-2 text-white" />
              </label>
              <label htmlFor="fs-first" className="flex flex-col gap-1">
                <span className="text-sm text-gray-400">First Tx (YYYY-MM-DD)</span>
                <input id="fs-first" type="date" value={firstTx} onChange={e => setFirstTx(e.target.value)} className="rounded-lg border border-gray-600 bg-gray-800 px-3 py-2 text-white" />
              </label>
              <label htmlFor="fs-last" className="flex flex-col gap-1">
                <span className="text-sm text-gray-400">Last Tx (YYYY-MM-DD)</span>
                <input id="fs-last" type="date" value={lastTx} onChange={e => setLastTx(e.target.value)} className="rounded-lg border border-gray-600 bg-gray-800 px-3 py-2 text-white" />
              </label>
            </div>
            <FinancialSummary line1={line1} line2={line2} />
            <button onClick={copy} aria-label="Copy summary" aria-pressed={copied} className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-700 hover:bg-gray-600 text-white text-sm transition-colors">
              {copied ? <Check size={16} /> : <Copy size={16} />}
              {copied ? 'Copied!' : 'Copy summary'}
            </button>
          </div>
        </PageContainer>
      </PageSection>
    </PageLayout>
  );
}

import React, { useState, useCallback, useMemo } from 'react';
import { Briefcase, Copy, Check } from 'lucide-react';
import PageLayout from '../components/PageLayout';
import { usePageTitle } from '../hooks/usePageTitle';
import { useMetaTags } from '../hooks/useMetaTags';
import { buildUpworkPrompt, type BudgetType, type UpworkParams } from '../utils/upworkProposal';
import { inputClass } from '../utils/formStyles';

const LABEL = 'Upwork Proposal Generator';
const COPY_RESET_MS = 2000;
const BUDGET_OPTIONS: { value: BudgetType; label: string }[] = [
  { value: 'hourly', label: 'Hourly' },
  { value: 'fixed', label: 'Fixed' },
  { value: 'scope-call', label: 'Scope call' }
];

export default function UpworkProposalGenerator() {
  usePageTitle(LABEL);
  useMetaTags({
    title: `${LABEL} - Free Tool | ShalConnects`,
    description: 'Generate professional Upwork proposals (100–160 words) with a hook, plan, proof, pricing, and CTA. Paste job details or add a job URL for reference.',
    keywords: 'upwork proposal, freelancer proposal, upwork cover letter, job proposal generator',
    ogTitle: `${LABEL} - Free Tool`,
    ogDescription: 'Generate professional Upwork proposals with a hook, plan, proof, pricing, and CTA.',
    ogImage: '/logo.png',
    twitterTitle: `${LABEL} - Free Tool`,
    twitterDescription: 'Generate professional Upwork proposals in seconds.',
    twitterImage: '/logo.png'
  });

  const [jobPosting, setJobPosting] = useState('');
  const [skills, setSkills] = useState('');
  const [budgetType, setBudgetType] = useState<BudgetType>('hourly');
  const [budgetAmount, setBudgetAmount] = useState('');
  const [proof, setProof] = useState('');
  const [jobUrl, setJobUrl] = useState('');
  const [copied, setCopied] = useState(false);
  const [showToast, setShowToast] = useState(false);

  const params: UpworkParams = useMemo(() => ({
    jobPosting,
    skills,
    budgetType,
    budgetAmount,
    proof: proof || undefined,
    jobUrl: jobUrl || undefined
  }), [jobPosting, skills, budgetType, budgetAmount, proof, jobUrl]);

  const prompt = useMemo(() => buildUpworkPrompt(params), [params]);

  const copy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(prompt);
      setCopied(true);
      setShowToast(true);
      setTimeout(() => { setCopied(false); setShowToast(false); }, COPY_RESET_MS);
    } catch {
      setCopied(false);
    }
  }, [prompt]);

  const inputCls = inputClass(false);

  return (
    <PageLayout title={LABEL} backTo={{ href: '/tools', label: 'Back to Tools' }}>
      <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-3 sm:py-4 md:py-6">
        <div className="text-center mb-6">
          <h1 className="text-2xl sm:text-3xl font-bold mb-2 bg-gradient-to-r from-green-400 to-emerald-600 bg-clip-text text-transparent">
            {LABEL}
          </h1>
          <p className="text-gray-400 text-sm">
            Build a prompt to paste into ChatGPT or Claude. Copy the prompt, then paste it into your AI tool.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1.5">Job posting *</label>
              <textarea value={jobPosting} onChange={(e) => setJobPosting(e.target.value)} placeholder="Paste the full job description here" rows={4} className={inputCls} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1.5">My skills / experience *</label>
              <textarea value={skills} onChange={(e) => setSkills(e.target.value)} placeholder="e.g. 5 years eBay experience" rows={2} className={inputCls} />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1.5">Budget type</label>
                <select value={budgetType} onChange={(e) => setBudgetType(e.target.value as BudgetType)} className={inputCls}>
                  {BUDGET_OPTIONS.map((o) => (
                    <option key={o.value} value={o.value}>{o.label}</option>
                  ))}
                </select>
              </div>
              <div className={budgetType !== 'scope-call' ? '' : 'hidden'}>
                <label className="block text-sm font-medium text-gray-300 mb-1.5">Amount</label>
                <input type="text" value={budgetAmount} onChange={(e) => setBudgetAmount(e.target.value)} placeholder="e.g. 5 or 50" className={inputCls} />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1.5">Proof / portfolio (optional)</label>
              <input type="text" value={proof} onChange={(e) => setProof(e.target.value)} placeholder="e.g. Sold 200+ boat listings on eBay in 6 months" className={inputCls} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1.5">Job URL (optional)</label>
              <input type="url" value={jobUrl} onChange={(e) => setJobUrl(e.target.value)} placeholder="https://www.upwork.com/..." className={inputCls} />
            </div>
          </div>

          <div className="bg-gray-800/50 rounded-lg border border-gray-700/50 p-4">
            <div className="flex items-center justify-between mb-3">
              <label className="text-sm font-medium text-gray-300 flex items-center gap-2">
                <Briefcase className="w-4 h-4 text-green-400" /> Prompt to copy
              </label>
              <button type="button" onClick={copy} className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-gray-700 hover:bg-gray-600 text-gray-200 text-sm transition-colors">
                {copied ? <Check className="w-3.5 h-3.5 text-green-400" /> : <Copy className="w-3.5 h-3.5" />}
                {copied ? 'Copied!' : 'Copy'}
              </button>
            </div>
            <textarea readOnly value={prompt} rows={14} className="w-full bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 text-sm text-gray-300 placeholder-gray-500 focus:outline-none resize-none" />
          </div>
        </div>

        {showToast && (
          <div className="fixed top-4 right-4 px-4 py-2 rounded-lg bg-green-500/90 text-white text-sm flex items-center gap-2 z-50 animate-[slideIn_0.3s_ease-out]">
            <Check className="w-4 h-4" /> Copied to clipboard
          </div>
        )}
      </div>
    </PageLayout>
  );
}

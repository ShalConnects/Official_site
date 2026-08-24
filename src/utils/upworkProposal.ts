/** Build Upwork proposal prompt for AI (ChatGPT/Claude). */

export type BudgetType = 'hourly' | 'fixed' | 'scope-call';

export interface UpworkParams {
  jobPosting: string;
  skills: string;
  budgetType: BudgetType;
  budgetAmount: string;
  proof?: string;
  jobUrl?: string;
}

function formatBudget(params: UpworkParams): string {
  if (params.budgetType === 'scope-call') return 'Offer a scope call to discuss pricing';
  const amt = params.budgetAmount.trim();
  if (!amt) return params.budgetType === 'hourly' ? 'Specify hourly rate' : 'Specify fixed price';
  const num = amt.replace(/[^0-9.]/g, '');
  return params.budgetType === 'hourly' ? `$${num}/hr` : `$${num} fixed`;
}

export function buildUpworkPrompt(params: UpworkParams): string {
  const budget = formatBudget(params);
  const proofNote = params.proof?.trim()
    ? `Use this proof: "${params.proof}"`
    : 'User did not provide proof; suggest a generic placeholder or ask them to add one.';
  const urlNote = params.jobUrl?.trim() ? `\nJob URL (for reference): ${params.jobUrl}` : '';

  return `Write an Upwork proposal (100–160 words) for the job below. Tone: professional, confidently helpful, slightly witty. Include: (1) a 1-line hook that echoes the client's top pain; (2) a concise 3-step plan with a milestone and timeline (if applies to the job); (3) one short relevant proof (past result or portfolio link); (4) transparent pricing/timeline or a note offering a scope call; (5) a call-to-action and one clarifying question.

Job posting: "[${params.jobPosting.trim() || '(paste job description)'}]"
My skills/experience: "[${params.skills.trim() || '(your experience)'}]"
Preferred budget: [${budget}]
${proofNote}${urlNote}`;
}

import React, { useState, useMemo, useCallback, useRef, useEffect } from 'react';
import { Share2, Copy, Check, ExternalLink, RotateCcw } from 'lucide-react';
import PageLayout from '../components/PageLayout';
import { usePageTitle } from '../hooks/usePageTitle';
import { useMetaTags } from '../hooks/useMetaTags';
import { buildShareLinks, type ShareParams } from '../utils/shareLinks';

const LABEL = 'Share Link Generator';
const COPY_RESET_MS = 2000;
const INPUT_CLASS = 'w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white placeholder-gray-500 focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500/50';

const FORM_FIELDS: { key: keyof ShareParams; label: string; placeholder: string; type: 'url' | 'text'; section: 'url' | 'social' | 'pinterest' | 'email' }[] = [
  { key: 'url', label: 'URL to share *', placeholder: 'https://example.com/page', type: 'url', section: 'url' },
  { key: 'text', label: 'Tweet / post text (Twitter, Bluesky)', placeholder: 'Optional', type: 'text', section: 'social' },
  { key: 'telegramText', label: 'Telegram message', placeholder: 'Optional', type: 'text', section: 'social' },
  { key: 'pinterestImageUrl', label: 'Pinterest image URL', placeholder: 'Falls back to URL above', type: 'url', section: 'pinterest' },
  { key: 'pinterestSourceUrl', label: 'Pinterest pin source URL', placeholder: 'Falls back to URL above', type: 'url', section: 'pinterest' },
  { key: 'emailRecipient', label: 'Email recipient', placeholder: 'email@example.com', type: 'text', section: 'email' },
  { key: 'emailSubject', label: 'Subject', placeholder: 'Optional', type: 'text', section: 'email' },
  { key: 'emailBody', label: 'Body', placeholder: 'Optional', type: 'text', section: 'email' },
  { key: 'emailCc', label: 'CC', placeholder: 'Optional', type: 'text', section: 'email' },
  { key: 'emailBcc', label: 'BCC', placeholder: 'Optional', type: 'text', section: 'email' }
];

const URL_FIELDS = FORM_FIELDS.filter((f) => f.section === 'url');
const OPTIONAL_FIELDS = FORM_FIELDS.filter((f) => f.section !== 'url');

const initialForm: Record<string, string> = FORM_FIELDS.reduce((acc, { key }) => ({ ...acc, [key]: '' }), {});

function CopyBtn({ id, value, label, copiedId, onCopy }: { id: string; value: string; label: string; copiedId: string | null; onCopy: (id: string, value: string) => void }) {
  return (
    <button
      type="button"
      onClick={() => onCopy(id, value)}
      className="flex items-center gap-1.5 px-2 py-1 rounded bg-gray-700 hover:bg-gray-600 text-gray-200 text-sm transition-colors flex-shrink-0"
      aria-label={`Copy ${label}`}
    >
      {copiedId === id ? <Check className="w-3.5 h-3.5 text-green-400" /> : <Copy className="w-3.5 h-3.5" />}
      {label}
    </button>
  );
}

export default function ShareLinkGenerator() {
  usePageTitle(LABEL);
  useMetaTags({
    title: `${LABEL} - Free Tool | ShalConnects`,
    description: 'Create Facebook, Twitter/X, LinkedIn, Bluesky, Telegram, Pinterest share links and email mailto links from one URL. No JavaScript required on the target.',
    keywords: 'share link generator, facebook share, twitter share, linkedin share, mailto, share url',
    ogTitle: `${LABEL} - Free Tool`,
    ogDescription: 'Generate share links for Facebook, Twitter, LinkedIn, Bluesky, Telegram, Pinterest and email from one form.',
    ogImage: '/logo.png',
    twitterTitle: `${LABEL} - Free Tool`,
    twitterDescription: 'Generate share links for all major platforms from one URL.',
    twitterImage: '/logo.png'
  });

  const [form, setForm] = useState(initialForm);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [showToast, setShowToast] = useState(false);

  const setField = useCallback((key: string, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  }, []);

  const params: ShareParams = useMemo(() => ({
    url: form.url,
    text: form.text,
    telegramText: form.telegramText,
    pinterestImageUrl: form.pinterestImageUrl || form.url,
    pinterestSourceUrl: form.pinterestSourceUrl || form.url,
    emailRecipient: form.emailRecipient,
    emailSubject: form.emailSubject,
    emailBody: form.emailBody,
    emailCc: form.emailCc,
    emailBcc: form.emailBcc
  }), [form]);

  const links = useMemo(() => buildShareLinks(params), [params]);
  const resultsRef = useRef<HTMLElement>(null);
  useEffect(() => {
    if (links.length > 0) resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, [links.length]);

  const copy = useCallback(async (id: string, value: string) => {
    try {
      await navigator.clipboard.writeText(value);
      setCopiedId(id);
      setShowToast(true);
      setTimeout(() => { setCopiedId(null); setShowToast(false); }, COPY_RESET_MS);
    } catch {
      setCopiedId(null);
    }
  }, []);

  const clearForm = useCallback(() => {
    setForm(initialForm);
  }, []);

  return (
    <PageLayout title={LABEL} backTo={{ href: '/tools', label: 'Back to Tools' }}>
      <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-3 sm:py-4 md:py-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-4 mb-2">
          <p className="text-gray-400 text-sm">
            Enter a URL to get share links for Facebook, Twitter/X, LinkedIn, Bluesky, Telegram, Pinterest and email—no iframes or JavaScript.
          </p>
          <button type="button" onClick={clearForm} className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-gray-700 hover:bg-gray-600 text-gray-300 text-sm transition-colors self-start sm:self-auto shrink-0" aria-label="Clear form">
            <RotateCcw className="w-3.5 h-3.5" /> Clear
          </button>
        </div>

        <div className="space-y-6 mb-8">
          <section className="space-y-3 border border-gray-700 rounded-lg p-4">
            {URL_FIELDS.map(({ key, label, placeholder, type }) => (
              <div key={key} className="flex flex-col md:flex-row md:items-center gap-2 md:gap-4">
                <label className="text-sm font-medium text-gray-300 shrink-0 md:w-32">{label}</label>
                <input
                  type={type}
                  value={form[key] ?? ''}
                  onChange={(e) => setField(key, e.target.value)}
                  placeholder={placeholder}
                  className={INPUT_CLASS}
                />
              </div>
            ))}
          </section>
          <details>
            <summary className="text-sm font-medium text-gray-500 uppercase tracking-wider border-b border-gray-700/50 pb-1.5 cursor-pointer list-none [&::-webkit-details-marker]:hidden">
              More options (optional)
            </summary>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 pt-3">
              {OPTIONAL_FIELDS.map(({ key, label, placeholder, type }) => (
                <div key={key}>
                  <label className="block text-sm font-medium text-gray-300 mb-1">{label}</label>
                  <input
                    type={type}
                    value={form[key] ?? ''}
                    onChange={(e) => setField(key, e.target.value)}
                    placeholder={placeholder}
                    className={INPUT_CLASS}
                  />
                </div>
              ))}
            </div>
          </details>
        </div>

        <section ref={resultsRef}>
          <h2 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
            <Share2 className="w-5 h-5 text-amber-400" />
            Generated links
          </h2>
          {links.length === 0 ? (
            <p className="text-gray-500 text-sm py-4">Enter a URL above to generate share links.</p>
          ) : (
            <ul className="space-y-3">
              {links.map(({ id, name, urlOnly, htmlLink }) => (
                <li key={id} className="bg-gray-800/80 border border-gray-700 rounded-lg p-3 sm:p-4">
                  <div className="flex items-center justify-between gap-2 mb-2 flex-wrap">
                    <span className="font-medium text-white">{name}</span>
                    <div className="flex items-center gap-2">
                      <a href={urlOnly} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 px-2 py-1 rounded bg-gray-700 hover:bg-gray-600 text-gray-200 text-sm transition-colors" aria-label={`Open ${name} share`}>
                        <ExternalLink className="w-3.5 h-3.5" /> Open
                      </a>
                      <CopyBtn id={`${id}-url`} value={urlOnly} label="URL only" copiedId={copiedId} onCopy={copy} />
                    </div>
                  </div>
                  <p className="text-gray-400 text-xs sm:text-sm font-mono break-all mb-2">{urlOnly}</p>
                  <div className="flex items-center justify-between gap-2">
                    <code className="text-gray-500 text-xs sm:text-sm break-all flex-1 min-w-0">{htmlLink}</code>
                    <CopyBtn id={`${id}-html`} value={htmlLink} label="HTML" copiedId={copiedId} onCopy={copy} />
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>

        {showToast && (
          <div className="fixed bottom-4 left-1/2 -translate-x-1/2 px-4 py-2 rounded-lg bg-amber-500/90 text-gray-900 text-sm font-medium shadow-lg z-50" role="status" aria-live="polite">
            Copied!
          </div>
        )}
      </div>
    </PageLayout>
  );
}

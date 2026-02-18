/** Build share URLs (no iframes/JS required). Single source for all platforms. */
const enc = (s: string) => encodeURIComponent(s);

export interface ShareParams {
  url: string;
  text?: string;
  telegramText?: string;
  pinterestImageUrl?: string;
  pinterestSourceUrl?: string;
  emailRecipient?: string;
  emailSubject?: string;
  emailBody?: string;
  emailCc?: string;
  emailBcc?: string;
}

export interface ShareLinkResult {
  id: string;
  name: string;
  urlOnly: string;
  htmlLink: string;
}

function buildShareLinks(p: ShareParams): ShareLinkResult[] {
  const u = (p.url || '').trim();
  const hasUrl = u.length > 0;
  const text = (p.text || '').trim();
  const tgText = (p.telegramText || '').trim();
  const pinImg = (p.pinterestImageUrl || '').trim() || u;
  const pinSrc = (p.pinterestSourceUrl || '').trim() || u;
  const mailTo = (p.emailRecipient || '').trim();
  const mailSubj = (p.emailSubject || '').trim();
  const mailBody = (p.emailBody || '').trim();
  const mailCc = (p.emailCc || '').trim();
  const mailBcc = (p.emailBcc || '').trim();

  const q = (params: Record<string, string>) =>
    Object.entries(params)
      .filter(([, v]) => v !== '')
      .map(([k, v]) => `${k}=${enc(v)}`)
      .join('&');

  const results: ShareLinkResult[] = [];

  if (hasUrl) {
    results.push({
      id: 'facebook',
      name: 'Facebook',
      urlOnly: `https://www.facebook.com/sharer/sharer.php?u=${enc(u)}`,
      htmlLink: `<a href="https://www.facebook.com/sharer/sharer.php?u=${enc(u)}">Share on Facebook</a>`
    });
    results.push({
      id: 'twitter',
      name: 'Twitter/X',
      urlOnly: `https://twitter.com/intent/tweet?${q({ url: u, text: text || u })}`,
      htmlLink: `<a href="https://twitter.com/intent/tweet?${q({ url: u, text: text || u })}">Tweet this</a>`
    });
    results.push({
      id: 'linkedin',
      name: 'LinkedIn',
      urlOnly: `https://www.linkedin.com/sharing/share-offsite/?url=${enc(u)}`,
      htmlLink: `<a href="https://www.linkedin.com/sharing/share-offsite/?url=${enc(u)}">Share on LinkedIn</a>`
    });
    results.push({
      id: 'telegram',
      name: 'Telegram',
      urlOnly: `https://t.me/share/url?${q({ url: u, text: tgText })}`,
      htmlLink: `<a href="https://t.me/share/url?${q({ url: u, text: tgText })}">Share on Telegram</a>`
    });
    results.push({
      id: 'pinterest',
      name: 'Pinterest',
      urlOnly: `https://www.pinterest.com/pin/create/button/?url=${enc(pinSrc)}&media=${enc(pinImg)}`,
      htmlLink: `<a href="https://www.pinterest.com/pin/create/button/?url=${enc(pinSrc)}&media=${enc(pinImg)}">Pin this</a>`
    });
  }

  const bskyText = [text, u].filter(Boolean).join(' ');
  if (bskyText) {
    results.push({
      id: 'bluesky',
      name: 'Bluesky',
      urlOnly: `https://bsky.app/intent/compose?text=${enc(bskyText)}`,
      htmlLink: `<a href="https://bsky.app/intent/compose?text=${enc(bskyText)}">Post on Bluesky</a>`
    });
  } else if (hasUrl) {
    results.push({
      id: 'bluesky',
      name: 'Bluesky',
      urlOnly: `https://bsky.app/intent/compose?text=${enc(u)}`,
      htmlLink: `<a href="https://bsky.app/intent/compose?text=${enc(u)}">Post on Bluesky</a>`
    });
  }

  if (mailTo) {
    const mailParams: Record<string, string> = {};
    if (mailSubj) mailParams.subject = mailSubj;
    if (mailBody) mailParams.body = mailBody;
    if (mailCc) mailParams.cc = mailCc;
    if (mailBcc) mailParams.bcc = mailBcc;
    const mailQuery = Object.entries(mailParams).map(([k, v]) => `${k}=${enc(v)}`).join('&');
    const mailtoUrl = `mailto:${enc(mailTo)}${mailQuery ? '?' + mailQuery : ''}`;
    results.push({
      id: 'email',
      name: 'Email',
      urlOnly: mailtoUrl,
      htmlLink: `<a href="${mailtoUrl.replace(/"/g, '&quot;')}">Send email</a>`
    });
  }

  return results;
}

export { buildShareLinks };

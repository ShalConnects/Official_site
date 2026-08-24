/** Shared newsletter subscription via Formspree. */

const FORMSPREE_ID = import.meta.env.VITE_FORMSPREE_NEWSLETTER_ID as string | undefined;
export const NEWSLETTER_ENDPOINT = FORMSPREE_ID
  ? `https://formspree.io/f/${FORMSPREE_ID}`
  : '';

export async function subscribeNewsletter(email: string): Promise<void> {
  if (!NEWSLETTER_ENDPOINT) {
    throw new Error('Newsletter is not configured. Set VITE_FORMSPREE_NEWSLETTER_ID.');
  }
  const res = await fetch(NEWSLETTER_ENDPOINT, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
    body: JSON.stringify({
      email: email.trim(),
      _subject: 'Newsletter subscription',
    }),
  });
  if (!res.ok) throw new Error('Subscription failed');
}

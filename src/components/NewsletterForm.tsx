import { useEffect, useRef, useState } from 'react';
import { Check } from 'lucide-react';
import { subscribeNewsletter } from '../utils/newsletter';

export default function NewsletterForm({ variant = 'page' }: { variant?: 'page' | 'sidebar' }) {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const resetRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const sidebar = variant === 'sidebar';

  useEffect(() => () => {
    if (resetRef.current) clearTimeout(resetRef.current);
  }, []);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return;
    setSubmitting(true);
    setError('');
    try {
      await subscribeNewsletter(email);
      setSubmitted(true);
      setEmail('');
      if (resetRef.current) clearTimeout(resetRef.current);
      resetRef.current = setTimeout(() => setSubmitted(false), 5000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Subscription failed. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className={sidebar ? 'text-center py-3' : 'text-center py-4'}>
        <div className={`inline-flex items-center gap-2 text-green-400 bg-green-500/20 rounded-lg border border-green-500/30 ${sidebar ? 'px-3 py-2 text-xs' : 'px-3 sm:px-4 py-2 text-sm sm:text-base'}`}>
          <Check className="w-4 h-4" />
          <span>{sidebar ? 'Subscribed!' : 'Thank you for subscribing!'}</span>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className={sidebar ? 'space-y-2' : 'max-w-md mx-auto flex flex-col sm:flex-row gap-2 sm:gap-3'}>
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder={sidebar ? 'Your email' : 'Enter your email'}
        aria-label="Email address"
        required
        className={`${sidebar ? 'w-full px-3 py-2 text-sm' : 'flex-1 px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base'} bg-gray-900 border border-gray-700 rounded-lg focus:outline-none focus:border-gradient-theme text-white placeholder-gray-500`}
      />
      <button
        type="submit"
        disabled={submitting}
        className={`${sidebar ? 'w-full px-3 py-2 text-sm' : 'px-4 sm:px-6 py-2.5 sm:py-3 text-sm sm:text-base whitespace-nowrap'} bg-gradient-theme text-white rounded-lg font-medium hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed`}
      >
        {submitting ? 'Subscribing...' : 'Subscribe'}
      </button>
      {error && (
        <p className={`text-red-400 ${sidebar ? 'text-xs' : 'text-sm sm:basis-full text-center'}`} role="alert">{error}</p>
      )}
    </form>
  );
}

import React, { useState } from 'react';
import { XCircle, CheckCircle, ArrowRight } from 'lucide-react';
import { inputClass, errorClass, submitBtnClass } from '../utils/formStyles';

const FORMSPREE_ID = import.meta.env.VITE_FORMSPREE_TESTIMONIALS_ID as string | undefined;
const ENDPOINT = FORMSPREE_ID ? `https://formspree.io/f/${FORMSPREE_ID}` : '';

interface State {
  name: string;
  email: string;
  role: string;
  message: string;
}
type Errors = Partial<Record<keyof State, string>>;

function validate(data: State): Errors {
  const e: Errors = {};
  if (!data.name.trim()) e.name = 'Name is required';
  if (!data.email.trim()) e.email = 'Email is required';
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) e.email = 'Valid email required';
  if (!data.message.trim()) e.message = 'Testimonial is required';
  return e;
}

export default function TestimonialForm() {
  const [data, setData] = useState<State>({ name: '', email: '', role: '', message: '' });
  const [errors, setErrors] = useState<Errors>({});
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [submitError, setSubmitError] = useState('');

  const update = (k: keyof State, v: string) => {
    setData((prev) => ({ ...prev, [k]: v }));
    if (errors[k]) setErrors((prev) => ({ ...prev, [k]: undefined }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!ENDPOINT) {
      setSubmitError('Submissions not configured. Set VITE_FORMSPREE_TESTIMONIALS_ID.');
      return;
    }
    const err = validate(data);
    if (Object.keys(err).length) {
      setErrors(err);
      return;
    }
    setErrors({});
    setSubmitError('');
    setSubmitting(true);
    try {
      const res = await fetch(ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: data.name,
          email: data.email,
          role: data.role || undefined,
          message: data.message,
          _subject: `New Testimonial from ${data.name}`,
        }),
      });
      if (!res.ok) throw new Error('Submit failed');
      setSuccess(true);
      setData({ name: '', email: '', role: '', message: '' });
    } catch {
      setSubmitError('Something went wrong. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="mt-8 sm:mt-10 md:mt-12 lg:mt-16">
      <h3 className="text-lg sm:text-xl font-semibold text-white mb-3 sm:mb-4">Leave your testimonial</h3>
      {!ENDPOINT && (
        <p className="text-gray-500 text-sm mb-3">Set VITE_FORMSPREE_TESTIMONIALS_ID in .env to enable submissions.</p>
      )}
      {success ? (
        <div className="p-4 rounded-xl bg-green-500/20 border border-green-500/50 flex items-center gap-3">
          <CheckCircle size={24} className="text-green-500 flex-shrink-0" />
          <p className="text-green-400 text-sm sm:text-base">Thank you! Your testimonial was submitted and may be featured after review.</p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4 max-w-xl">
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <input
                type="text"
                name="name"
                value={data.name}
                onChange={(e) => update('name', e.target.value)}
                placeholder="Your name"
                className={inputClass(!!errors.name)}
              />
              {errors.name && (
                <p className={errorClass}><XCircle size={12} className="mr-1" />{errors.name}</p>
              )}
            </div>
            <div>
              <input
                type="email"
                name="email"
                value={data.email}
                onChange={(e) => update('email', e.target.value)}
                placeholder="Your email"
                className={inputClass(!!errors.email)}
              />
              {errors.email && (
                <p className={errorClass}><XCircle size={12} className="mr-1" />{errors.email}</p>
              )}
            </div>
          </div>
          <div>
            <input
              type="text"
              name="role"
              value={data.role}
              onChange={(e) => update('role', e.target.value)}
              placeholder="Role or company (optional)"
              className={inputClass(false)}
            />
          </div>
          <div>
            <textarea
              name="message"
              value={data.message}
              onChange={(e) => update('message', e.target.value)}
              rows={4}
              placeholder="Your experience working with us..."
              className={`${inputClass(!!errors.message)} resize-none`}
            />
            {errors.message && (
              <p className={errorClass}><XCircle size={12} className="mr-1" />{errors.message}</p>
            )}
          </div>
          {submitError && <p className={errorClass}>{submitError}</p>}
          <button type="submit" disabled={submitting || !ENDPOINT} className={submitBtnClass}>
            {submitting ? (
              <><div className="w-4 h-4 sm:w-5 sm:h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />Sending...</>
            ) : (
              <><span>Submit testimonial</span><ArrowRight className="ml-2 w-4 h-4 sm:w-5 sm:h-5" /></>
            )}
          </button>
        </form>
      )}
    </div>
  );
}

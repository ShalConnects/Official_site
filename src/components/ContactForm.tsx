import React, { useState, useRef, useEffect } from 'react';
import { XCircle, CheckCircle, ChevronDown, ArrowRight } from 'lucide-react';

export interface ContactFormData {
  name: string;
  email: string;
  message: string;
  service: string;
}

export interface ContactFormErrors {
  name?: string;
  email?: string;
  message?: string;
  service?: string;
}

export interface ServiceCategoryOption {
  name: string;
  services: { title: string }[];
}

interface ContactFormProps {
  /** When set, service is shown read-only and dropdown is hidden (e.g. on service page modal) */
  prefillService?: string;
  /** For dropdown when prefillService is not set (e.g. on landing page) */
  serviceCategories?: ServiceCategoryOption[];
  /** Called after successful submit (e.g. close modal) */
  onSuccess?: () => void;
  /** Optional accent color for focus borders */
  accentColor?: string;
  /** Show inline success message instead of modal (e.g. when embedded in page) */
  successInline?: boolean;
}

const defaultAccent = '#176641';
const FORMSPREE_ID = import.meta.env.VITE_FORMSPREE_CONTACT_ID as string | undefined;
const CONTACT_ENDPOINT = FORMSPREE_ID ? `https://formspree.io/f/${FORMSPREE_ID}` : '';

export default function ContactForm({
  prefillService,
  serviceCategories = [],
  onSuccess,
  accentColor = defaultAccent,
  successInline = false
}: ContactFormProps) {
  const [formData, setFormData] = useState<ContactFormData>({
    name: '',
    email: '',
    message: '',
    service: prefillService ?? ''
  });
  const [formErrors, setFormErrors] = useState<ContactFormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [isServiceDropdownOpen, setIsServiceDropdownOpen] = useState(false);
  const [hoveredServiceIndex, setHoveredServiceIndex] = useState<number | null>(null);
  const serviceDropdownRef = useRef<HTMLDivElement>(null);
  const successTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (successTimerRef.current) clearTimeout(successTimerRef.current);
    };
  }, []);

  useEffect(() => {
    if (prefillService) setFormData(prev => ({ ...prev, service: prefillService }));
  }, [prefillService]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (serviceDropdownRef.current && !serviceDropdownRef.current.contains(e.target as Node)) {
        setIsServiceDropdownOpen(false);
        setHoveredServiceIndex(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const validateForm = (): ContactFormErrors => {
    const errors: ContactFormErrors = {};
    if (!formData.name.trim()) errors.name = 'Name is required';
    if (!formData.email.trim()) {
      errors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = 'Please enter a valid email address';
    }
    if (!formData.message.trim()) errors.message = 'Message is required';
    return errors;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errors = validateForm();
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }
    if (!CONTACT_ENDPOINT) {
      setSubmitError('Contact form is not configured. Please email hello@shalconnects.com.');
      return;
    }
    setFormErrors({});
    setSubmitError('');
    setIsSubmitting(true);
    try {
      const res = await fetch(CONTACT_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({
          name: formData.name.trim(),
          email: formData.email.trim(),
          message: formData.message.trim(),
          service: formData.service || undefined,
          _subject: `Contact from ${formData.name.trim()}${formData.service ? ` — ${formData.service}` : ''}`,
        }),
      });
      if (!res.ok) throw new Error('Submit failed');
      setShowSuccess(true);
      setFormData({ name: '', email: '', message: '', service: prefillService ?? '' });
      if (successTimerRef.current) clearTimeout(successTimerRef.current);
      successTimerRef.current = setTimeout(() => {
        setShowSuccess(false);
        onSuccess?.();
      }, 5000);
    } catch {
      setSubmitError('Something went wrong. Please try again or email hello@shalconnects.com.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (formErrors[name as keyof ContactFormErrors]) {
      setFormErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  const borderFocusStyle = { borderColor: accentColor };

  return (
    <>
      <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
        <div className="grid md:grid-cols-2 gap-4 sm:gap-6">
          <div>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              placeholder="Your Name"
              aria-label="Your name"
              autoComplete="name"
              className={`w-full bg-gray-900 border rounded-lg sm:rounded-xl px-4 py-3 sm:px-6 sm:py-4 text-sm sm:text-base text-white placeholder-gray-500 focus:outline-none transition-colors ${
                formErrors.name ? 'border-red-500 focus:border-red-500' : 'border-gray-700'
              }`}
              onFocus={(e) => !formErrors.name && (e.currentTarget.style.borderColor = accentColor)}
              onBlur={(e) => !formErrors.name && (e.currentTarget.style.borderColor = '#374151')}
            />
            {formErrors.name && (
              <p className="text-red-400 text-xs sm:text-sm mt-2 flex items-center">
                <XCircle size={12} className="sm:w-3.5 sm:h-3.5 mr-1" />
                {formErrors.name}
              </p>
            )}
          </div>
          <div>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              placeholder="Your Email"
              aria-label="Your email"
              autoComplete="email"
              className={`w-full bg-gray-900 border rounded-lg sm:rounded-xl px-4 py-3 sm:px-6 sm:py-4 text-sm sm:text-base text-white placeholder-gray-500 focus:outline-none transition-colors ${
                formErrors.email ? 'border-red-500 focus:border-red-500' : 'border-gray-700'
              }`}
              onFocus={(e) => !formErrors.email && (e.currentTarget.style.borderColor = accentColor)}
              onBlur={(e) => !formErrors.email && (e.currentTarget.style.borderColor = '#374151')}
            />
            {formErrors.email && (
              <p className="text-red-400 text-xs sm:text-sm mt-2 flex items-center">
                <XCircle size={12} className="sm:w-3.5 sm:h-3.5 mr-1" />
                {formErrors.email}
              </p>
            )}
          </div>
        </div>

        {prefillService ? (
          <div className="rounded-lg sm:rounded-xl py-3 sm:py-4 px-4 sm:px-6 bg-gray-800/50 border border-gray-700 text-gray-300 text-sm sm:text-base">
            Service: <span className="text-white font-medium">{prefillService}</span>
            <input type="hidden" name="service" value={prefillService} />
          </div>
        ) : (
          <div className="relative" ref={serviceDropdownRef}>
            <button
              type="button"
              onClick={() => setIsServiceDropdownOpen(!isServiceDropdownOpen)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  setIsServiceDropdownOpen(!isServiceDropdownOpen);
                } else if (e.key === 'ArrowDown' && !isServiceDropdownOpen) {
                  e.preventDefault();
                  setIsServiceDropdownOpen(true);
                  setHoveredServiceIndex(0);
                }
              }}
              className={`w-full bg-gray-900 border rounded-lg sm:rounded-xl py-3 sm:py-4 pr-10 sm:pr-12 text-left text-sm sm:text-base focus:outline-none transition-all duration-200 border-gray-700 text-white cursor-pointer hover:border-gray-600 focus:ring-2 focus:ring-green-500/20 ${
                formData.service ? 'pl-8 sm:pl-10' : 'pl-4 sm:pl-6'
              }`}
              style={{
                backgroundImage: formData.service ? 'none' : `linear-gradient(to right, ${accentColor}08, rgba(218, 101, 30, 0.05))`
              }}
              onMouseEnter={(e) => {
                if (document.activeElement !== e.currentTarget) e.currentTarget.style.borderColor = '#4b5563';
              }}
              onMouseLeave={(e) => {
                if (document.activeElement !== e.currentTarget)
                  e.currentTarget.style.borderColor = formData.service ? accentColor : '#374151';
              }}
            >
              <span className={formData.service ? 'text-white' : 'text-gray-400'}>
                {formData.service || 'Select a Service (Optional)'}
              </span>
            </button>
            <ChevronDown
              size={20}
              className={`absolute right-3 sm:right-4 top-1/2 transform -translate-y-1/2 pointer-events-none transition-all duration-200 ${
                isServiceDropdownOpen ? 'rotate-180' : ''
              }`}
              style={{ color: formData.service ? accentColor : '#9ca3af' }}
            />
            {formData.service && (
              <div className="absolute left-4 top-1/2 transform -translate-y-1/2 pointer-events-none">
                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" style={{ backgroundColor: accentColor }} />
              </div>
            )}
            {isServiceDropdownOpen && serviceCategories.length > 0 && (
              <div
                className="absolute z-50 w-full mt-2 bg-gray-900 border border-gray-700 rounded-lg sm:rounded-xl shadow-2xl max-h-60 overflow-y-auto"
                onKeyDown={(e) => e.key === 'Escape' && (setIsServiceDropdownOpen(false), setHoveredServiceIndex(null))}
                tabIndex={-1}
              >
                <div className="py-2">
                  {serviceCategories.map((category, categoryIdx) => (
                    <div key={category.name}>
                      <div className="px-3 sm:px-4 py-1.5 sm:py-2 text-[10px] sm:text-xs font-semibold text-gray-400 uppercase tracking-wider bg-gray-800/50 sticky top-0">
                        {category.name}
                      </div>
                      {category.services.map((service, serviceIdx) => {
                        const index = categoryIdx * 100 + serviceIdx;
                        const serviceValue = `${category.name} - ${service.title}`;
                        const isSelected = formData.service === serviceValue;
                        return (
                          <button
                            key={serviceValue}
                            type="button"
                            onClick={() => {
                              setFormData(prev => ({ ...prev, service: serviceValue }));
                              setIsServiceDropdownOpen(false);
                              setHoveredServiceIndex(null);
                            }}
                            onMouseEnter={() => setHoveredServiceIndex(index)}
                            className={`w-full text-left px-3 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm md:text-base transition-colors ${
                              isSelected
                                ? 'bg-green-500/20 text-green-400'
                                : hoveredServiceIndex === index
                                  ? 'bg-gray-800 text-white'
                                  : 'text-gray-300 hover:bg-gray-800/50'
                            }`}
                          >
                            <div className="flex items-center gap-2">
                              {isSelected && <CheckCircle size={14} className="sm:w-4 sm:h-4 text-green-500 flex-shrink-0" />}
                              <span className="truncate">{service.title}</span>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  ))}
                  <div className="border-t border-gray-700 mt-2">
                    <div className="px-3 sm:px-4 py-1.5 sm:py-2 text-[10px] sm:text-xs font-semibold text-gray-400 uppercase tracking-wider bg-gray-800/50">
                      Other
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        setFormData(prev => ({ ...prev, service: 'General Inquiry' }));
                        setIsServiceDropdownOpen(false);
                        setHoveredServiceIndex(null);
                      }}
                      onMouseEnter={() => setHoveredServiceIndex(999)}
                      className={`w-full text-left px-3 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm md:text-base transition-colors ${
                        formData.service === 'General Inquiry'
                          ? 'bg-green-500/20 text-green-400'
                          : hoveredServiceIndex === 999
                            ? 'bg-gray-800 text-white'
                            : 'text-gray-300 hover:bg-gray-800/50'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        {formData.service === 'General Inquiry' && (
                          <CheckCircle size={14} className="sm:w-4 sm:h-4 text-green-500 flex-shrink-0" />
                        )}
                        <span className="truncate">General Inquiry</span>
                      </div>
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        <div>
          <textarea
            name="message"
            value={formData.message}
            onChange={handleInputChange}
            rows={4}
            placeholder="Tell us about your project"
            aria-label="Your message"
            className={`w-full bg-gray-900 border rounded-lg sm:rounded-xl px-4 py-3 sm:px-6 sm:py-4 text-sm sm:text-base text-white placeholder-gray-500 focus:outline-none transition-colors resize-none ${
              formErrors.message ? 'border-red-500 focus:border-red-500' : 'border-gray-700'
            }`}
            onFocus={(e) => !formErrors.message && (e.currentTarget.style.borderColor = accentColor)}
            onBlur={(e) => !formErrors.message && (e.currentTarget.style.borderColor = '#374151')}
          />
          {formErrors.message && (
            <p className="text-red-400 text-xs sm:text-sm mt-2 flex items-center">
              <XCircle size={12} className="sm:w-3.5 sm:h-3.5 mr-1" />
              {formErrors.message}
            </p>
          )}
        </div>
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-gradient-theme py-3 sm:py-4 rounded-lg sm:rounded-xl font-semibold text-sm sm:text-base text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
        >
          {isSubmitting ? (
            <>
              <div className="w-4 h-4 sm:w-5 sm:h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
              <span className="text-sm sm:text-base">Sending...</span>
            </>
          ) : (
            <>
              <span>Send Message</span>
              <ArrowRight className="ml-2 w-4 h-4 sm:w-5 sm:h-5" size={20} />
            </>
          )}
        </button>
        {submitError && (
          <p className="text-red-400 text-xs sm:text-sm flex items-center" role="alert">
            <XCircle size={12} className="sm:w-3.5 sm:h-3.5 mr-1 flex-shrink-0" />
            {submitError}
          </p>
        )}
      </form>

      {showSuccess && (
        successInline ? (
          <div className="mt-4 p-4 rounded-xl bg-green-500/20 border border-green-500/50 flex items-center gap-3">
            <CheckCircle size={24} className="text-green-500 flex-shrink-0" />
            <p className="text-green-400 text-sm sm:text-base">Thank you! We've received your message and will get back to you soon.</p>
          </div>
        ) : (
          <div
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
            onClick={() => setShowSuccess(false)}
          >
            <div
              className="bg-gray-900 rounded-2xl max-w-md w-full p-6 sm:p-8 border-2 shadow-2xl border-green-500/50"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex flex-col items-center text-center">
                <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-gradient-theme flex items-center justify-center mb-4 sm:mb-6">
                  <CheckCircle size={32} className="sm:w-10 sm:h-10 text-white" />
                </div>
                <h3 className="text-2xl sm:text-3xl font-bold text-white mb-2 sm:mb-3">Message Sent!</h3>
                <p className="text-gray-400 text-sm sm:text-base mb-4 sm:mb-6">
                  Thank you for reaching out! We've received your message and will get back to you soon.
                </p>
                <button
                  type="button"
                  onClick={() => setShowSuccess(false)}
                  className="px-6 py-3 rounded-xl font-semibold text-white transition-all hover:scale-105 bg-gradient-theme"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )
      )}
    </>
  );
}

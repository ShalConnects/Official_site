import { X } from 'lucide-react';
import ContactForm from './ContactForm';

interface ContactModalProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  prefillService?: string;
  accentColor?: string;
}

export default function ContactModal({ open, onClose, title = 'Get in touch', prefillService, accentColor }: ContactModalProps) {
  if (!open) return null;
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
      onClick={onClose}
      aria-modal="true"
      role="dialog"
      aria-labelledby="contact-modal-title"
    >
      <div className="relative bg-gray-900 rounded-2xl border border-gray-700 max-w-lg w-full max-h-[90vh] overflow-y-auto shadow-2xl" onClick={(e) => e.stopPropagation()}>
        <div className="sticky top-0 flex items-center justify-between p-4 border-b border-gray-700 bg-gray-900 rounded-t-2xl z-10">
          <h2 id="contact-modal-title" className="text-lg font-semibold text-white">{title}</h2>
          <button type="button" onClick={onClose} className="p-2 rounded-lg bg-gray-800 hover:bg-gray-700 border border-gray-700 text-gray-300 transition-colors" aria-label="Close modal">
            <X size={20} />
          </button>
        </div>
        <div className="p-4 sm:p-6">
          <ContactForm prefillService={prefillService} onSuccess={onClose} accentColor={accentColor} successInline={false} />
        </div>
      </div>
    </div>
  );
}

import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

const buttonClass =
  'inline-flex items-center gap-2 px-5 py-2.5 sm:px-6 sm:py-3 rounded-xl bg-gray-800 hover:bg-gray-700 border border-gray-700 hover:border-green-500/50 text-white font-medium transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 focus:ring-offset-gray-900 active:scale-[0.98]';

type ViewAllLinkProps = {
  /** Internal route (React Router). Use either `to` or `href`, not both. */
  to?: string;
  /** External URL. Use either `to` or `href`, not both. */
  href?: string;
  children: React.ReactNode;
};

export function ViewAllLink({ to, href, children }: ViewAllLinkProps) {
  if (href) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className={buttonClass}
      >
        <span>{children}</span>
        <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
      </a>
    );
  }
  if (to) {
    return (
      <Link to={to} className={buttonClass}>
        <span>{children}</span>
        <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
      </Link>
    );
  }
  return null;
}

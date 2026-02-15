import { Home } from 'lucide-react';
import { MAIN_SITE_URL } from '../utils/storeUtils';

export default function StoreTopBar() {
  return (
    <div className="flex justify-center border-b border-gray-700/50 bg-gray-900/95 py-3">
      <a
        href={MAIN_SITE_URL}
        className="inline-flex items-center gap-2 rounded-lg border border-gray-600 bg-gray-800 px-4 py-2 text-base font-semibold text-green-400 transition-colors hover:bg-gray-700 hover:text-green-300"
      >
        <Home size={16} />
        Main site
      </a>
    </div>
  );
}

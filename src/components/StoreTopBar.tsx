import { MAIN_SITE_URL } from '../utils/storeUtils';

export default function StoreTopBar() {
  return (
    <div className="flex justify-center border-b border-gray-700/50 bg-gray-900/95 py-3">
      <a
        href={MAIN_SITE_URL}
        target="_blank"
        rel="noopener noreferrer"
        className="text-sm font-medium text-green-400 hover:text-green-300 transition-colors"
      >
        Main site
      </a>
    </div>
  );
}

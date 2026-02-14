/** Shared form field styles (DRY). */
export const inputClass = (hasError: boolean) =>
  `w-full bg-gray-900 border rounded-lg sm:rounded-xl px-4 py-3 sm:px-6 sm:py-4 text-sm sm:text-base text-white placeholder-gray-500 focus:outline-none transition-colors ${hasError ? 'border-red-500 focus:border-red-500' : 'border-gray-700'}`;
export const errorClass = 'text-red-400 text-xs sm:text-sm mt-2 flex items-center';
export const submitBtnClass = 'w-full bg-gradient-theme py-3 sm:py-4 rounded-lg sm:rounded-xl font-semibold text-sm sm:text-base text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center';

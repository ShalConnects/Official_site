/**
 * Theme-aware class name mappings
 * DRY utility to convert hardcoded dark mode classes to theme-aware classes
 * 
 * Usage: 
 *   Old: className="bg-gray-900 text-white"
 *   New: className="bg-theme-bg-primary text-theme-text-primary"
 */

export const themeClassMap: Record<string, string> = {
  // Background colors
  'bg-gray-900': 'bg-theme-bg-primary',
  'bg-gray-800': 'bg-theme-bg-secondary',
  'bg-gray-700': 'bg-theme-bg-tertiary',
  'bg-gray-900/95': 'bg-theme-bg-primary/95',
  'bg-gray-900/98': 'bg-theme-bg-primary/98',
  'bg-gray-900/90': 'bg-theme-bg-primary/90',
  'bg-gray-900/80': 'bg-theme-bg-primary/80',
  'bg-gray-800/50': 'bg-theme-bg-secondary/50',
  'bg-gray-800/70': 'bg-theme-bg-secondary/70',
  
  // Text colors
  'text-white': 'text-theme-text-primary',
  'text-gray-400': 'text-theme-text-tertiary',
  'text-gray-300': 'text-theme-text-secondary',
  'text-gray-500': 'text-theme-text-tertiary',
  
  // Border colors
  'border-gray-800': 'border-theme-border-primary',
  'border-gray-700': 'border-theme-border-primary',
  'border-gray-800/50': 'border-theme-border-primary/50',
  'border-gray-700/50': 'border-theme-border-primary/50',
  'border-gray-600/50': 'border-theme-border-secondary/50',
  
  // Hover backgrounds
  'hover:bg-gray-800/50': 'hover:bg-theme-hover/50',
  'hover:bg-gray-800': 'hover:bg-theme-hover',
  'hover:bg-gray-700/50': 'hover:bg-theme-hover/50',
  
  // Hover text
  'hover:text-white': 'hover:text-theme-text-primary',
};

/**
 * Batch convert multiple class names
 */
export function convertToThemeClasses(classNames: string): string {
  let result = classNames;
  Object.entries(themeClassMap).forEach(([oldClass, newClass]) => {
    result = result.replace(new RegExp(oldClass, 'g'), newClass);
  });
  return result;
}

/**
 * Helper function to merge theme classes with custom classes
 */
export function themeClass(...classes: string[]): string {
  return classes.filter(Boolean).join(' ');
}

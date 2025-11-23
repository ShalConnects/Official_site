import { useEffect } from 'react';

export function usePageTitle(title: string) {
  useEffect(() => {
    const baseTitle = 'ShalConnects';
    const fullTitle = title ? `${title} | ${baseTitle}` : baseTitle;
    
    document.title = fullTitle;
    
    // Cleanup: restore default title when component unmounts
    return () => {
      document.title = baseTitle;
    };
  }, [title]);
}


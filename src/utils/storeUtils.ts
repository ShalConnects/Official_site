/**
 * Check if we're on the store subdomain or accessing store routes
 * Works on both production (store.shalconnects.com) and localhost (/store routes)
 */
export function isStoreContext(): boolean {
  if (typeof window === 'undefined') return false;
  
  const hostname = window.location.hostname;
  const pathname = window.location.pathname;
  
  // Production: store.shalconnects.com
  if (hostname === 'store.shalconnects.com') {
    return true;
  }
  
  // Localhost: check if path starts with /store (for testing store pages)
  if (hostname === 'localhost' || hostname === '127.0.0.1' || hostname.startsWith('192.168.')) {
    return pathname.startsWith('/store');
  }
  
  return false;
}


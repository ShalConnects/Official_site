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

/** Store home path: / on subdomain, /store on main site */
export function getStoreHomePath(): string {
  return isStoreContext() ? '/' : '/store';
}

export const MAIN_SITE_URL = 'https://shalconnects.com';
export const STORE_URL = 'https://store.shalconnects.com';


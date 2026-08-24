import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { sanitizeHtml } from '../sanitizeHtml';
import { isStoreContext, getStoreHomePath } from '../storeUtils';

describe('sanitizeHtml', () => {
  it('strips script tags', () => {
    const dirty = '<p>Hello</p><script>alert(1)</script>';
    const clean = sanitizeHtml(dirty);
    expect(clean).toContain('Hello');
    expect(clean.toLowerCase()).not.toContain('<script');
  });

  it('returns empty string for non-strings', () => {
    expect(sanitizeHtml(null as unknown as string)).toBe('');
  });

  it('allows safe formatting tags', () => {
    const html = '<p><strong>Bold</strong> and <em>italic</em></p>';
    expect(sanitizeHtml(html)).toContain('<strong>');
    expect(sanitizeHtml(html)).toContain('<em>');
  });
});

describe('storeUtils', () => {
  const originalLocation = window.location;

  afterEach(() => {
    Object.defineProperty(window, 'location', {
      configurable: true,
      value: originalLocation,
    });
  });

  it('detects store subdomain', () => {
    Object.defineProperty(window, 'location', {
      configurable: true,
      value: { hostname: 'store.shalconnects.com', pathname: '/' },
    });
    expect(isStoreContext()).toBe(true);
    expect(getStoreHomePath()).toBe('/');
  });

  it('detects /store paths on localhost', () => {
    Object.defineProperty(window, 'location', {
      configurable: true,
      value: { hostname: 'localhost', pathname: '/store/foo' },
    });
    expect(isStoreContext()).toBe(true);
    expect(getStoreHomePath()).toBe('/');
  });

  it('returns false for main site', () => {
    Object.defineProperty(window, 'location', {
      configurable: true,
      value: { hostname: 'shalconnects.com', pathname: '/about' },
    });
    expect(isStoreContext()).toBe(false);
    expect(getStoreHomePath()).toBe('/store');
  });
});

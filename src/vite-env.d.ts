/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_URL?: string;
  readonly VITE_FORMSPREE_TESTIMONIALS_ID?: string;
  readonly VITE_FORMSPREE_CONTACT_ID?: string;
  readonly VITE_FORMSPREE_NEWSLETTER_ID?: string;
  readonly VITE_GA_MEASUREMENT_ID?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

declare global {
  interface PaddleCheckoutOptions {
    items?: Array<{ priceId: string; quantity?: number }>;
    product?: string;
    settings?: {
      successUrl?: string;
      displayMode?: 'inline' | 'overlay';
    };
    onComplete?: (data: { transactionId?: string }) => void;
  }

  interface PaddleCheckout {
    open: (options: PaddleCheckoutOptions) => void;
  }

  interface PaddleGlobal {
    Checkout: PaddleCheckout;
    Environment?: { set: (env: string) => void };
    Initialize?: (options: { token?: string; seller?: number }) => void;
    Setup?: (options: { vendor: number }) => void;
  }

  interface Window {
    Paddle?: PaddleGlobal;
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

export {};

import { useEffect } from 'react';

interface MetaTags {
  title?: string;
  description?: string;
  keywords?: string;
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
  twitterTitle?: string;
  twitterDescription?: string;
  twitterImage?: string;
}

export function useMetaTags(meta: MetaTags) {
  useEffect(() => {
    const updateMetaTag = (name: string, content: string, attribute: string = 'name') => {
      let element = document.querySelector(`meta[${attribute}="${name}"]`);
      if (!element) {
        element = document.createElement('meta');
        element.setAttribute(attribute, name);
        document.head.appendChild(element);
      }
      element.setAttribute('content', content);
    };

    if (meta.title) {
      document.title = meta.title;
    }

    if (meta.description) {
      updateMetaTag('description', meta.description);
    }

    if (meta.keywords) {
      updateMetaTag('keywords', meta.keywords);
    }

    if (meta.ogTitle) {
      updateMetaTag('og:title', meta.ogTitle, 'property');
    }

    if (meta.ogDescription) {
      updateMetaTag('og:description', meta.ogDescription, 'property');
    }

    if (meta.ogImage) {
      updateMetaTag('og:image', meta.ogImage, 'property');
    }

    if (meta.twitterTitle) {
      updateMetaTag('twitter:title', meta.twitterTitle);
    }

    if (meta.twitterDescription) {
      updateMetaTag('twitter:description', meta.twitterDescription);
    }

    if (meta.twitterImage) {
      updateMetaTag('twitter:image', meta.twitterImage);
    }
  }, [meta]);
}


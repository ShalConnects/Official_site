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

function updateMetaTag(name: string, content: string, attribute: string = 'name') {
  let element = document.querySelector(`meta[${attribute}="${name}"]`);
  if (!element) {
    element = document.createElement('meta');
    element.setAttribute(attribute, name);
    document.head.appendChild(element);
  }
  element.setAttribute('content', content);
}

export function useMetaTags(meta: MetaTags) {
  const {
    title,
    description,
    keywords,
    ogTitle,
    ogDescription,
    ogImage,
    twitterTitle,
    twitterDescription,
    twitterImage,
  } = meta;

  useEffect(() => {
    if (title) {
      document.title = title;
    }
    if (description) updateMetaTag('description', description);
    if (keywords) updateMetaTag('keywords', keywords);
    if (ogTitle) updateMetaTag('og:title', ogTitle, 'property');
    if (ogDescription) updateMetaTag('og:description', ogDescription, 'property');
    if (ogImage) updateMetaTag('og:image', ogImage, 'property');
    if (twitterTitle) updateMetaTag('twitter:title', twitterTitle);
    if (twitterDescription) updateMetaTag('twitter:description', twitterDescription);
    if (twitterImage) updateMetaTag('twitter:image', twitterImage);
  }, [
    title,
    description,
    keywords,
    ogTitle,
    ogDescription,
    ogImage,
    twitterTitle,
    twitterDescription,
    twitterImage,
  ]);
}

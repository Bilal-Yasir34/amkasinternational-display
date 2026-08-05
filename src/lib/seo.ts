import { useEffect } from 'react';

type SeoOptions = {
  title?: string;
  description?: string;
  image?: string;
  canonical?: string;
  type?: string;
  jsonLd?: object;
};

function setMeta(attr: 'name' | 'property', key: string, value?: string) {
  if (!value) return;
  let el = document.head.querySelector(`meta[${attr}="${key}"]`) as HTMLMetaElement | null;
  if (!el) {
    el = document.createElement('meta');
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.setAttribute('content', value);
}

function setLink(rel: string, href?: string) {
  if (!href) return;
  let el = document.head.querySelector(`link[rel="${rel}"]`) as HTMLLinkElement | null;
  if (!el) {
    el = document.createElement('link');
    el.setAttribute('rel', rel);
    document.head.appendChild(el);
  }
  el.setAttribute('href', href);
}

export function useSeo(opts: SeoOptions) {
  useEffect(() => {
    if (opts.title) document.title = opts.title;
    setMeta('name', 'description', opts.description);
    setMeta('property', 'og:title', opts.title);
    setMeta('property', 'og:description', opts.description);
    setMeta('property', 'og:type', opts.type ?? 'website');
    setMeta('property', 'og:image', opts.image);
    setMeta('name', 'twitter:card', 'summary_large_image');
    setMeta('name', 'twitter:title', opts.title);
    setMeta('name', 'twitter:description', opts.description);
    setMeta('name', 'twitter:image', opts.image);
    setLink('canonical', opts.canonical);

    let script: HTMLScriptElement | null = null;
    if (opts.jsonLd) {
      script = document.createElement('script');
      script.type = 'application/ld+json';
      script.text = JSON.stringify(opts.jsonLd);
      script.id = 'seo-jsonld';
      document.head.appendChild(script);
    }
    return () => {
      if (script) document.head.removeChild(script);
    };
  }, [opts.title, opts.description, opts.image, opts.canonical, opts.type, JSON.stringify(opts.jsonLd)]);
}

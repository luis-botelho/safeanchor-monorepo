import { useEffect } from "react";
import { useLocation } from "react-router-dom";

import {
  SITE_IMAGE,
  SITE_NAME,
  canonicalFor,
  jsonLdForPath,
  metaForPath,
} from "./pageMeta";

function upsertMeta(attribute, key, content) {
  let tag = document.head.querySelector(`meta[${attribute}="${key}"]`);
  if (!tag) {
    tag = document.createElement("meta");
    tag.setAttribute(attribute, key);
    document.head.appendChild(tag);
  }
  tag.setAttribute("content", content);
}

function applyMeta(pathname) {
  const meta = metaForPath(pathname);
  const canonical = canonicalFor(pathname);

  document.documentElement.lang = "pt-BR";
  document.title = meta.title;

  upsertMeta("name", "description", meta.description);
  upsertMeta("name", "robots", meta.robots);
  upsertMeta("property", "og:type", "website");
  upsertMeta("property", "og:site_name", SITE_NAME);
  upsertMeta("property", "og:locale", "pt_BR");
  upsertMeta("property", "og:title", meta.title);
  upsertMeta("property", "og:description", meta.description);
  upsertMeta("property", "og:url", canonical);
  upsertMeta("property", "og:image", SITE_IMAGE);
  upsertMeta("name", "twitter:card", "summary_large_image");
  upsertMeta("name", "twitter:title", meta.title);
  upsertMeta("name", "twitter:description", meta.description);
  upsertMeta("name", "twitter:image", SITE_IMAGE);

  let link = document.head.querySelector('link[rel="canonical"]');
  if (!link) {
    link = document.createElement("link");
    link.setAttribute("rel", "canonical");
    document.head.appendChild(link);
  }
  link.setAttribute("href", canonical);

  document.getElementById("safeanchor-jsonld")?.remove();
  const jsonLd = jsonLdForPath(pathname);
  if (jsonLd) {
    const script = document.createElement("script");
    script.id = "safeanchor-jsonld";
    script.type = "application/ld+json";
    script.textContent = JSON.stringify(jsonLd);
    document.head.appendChild(script);
  }
}

export default function SeoRoute() {
  const { pathname } = useLocation();

  useEffect(() => {
    applyMeta(pathname);
  }, [pathname]);

  return null;
}

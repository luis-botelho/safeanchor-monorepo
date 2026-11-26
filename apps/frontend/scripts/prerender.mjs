// Prerender estático das rotas públicas + robots.txt + sitemap.xml.
// Uso: node apps/frontend/scripts/prerender.mjs (após `vite build`).
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";

import {
  SITE_IMAGE,
  SITE_NAME,
  SITE_URL,
  PAGES,
  canonicalFor,
} from "../src/seo/pageMeta.js";

const distDir = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  "..",
  "dist",
);
const base = process.env.VITE_BASE_URL || "/";
const template = readFileSync(path.join(distDir, "index.html"), "utf8");
const today = new Date().toISOString().slice(0, 10);

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function stripTemplateHead(html) {
  return html
    .replace(/<title>[\s\S]*?<\/title>/i, "")
    .replace(/<meta\s+name="description"[^>]*>/gi, "")
    .replace(/<meta\s+name="robots"[^>]*>/gi, "")
    .replace(/<link\s+rel="canonical"[^>]*>/gi, "")
    .replace(/<meta\s+property="og:[^"]+"[^>]*>/gi, "")
    .replace(/<meta\s+name="twitter:[^"]+"[^>]*>/gi, "")
    .replace(/<script\s+id="safeanchor-jsonld"[\s\S]*?<\/script>/gi, "");
}

function headFor(meta, { canonical = true, noindex = false } = {}) {
  const tags = [
    `<title>${escapeHtml(meta.title)}</title>`,
    `<meta name="description" content="${escapeHtml(meta.description)}" />`,
    `<meta name="robots" content="${noindex ? "noindex,nofollow" : meta.robots}" />`,
    canonical ? `<link rel="canonical" href="${canonicalFor(meta.path)}" />` : "",
    `<meta property="og:type" content="website" />`,
    `<meta property="og:site_name" content="${SITE_NAME}" />`,
    `<meta property="og:locale" content="pt_BR" />`,
    `<meta property="og:title" content="${escapeHtml(meta.title)}" />`,
    `<meta property="og:description" content="${escapeHtml(meta.description)}" />`,
    `<meta property="og:url" content="${canonicalFor(meta.path)}" />`,
    `<meta property="og:image" content="${SITE_IMAGE}" />`,
    `<meta name="twitter:card" content="summary_large_image" />`,
    `<meta name="twitter:title" content="${escapeHtml(meta.title)}" />`,
    `<meta name="twitter:description" content="${escapeHtml(meta.description)}" />`,
    `<meta name="twitter:image" content="${SITE_IMAGE}" />`,
  ];

  if (meta.jsonLd && !noindex) {
    tags.push(
      `<script id="safeanchor-jsonld" type="application/ld+json">${JSON.stringify(meta.jsonLd).replaceAll("<", "\\u003c")}</script>`,
    );
  }

  return tags.filter(Boolean).join("\n    ");
}

const staticStyle = `
    <style>
      .seo-static{max-width:720px;margin:0 auto;padding:48px 24px;font:16px/1.6 system-ui,sans-serif;color:#344054}
      .seo-static h1{color:#102a43;font-size:32px;line-height:1.2}
      .seo-static a{color:#167d83}
      .seo-static ul{padding-left:20px}
    </style>`;

function bodyFor(meta) {
  const paragraphs = meta.paragraphs
    .map((text) => `<p>${escapeHtml(text)}</p>`)
    .join("\n      ");
  const links = meta.links
    .map(({ href, label }) => {
      const url = `${base}${href.replace(/^\//, "")}`;
      return `<li><a href="${escapeHtml(url)}">${escapeHtml(label)}</a></li>`;
    })
    .join("\n      ");
  return `<main class="seo-static">
      <h1>${escapeHtml(meta.heading)}</h1>
      ${paragraphs}
      <ul>
      ${links}
      </ul>
    </main>`;
}

function pageHtml(meta, options) {
  let html = stripTemplateHead(template).replace(
    /<\/head>/i,
    `    ${headFor(meta, options)}${staticStyle}\n  </head>`,
  );
  html = html.replace(
    /<div id="root"><\/div>/i,
    `<div id="root">${bodyFor(meta)}</div>`,
  );
  return html;
}

for (const [route, meta] of Object.entries(PAGES)) {
  const target = route === "/" ? distDir : path.join(distDir, route.replace(/^\//, ""));
  mkdirSync(target, { recursive: true });
  writeFileSync(path.join(target, "index.html"), pageHtml({ ...meta, path: route }));
}

const notFoundMeta = {
  title: `Página não encontrada — ${SITE_NAME}`,
  description: "A página solicitada não existe neste site.",
  heading: "Página não encontrada",
  paragraphs: ["O endereço pode ter mudado. Volte ao início para conhecer a demonstração."],
  links: [{ href: "/", label: "Ir para o início" }],
  path: "/404",
};
writeFileSync(path.join(distDir, "404.html"), pageHtml(notFoundMeta, { canonical: false, noindex: true }));

const robots = `User-agent: *
Allow: /
Disallow: /login/
Disallow: /register/
Disallow: /dashboard/
Disallow: /fleet/
Disallow: /maintenance/
Disallow: /documents/
Disallow: /inspections/
Disallow: /marinas/
Disallow: /jobs/

Sitemap: ${SITE_URL}sitemap.xml
`;
writeFileSync(path.join(distDir, "robots.txt"), robots);

const indexable = ["/", "/pesquisa", "/privacidade"].map((route) => {
  const url = route === "/" ? SITE_URL : `${SITE_URL}${route.replace(/^\//, "")}/`;
  return `  <url>\n    <loc>${url}</loc>\n    <lastmod>${today}</lastmod>\n  </url>`;
});
writeFileSync(
  path.join(distDir, "sitemap.xml"),
  `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${indexable.join("\n")}\n</urlset>\n`,
);

console.log(`Prerender concluído em ${distDir}`);

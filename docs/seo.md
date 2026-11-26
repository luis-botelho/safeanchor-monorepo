# SEO e identidade visual do SafeAnchor

Data da última revisão: 26 de novembro de 2026.

Este documento explica como o SafeAnchor entrega metadados, ícones e conteúdo
indexável sem trocar a stack atual por Next.js. A SPA continua em React + Vite;
o build gera HTML estático para as poucas rotas públicas que devem aparecer em
buscadores.

## Rotas indexáveis

| Rota | Política | Motivo |
|---|---|---|
| `/` | `index,follow` | Apresentação pública do produto. |
| `/pesquisa/` | `index,follow` | Pesquisa de produto aberta ao público. |
| `/privacidade/` | `index,follow` | Transparência e LGPD. |
| `/login/`, `/register/` e rotas autenticadas | `noindex,nofollow` | Evita indexar telas de demonstração e dados privados. |

O arquivo `apps/frontend/src/seo/pageMeta.js` é a fonte única de título,
descrição, canonical, Open Graph, Twitter Card, JSON-LD e do texto estático
prerenderizado. `SeoRoute.jsx` aplica os metadados quando a SPA troca de rota.

## Build

```bash
cd apps/frontend
npm ci
$env:VITE_BASE_URL='/safeanchor-monorepo/' # Windows PowerShell
npm run build
```

O script `build` executa `vite build` e depois `node scripts/prerender.mjs`.
O prerender:

- grava `dist/index.html`, `dist/pesquisa/index.html` e
  `dist/privacidade/index.html` com metadata e conteúdo inicial;
- grava `dist/404.html` com `noindex`;
- gera `dist/robots.txt` com `Sitemap:` absoluto;
- gera `dist/sitemap.xml` com `lastmod` do dia do build;
- mantém os scripts da SPA para que a hidratação assuma a página depois.

O workflow `.github/workflows/deploy-frontend.yml` não sobrescreve mais
`404.html`: o arquivo gerado no build é o entregue pelo GitHub Pages.

## Identidade visual

`scripts/generate-brand-assets.mjs` gera, sem dependências externas:

- `favicon.svg` e `favicon.ico`;
- `favicon-16x16.png` e `favicon-32x32.png`;
- `apple-touch-icon.png`;
- `android-chrome-192x192.png` e `android-chrome-512x512.png`.

`site.webmanifest` usa esses ícones e a cor `#102a43`. `og-image.png`
(1200 × 630) é gerada por `scripts/generate-og-image.ps1` com System.Drawing.
Para regenar os arquivos:

```bash
npm run generate:assets
powershell -ExecutionPolicy Bypass -File scripts/generate-og-image.ps1
```

As referências de `index.html` usam `%BASE_URL%`, substituído pelo Vite em
desenvolvimento e no deploy. Assim os ícones funcionam tanto na raiz quanto em
`https://luis-botelho.github.io/safeanchor-monorepo/`.

## Por que prerender em vez de SSR completo

- GitHub Pages serve arquivos estáticos; não há runtime Node para SSR.
- Apenas três páginas precisam ser indexadas; o restante é produto protegido.
- O HTML inicial já contém título, descrição, canonical e conteúdo legível para
  crawlers que não executam JavaScript.
- A navegação continua 100% SPA, preservando a arquitetura MVVM e o custo de
  hospedagem.

## Referências adotadas como boas práticas

- Vite, *Static Deployment / Build* — tratamento de `base` e assets no build:
  https://vite.dev/guide/static-deploy
- Google Search Central, *SEO basics* — títulos, descrições e links canônicos:
  https://developers.google.com/search/docs/fundamentals/seo-starter-guide
- Open Graph protocol — `og:title`, `og:description`, `og:image`, `og:url`:
  https://ogp.me/
- schema.org — `Organization`, `WebApplication`, `WebPage` e JSON-LD:
  https://schema.org/
- web.dev, *Progressive Web App / manifest and icons*:
  https://web.dev/learn/pwa/web-app-manifest

## Validação

`node scripts/verify-demo.mjs` verifica, contra produção, os assets de marca,
`robots.txt`, `sitemap.xml`, canonical, robots meta e títulos das rotas
públicas. A verificação completa deve terminar com todos os checks OK após o
deploy de `main`.

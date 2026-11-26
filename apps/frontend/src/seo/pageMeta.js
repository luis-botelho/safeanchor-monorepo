// Fonte única de metadados das rotas públicas.
// Usada pela SPA (document.title/OG/canonical) e pelo prerender estático.
export const SITE_URL = "https://luis-botelho.github.io/safeanchor-monorepo/";
export const SITE_NAME = "SafeAnchor";
export const SITE_IMAGE = `${SITE_URL}og-image.png`;
export const WHATSAPP_URL = "https://wa.me/5524992772357";

const organization = {
  "@type": "Organization",
  "@id": `${SITE_URL}#organization`,
  name: SITE_NAME,
  url: SITE_URL,
  sameAs: ["https://github.com/luis-botelho/safeanchor-monorepo"],
  contactPoint: {
    "@type": "ContactPoint",
    contactType: "customer support",
    url: WHATSAPP_URL,
    availableLanguage: ["pt-BR"],
  },
};

export const PAGES = {
  "/": {
    title: "SafeAnchor — gestão náutica de frota, manutenção e inspeções",
    description:
      "SafeAnchor reúne frota, manutenção, documentos, inspeções e checklists em um só lugar. Veja a demo funcional para proprietários, prestadores e marinas.",
    robots: "index,follow",
    heading: "Gestão náutica clara para quem vive o mar",
    paragraphs: [
      "O SafeAnchor reúne a operação de uma embarcação em um único fluxo: cadastro da frota, manutenções corretivas e preventivas, documentos com validade, inspeções com checklist e certificado.",
      "A demonstração pública usa contas reais com dados fictícios para percorrer a jornada completa de proprietário, prestador de serviço e marina.",
    ],
    links: [
      { href: "/login", label: "Ver a demonstração" },
      { href: "/pesquisa", label: "Responder a pesquisa" },
      { href: "/privacidade", label: "Política de privacidade e LGPD" },
    ],
    jsonLd: {
      "@context": "https://schema.org",
      "@graph": [
        organization,
        {
          "@type": "WebApplication",
          name: SITE_NAME,
          url: SITE_URL,
          applicationCategory: "BusinessApplication",
          operatingSystem: "Web",
          inLanguage: "pt-BR",
          description:
            "Gestão de frota náutica, manutenção, documentos, inspeções e checklists em uma aplicação web.",
          featureList: [
            "Frota e embarcações",
            "Manutenção corretiva e preventiva",
            "Documentos com controle de validade",
            "Inspeções com checklist e certificado",
            "Painéis por proprietário, prestador e marina",
          ],
          publisher: { "@id": `${SITE_URL}#organization` },
        },
      ],
    },
  },
  "/pesquisa": {
    title: "Pesquisa de produto — SafeAnchor",
    description:
      "Conte como você cuida da sua embarcação ou marina. A pesquisa do SafeAnchor leva de 3 a 5 minutos e ajuda a decidir o que construir primeiro.",
    robots: "index,follow",
    heading: "Ajude a decidir o que o SafeAnchor constrói primeiro",
    paragraphs: [
      "Queremos ouvir quem usa barco, marina e serviço náutico todo dia. A pesquisa é curta, pode ser respondida de forma anônima e suas respostas ajudam a priorizar o produto.",
      "Ao final, você pode deixar seu contato de forma opcional. O envio pelo site é feito pelo backend; também há alternativas manuais por e-mail e WhatsApp.",
    ],
    links: [
      { href: "/", label: "Voltar ao início" },
      { href: "/privacidade", label: "Como usamos seus dados" },
    ],
    jsonLd: {
      "@context": "https://schema.org",
      "@graph": [
        organization,
        {
          "@type": "WebPage",
          name: "Pesquisa de produto",
          url: `${SITE_URL}pesquisa/`,
          inLanguage: "pt-BR",
          description:
            "Pesquisa curta sobre gestão náutica, usada para priorizar o desenvolvimento do SafeAnchor.",
          isPartOf: { "@id": `${SITE_URL}#organization` },
        },
      ],
    },
  },
  "/privacidade": {
    title: "Privacidade e LGPD — SafeAnchor",
    description:
      "Política de privacidade do SafeAnchor: dados coletados, bases legais da LGPD, compartilhamento, retenção, segurança e direitos do titular.",
    robots: "index,follow",
    heading: "Privacidade e proteção de dados no SafeAnchor",
    paragraphs: [
      "Esta página explica quais dados são coletados no site e na aplicação, por que eles são usados, com quem são compartilhados e por quanto tempo ficam armazenados.",
      "O tratamento segue a Lei Geral de Proteção de Dados (LGPD). O titular pode exercer seus direitos previstos no art. 18 da lei usando os canais de contato indicados na própria política.",
    ],
    links: [
      { href: "/", label: "Voltar ao início" },
      { href: "/pesquisa", label: "Pesquisa de produto" },
    ],
    jsonLd: {
      "@context": "https://schema.org",
      "@graph": [
        organization,
        {
          "@type": "WebPage",
          name: "Política de privacidade",
          url: `${SITE_URL}privacidade/`,
          inLanguage: "pt-BR",
          description:
            "Política de privacidade e bases legais da LGPD para o site e a aplicação SafeAnchor.",
          isPartOf: { "@id": `${SITE_URL}#organization` },
        },
      ],
    },
  },
  "/login": {
    title: "Entrar na demo — SafeAnchor",
    description: "Acesse a demonstração funcional do SafeAnchor.",
    robots: "noindex,nofollow",
    heading: "Acesso à demonstração",
    paragraphs: ["Use os acessos de demonstração na tela de login para entrar como proprietário, prestador ou marina."],
    links: [{ href: "/", label: "Voltar ao início" }],
  },
  "/register": {
    title: "Criar conta — SafeAnchor",
    description: "Crie uma conta para usar o SafeAnchor.",
    robots: "noindex,nofollow",
    heading: "Criar conta",
    paragraphs: ["Cadastro na aplicação SafeAnchor."],
    links: [{ href: "/", label: "Voltar ao início" }],
  },
};

const fallback = {
  title: "SafeAnchor — gestão náutica",
  description:
    "SafeAnchor: gestão de frota, manutenção, documentos, inspeções e checklists para o mercado náutico.",
  robots: "noindex,follow",
  heading: "SafeAnchor",
  paragraphs: [],
  links: [{ href: "/", label: "Ir para o início" }],
};

export function canonicalFor(pathname) {
  const clean = pathname === "/" ? "" : pathname.replace(/^\/+|\/+$/g, "");
  return `${SITE_URL}${clean ? `${clean}/` : ""}`;
}

export function metaForPath(pathname) {
  const clean = `/${String(pathname || "").replace(/^\/+|\/+$/g, "")}`;
  return PAGES[clean === "/" ? "/" : clean] || fallback;
}

export function jsonLdForPath(pathname) {
  const clean = `/${String(pathname || "").replace(/^\/+|\/+$/g, "")}`;
  return PAGES[clean]?.jsonLd || null;
}

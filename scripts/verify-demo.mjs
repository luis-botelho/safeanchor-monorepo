// Verificação não destrutiva da demo publicada.
// Uso: node scripts/verify-demo.mjs
// Node 22+ (fetch nativo). Nenhuma credencial é impressa.
const pagesUrl = process.env.DEMO_FRONTEND_URL || "https://luis-botelho.github.io/safeanchor-monorepo/";
const apiUrl = process.env.DEMO_API_URL || "https://safeanchor-monorepo.vercel.app";
const origin = new URL(pagesUrl).origin;

const results = [];

function check(name, ok, detail = "") {
  results.push({ name, ok: Boolean(ok), detail });
  console.log(`${ok ? "PASS" : "FAIL"}  ${name}${detail ? ` — ${detail}` : ""}`);
}

async function request(method, path, { token, body, withOrigin = false } = {}) {
  const response = await fetch(`${apiUrl}${path}`, {
    method,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(withOrigin ? { Origin: origin } : {}),
    },
    body: body ? JSON.stringify(body) : undefined,
  });

  const text = await response.text();
  let parsed;
  try {
    parsed = JSON.parse(text);
  } catch {
    parsed = text.slice(0, 120);
  }

  return {
    status: response.status,
    body: parsed,
    cors: response.headers.get("access-control-allow-origin"),
  };
}

function countOf(body) {
  if (Array.isArray(body)) return body.length;
  if (Array.isArray(body?.data)) return body.data.length;
  return 0;
}

function hasEnough(name, body, minimum) {
  const count = countOf(body);
  check(`${name} (>= ${minimum})`, count >= minimum, `${count} itens`);
  return count;
}

const accounts = [
  {
    email: "demo@safeanchor.app",
    password: "demo123",
    persona: "OWNER",
    label: "Proprietário",
    expected: { vessels: 3, maintenances: 5, documents: 5, inspections: 4, preventive: 1, executions: 1 },
  },
  {
    email: "carlos@tecno.boat",
    password: "demo123",
    persona: "SERVICE_PROVIDER",
    label: "Prestador",
    expected: { vessels: 2, maintenances: 2, documents: 2, inspections: 1, preventive: 1, executions: 1 },
  },
  {
    email: "gestao@marinacostaazul.com",
    password: "demo123",
    persona: "MARINA",
    label: "Marina",
    expected: { vessels: 2, maintenances: 2, documents: 2, inspections: 1, preventive: 1, executions: 1 },
  },
];

const legacyAccount = {
  email: "demo@safeanchor.test",
  password: "demo123456",
  persona: "OWNER",
  label: "Proprietário legado",
};

async function verifyFrontend() {
  const response = await fetch(pagesUrl);
  const html = await response.text();
  check("GitHub Pages index", response.status === 200, `HTTP ${response.status}`);
  check("SPA root", html.includes('id="root"'));

  const assets = [...html.matchAll(/(?:src|href)="([^"]+\.(?:js|css))"/g)].map((match) => match[1]);
  check("Assets referenciados", assets.length >= 2, assets.join(", "));

  let bundle = "";
  let css = "";
  for (const asset of assets) {
    const assetResponse = await fetch(new URL(asset, pagesUrl));
    const text = await assetResponse.text();
    check(`Asset ${asset}`, assetResponse.status === 200, `HTTP ${assetResponse.status}`);
    if (asset.endsWith(".js")) bundle += text;
    if (asset.endsWith(".css")) css += text;
  }

  check("API de produção no bundle", bundle.includes(new URL(apiUrl).host));
  check("WhatsApp correto", bundle.includes("5524992772357"));
  check(
    "WhatsApp antigo ausente",
    !/(?<![0-9])24992772357/.test(bundle),
  );
  for (const route of ["/privacidade", "/login", "/dashboard", "/fleet", "/inspections"]) {
    check(`Rota ${route} no bundle`, bundle.includes(route));
  }
  check("LGPD no bundle", bundle.includes("LGPD"));
  check("Consentimento no bundle", bundle.includes("safeanchor.cookieConsent"));
  check("Links manuais no bundle", bundle.includes("wa.me") && bundle.includes("mailto:"));

  for (const email of accounts.map((account) => account.email)) {
    check(`Conta demo no bundle: ${email}`, bundle.includes(email));
  }
  check("IDs de catálogo no bundle", bundle.includes("prov-carlos") && bundle.includes("marin-costa-azul"));

  check("Skeleton no CSS", css.includes("skeleton") && css.includes("skeleton-pulse"));
  check("Spinner de submit no CSS", css.includes("inline-loader__spin") && css.includes("btn__label-busy"));
  check("Alert BEM no CSS", css.includes("alert--error"));
  check("Tokens Maritime no CSS", /#102a43/i.test(css));
  check("Acessos de demonstração no CSS", css.includes("demo-access"));

  const entryScript = assets.find((asset) => asset.endsWith(".js"))?.split("/").pop() || "";
  for (const route of ["privacidade", "pesquisa", "login", "dashboard", "fleet", "marinas", "jobs"]) {
    const deepLink = await fetch(new URL(route, pagesUrl));
    const text = await deepLink.text();
    const spa = text.includes('id="root"') && (!entryScript || text.includes(entryScript));
    check(`Deep link /${route}`, [200, 404].includes(deepLink.status) && spa, `HTTP ${deepLink.status}`);
  }
}

async function verifyBackend() {
  const health = await request("GET", "/health");
  check(
    "Vercel /health",
    health.status === 200 && health.body.status === "ok" && health.body.database === "up",
    JSON.stringify(health.body),
  );

  const templateResponse = await request("GET", "/checklist-templates", {
    token: (await login(accounts[0])).token,
  });
  const templates = templateResponse.body;
  check(
    "Template global de checklist",
    templateResponse.status === 200 &&
      Array.isArray(templates) &&
      templates.some((item) => item.title === "Checklist de segurança — demo"),
    `${countOf(templates)} templates`,
  );

  let ownerVesselId = null;
  for (const account of accounts) {
    const session = await login(account);
    check(`Login ${account.label}`, session.status === 200 && Boolean(session.token), `HTTP ${session.status}`);
    if (!session.token) continue;

    check(`Persona ${account.label}`, session.body.user?.persona === account.persona, session.body.user?.persona || "ausente");
    check(`Role ${account.label}`, session.body.user?.role === "USER", session.body.user?.role || "ausente");

    const me = await request("GET", "/auth/me", { token: session.token });
    check(`/auth/me ${account.label}`, me.status === 200 && me.body.persona === account.persona, `HTTP ${me.status}`);

    for (const [path, key] of [
      ["vessels", "vessels"],
      ["maintenances", "maintenances"],
      ["documents", "documents"],
      ["inspections", "inspections"],
      ["preventive-maintenances", "preventive"],
      ["checklist-executions", "executions"],
    ]) {
      const list = await request("GET", `/${path}`, { token: session.token, withOrigin: true });
      check(`GET /${path} (${account.label})`, list.status === 200, `HTTP ${list.status}`);
      check(
        `CORS /${path} (${account.label})`,
        list.cors === origin,
        list.cors || "ausente",
      );
      hasEnough(`${path} (${account.label})`, list.body, account.expected[key]);
      if (path === "vessels" && account === accounts[0]) {
        ownerVesselId = Array.isArray(list.body) ? list.body[0]?.id || null : null;
      }
      if (path === "inspections") {
        check(
          `Certificado ${account.label}`,
          Array.isArray(list.body) &&
            list.body.some((item) => item.status === "COMPLETED" && item.certificate),
        );
      }
    }

    const dashboard = await request("GET", "/maintenances/dashboard", { token: session.token });
    check(
      `Dashboard de manutenção ${account.label}`,
      dashboard.status === 200 && Number(dashboard.body.total) >= account.expected.maintenances,
      `HTTP ${dashboard.status} · total=${dashboard.body.total}`,
    );
  }

  const legacySession = await login(legacyAccount);
  check(
    `Login ${legacyAccount.label}`,
    legacySession.status === 200 && Boolean(legacySession.token),
    `HTTP ${legacySession.status}`,
  );
  check(
    `Persona ${legacyAccount.label}`,
    legacySession.body.user?.persona === legacyAccount.persona,
    legacySession.body.user?.persona || "ausente",
  );
  if (legacySession.token) {
    const legacyVessels = await request("GET", "/vessels", {
      token: legacySession.token,
      withOrigin: true,
    });
    hasEnough("vessels (Proprietário legado)", legacyVessels.body, 3);
  }

  if (ownerVesselId) {
    const provider = await login(accounts[1]);
    const outsider = await request("GET", `/vessels/${ownerVesselId}`, { token: provider.token });
    check(
      "Isolamento por Party",
      outsider.status === 404,
      `HTTP ${outsider.status}`,
    );
  }
}

async function login(account) {
  const response = await request("POST", "/auth/login", {
    body: { email: account.email, password: account.password },
  });

  return {
    ...response,
    token: response.body?.token || response.body?.accessToken || response.body?.data?.token,
  };
}

try {
  await verifyFrontend();
  await verifyBackend();
} catch (error) {
  check("Execução sem erro fatal", false, error instanceof Error ? error.message : String(error));
}

const failed = results.filter((result) => !result.ok);
console.log(`\n${results.length - failed.length}/${results.length} Checks OK`);
if (failed.length) {
  console.log(`Falhas: ${failed.map((result) => result.name).join("; ")}`);
  process.exitCode = 1;
}

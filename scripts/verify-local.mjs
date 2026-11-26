/* Verificação local, sem rede: garante que os artefatos gerados continuam
   seguros e que o frontend foi construído com os ajustes esperados. */

import { readFileSync, readdirSync, statSync } from "node:fs";
import { dirname, extname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const frontend = join(root, "apps", "frontend");
const backend = join(root, "apps", "backend");
const dist = join(frontend, "dist");

const failures = [];
let checks = 0;

function check(name, condition) {
  checks += 1;
  if (!condition) failures.push(name);
}

function listFiles(directory) {
  return readdirSync(directory).flatMap((entry) => {
    const path = join(directory, entry);
    return statSync(path).isDirectory() ? listFiles(path) : [path];
  });
}

function readIfExists(path) {
  try {
    return readFileSync(path, "utf8");
  } catch {
    return "";
  }
}

const frontendSources = listFiles(join(frontend, "src")).filter((path) =>
  [".js", ".jsx", ".css"].includes(extname(path)),
);
const frontendSource = frontendSources.map((path) => readIfExists(path)).join("\n");
const builtAssets = listFiles(join(dist, "assets")).filter((path) =>
  [".js", ".css"].includes(extname(path)),
);
const builtContent = builtAssets.map((path) => readIfExists(path)).join("\n");

const forbiddenInBundle = [
  "diretoria@safeanchor.app",
  'safeanchor:session',
  'localStorage.getItem("token")',
  'localStorage.setItem("token")',
];

for (const needle of forbiddenInBundle) {
  check(`bundle sem "${needle}"`, !builtContent.includes(needle));
}

check("bundle contém o carrossel", builtContent.includes("auth-carousel"));
check(
  "bundle sem console.* no código-fonte",
  !/\bconsole\.(error|warn|log|debug)\s*\(/.test(frontendSource),
);
check(
  "código-fonte sem credencial pública de diretoria",
  !frontendSource.includes("diretoria@safeanchor.app"),
);
check(
  "backend sem credencial pública de diretoria",
  !listFiles(join(backend, "src"))
    .map((path) => readIfExists(path))
    .join("\n")
    .includes("diretoria@safeanchor.app"),
);

const vercelConfig = JSON.parse(readIfExists(join(frontend, "vercel.json")) || "{}");
const headers = vercelConfig.headers?.[0]?.headers || [];
const headerMap = new Map(headers.map((item) => [item.key, item.value]));

check("vercel.json tem CSP em Report-Only", headerMap.has("Content-Security-Policy-Report-Only"));
check("vercel.json tem X-Content-Type-Options", headerMap.get("X-Content-Type-Options") === "nosniff");
check("vercel.json tem Referrer-Policy", headerMap.get("Referrer-Policy") === "no-referrer");

const pagesHeaders = readIfExists(join(dist, "_headers"));
check("dist/_headers presente", Boolean(pagesHeaders));
check("dist/_headers com nosniff", pagesHeaders.includes("X-Content-Type-Options: nosniff"));

check(
  ".env.example não versiona segredo",
  readIfExists(join(backend, ".env.example")).includes('JWT_SECRET=""'),
);

const backendPackage = JSON.parse(readIfExists(join(backend, "package.json")) || "{}");
const backendLock = JSON.parse(readIfExists(join(backend, "package-lock.json")) || "{}");
const effectVersion = backendLock.packages?.["node_modules/effect"]?.version || "";
const [effectMajor, effectMinor, effectPatch] = effectVersion.split(".").map(Number);

check(
  "backend fixa override do effect",
  backendPackage.overrides?.effect === "3.22.5",
);
check(
  "backend sem effect vulnerável (<=3.22.0)",
  effectMajor > 3 ||
    (effectMajor === 3 && (effectMinor > 22 || (effectMinor === 22 && effectPatch > 0))),
);

if (failures.length > 0) {
  console.error("verify:local falhou:");
  for (const failure of failures) console.error(`  - ${failure}`);
  process.exit(1);
}

console.log(`verify:local OK (${checks} checks)`);

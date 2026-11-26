import { apiFetch, setToken } from "./api";
import { demoAccounts } from "../mock/users";

const roleLabels = {
  USER: "Proprietário",
  MANAGER: "Gestor de frota",
  ADMIN: "Administrador",
  DIRECTOR: "Admin da diretoria",
};

// A API não tem modelos de Marina/Prestador, então estes IDs de catálogo
// vêm dos perfis de demonstração versionados no frontend.
const demoProfilesByEmail = new Map(
  demoAccounts.map(({ email, profile }) => [email.toLowerCase(), profile]),
);

export function toProfile(user) {
  const name = user.name || "Usuário";
  const initials = name
    .split(" ")
    .map((part) => part[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  const demoProfile =
    demoProfilesByEmail.get(String(user.email || "").toLowerCase()) || {};

  return {
    ...demoProfile,
    id: user.id,
    partyId: user.partyId,
    name: name.split(" ")[0] || name,
    fullName: name,
    email: user.email,
    role: demoProfile.role || roleLabels[user.role] || "Proprietário",
    roleKey: demoProfile.roleKey || user.role || "USER",
    persona: user.persona || demoProfile.persona || "OWNER",
    initials: demoProfile.initials || initials,
    providerId: user.providerId || demoProfile.providerId,
    marinaId: user.marinaId || demoProfile.marinaId,
  };
}

export async function loginUser({ email, password }) {
  const data = await apiFetch("/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });

  setToken(data.token);

  return toProfile(data.user);
}

export async function registerUser({ name, email, password, persona }) {
  await apiFetch("/auth/register", {
    method: "POST",
    body: JSON.stringify({ name, email, password, persona }),
  });

  return loginUser({ email, password });
}

export async function getCurrentUser() {
  return toProfile(await apiFetch("/auth/me"));
}

export async function logoutUser() {
  return apiFetch("/auth/logout", {
    method: "POST",
    skipUnauthorizedEvent: true,
  });
}

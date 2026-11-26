import { apiFetch, setToken } from "./api";

const roleLabels = {
  USER: "Proprietário",
  MANAGER: "Gestor de frota",
  ADMIN: "Administrador",
};

export function toProfile(user) {
  const name = user.name || "Usuário";
  const initials = name
    .split(" ")
    .map((part) => part[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return {
    id: user.id,
    partyId: user.partyId,
    name: name.split(" ")[0] || name,
    fullName: name,
    email: user.email,
    role: roleLabels[user.role] || "Proprietário",
    persona: user.persona || "OWNER",
    initials,
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

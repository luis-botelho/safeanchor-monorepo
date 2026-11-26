const devApiUrl = "/api";

const apiUrl =
  import.meta.env.VITE_API_URL || (import.meta.env.DEV ? devApiUrl : "");

// O access token vive apenas na memória da aba. Isso evita que um XSS leia
// o JWT persistido e reduz a janela de roubo de sessão. Na recarga, o usuário
// precisa entrar novamente — aceitável para a demo (o token dura 15 minutos).
let accessToken = null;

export function getToken() {
  return accessToken;
}

export function setToken(token) {
  accessToken = token || null;
}

export function clearToken() {
  accessToken = null;
}

export async function apiFetch(path, options = {}) {
  const { skipUnauthorizedEvent = false, ...fetchOptions } = options;
  const token = getToken();

  const headers = new Headers(fetchOptions.headers || {});

  if (fetchOptions.body && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }

  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  const response = await fetch(`${apiUrl}${path}`, {
    ...fetchOptions,
    headers,
  });

  if (response.status === 401 && !skipUnauthorizedEvent) {
    clearToken();
    window.dispatchEvent(new CustomEvent("auth:unauthorized"));
  }

  if (!response.ok) {
    const data = await response.json().catch(() => ({}));
    const error = new Error(data.message || "Erro inesperado.");
    error.status = response.status;
    throw error;
  }

  if (response.status === 204) {
    return null;
  }

  return response.json().catch(() => null);
}

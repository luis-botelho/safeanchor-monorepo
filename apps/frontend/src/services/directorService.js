import { apiFetch } from "./api";

function queryString(filters = {}) {
  const params = new URLSearchParams();
  Object.entries(filters).forEach(([key, value]) => {
    if (value) params.set(key, value);
  });
  const query = params.toString();
  return query ? `?${query}` : "";
}

export function getDirectorInsights() {
  return apiFetch("/director/insights");
}

export function getDirectorResponses(filters) {
  return apiFetch(`/director/responses${queryString(filters)}`);
}

export function getDirectorUsers() {
  return apiFetch("/director/users");
}

export function getDirectorActions() {
  return apiFetch("/director/actions");
}

export function updateDirectorResponse(id, payload) {
  return apiFetch(`/director/responses/${encodeURIComponent(id)}`, {
    method: "PATCH",
    body: JSON.stringify(payload),
  });
}

export function updateDirectorUser(id, payload) {
  return apiFetch(`/director/users/${encodeURIComponent(id)}`, {
    method: "PATCH",
    body: JSON.stringify(payload),
  });
}

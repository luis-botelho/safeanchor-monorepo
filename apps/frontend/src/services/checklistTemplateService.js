import { apiFetch } from "./api";

export async function getChecklistTemplates() {
  return apiFetch("/checklist-templates");
}

export async function createChecklistTemplate(template) {
  return apiFetch("/checklist-templates", {
    method: "POST",
    body: JSON.stringify(template),
  });
}
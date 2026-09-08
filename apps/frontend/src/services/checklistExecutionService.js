import { apiFetch } from "./api";

export async function getChecklistExecutions() {
  return apiFetch("/checklist-executions");
}

export async function createChecklistExecution(execution) {
  return apiFetch("/checklist-executions", {
    method: "POST",
    body: JSON.stringify(execution),
  });
}
const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:3001";

export async function getChecklistExecutions() {
  const response = await fetch(`${apiUrl}/checklist-executions`);

  if (!response.ok) {
    throw new Error("Não foi possível carregar as execuções de checklist.");
  }

  return response.json();
}

export async function createChecklistExecution(execution) {
  const response = await fetch(`${apiUrl}/checklist-executions`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(execution),
  });

  if (!response.ok) {
    throw new Error("Não foi possível cadastrar a execução de checklist.");
  }

  return response.json();
}
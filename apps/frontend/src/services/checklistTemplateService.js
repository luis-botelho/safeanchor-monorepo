const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:3001";
export async function getChecklistTemplates() {
  const response = await fetch(`${apiUrl}/checklist-templates`);

  if (!response.ok) {
    throw new Error("Não foi possível carregar os templates.");
  }

  return response.json();
}

export async function createChecklistTemplate(template) {
  const response = await fetch(`${apiUrl}/checklist-templates`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(template),
  });

  if (!response.ok) {
    throw new Error("Não foi possível cadastrar o template.");
  }

  return response.json();
}
import { createModule } from "../models/moduleModel";

const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:3001";

const fallbackModules = [
  createModule({
    id: 1,
    name: "Embarcacoes",
    description: "Cadastro inicial das embarcacoes do cliente.",
    status: "Para aprender",
  }),
  createModule({
    id: 2,
    name: "Manutencoes",
    description: "Controle simples de servicos preventivos e corretivos.",
    status: "Proximo passo",
  }),
  createModule({
    id: 3,
    name: "Checklists",
    description: "Lista basica de seguranca antes de sair para navegar.",
    status: "Futuro",
  }),
];

export async function getModules() {
  try {
    const response = await fetch(`${apiUrl}/modules`);

    if (!response.ok) {
      throw new Error("Nao foi possivel carregar os modulos.");
    }

    return response.json();
  } catch {
    return fallbackModules;
  }
}

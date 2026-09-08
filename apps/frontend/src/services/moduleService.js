import { createModule } from "../models/moduleModel";

import { apiFetch } from "./api";

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
    return await apiFetch("/modules");
  } catch (error) {
    if (error.status === 401) {
      throw error;
    }

    return fallbackModules;
  }
}

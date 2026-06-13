const modules = [
  {
    id: 1,
    name: "Embarcacoes",
    description: "Cadastro inicial das embarcacoes do cliente.",
    status: "Para aprender",
  },
  {
    id: 2,
    name: "Manutencoes",
    description: "Controle simples de servicos preventivos e corretivos.",
    status: "Proximo passo",
  },
  {
    id: 3,
    name: "Checklists",
    description: "Lista basica de seguranca antes de sair para navegar.",
    status: "Futuro",
  },
];

export function getModules() {
  return modules;
}

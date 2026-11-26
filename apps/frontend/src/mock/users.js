export const demoProfile = {
  id: "usr-luis",
  name: "Luis",
  fullName: "Luis Botelho",
  email: "demo@safeanchor.app",
  role: "Proprietário / Gestor de Frota",
  company: "Náutica Luis",
  location: "Florianópolis, SC",
  since: "2023",
  initials: "LB",
  persona: "OWNER",
};

export const demoAccounts = [
  {
    email: "demo@safeanchor.app",
    password: "demo123",
    label: "Demo — Proprietário",
    profile: demoProfile,
  },
  {
    email: "carlos@tecno.boat",
    password: "demo123",
    label: "Demo — Prestador",
    profile: {
      id: "usr-carlos",
      name: "Carlos",
      fullName: "Carlos Mendes",
      email: "carlos@tecno.boat",
      role: "Mecânico Naval",
      company: "TecnoMar",
      location: "Florianópolis, SC",
      since: "2018",
      initials: "CM",
      persona: "SERVICE_PROVIDER",
      providerId: "prov-carlos",
    },
  },
  {
    email: "gestao@marinacostaazul.com",
    password: "demo123",
    label: "Demo — Marina",
    profile: {
      id: "usr-marina",
      name: "Renata",
      fullName: "Renata Almeida",
      email: "gestao@marinacostaazul.com",
      role: "Gestora da Marina",
      company: "Marina Costa Azul",
      location: "Florianópolis, SC",
      since: "2015",
      initials: "RA",
      persona: "MARINA",
      marinaId: "marin-costa-azul",
    },
  },
];

export const personaAccounts = [
  {
    persona: "OWNER",
    label: "Proprietário",
    description: "Frota e operação",
    email: "demo@safeanchor.app",
    password: "demo123",
    icon: "fleet",
  },
  {
    persona: "SERVICE_PROVIDER",
    label: "Prestador",
    description: "Serviços e reputação",
    email: "carlos@tecno.boat",
    password: "demo123",
    icon: "wrench",
  },
  {
    persona: "MARINA",
    label: "Marina",
    description: "Estrutura e clientes",
    email: "gestao@marinacostaazul.com",
    password: "demo123",
    icon: "anchor",
  },
];

export const communityAuthors = {
  "luis": { name: "Luis Botelho", initials: "LB", role: "Proprietário" },
  "ana": { name: "Ana Costa", initials: "AC", role: "Proprietária" },
  "marcos": { name: "Marcos Vieira", initials: "MV", role: "Marinheiro" },
  "julia": { name: "Julia Ramos", initials: "JR", role: "Capitã" },
  "pedro": { name: "Pedro Lima", initials: "PL", role: "Mecânico" },
};
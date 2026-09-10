export const activities = [
  {
    id: "act-1",
    type: "checklist",
    title: "Checklist concluído — Costa Norte",
    subtitle: "Prontidão de saída · nota 98",
    time: "hoje, 09:24",
  },
  {
    id: "act-2",
    type: "maintenance",
    title: "Manutenção agendada — Mar Azul",
    subtitle: "Revisão preventiva do motor · 12/09",
    time: "hoje, 08:40",
  },
  {
    id: "act-3",
    type: "service",
    title: "Serviço solicitado — Estrela do Mar",
    subtitle: "Reparo corretivo do motor · TecnoMar",
    time: "ontem, 16:12",
  },
  {
    id: "act-4",
    type: "document",
    title: "Documento atualizado — Horizonte",
    subtitle: "Certificado de navegabilidade renovado",
    time: "ontem, 11:05",
  },
  {
    id: "act-5",
    type: "provider",
    title: "Novo prestador avaliado",
    subtitle: "Kraft Motores Diesel · 5 estrelas",
    time: "06/09, 18:30",
  },
  {
    id: "act-6",
    type: "maintenance",
    title: "Manutenção registrada — Horizonte",
    subtitle: "Revisão do motor auxiliar · 15/08",
    time: "15/08, 10:00",
  },
];

export const activityMeta = {
  checklist: { label: "Checklist", tone: "success", icon: "checklist" },
  maintenance: { label: "Manutenção", tone: "warning", icon: "wrench" },
  service: { label: "Serviço", tone: "danger", icon: "wrench" },
  document: { label: "Documento", tone: "info", icon: "doc" },
  provider: { label: "Prestador", tone: "neutral", icon: "user" },
};
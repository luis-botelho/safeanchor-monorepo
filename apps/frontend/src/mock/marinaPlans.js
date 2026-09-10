export const marinaPlans = [
  {
    id: "plan-essencial",
    name: "Essencial",
    price: "Grátis",
    tone: "neutral",
    includes: [
      "Vitrine básica da marina",
      "Listagem de serviços",
      "Mural de vagas",
      "Formulário de contato",
    ],
  },
  {
    id: "plan-operacional",
    name: "Operacional",
    price: "R$ 490/mês",
    tone: "accent",
    highlighted: true,
    includes: [
      "Tudo do Essencial",
      "Reservas automáticas de vaga",
      "Gestão de equipe",
      "Catálogo de serviços no Marketplace",
      "Recebimento de solicitações de serviços",
      "Ocupação em tempo real",
    ],
  },
  {
    id: "plan-ecossistema",
    name: "Ecossistema Conectado",
    price: "Sob consulta",
    tone: "success",
    includes: [
      "Tudo do Operacional",
      "Parcerias B2B com prestadores",
      "Integração de API (espelha dados com sistemas)",
      "Relatórios avançados de operação",
      "Comunidade com selo de marina verificada",
      "Analistas de ecossistema dedicados",
    ],
  },
];

export const marinaB2b = {
  pilotMarinas: 3,
  marketInsurance: "Coverwatt Náutico",
  partnerships: [
    {
      id: "b2b-1",
      name: "Coverwatt Náutico",
      type: "Provedor de seguros",
      benefit: "Selo de segurado verificado na atracação",
      status: "Ativo",
    },
    {
      id: "b2b-2",
      name: "Mergulho SC",
      type: "Prestador de serviços",
      benefit: "Inspeções subaquáticas agendadas pela marina",
      status: "Ativo",
    },
    {
      id: "b2b-3",
      name: "Albatroz Combustíveis",
      type: "Fornecedor de combustível",
      benefit: "Desconto de 4% para embarcações do píer",
      status: "Em negociação",
    },
  ],
};
export const academy = {
  level: "Marinheiro II",
  nextLevel: "Mestre de Águas Interiores",
  progressToNext: 72,
  competencies: [
    { name: "Navegação", value: 68, level: "Navegante em formação" },
    { name: "Segurança", value: 92, level: "Avançado" },
    { name: "Manutenção básica", value: 55, level: "Intermediário" },
    { name: "Atendimento de bordo", value: 78, level: "Intermediário avançado" },
    { name: "Primeiros socorros", value: 85, level: "Avançado" },
  ],
  tracks: [
    {
      id: "trk-manutencao",
      title: "Manutenção de motores",
      icon: "wrench",
      tagline: "Da preventiva ao diagnóstico eletrônico",
      courses: [
        { id: "c-mod-1", title: "Fundamentos de motores a gasolina e diesel", hours: 12, level: "Iniciante", status: "Concluído" },
        { id: "c-mod-2", title: "Diagnóstico eletrônico e leitura de falhas", hours: 10, level: "Intermediário", status: "Iniciar" },
        { id: "c-mod-3", title: "Sistema de arrefecimento e bomba d'água", hours: 8, level: "Intermediário", status: "Iniciar" },
        { id: "c-mod-4", title: "Preventiva sazonal e checklist de saída", hours: 6, level: "Avançado", status: "Bloqueado" },
      ],
    },
    {
      id: "trk-operacao",
      title: "Operação náutica",
      icon: "anchor",
      tagline: "Navegar com segurança e autonomia",
      courses: [
        { id: "c-ope-1", title: "Regras de navegação e sinalização", hours: 14, level: "Iniciante", status: "Em curso" },
        { id: "c-ope-2", title: "Manobras de marinas e fundeio", hours: 9, level: "Intermediário", status: "Iniciar" },
        { id: "c-ope-3", title: "Planejamento de rota e condições do mar", hours: 8, level: "Intermediário", status: "Iniciar" },
      ],
    },
    {
      id: "trk-hospitalidade",
      title: "Hospitalidade de bordo",
      icon: "star",
      tagline: "Serviço de bordo de alto nível",
      courses: [
        { id: "c-hos-1", title: "Atendimento ao passageiro", hours: 6, level: "Iniciante", status: "Concluído" },
        { id: "c-hos-2", title: "Cozinha de bordo e reaproveitamento", hours: 8, level: "Intermediário", status: "Iniciar" },
        { id: "c-hos-3", title: "Bar e harmonização", hours: 6, level: "Intermediário", status: "Bloqueado" },
      ],
    },
    {
      id: "trk-navio",
      title: "Carpintaria náutica",
      icon: "fleet",
      tagline: "Materiais, reparos e acabamento",
      courses: [
        { id: "c-nav-1", title: "Materiais: madeira, fibra e aço", hours: 10, level: "Iniciante", status: "Iniciar" },
        { id: "c-nav-2", title: "Reparos rápidos e vedação", hours: 7, level: "Intermediário", status: "Bloqueado" },
      ],
    },
  ],
  disclaimer:
    "Requisitos e certificações podem variar conforme atividade, embarcação e jurisdição. O SafeAnchor Academy é um espaço conceitual de aprendizado para a comunidade náutica — não substitui cursos regulamentados.",
};
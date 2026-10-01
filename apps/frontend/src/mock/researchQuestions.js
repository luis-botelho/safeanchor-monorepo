/* ============================================================
   SafeAnchor — Árvore de perguntas da pesquisa (ramificada)
   Uma pergunta por tela. Cada fluxo tem 8 a 12 perguntas.
   ============================================================ */

export const STAGES = {
  perfil: "Seu perfil",
  rotina: "Sua rotina",
  prioridades: "Prioridades",
  extras: "Questão final",
  contato: "Contato",
  fim: "Concluído",
};

export const QUESTION_PROFILE = {
  id: "perfil",
  stage: "perfil",
  type: "single",
  question: "Como você se relaciona atualmente com o universo náutico?",
  hint: "Sua resposta define as próximas perguntas. Dá para voltar e trocar de caminho depois.",
  options: [
    { value: "proprietario", label: "Sou proprietário ou gestor de embarcação", iconName: "boat" },
    { value: "prestador", label: "Sou prestador de serviço náutico", iconName: "wrench" },
    { value: "marina", label: "Trabalho em marina ou organização náutica", iconName: "fleet" },
    { value: "interessado", label: "Ainda não atuo, mas me interesso pelo mar", iconName: "user" },
  ],
};

/* ---------- Fluxo: proprietário / gestor ---------- */

const ownerFlow = [
  {
    id: "owner_embarcacoes",
    stage: "rotina",
    type: "single",
    question: "Quantas embarcações você gerencia?",
    options: [
      { value: "uma", label: "1 embarcação" },
      { value: "duas_cinco", label: "2 a 5 embarcações" },
      { value: "seis_vinte", label: "6 a 20 embarcações" },
      { value: "mais_de_vinte", label: "Mais de 20 embarcações" },
      { value: "planejando", label: "Estou planejando comprar" },
    ],
  },
  {
    id: "owner_tipo",
    stage: "rotina",
    type: "multi",
    question: "Que tipo de embarcação você usa ou gerencia?",
    hint: "Pode marcar mais de uma.",
    options: [
      { value: "lancha", label: "Lancha" },
      { value: "veleiro", label: "Veleiro" },
      { value: "jetski", label: "Jet ski" },
      { value: "pesca", label: "Barco de pesca" },
      { value: "catingo", label: "Catingo ourada" },
      { value: "outro", label: "Outro tipo", other: true },
    ],
  },
  {
    id: "owner_uso",
    stage: "rotina",
    type: "single",
    question: "Com que frequência você usa a embarcação?",
    options: [
      { value: "diario", label: "Quase todos os dias" },
      { value: "semanal", label: "Toda semana" },
      { value: "mensal", label: "Algumas vezes por mês" },
      { value: "temporada", label: "Só na temporada" },
      { value: "parado", label: "Está parado, em manutenção" },
    ],
  },
  {
    id: "owner_tempo",
    stage: "rotina",
    type: "multi",
    question: "Qual atividade mais consome seu tempo hoje?",
    hint: "Pode marcar até duas.",
    maxChoices: 2,
    options: [
      { value: "manutencao", label: "Manutenção preventiva" },
      { value: "prestadores", label: "Achar prestador confiável" },
      { value: "documentos", label: "Documentos e certificados" },
      { value: "inspecoes", label: "Inspeções e checklists" },
      { value: "custos", label: "Controle de custos" },
      { value: "tripulacao", label: "Tripulação e agenda" },
    ],
  },
  {
    id: "owner_problema",
    stage: "rotina",
    type: "single",
    hasOther: true,
    question: "Qual problema mais te incomodou nos últimos 30 dias?",
    options: [
      { value: "avaria", label: "Avaria inesperada" },
      { value: "atraso", label: "Manutenção atrasada" },
      { value: "prazo", label: "Serviço demorado além do combinado" },
      { value: "custo", label: "Custo maior do que eu esperava" },
      { value: "documento", label: "Documento vencido ou perdido" },
      { value: "outro", label: "Outro problema", other: true },
    ],
  },
  {
    id: "owner_controle",
    stage: "rotina",
    type: "multi",
    question: "Como você controla manutenção e serviços hoje?",
    options: [
      { value: "planilha", label: "Planilha" },
      { value: "whatsapp", label: "Mensagem no WhatsApp" },
      { value: "caderno", label: "Caderno ou papel" },
      { value: "memoria", label: "De memória" },
      { value: "sistema", label: "Sistema online" },
    ],
  },
  {
    id: "owner_prestadores",
    stage: "rotina",
    type: "single",
    question: "Como você encontra prestadores de confiança?",
    options: [
      { value: "indicacao", label: "Indicação de conhecido" },
      { value: "redes", label: "Redes sociais" },
      { value: "busca", label: "Busca na internet" },
      { value: "eventos", label: "Feiras e eventos do setor" },
      { value: "fixos", label: "Já tenho prestadores fixos" },
      { value: "nao_sei", label: "Não sei onde procurar" },
    ],
  },
  {
    id: "owner_docs",
    stage: "rotina",
    type: "single",
    question: "Qual papelada é mais difícil de lidar?",
    options: [
      { value: "ins", label: "Inscrição e certificado" },
      { value: "procuracao", label: "Procuração e custódia" },
      { value: "seguro", label: "Seguro" },
      { value: "ambiental", label: "Licenciamento ambiental" },
      { value: "seguranca", label: "Itens de segurança" },
    ],
  },
  {
    id: "owner_dedicacao",
    stage: "rotina",
    type: "single",
    question: "Quanto tempo você ou sua equipe gasta com isso por mês?",
    options: [
      { value: "menos_1h", label: "Menos de 1 hora" },
      { value: "1_5h", label: "De 1 a 5 horas" },
      { value: "5_15h", label: "De 5 a 15 horas" },
      { value: "mais_15h", label: "Mais de 15 horas" },
    ],
  },
  {
    id: "owner_recurso",
    stage: "prioridades",
    type: "single",
    question: "Se um recurso novo resolvesse seu maior incômodo, seria qual?",
    options: [
      { value: "agenda", label: "Agenda de manutenção" },
      { value: "prestadores", label: "Rede de prestadores verificados" },
      { value: "documentos", label: "Documentos sempre em dia" },
      { value: "custos", label: "Custos sob controle" },
      { value: "tripulacao", label: "Tripulação organizada" },
    ],
  },
  {
    id: "owner_prioridade",
    stage: "prioridades",
    type: "single",
    question: "Se você pudesse resolver um problema só da gestão náutica, qual seria?",
    options: [
      { value: "prazo", label: "Manutenção dentro do prazo" },
      { value: "custo", label: "Preço justo e previsível" },
      { value: "confianca", label: "Saber em quem confiar" },
      { value: "documento", label: "Papelada organizada" },
      { value: "disponibilidade", label: "Encontrar quem faz o serviço" },
    ],
  },
  {
    id: "owner_melhorias",
    stage: "prioridades",
    type: "multi",
    maxChoices: 2,
    question: "Quais destas melhorias teriam maior impacto na sua rotina?",
    hint: "Escolha até duas.",
    options: [
      { value: "agenda", label: "Agenda com lembretes" },
      { value: "checklist", label: "Checklist de inspeção" },
      { value: "orcamento", label: "Orçamento online" },
      { value: "garantia", label: "Garantia do serviço feito" },
      { value: "comunidade", label: "Comunidade com outros proprietários" },
    ],
  },
];

/* ---------- Fluxo: prestador de serviço ---------- */

const providerFlow = [
  {
    id: "provider_tipo",
    stage: "rotina",
    type: "single",
    question: "Que tipo de serviço você presta?",
    options: [
      { value: "mecanica", label: "Mecânica e elétrica" },
      { value: "estetica", label: "Pintura e estética" },
      { value: "reforma", label: "Reforma e manutenção" },
      { value: "reboque", label: "Reboque e transporte" },
      { value: "conservacao", label: "Limpeza e conservação" },
      { value: "temporada", label: "Preparação para temporada" },
      { value: "variado", label: "Vários tipos" },
    ],
  },
  {
    id: "provider_equipe",
    stage: "rotina",
    type: "single",
    question: "Você trabalha sozinho ou com equipe?",
    options: [
      { value: "sozinho", label: "Sozinho" },
      { value: "um_dois", label: "Com 1 ou 2 pessoas" },
      { value: "tres_cinco", label: "De 3 a 5 pessoas" },
      { value: "seis_mais", label: "Mais de 6 pessoas" },
    ],
  },
  {
    id: "provider_negocios",
    stage: "rotina",
    type: "multi",
    question: "Como você consegue novos clientes hoje?",
    options: [
      { value: "indicacao", label: "Indicação" },
      { value: "instagram", label: "Instagram" },
      { value: "busca", label: "Busca na internet" },
      { value: "plataforma", label: "Plataforma de serviços" },
      { value: "anuncio", label: "Anúncio" },
      { value: "fisico", label: "Cartaz ou material físico" },
      { value: "nenhum", label: "Não busco ativamente" },
    ],
  },
  {
    id: "provider_dificuldade",
    stage: "rotina",
    type: "single",
    hasOther: true,
    question: "Qual é a maior dificuldade na sua operação?",
    options: [
      { value: "clientes", label: "Encontrar clientes" },
      { value: "agenda", label: "Organizar a agenda" },
      { value: "orcamento", label: "Enviar orçamento" },
      { value: "cobranca", label: "Receber no prazo" },
      { value: "fidelizar", label: "Manter o cliente" },
      { value: "documentar", label: "Documentar o serviço" },
      { value: "outro", label: "Outra dificuldade", other: true },
    ],
  },
  {
    id: "provider_gestao",
    stage: "rotina",
    type: "multi",
    question: "Como controla seus serviços hoje?",
    options: [
      { value: "planilha", label: "Planilha" },
      { value: "whatsapp", label: "Mensagem no WhatsApp" },
      { value: "caderno", label: "Caderno ou papel" },
      { value: "memoria", label: "De memória" },
      { value: "sistema", label: "Sistema online" },
    ],
  },
  {
    id: "provider_atraso",
    stage: "rotina",
    type: "single",
    question: "O que mais gera atraso na sua rotina?",
    options: [
      { value: "peca", label: "Peça ou acessório faltando" },
      { value: "confirmacao", label: "Falta de confirmação do cliente" },
      { value: "sumiu", label: "Cliente some depois do orçamento" },
      { value: "deslocamento", label: "Deslocamento" },
      { value: "tempo", label: "Falta de tempo" },
      { value: "nada", label: "Nada relevante" },
    ],
  },
  {
    id: "provider_orcamento",
    stage: "rotina",
    type: "single",
    question: "Como você envia orçamento?",
    options: [
      { value: "mensagem", label: "Mensagem rápida" },
      { value: "pdf", label: "PDF" },
      { value: "online", label: "Sistema online" },
      { value: "presencial", label: "Pessoalmente" },
      { value: "sem_padrao", label: "Sem padrão fixo" },
    ],
  },
  {
    id: "provider_retorno",
    stage: "rotina",
    type: "single",
    question: "O que faz um cliente voltar a te chamar?",
    options: [
      { value: "preco", label: "Preço justo" },
      { value: "pontualidade", label: "Pontualidade" },
      { value: "qualidade", label: "Qualidade do serviço" },
      { value: "transparencia", label: "Transparência no que foi feito" },
      { value: "indicacao", label: "Indicação de quem já contratou" },
    ],
  },
  {
    id: "provider_pagaria",
    stage: "rotina",
    type: "single",
    question: "Você pagaria por uma ferramenta que organizasse seus serviços?",
    options: [
      { value: "sim", label: "Sim" },
      { value: "talvez", label: "Talvez, se for barata" },
      { value: "nao", label: "Não" },
      { value: "ja_pago", label: "Já uso e já pago" },
    ],
  },
  {
    id: "provider_prioridade",
    stage: "prioridades",
    type: "single",
    question: "Se você pudesse resolver um problema só do seu trabalho, qual seria?",
    options: [
      { value: "clientes", label: "Chegar mais clientes" },
      { value: "agenda", label: "Organizar a agenda" },
      { value: "orcamento", label: "Orçamento rápido e formal" },
      { value: "cobranca", label: "Receber no prazo" },
      { value: "fidelizar", label: "Fidelizar o cliente" },
    ],
  },
  {
    id: "provider_melhorias",
    stage: "prioridades",
    type: "multi",
    maxChoices: 2,
    question: "Quais destas melhorias teriam maior impacto na sua rotina?",
    hint: "Escolha até duas.",
    options: [
      { value: "agenda", label: "Agenda automática" },
      { value: "orcamento", label: "Orçamento em modelo pronto" },
      { value: "cobrancas", label: "Cobrança com link" },
      { value: "portfolio", label: "Portfólio dos serviços" },
      { value: "avaliacao", label: "Avaliação dos clientes" },
    ],
  },
];

/* ---------- Fluxo: marina / organização ---------- */

const marinaFlow = [
  {
    id: "marina_tipo",
    stage: "rotina",
    type: "single",
    question: "Qual é o seu perfil de operação?",
    options: [
      { value: "marina", label: "Marina ou estacionamento náutico" },
      { value: "clube", label: "Clube náutico" },
      { value: "frota", label: "Administração de frota" },
      { value: "oficina", label: "Oficina náutica" },
      { value: "outro", label: "Outro tipo de operação" },
    ],
  },
  {
    id: "marina_frota",
    stage: "rotina",
    type: "single",
    question: "Quantas embarcações você administra?",
    options: [
      { value: "ate_10", label: "Até 10" },
      { value: "11_50", label: "De 11 a 50" },
      { value: "51_200", label: "De 51 a 200" },
      { value: "mais_200", label: "Mais de 200" },
    ],
  },
  {
    id: "marina_pessoas",
    stage: "rotina",
    type: "single",
    question: "Quantas pessoas trabalham na operação?",
    options: [
      { value: "ate_5", label: "Até 5" },
      { value: "6_20", label: "De 6 a 20" },
      { value: "21_100", label: "De 21 a 100" },
      { value: "mais_100", label: "Mais de 100" },
    ],
  },
  {
    id: "marina_ferramentas",
    stage: "rotina",
    type: "multi",
    question: "Como a operação é controlada hoje?",
    options: [
      { value: "planilha", label: "Planilhas" },
      { value: "sistema", label: "Sistema próprio" },
      { value: "papel", label: "Papel e caderno" },
      { value: "whatsapp", label: "Mensagens avulsas" },
      { value: "gestao", label: "Software de gestão" },
      { value: "cada_um", label: "Cada um do seu jeito" },
    ],
  },
  {
    id: "marina_atividades",
    stage: "rotina",
    type: "multi",
    question: "Quais atividades são mais difíceis de escalar?",
    hint: "Pode marcar até duas.",
    maxChoices: 2,
    options: [
      { value: "manutencao", label: "Manutenção" },
      { value: "conservacao", label: "Limpeza e conservação" },
      { value: "docas", label: "Docas e vagas" },
      { value: "equipe", label: "Disponibilidade de equipe" },
      { value: "documentos", label: "Documentação" },
      { value: "comunicacao", label: "Comunicação com proprietários" },
    ],
  },
  {
    id: "marina_info",
    stage: "rotina",
    type: "single",
    question: "Onde ficam as informações da operação?",
    options: [
      { value: "centralizado", label: "Centralizadas em um sistema" },
      { value: "planilhas", label: "Espalhadas entre planilhas" },
      { value: "pessoas", label: "Na cabeça das pessoas" },
      { value: "misturado", label: "Cada um usa uma ferramenta" },
    ],
  },
  {
    id: "marina_retrabalho",
    stage: "rotina",
    type: "single",
    hasOther: true,
    question: "O que mais gera retrabalho na sua operação?",
    options: [
      { value: "informacao", label: "Informação perdida" },
      { value: "repetida", label: "Tarefa repetida" },
      { value: "comunicacao", label: "Falha de comunicação" },
      { value: "checklist", label: "Checklist esquecido" },
      { value: "outro", label: "Outro motivo", other: true },
    ],
  },
  {
    id: "marina_solicitacoes",
    stage: "rotina",
    type: "single",
    question: "Como acompanham as solicitações dos proprietários?",
    options: [
      { value: "caderno", label: "Caderno de solicitações" },
      { value: "whatsapp", label: "Mensagens separadas" },
      { value: "email", label: "E-mail" },
      { value: "chamado", label: "Sistema de chamados" },
      { value: "nada", label: "Nada estruturado" },
    ],
  },
  {
    id: "marina_tempo_real",
    stage: "rotina",
    type: "single",
    question: "Os proprietários recebem informação do estado da embarcação?",
    options: [
      { value: "sempre", label: "Sempre" },
      { value: "as_vezes", label: "Às vezes" },
      { value: "quase_nunca", label: "Quase nunca" },
    ],
  },
  {
    id: "marina_prioridade",
    stage: "prioridades",
    type: "single",
    question: "Se você pudesse resolver um problema só da operação, qual seria?",
    options: [
      { value: "organizacao", label: "Organização do trabalho" },
      { value: "comunicacao", label: "Comunicação com proprietários" },
      { value: "custo", label: "Redução de custo" },
      { value: "prazo", label: "Prazo das manutenção" },
      { value: "pessoas", label: "Contratar e treinar pessoal" },
    ],
  },
  {
    id: "marina_melhorias",
    stage: "prioridades",
    type: "multi",
    maxChoices: 2,
    question: "Quais destas melhorias teriam maior impacto na operação?",
    hint: "Escolha até duas.",
    options: [
      { value: "quadro", label: "Quadro de tarefas" },
      { value: "frotas", label: "Visão da frota" },
      { value: "portal", label: "Portal para proprietários" },
      { value: "relatorios", label: "Relatórios de operação" },
      { value: "auditoria", label: "Histórico de manutenção" },
    ],
  },
];

/* ---------- Fluxo: interessado ---------- */

const interestedFlow = [
  {
    id: "interessado_motivo",
    stage: "rotina",
    type: "multi",
    question: "O que despertou seu interesse pelo SafeAnchor?",
    hint: "Pode marcar mais de uma.",
    options: [
      { value: "facilidade", label: "Deixar minha embarcação mais fácil de cuidar" },
      { value: "prestadores", label: "Encontrar prestadores confiáveis" },
      { value: "custos", label: "Organizar custos" },
      { value: "comunidade", label: "Conhecer pessoas do mar" },
      { value: "apenas_acompanhar", label: "Só queria acompanhar" },
    ],
  },
  {
    id: "interessado_duvida",
    stage: "rotina",
    type: "single",
    question: "Qual é a sua maior dúvida hoje?",
    options: [
      { value: "como", label: "Como funciona" },
      { value: "custo", label: "Quanto custa" },
      { value: "seguranca", label: "Se é seguro" },
      { value: "serve", label: "Se serve para o meu caso" },
    ],
  },
  {
    id: "interessado_confianca",
    stage: "rotina",
    type: "multi",
    maxChoices: 2,
    question: "O que faria você confiar na ferramenta?",
    hint: "Escolha até duas.",
    options: [
      { value: "avaliacoes", label: "Ver avaliações reais" },
      { value: "casos", label: "Conhecer quem usa" },
      { value: "precos", label: "Preços claros" },
      { value: "prazo", label: "Prazo de resposta claro" },
      { value: "suporte", label: "Suporte que fala português" },
    ],
  },
  {
    id: "interessado_uso",
    stage: "prioridades",
    type: "single",
    question: "Você pretende usar nos próximos 6 meses?",
    options: [
      { value: "com_certeza", label: "Com certeza" },
      { value: "talvez", label: "Talvez" },
      { value: "acompanhando", label: "Só acompanhando" },
      { value: "nao_sei", label: "Ainda não sei" },
    ],
  },
];

/* ---------- Perguntas finais comuns a todos ---------- */

const finalFlow = [
  {
    id: "final_frase",
    stage: "extras",
    type: "text",
    question: "Como você descreveria sua experiência com gestão náutica em uma frase?",
    hint: "Opcional. Escreva do seu jeito.",
    placeholder: "Ex.: minha maior dor é procurar mecânico de confiança...",
  },
  {
    id: "final_util",
    stage: "extras",
    type: "multi",
    maxChoices: 2,
    question: "O que tornaria essa pesquisa útil para você?",
    hint: "Escolha até duas.",
    options: [
      { value: "exemplo", label: "Ver exemplos reais do meu caso" },
      { value: "prioridade", label: "Saber o que será feito primeiro" },
      { value: "prazo", label: "Saber quando vai existir" },
      { value: "convite", label: "Ser convidado para testar antes" },
      { value: "nada", label: "Nada além de preencher" },
    ],
  },
  {
    id: "final_extra",
    stage: "extras",
    type: "text",
    question: "Há algo que não perguntamos e que você gostaria de compartilhar?",
    hint: "Opcional. Este campo é livre.",
    placeholder: "Escreva aqui...",
  },
];

/* ---------- Exportações ---------- */

export const FLOWS = {
  proprietario: ownerFlow,
  prestador: providerFlow,
  marina: marinaFlow,
  interessado: interestedFlow,
};

export const FINAL_FLOW = finalFlow;

export function buildPath(profile) {
  const flow = FLOWS[profile] || [];
  return [QUESTION_PROFILE, ...flow, ...FINAL_FLOW];
}

export function questionCount(profile) {
  return buildPath(profile).length;
}
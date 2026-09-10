export const ownerAi = {
  intro:
    "O SafeAnchor recomenda rotas, marinas, prestadores e atividades com base no seu histórico de navegação, embarcação e preferências.",
  insights: [
    {
      title: "Seu mês ideal: Costa Verde em setembro",
      preview: "Comparado ao histórico de outras famílias de veleiro, o período 10–14/09 tem mar calmo e marinas com vaga.",
    },
    {
      title: "Horário de saída recomendado",
      preview: "Mar de lebre entre 05:30 e 07:00. Recomendamos saída antes do pôr do sol para o trecho mais longo.",
    },
    {
      title: "Prestadores com agenda nesta semana",
      preview: "TecnoMar (mecânico) e Mergulho SC estão disponíveis — combine uma pré-inspeção em Angra.",
    },
  ],
  answerByQuestion: {
    "Melhor rota para a minha semana?": "Para 4 dias saindo de Florianópolis: Costa Verde (Angra → Ilha Grande → Paraty → Trindade). Dias de mar 1m, marinas com vaga e 12 POIs compatíveis com seu perfil de cruzeiro tranquilo.",
    "Quando devo sair?": "Antes das 06:00 para aproveitar mar de lebre e chegar antes do pôr do sol. A reserva na Paraty Yacht Marina está disponível no horário.",
    "Quem contratar para a tripulação?": "Marinheiro: recomendamos facilitador local em Angra (avaliação 4.8, responde em ~1h). Chef: pacote de 2 dias com equipe da Marina Costa Azul. Mecânico: TecnoMar para o check pré-saída.",
    "Estou com orçamento curtido — sugestões?": "Troque o chef para 1 dia e o capitão local apenas no trecho Angra ↔ Ilha Grande. Economia estimada de R$ 890 mantendo os destaques.",
  },
};

export const providerAi = {
  intro:
    "Assistente do prestador: ajuda a compor orçamentos, priorizar oportunidades, preparar a agenda e responder cliente.",
  stats: [
    { label: "Taxa de resposta", value: "1h", note: "melhor que 78% dos prestadores" },
    { label: "Oportunidades em aberto", value: "3", note: "2 combinam com seu perfil" },
    { label: "Faturamento estimado no mês", value: "R$ 8.4k", note: "+22% vs. agosto" },
  ],
  answerByQuestion: {
    "Como montar a proposta ideal?": "Para a preventiva da Mar Azul: revisão de 2 motores Yamaha + check do arrefecimento = R$ 1.850 + deslocamento. Inclua relatório fotográfico e histórico — clientes da plataforma valorizam entrega documentada.",
    "Quais oportunidades priorizar?": "O job 'Manutenção preventiva Yamaha 2x200' tem 3 propostas e vencimento em 2 dias. É o de maior encaixe com seu histórico (92% compatibilidade) e pode abrir contrato recorrente com a Marina Costa Azul.",
    "Estou com agenda cheia. O que adiar?": "Recomendo adiar a 'Pintura de casco' (menor ticket, cliente não-resposta) e manter a preventiva Yamaha, que tem retorno de 4.2x por hora de serviço.",
    "Como melhorar minha avaliação?": "Seus 5 pontos fortes: pontualidade, diagnóstico, relatório. Sua lacuna recorrente: tempo de resposta (>60min). Configure lembretes e reserve slots de 'resposta rápida' nas manhãs.",
  },
};

export const marinaAi = {
  intro:
    "Assistente do gestor da marina: analisa ocupação, operação de serviços, equipe e oportunidades B2B com dados simulados.",
  insights: [
    { title: "Ocupação prevista para o feriado", preview: "Sexta + sábado do feriado devem atingir 92% — sugira pré-reserva de serviços de água/energia." },
    { title: "Serviços com maior demanda", preview: "Lavagem e inspeção subaquática cresceram 18% nas últimas 2 semanas." },
    { title: "Parceria B2B com potencial", preview: "A negociação com Albatroz Combustíveis pode gerar R$ 3.2k extras/mês em volume." },
  ],
  answerByQuestion: {
    "Como está minha ocupação amanhã?": "93% dos berços reservados. Vão sobrar 6 vagas, todas cobertas? Sugiro abrir pré-reserva de serviços de energia/água para as embarcações que chegam tarde.",
    "Qual serviço devo promover?": "Lavagem a bordo e inspeção subaquática lideram a demanda. Puxe a dupla com o Mergulho SC (parceiro ativo) para um pacote de final de semana.",
    "Vale a pena o plano Ecossistema Conectado?": "Sim para o seu volume: com 4 reservas/dia a integração de API economiza ~10h semanais de digitação e destrava relatórios que o plano Operacional já gera.",
  },
};
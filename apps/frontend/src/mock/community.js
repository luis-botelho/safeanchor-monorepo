export const posts = [
  {
    id: "post-6",
    authorKey: "luis",
    time: "há 45min",
    tag: "Viagens",
    title:
      "Costa Verde: nossa rota de cruzeiro com checklist completo (família + veleiro)",
    content:
      "Compilamos a rota Florianópolis → Angra → Ilha Grande → Paraty → Trindade com itinerário por dia, marinas conectadas e POIs. Deixo o plano completo para quem quiser aproveitar o feriado. Dica: sair antes das 06h e reservar píer com antecedência em Paraty.",
    likes: 18,
    comments: [
      { authorKey: "marcos", text: "Que demais! Vou replicar no fim do ano." },
      { authorKey: "ana", text: "Savei aqui. O trecho de Paraty → Trindade é lindo." },
    ],
    tripId: "trip-costa-verde",
  },
  {
    id: "post-1",
    authorKey: "luis",
    time: "há 2h",
    tag: "Dica",
    title: "Checklist de inverno para embarcações",
    content:
      "Compartilhando o checklist que uso para preparar as embarcações antes da baixa temporada: motor, baterias, vela sobressalente, desumidificadores e revisão do seguro. Funciona muito bem no Sul!",
    likes: 24,
    comments: [
      { authorKey: "ana", text: "Anotei tudo. Obrigada, Luis!" },
      { authorKey: "marcos", text: "Desumidificador é essencial mesmo." },
    ],
  },
  {
    id: "post-2",
    authorKey: "ana",
    time: "há 5h",
    tag: "Pergunta",
    title: "Alguém recomenda estaleiro para hélice em Floripa?",
    content:
      "Minha hélice amassou ao sair da baía. Preciso de um estaleiro confiável e com agilidade. Alguém tem indicação?",
    likes: 8,
    comments: [
      { authorKey: "luis", text: "Fala com o Carlos da TecnoMar. Resolveu a minha em dois dias." },
      { authorKey: "pedro", text: "+1 pra TecnoMar. Diagnóstico honesto." },
    ],
  },
  {
    id: "post-3",
    authorKey: "marcos",
    time: "ontem",
    tag: "Discussão",
    title: "Marinas: março ou junho para docar?",
    content:
      "Estou decidindo quando docar o veleiro para manutenção. Na experiência de vocês, qual época fica menos cheio e com melhor clima?",
    likes: 15,
    comments: [
      { authorKey: "julia", text: "Junho costuma ter vaga fácil. Março ainda tem movimento de temporada." },
      { authorKey: "luis", text: "Fiz antifouling em julho no Horizonte e ficou tranquilo." },
    ],
  },
  {
    id: "post-4",
    authorKey: "julia",
    time: "ontem",
    tag: "Evento",
    title: "Quem vai pra Regata Costa Azul?",
    content:
      "Confirmado o percurso de 12 milhas pela Baía Norte no dia 21/09. Vamos fechar uma equipe para a categoria 32 pés. Quem topa?",
    likes: 31,
    comments: [
      { authorKey: "marcos", text: "Eu vou! Bora fechar tripulação." },
      { authorKey: "julia", text: "Fechado, Marcos. Te chamo amanhã." },
    ],
  },
  {
    id: "post-5",
    authorKey: "pedro",
    time: "2 dias",
    tag: "Dica",
    title: "Motor 4 tempos: o óleo que você não deve usar",
    content:
      "Dica rápida para quem tem motor de popa 4T: evite óleo automotivo comum. Use especificação FC-W. Vi muitos problemas de carbonização por causa disso.",
    likes: 47,
    comments: [
      { authorKey: "luis", text: "Ótima dica, Pedro. Vou repassar no estaleiro." },
    ],
  },
{
    id: "post-7",
    authorKey: "julia",
    time: "3 dias",
    tag: "Experiência",
    title: "Fim de semana de mergulho em Trindade (com marinheiro local)",
    content:
      "Contratamos marinheiro local via SafeAnchor para o fim de semana. Dupla atenta nas manobras, conferia coletes e ainda encontrou um bom spot de mergulho. Vale muito a pena deixar a tripulação preparada no pré-checklist.",
    likes: 29,
    comments: [
      { authorKey: "luis", text: "Boa. Vou incluir mergulho no nosso roteiro de Trindade." },
      { authorKey: "pedro", text: "Anotado. Com quem fechou?" },
    ],
  },
];

// Tópicos/categorias da comunidade. Novas categorias (Viagens e
// Experiência) conectam a Comunidade às viagens e ao ecossistema.
export const communityTopics = [
  "Todas",
  "Dica",
  "Pergunta",
  "Discussão",
  "Evento",
  "Viagens",
  "Experiência",
];
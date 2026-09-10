import { vessels } from "../mock/vessels";
import { marinas } from "../mock/marinas";

const STORAGE_KEY = "safeanchor:requests";

const seedRequests = [
  {
    id: "req-estrela-motor",
    vesselId: "ves-estrela",
    category: "Manutenção do motor",
    description:
      "Falha no sistema de injeção do motor principal. Pedido diagnóstico e orçamento para reparo.",
    providerId: "prov-carlos",
    status: "Em andamento",
    createdAt: "05/09/2026",
    dueDate: "15/09/2026",
    rating: null,
    comment: null,
    price: "Em orçamento",
  },
  {
    id: "req-azul-limpeza",
    vesselId: "ves-mar-azul",
    category: "Limpeza / mergulho",
    description:
      "Limpeza subaquática do casco e inspeção da hélice antes da temporada.",
    providerId: "prov-joao-mergulho",
    status: "Aguardando orçamento",
    createdAt: "28/08/2026",
    dueDate: "20/09/2026",
    rating: null,
    comment: null,
    price: null,
  },
  {
    id: "req-horizonte-motor",
    vesselId: "ves-horizonte",
    category: "Manutenção do motor",
    description:
      "Revisão completa do motor auxiliar Volvo D2-40 com troca de correias.",
    providerId: "prov-kraft",
    status: "Concluído",
    createdAt: "10/08/2026",
    dueDate: "15/08/2026",
    rating: 5,
    comment:
      "Serviço de qualidade, relatório completo e o motor voltou a funcionar perfeitamente.",
    price: "R$ 2.300",
  },
  {
    id: "req-costa-helice",
    vesselId: "ves-costa-norte",
    category: "Manutenção do motor",
    description:
      "Substituição da hélice danificada após contato com sacaria na temporada.",
    providerId: "prov-carlos",
    status: "Concluído",
    createdAt: "13/07/2026",
    dueDate: "15/07/2026",
    rating: 5,
    comment:
      "Serviço rápido e honesto. A embarcação voltou a rodar perfeitamente.",
    price: "R$ 1.100",
  },
  {
    id: "req-azul-coxim",
    vesselId: "ves-mar-azul",
    category: "Manutenção do motor",
    description:
      "Troca dos coxins do motor principal, que apresentam vibração excessiva em alta rotação.",
    providerId: "prov-carlos",
    status: "Aguardando orçamento",
    createdAt: "09/09/2026",
    dueDate: null,
    rating: null,
    comment: null,
    price: null,
  },
  {
    id: "req-marina-vistoria",
    vesselId: "ves-mar-azul",
    category: "Inspeção de segurança",
    description:
      "Vistoria anual de segurança e conferência dos documentos da embarcação atracada na marina.",
    targetType: "MARINA",
    targetId: "marin-costa-azul",
    providerId: null,
    status: "Em andamento",
    createdAt: "10/09/2026",
    dueDate: "18/09/2026",
    rating: null,
    comment: null,
    price: "Em orçamento",
  },
];

function load() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);

    if (raw) {
      return JSON.parse(raw);
    }
  } catch {
    // Sem dados locais válidos; usa o seed.
  }

  localStorage.setItem(STORAGE_KEY, JSON.stringify(seedRequests));
  return seedRequests;
}

export async function getRequests() {
  return load();
}

export async function getRequestById(id) {
  const request = load().find((item) => item.id === id);
  return request ? enrichWithVessel(request) : null;
}

export function getRequestTimeline(request) {
  const events = [
    {
      label: "Solicitação criada",
      actor:
        request.targetType === "MARINA"
          ? "Proprietário → Marina (solicita serviço)"
          : "Proprietário → Prestador",
      time: request.createdAt,
      observation: request.category,
      tone: "info",
    },
  ];

  if (request.status === "Aguardando orçamento") {
    events.push({
      label: "Orçamento pendente",
      actor: "Prestador / equipe da marina retorna valor",
      time: "—",
      observation: request.price || "Em orçamento",
      tone: "info",
    });
  }

  if (request.status === "Em andamento" || request.status === "Concluído") {
    events.push({
      label: "Orçamento aprovado",
      actor: "Proprietário",
      time: request.createdAt,
      observation: request.price || "Valor combinado busca feito via chat",
      tone: "success",
    });
    events.push({
      label: "Serviço em execução",
      actor: request.targetType === "MARINA" ? "Equipe da marina" : "Prestador",
      time: request.dueDate ? `prazo ${request.dueDate}` : "—",
      observation: request.description,
      tone: "warning",
    });
  }

  if (request.status === "Concluído") {
    events.push({
      label: "Serviço concluído e avaliado",
      actor: "Proprietário avaliou o serviço",
      time: request.dueDate || "—",
      observation: request.rating
        ? `Avaliação ${request.rating}/5 — ${request.comment || "sem comentário"}`
        : "Aguardando avaliação",
      tone: "success",
    });
  }

  return events;
}

function enrichWithVessel(request) {
  const vessel = vessels.find((item) => item.id === request.vesselId);
  const marinaName =
    request.targetType === "MARINA"
      ? marinas.find((item) => item.id === request.targetId)?.name
      : undefined;

  return {
    ...request,
    vesselName: vessel ? vessel.name : "Embarcação",
    marinaName: marinaName || "Marina",
  };
}

export async function getRequestsByProvider(providerId) {
  return load()
    .filter((request) => request.providerId === providerId)
    .map(enrichWithVessel);
}

export async function getRequestsForMarina(marinaId) {
  return load()
    .filter(
      (request) =>
        request.targetType === "MARINA" && request.targetId === marinaId,
    )
    .map(enrichWithVessel);
}

export async function createRequest({
  vesselId,
  category,
  description,
  providerId,
  targetType,
  targetId,
}) {
  const requests = load();

  const newRequest = {
    id: `req-${Date.now()}`,
    vesselId,
    category,
    description,
    status: "Aguardando orçamento",
    createdAt: "10/09/2026",
    dueDate: null,
    rating: null,
    comment: null,
    price: null,
  };

  if (targetType === "MARINA") {
    newRequest.targetType = "MARINA";
    newRequest.targetId = targetId;
    newRequest.providerId = null;
  } else {
    newRequest.providerId = providerId;
  }

  requests.unshift(newRequest);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(requests));

  return newRequest;
}

export async function rateRequest(id, rating, comment) {
  const requests = load();
  const request = requests.find((item) => item.id === id);

  if (request) {
    request.status = "Concluído";
    request.rating = rating;
    request.comment = comment || null;
    request.price = request.price || "R$ 2.100";
    request.dueDate = request.dueDate || "10/09/2026";

    localStorage.setItem(STORAGE_KEY, JSON.stringify(requests));
  }

  return request;
}
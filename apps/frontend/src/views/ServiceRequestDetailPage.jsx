import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

import PageHeader, { BackLink } from "../components/PageHeader";
import StatusBadge from "../components/StatusBadge";
import Icon from "../components/Icon";
import ServiceTimeline from "../components/ServiceTimeline";

import { useAuth } from "../context/AuthContext";
import { getRequestById, getRequestTimeline } from "../services/requestService";
import { getFleetVessels } from "../services/vesselService";
import { getProviderById } from "../services/providerService";
import { getMarinaById } from "../services/marinaService";

const requestStatusMeta = {
  "Aguardando orçamento": "info",
  "Em andamento": "warning",
  "Concluído": "success",
  "Cancelado": "neutral",
};

export default function ServiceRequestDetailPage() {
  const { id } = useParams();
  const { user } = useAuth();
  const [request, setRequest] = useState(null);
  const [vessel, setVessel] = useState(null);
  const [provider, setProvider] = useState(null);
  const [marina, setMarina] = useState(null);

  useEffect(() => {
    getRequestById(id).then(async (data) => {
      setRequest(data);
      if (!data) return;

      const fleet = await getFleetVessels();
      setVessel(fleet.find((item) => item.id === data.vesselId) || null);

      if (data.targetType === "MARINA") {
        setMarina(await getMarinaById(data.targetId));
      } else if (data.providerId) {
        setProvider(await getProviderById(data.providerId));
      }
    });
  }, [id]);

  if (!request) {
    return <p>Carregando solicitação...</p>;
  }

  const isProvider = user?.persona === "SERVICE_PROVIDER";
  const tone = requestStatusMeta[request.status] || "neutral";

  return (
    <div>
      <BackLink to="/service-requests" label="Voltar para solicitações" />

      <PageHeader
        eyebrow="Rede de serviços"
        title={request.category}
        subtitle={request.description}
        actions={<StatusBadge label={request.status} tone={tone} />}
      />

      <div className="grid grid--stack">
        <div className="stack">
          <section className="card card--padding">
            <div className="section-title">
              <h2>Timeline do serviço</h2>
            </div>
            <ServiceTimeline steps={getRequestTimeline(request)} />
          </section>

          <section className="card card--padding">
            <div className="section-title">
              <h2>Detalhes</h2>
            </div>
            <div className="plan-stats">
              <div className="plan-stat">
                <strong>{request.createdAt}</strong>
                <span>Solicitado</span>
              </div>
              <div className="plan-stat">
                <strong>{request.dueDate || "—"}</strong>
                <span>Prazo / conclusão</span>
              </div>
              <div className="plan-stat">
                <strong>{request.price || "Em orçamento"}</strong>
                <span>Valor</span>
              </div>
              <div className="plan-stat">
                <strong>{request.rating ? `${request.rating}/5` : "—"}</strong>
                <span>Avaliação</span>
              </div>
            </div>
            {request.rating && request.comment && (
              <div className="ai-thread" style={{ marginTop: 12 }}>
                <strong>Avaliação do proprietário</strong>
                <p>"{request.comment}"</p>
              </div>
            )}
          </section>
        </div>

        <div className="stack">
          <section className="card card--padding">
            <div className="section-title">
              <h2>Embarcação</h2>
            </div>
            {vessel ? (
              <Link className="btn btn--ghost" to={`/fleet/${vessel.id}`}>
                <Icon name="boat" size={16} />
                {vessel.name} · {vessel.length} pés
              </Link>
            ) : (
              <p className="mnt__meta">Embarcação</p>
            )}
          </section>

          <section className="card card--padding">
            <div className="section-title">
              <h2>Destinatário</h2>
            </div>
            {request.targetType === "MARINA" ? (
              marina ? (
                <Link className="btn btn--ghost" to={`/marinas/${marina.id}`}>
                  <Icon name="anchor" size={16} />
                  {marina.name}
                </Link>
              ) : (
                <p className="mnt__meta">Marina</p>
              )
            ) : provider ? (
              <Link className="btn btn--ghost" to={`/service-providers/${provider.id}`}>
                <Icon name="user" size={16} />
                {provider.name} · {provider.company}
              </Link>
            ) : (
              <p className="mnt__meta">Prestador</p>
            )}
          </section>

          {isProvider && request.status === "Aguardando orçamento" && (
            <section className="card card--padding">
              <div className="section-title">
                <h2>Próxima ação</h2>
              </div>
              <button className="btn btn--primary" type="button">
                Enviar orçamento (demo)
              </button>
            </section>
          )}
        </div>
      </div>
    </div>
  );
}
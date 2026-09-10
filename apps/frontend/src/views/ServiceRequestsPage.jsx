import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import { useAuth } from "../context/AuthContext";
import {
  getRequests,
  getRequestsByProvider,
  rateRequest,
} from "../services/requestService";
import { getFleetVessels } from "../services/vesselService";
import { getProviderById } from "../services/providerService";
import PageHeader from "../components/PageHeader";
import StatusBadge from "../components/StatusBadge";
import Icon from "../components/Icon";

const requestStatusMeta = {
  "Aguardando orçamento": "info",
  "Em andamento": "warning",
  "Concluído": "success",
  "Cancelado": "neutral",
};

export default function ServiceRequestsPage() {
  const { user } = useAuth();
  const isProvider = user?.persona === "SERVICE_PROVIDER";

  const [requests, setRequests] = useState([]);
  const [vessels, setVessels] = useState([]);

  useEffect(() => {
    async function load() {
      if (isProvider) {
        setRequests(await getRequestsByProvider(user.providerId));
      } else {
        setRequests(await getRequests());
      }
    }

    load();
    getFleetVessels().then(setVessels);
  }, [isProvider, user]);

  function vesselName(vesselId) {
    const vessel = vessels.find((item) => item.id === vesselId);
    return vessel ? vessel.name : "Embarcação";
  }

  async function handleRate(request, rating, comment) {
    await rateRequest(request.id, rating, comment);

    if (isProvider) {
      setRequests(await getRequestsByProvider(user.providerId));
    } else {
      setRequests(await getRequests());
    }
  }

  return (
    <div>
      <PageHeader
        eyebrow="Rede de serviços"
        title={isProvider ? "Solicitações recebidas" : "Solicitações"}
        subtitle={
          isProvider
            ? "Pedidos de serviço enviados à sua empresa. Responda com orçamento e acompanhe o andamento."
            : "Acompanhe os pedidos de serviço enviados aos prestadores e avalie os concluídos."
        }
        actions={
          !isProvider && (
            <Link className="btn btn--primary" to="/service-requests/new">
              Nova solicitação
            </Link>
          )
        }
      />

      <section className="card">
        {requests.length === 0 ? (
          <div className="card--padding">
            <p className="page-header__subtitle">
              {isProvider
                ? "Nenhuma solicitação recebida até o momento."
                : "Nenhuma solicitação. Crie a primeira para encontrar um prestador."}
            </p>
          </div>
        ) : (
          requests.map((request) => (
            <RequestRow
              key={request.id}
              request={request}
              vesselName={vesselName(request.vesselId)}
              onRate={handleRate}
              readOnly={isProvider}
            />
          ))
        )}
      </section>
    </div>
  );
}

function RequestRow({ request, vesselName, onRate, readOnly }) {
  const [provider, setProvider] = useState(null);
  const [open, setOpen] = useState(false);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");

  useEffect(() => {
    if (request.targetType === "MARINA") {
      setProvider(null);
      return;
    }

    getProviderById(request.providerId).then(setProvider);
  }, [request.providerId, request.targetType]);

  const tone = requestStatusMeta[request.status] || "neutral";
  const recipient = request.targetType === "MARINA" ? "Marina" : null;

  return (
    <div className="mnt">
      <Link className="mnt__link-wrap" to={`/service-requests/${request.id}`}>
        <span className={`mnt__icon ${request.rating ? "mnt--concluida" : ""}`}>
          <Icon name="send" size={17} />
        </span>
        <div>
          <p className="mnt__title">
            {request.category} — {vesselName}
          </p>
          <p className="mnt__meta">
            <span>{readOnly ? "Cliente" : recipient || (provider ? provider.name : "Prestador")}</span>
            <StatusBadge label={request.status} tone={tone} />
            <span>solicitada em {request.createdAt}</span>
          </p>
          {request.description && request.status !== "Concluído" && (
            <p className="page-header__subtitle" style={{ marginTop: 6 }}>
              {request.description}
            </p>
          )}

          {!readOnly && open && request.status !== "Concluído" && (
            <div className="grid grid--2" style={{ marginTop: 14 }}>
            <div className="field">
              <label className="field__label">Sua nota (1 a 5)</label>
              <div className="post__actions">
                {[1, 2, 3, 4, 5].map((value) => (
                  <button
                    key={value}
                    type="button"
                    className={`post__action ${value === rating ? "post__action--active" : ""}`}
                    onClick={() => setRating(value)}
                  >
                    {value}
                  </button>
                ))}
              </div>
            </div>
            <div className="field">
              <label className="field__label" htmlFor={`comment-${request.id}`}>
                Comentário (opcional)
              </label>
              <input
                id={`comment-${request.id}`}
                className="input"
                type="text"
                placeholder="Como foi o serviço?"
                value={comment}
                onChange={(event) => setComment(event.target.value)}
              />
            </div>
            <div style={{ display: "flex", gap: 10 }}>
              <button
                className="btn btn--primary btn--sm"
                onClick={() => onRate(request, rating, comment)}
              >
                Enviar avaliação
              </button>
              <button className="btn btn--ghost btn--sm" onClick={() => setOpen(false)}>
                Cancelar
              </button>
            </div>
          </div>
        )}
        </div>
      </Link>
      <div className="mnt__due" style={{ minWidth: 120 }}>
        {request.status === "Concluído" && request.rating ? (
          <>
            <span className="mnt__due-date">
              Nota {request.rating}/5
            </span>
            <span className="mnt__due-label">avaliado</span>
          </>
        ) : readOnly ? (
          <>
            <span className="mnt__due-date">{request.price || "em orçamento"}</span>
            <span className="mnt__due-label">
              {request.status === "Aguardando orçamento"
                ? "enviar orçamento"
                : "em andamento"}
            </span>
          </>
        ) : (
          <>
            <span className="mnt__due-date">{request.price || "em orçamento"}</span>
            <button className="btn btn--ghost btn--sm" onClick={() => setOpen(true)}>
              Concluir e avaliar
            </button>
          </>
        )}
      </div>
    </div>
  );
}
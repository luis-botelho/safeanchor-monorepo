import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import { useAuth } from "../context/AuthContext";
import { getMarinaById } from "../services/marinaService";
import {
  getMarinaOperations,
  getMarinaOperationStatusTone,
  getMarinaOperationOrigin,
  getReceivedRequestsForMarina,
} from "../services/marinaOperationService";
import PageHeader from "../components/PageHeader";
import StatusBadge from "../components/StatusBadge";
import Avatar from "../components/Avatar";
import StatCard from "../components/StatCard";
import Icon from "../components/Icon";

const originFilters = ["Todos", "Interno", "Prestador externo", "Solicitação recebida"];

export default function MarinaServicesPage() {
  const { user } = useAuth();
  const marinaId = user?.marinaId || "marin-costa-azul";

  const [marina, setMarina] = useState(null);
  const [operations, setOperations] = useState([]);
  const [received, setReceived] = useState([]);
  const [origin, setOrigin] = useState("Todos");

  useEffect(() => {
    async function load() {
      setMarina(await getMarinaById(marinaId));
      setOperations(await getMarinaOperations(marinaId));
      setReceived(await getReceivedRequestsForMarina(marinaId));
    }

    load();
  }, [marinaId]);

  if (!marina) {
    return <p>Carregando operação de serviços...</p>;
  }

  const filtered =
    origin === "Todos"
      ? operations
      : operations.filter((item) => item.origin === origin);

  const inProgress = operations.filter((item) => item.status === "Em andamento").length;
  const waiting = operations.filter((item) => item.status !== "Concluído" && item.status !== "Em andamento").length;
  const concluded = operations.filter((item) => item.status === "Concluído").length;

  return (
    <div>
      <PageHeader
        eyebrow={`${marina.name} · Operação`}
        title="Operação de serviços"
        subtitle="Serviços executados pela equipe interna, acionamento de prestadores externos e solicitações recebidas de proprietários."
        actions={
          <Link className="btn btn--primary" to="/marina/services/catalog">
            Catálogo de serviços
          </Link>
        }
      />

      <section className="card card--padding" style={{ marginBottom: 18 }}>
        <div className="flow">
          <div className="flow__step">
            <span className="flow__icon">
              <Icon name="fleet" size={16} />
            </span>
            Proprietário
          </div>
          <span className="flow__arrow">→</span>
          <div className="flow__step">
            <span className="flow__icon">
              <Icon name="anchor" size={16} />
            </span>
            Marina
          </div>
          <span className="flow__arrow">→</span>
          <div className="flow__step">
            <span className="flow__icon">
              <Icon name="send" size={16} />
            </span>
            Solicitação
          </div>
          <span className="flow__arrow">→</span>
          <div className="flow__step">
            <span className="flow__icon">
              <Icon name="users" size={16} />
            </span>
            Funcionário / Prestador
          </div>
          <span className="flow__arrow">→</span>
          <div className="flow__step flow__step--end">
            <span className="flow__icon">
              <Icon name="check" size={16} />
            </span>
            Conclusão
          </div>
        </div>
        <p className="page-header__subtitle" style={{ marginTop: 12 }}>
          Fluxo da operação: o proprietário solicita à marina, que distribui o
          serviço para a equipe interna ou para um prestador parceiro, acompanha
          até a conclusão e devolve o status ao proprietário.
        </p>
      </section>

      <div className="grid grid--3" style={{ marginBottom: 18 }}>
        <StatCard
          label="Em andamento"
          value={inProgress}
          icon="wrench"
          tone="warning"
        />
        <StatCard
          label="Aguardando"
          value={waiting}
          icon="send"
          tone="info"
        />
        <StatCard
          label="Concluídos"
          value={concluded}
          icon="check"
          tone="success"
        />
      </div>

      <section className="card">
        <div className="card--padding">
          <div className="section-title">
            <h2>Serviços em operação</h2>
          </div>
          <div className="filters" style={{ marginBottom: 12 }}>
            {originFilters.map((item) => (
              <button
                key={item}
                type="button"
                className="demo-chip"
                onClick={() => setOrigin(item)}
                style={{
                  width: "auto",
                  flex: "1 1 auto",
                  margin: 0,
                  borderColor: origin === item ? "var(--primary)" : undefined,
                  background:
                    origin === item ? "var(--success-bg)" : undefined,
                }}
              >
                {item}
              </button>
            ))}
          </div>
        </div>

        {filtered.length === 0 ? (
          <div className="card--padding">
            <p className="page-header__subtitle">
              Nenhum serviço nesta origem.
            </p>
          </div>
        ) : (
          filtered.map((operation) => {
            const statusTone = getMarinaOperationStatusTone(operation.status);
            const originMeta = getMarinaOperationOrigin(operation.origin);
            const showProvider =
              operation.assigneeType === "provider" &&
              operation.origin === "Prestador externo";

            return (
              <div className="mnt" key={operation.id}>
                <span className="mnt__icon">
                  <Icon name={originMeta.icon} size={18} />
                </span>
                <div>
                  <p className="mnt__title">
                    {operation.service} · {operation.vessel}
                  </p>
                  <p className="mnt__meta">
                    <span>{operation.client}</span> ·{" "}
                    <span>{operation.origin}</span> ·{" "}
                    <span>{operation.date}</span>
                  </p>
                  {operation.note && (
                    <p className="page-header__subtitle" style={{ marginTop: 4 }}>
                      {operation.note}
                    </p>
                  )}
                  <div className="mnt__meta" style={{ marginTop: 8 }}>
                    <Avatar initials={operation.assigneeInitials} size={28} />
                    <span style={{ marginLeft: 8 }}>
                      {showProvider ? (
                        <Link
                          to="/service-providers"
                          style={{ color: "var(--primary)" }}
                        >
                          {operation.assignee} (prestador)
                        </Link>
                      ) : (
                        operation.assignee
                      )}
                    </span>
                    {operation.assigneeType === "provider" && (
                      <span style={{ marginLeft: 8 }}>
                        <StatusBadge label="Externo" tone="info" />
                      </span>
                    )}
                  </div>
                </div>
                <div className="mnt__due">
                  <StatusBadge label={operation.status} tone={statusTone} />
                </div>
              </div>
            );
          })
        )}
      </section>

      <section className="card" style={{ marginTop: 18 }}>
        <div className="card--padding">
          <div className="section-title">
            <h2>Solicitações recebidas de proprietários</h2>
          </div>
        </div>
        {received.length === 0 ? (
          <div className="card--padding">
            <p className="page-header__subtitle">
              Nenhuma solicitação recebida diretamente pela marina.
            </p>
          </div>
        ) : (
          received.map((request) => (
            <div className="mnt" key={request.id}>
              <span className="mnt__icon">
                <Icon name="send" size={18} />
              </span>
              <div>
                <p className="mnt__title">
                  {request.category} · {request.vesselName}
                </p>
                <p className="mnt__meta">
                  <span>Proprietário</span> ·{" "}
                  <span>solicitada em {request.createdAt}</span>
                </p>
                {request.description && (
                  <p className="page-header__subtitle" style={{ marginTop: 4 }}>
                    {request.description}
                  </p>
                )}
              </div>
              <div className="mnt__due" style={{ minWidth: 130 }}>
                <StatusBadge label={request.status} tone="warning" />
                <span className="mnt__due-label" style={{ marginTop: 6 }}>
                  {request.price || "em orçamento"}
                </span>
              </div>
            </div>
          ))
        )}
      </section>
    </div>
  );
}
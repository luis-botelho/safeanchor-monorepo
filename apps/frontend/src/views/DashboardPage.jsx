import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import { useAuth } from "../context/AuthContext";
import { getDashboard } from "../services/dashboardService";
import { getVesselStatus } from "../services/vesselService";
import ReadinessGauge from "../components/ReadinessGauge";
import StatusBadge from "../components/StatusBadge";
import Icon from "../components/Icon";
import StatCard from "../components/StatCard";

export default function DashboardPage() {
  const { user } = useAuth();
  const [data, setData] = useState(null);

  useEffect(() => {
    getDashboard().then(setData);
  }, []);

  if (!data) {
    return <p>Carregando dashboard...</p>;
  }

  const quickActions = [
    { to: "/trips/new", label: "Planejar viagem", icon: "locationPin" },
    { to: "/service-requests/new", label: "Solicitar serviço", icon: "send" },
    { to: "/boat-rentals", label: "Boat rentals", icon: "boat" },
    { to: "/community", label: "Comunidade", icon: "message" },
  ];

  return (
    <div>
      <header className="page-header">
        <div className="page-header__text">
          <span className="page-header__eyebrow">Região Sul do Brasil</span>
          <h1 className="page-header__title">Bom dia, {user?.name}!</h1>
          <p className="page-header__subtitle">
            Resumo da sua frota: prontidão operacional, próximas manutenções,
            documentos e atividades recentes.
          </p>
        </div>
      </header>

      <div className="grid grid--4" style={{ marginBottom: 20 }}>
        <StatCard
          label="Embarcações na frota"
          value={data.fleetOverview.total}
          icon="fleet"
          tone="primary"
          hint={`${data.fleetOverview.operational} operacionais`}
        />
        <StatCard
          label="Prontidão média"
          value={`${data.readiness.total}%`}
          icon="dashboard"
          tone={data.readiness.total >= 80 ? "primary" : "warning"}
          hint={`${data.issues.count}/${data.vessels.length} abaixo de 80%`}
        />
        <StatCard
          label="Manutenções em aberto"
          value={data.issues.maintenance}
          icon="wrench"
          tone="warning"
          hint="próximas ou em andamento"
        />
        <StatCard
          label="Docs. próximos/vencidos"
          value={data.expiringDocuments.length}
          icon="doc"
          tone="danger"
          hint={`${data.documentsSummary.expired} vencidos`}
        />
      </div>

      <div className="grid grid--stack">
        <div className="stack">
          <section className="card card--padding">
            <div className="section-title">
              <h2>Fleet overview</h2>
              <Link className="section-title__link" to="/fleet">
                Ver todas
              </Link>
            </div>

            {data.vessels.map((vessel) => {
              const status = getVesselStatus(vessel.status);

              return (
                <Link
                  key={vessel.id}
                  className="mnt"
                  to={`/fleet/${vessel.id}`}
                >
                  <span className="mnt__icon">
                    <Icon name="boat" size={19} />
                  </span>
                  <div>
                    <p className="mnt__title">{vessel.name}</p>
                    <p className="mnt__meta">
                      <span>{vessel.type} · {vessel.length}</span>
                      <StatusBadge label={status.label} tone={status.tone} />
                    </p>
                  </div>
                  <ReadinessGauge value={vessel.readiness} size={52} />
                </Link>
              );
            })}
          </section>

          <section className="card card--padding">
            <div className="section-title">
              <h2>Próximas manutenções</h2>
              <Link className="section-title__link" to="/maintenance">
                Manutenção
              </Link>
            </div>

            {data.upcomingMaintenance.length === 0 ? (
              <p className="page-header__subtitle">Nenhuma manutenção pendente.</p>
            ) : (
              data.upcomingMaintenance.map((item) => (
                <div className="mnt" key={item.id}>
                  <span className="mnt__icon">
                    <Icon name="wrench" size={19} />
                  </span>
                  <div>
                    <p className="mnt__title">{item.title}</p>
                    <p className="mnt__meta">
                      <span>{item.vesselName}</span>
                      <StatusBadge label={item.status} tone={item.statusTone} />
                    </p>
                  </div>
                  <div className="mnt__due">
                    <span className="mnt__due-date">{item.date}</span>
                    <span className="mnt__due-label">prazo</span>
                  </div>
                </div>
              ))
            )}
          </section>
        </div>

        <div className="stack">
          <section className="card card--padding">
            <div className="section-title">
              <h2>SafeAnchor IA · Próximo passo</h2>
              <Link className="section-title__link" to="/trips/new">
                Planejar viagem
              </Link>
            </div>
            <div className="ai-banner">
              <span className="ai-banner__icon">
                <Icon name="star" size={17} />
              </span>
              <div>
                <strong>Seu mês ideal: Costa Verde em setembro</strong>
                <p>
                  Com mar calmo previsto e marinas com vaga, o véu Horizonte
                  está pronto para a travessia de 4 dias — reserve a rota agora.
                </p>
              </div>
            </div>
            <p className="page-header__subtitle" style={{ marginTop: 10 }}>
              Sugestões geradas localmente (mock), sem chamadas externas de IA.
            </p>
          </section>

          <section className="card card--padding">
            <div className="section-title">
              <h2>Documentos em atenção</h2>
              <Link className="section-title__link" to="/documents">
                Documentos
              </Link>
            </div>

            {data.expiringDocuments.length === 0 ? (
              <p className="page-header__subtitle">Tudo em dia.</p>
            ) : (
              data.expiringDocuments.map((document) => {
                const vessel = data.vessels.find(
                  (item) => item.id === document.vesselId,
                );

                return (
                  <div className="doc-row" key={document.id}>
                    <div className="doc-row__info">
                      <span className="doc-row__icon">
                        <Icon name="doc" size={18} />
                      </span>
                      <div>
                        <p className="doc-row__name">{document.name}</p>
                        <p className="doc-row__meta">
                          {vessel ? vessel.name : "Embarcação"} · {document.category}
                        </p>
                      </div>
                    </div>
                    <div className="doc-row__right">
                      <StatusBadge label={document.status.label} tone={document.status.tone} />
                      <p className="doc-row__expires">vence {document.expiresAt}</p>
                    </div>
                  </div>
                );
              })
            )}
          </section>

          <section className="card card--padding">
            <div className="section-title">
              <h2>Atividade recente</h2>
            </div>

            {data.recentActivity.map((item) => (
              <div className="activity" key={item.id}>
                <span
                  className={`activity__icon activity__icon--${item.meta.tone}`}
                >
                  <Icon name={item.meta.icon} size={16} />
                </span>
                <div>
                  <p className="activity__title">{item.title}</p>
                  <p className="activity__subtitle">{item.subtitle}</p>
                </div>
                <span className="activity__time">{item.time}</span>
              </div>
            ))}
          </section>
        </div>
      </div>

      <section className="card card--padding" style={{ marginTop: 20 }}>
        <div className="section-title">
          <h2>Ações rápidas</h2>
        </div>
        <div className="grid grid--4">
          {quickActions.map((action) => (
            <Link key={action.to} className="btn btn--accent" to={action.to}>
              <Icon name={action.icon} size={17} />
              {action.label}
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import PageHeader from "../components/PageHeader";
import StatCard from "../components/StatCard";
import StatusBadge from "../components/StatusBadge";
import Icon from "../components/Icon";

import { getReservations, getReservationStats } from "../services/reservationService";

export default function MarinaReservationsPage() {
  const [reservations, setReservations] = useState([]);
  const [stats, setStats] = useState(null);

  useEffect(() => {
    getReservations().then(setReservations);
    getReservationStats().then(setStats);
  }, []);

  if (!stats) {
    return <p>Carregando reservas...</p>;
  }

  return (
    <div>
      <PageHeader
        eyebrow="Marina Costa Azul"
        title="Reservas"
        subtitle="Vagas, solicitações e estadias conectadas à ocupação em tempo real e ao plano da marina."
      />

      <div className="grid grid--4" style={{ marginBottom: 18 }}>
        <StatCard label="Reservas nos próximos dias" value={stats.nextDays} icon="calendar" tone="primary" />
        <StatCard label="Vagas livres hoje" value={stats.vacanciesToday} icon="boat" tone="success" />
        <StatCard label="Ocupadas agora" value={stats.reservedToday} icon="anchor" tone="warning" />
        <StatCard label="Rotatividade" value={`${stats.turnoverRate}%`} icon="dashboard" tone="accent" />
      </div>

      <div className="grid grid--stack">
        <div className="stack">
          <section className="card">
            <div className="card--padding">
              <div className="section-title">
                <h2>Solicitações e estadias</h2>
                <Link className="section-title__link" to="/marina/dashboard">
                  Ver ocupação
                </Link>
              </div>
            </div>
            {reservations.map((reservation) => (
              <div className="mnt mnt--column" key={reservation.id}>
                <div style={{ display: "flex", gap: 12, alignItems: "center", width: "100%" }}>
                  <span className="mnt__icon">
                    <Icon name="boat" size={18} />
                  </span>
                  <div>
                    <p className="mnt__title">
                      {reservation.vessel} · {reservation.owner}
                    </p>
                    <p className="mnt__meta">
                      <span>Berço {reservation.slot}</span> ·{" "}
                      <span>
                        {reservation.checkIn} → {reservation.checkOut}
                      </span>{" "}
                      · <span>{reservation.value}</span>
                    </p>
                    <p className="mnt__meta">
                      {reservation.services.join(" · ")}
                    </p>
                  </div>
                  <StatusBadge
                    label={reservation.status}
                    tone={reservation.statusTone}
                  />
                </div>
              </div>
            ))}
          </section>
        </div>

        <div className="stack">
          <section className="card card--padding">
            <div className="section-title">
              <h2>Automação de reservas</h2>
            </div>
            <p className="page-header__subtitle">
              No plano Operacional, vagas são reservadas automaticamente e
              sincronizadas com a grade de ocupação do dashboard.
            </p>
            <Link className="btn btn--accent" to="/marina/plan" style={{ marginTop: 12 }}>
              Ver planos B2B
            </Link>
          </section>

          <section className="card card--padding">
            <div className="section-title">
              <h2>Comunicação com clientes</h2>
            </div>
            <div className="ai-banner">
              <span className="ai-banner__icon"><Icon name="message" size={17} /></span>
              <div>
                <strong>Pré-check-in</strong>
                <p>
                  Lembrete automático de chegada e validação de documentos no
                  mesmo fluxo do plano de viagem.
                </p>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import {
  getUpcomingMaintenance,
  getMaintenanceHistory,
  getPriorityTone,
} from "../services/maintenanceService";
import PageHeader from "../components/PageHeader";
import StatusBadge from "../components/StatusBadge";
import Icon from "../components/Icon";

export default function MaintenancePage() {
  const [upcoming, setUpcoming] = useState([]);
  const [history, setHistory] = useState([]);

  useEffect(() => {
    getUpcomingMaintenance().then(setUpcoming);
    getMaintenanceHistory().then(setHistory);
  }, []);

  return (
    <div>
      <PageHeader
        eyebrow="Gestão de manutenção"
        title="Manutenção"
        subtitle="Acompanhe as manutenções preventivas e corretivas de toda a frota em um só lugar."
        actions={
          <Link className="btn btn--ghost" to="/maintenance/new">
            <Icon name="plus" size={17} />
            Agendar manutenção
          </Link>
        }
      />

      <section className="card" style={{ marginBottom: 18 }}>
        <div className="card--padding">
          <div className="section-title">
            <h2>Abertas e agendadas</h2>
          </div>
        </div>
        {upcoming.length === 0 ? (
          <div className="card--padding">
            <p className="page-header__subtitle">Nenhuma manutenção aberta.</p>
          </div>
        ) : (
          upcoming.map((item) => (
            <div className="mnt" key={item.id}>
              <span
                className={`mnt__icon ${item.status === "Em andamento" ? "mnt--andamento" : ""}`}
              >
                <Icon name="wrench" size={19} />
              </span>
              <div>
                <p className="mnt__title">{item.title}</p>
                <p className="mnt__meta">
                  <span>{item.vesselName}</span>
                  <StatusBadge label={item.status} tone={item.statusTone} />
                  <StatusBadge label={item.priority} tone={getPriorityTone(item.priority)} />
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

      <section className="card">
        <div className="card--padding">
          <div className="section-title">
            <h2>Histórico concluído</h2>
          </div>
        </div>
        {history.length === 0 ? (
          <div className="card--padding">
            <p className="page-header__subtitle">Nenhuma manutenção concluída.</p>
          </div>
        ) : (
          history.map((item) => (
            <div className="mnt mnt--concluida" key={item.id}>
              <span className="mnt__icon">
                <Icon name="check" size={18} />
              </span>
              <div>
                <p className="mnt__title">{item.title}</p>
                <p className="mnt__meta">
                  <span>{item.vesselName}</span>
                  <StatusBadge label={item.status} tone={item.statusTone} />
                  <span>{item.category}</span>
                </p>
              </div>
              <div className="mnt__due">
                <span className="mnt__due-date">{item.date}</span>
                <span className="mnt__due-label">{item.cost}</span>
              </div>
            </div>
          ))
        )}
      </section>
    </div>
  );
}
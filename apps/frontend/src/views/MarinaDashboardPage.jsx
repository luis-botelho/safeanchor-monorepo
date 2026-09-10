import { useEffect, useState } from "react";
import { Link, NavLink } from "react-router-dom";

import { useAuth } from "../context/AuthContext";
import { getMarinaById } from "../services/marinaService";
import { getVesselsByOwner } from "../services/vesselService";
import { getTeamByMarina } from "../services/teamService";
import {
  getBerthSlots,
  getMarinaMovements,
  getTodayMovementCounts,
  berthSlotMeta,
} from "../services/occupancyService";
import {
  getMarinaOperations,
  getMarinaOperationStatusTone,
  getMarinaOperationOrigin,
  getReceivedRequestsForMarina,
} from "../services/marinaOperationService";
import { getPublishedCatalogCount } from "../services/marinaCatalogService";
import PageHeader from "../components/PageHeader";
import StatCard from "../components/StatCard";
import StatusBadge from "../components/StatusBadge";
import Avatar from "../components/Avatar";
import Icon from "../components/Icon";

const marinaTabs = [
  { to: "/marina/dashboard", label: "Dashboard" },
  { to: "/marina/fleet", label: "Frota" },
  { to: "/marina/team", label: "Equipe" },
  { to: "/marina/services", label: "Serviços" },
  { to: "/marina/services/catalog", label: "Catálogo" },
  { to: "/marina/reservations", label: "Reservas" },
  { to: "/marina/ai", label: "IA" },
  { to: "/marina/plan", label: "Plano B2B" },
];

export default function MarinaDashboardPage() {
  const { user } = useAuth();
  const marinaId = user?.marinaId || "marin-costa-azul";

  const [marina, setMarina] = useState(null);
  const [fleet, setFleet] = useState([]);
  const [team, setTeam] = useState([]);
  const [slots, setSlots] = useState([]);
  const [movements, setMovements] = useState([]);
  const [counts, setCounts] = useState({ arrivals: 0, departures: 0 });
  const [operations, setOperations] = useState([]);
  const [received, setReceived] = useState([]);
  const [published, setPublished] = useState(0);

  useEffect(() => {
    async function load() {
      setMarina(await getMarinaById(marinaId));
      setFleet(await getVesselsByOwner("usr-marina"));
      setTeam(await getTeamByMarina(marinaId));
      setSlots(await getBerthSlots());
      setMovements(await getMarinaMovements());
      setCounts(await getTodayMovementCounts());
      setOperations(await getMarinaOperations(marinaId));
      setReceived(await getReceivedRequestsForMarina(marinaId));
      setPublished(await getPublishedCatalogCount());
    }

    load();
  }, [marinaId]);

  if (!marina) {
    return <p>Carregando visão da marina...</p>;
  }

  const openRequests = received.filter((item) => item.status !== "Concluído");
  const openServices = operations.filter((item) => item.status !== "Concluído");
  const activeStaff = team.filter((member) => member.status !== "Em folga");
  const managedVessels = marina.clients.length + fleet.length;

  return (
    <div>
      <PageHeader
        eyebrow="Marina Costa Azul · Operação"
        title={`Olá, ${user?.name}!`}
        subtitle={`${marina.name} · ${marina.location}`}
        actions={
          <>
            <Link className="btn btn--ghost" to={`/marinas/${marina.id}`}>
              Página pública
            </Link>
            <Link className="btn btn--primary" to="/marina/services">
              Gerenciar serviços
            </Link>
          </>
        }
      />

      <nav className="subnav" aria-label="Visão da marina">
        {marinaTabs.map((tab) => (
          <NavLink
            key={tab.to}
            to={tab.to}
            className={({ isActive }) =>
              `subnav__item ${isActive ? "subnav__item--active" : ""}`
            }
          >
            {tab.label}
          </NavLink>
        ))}
        <NavLink
          to={`/marinas/${marina.id}`}
          className={({ isActive }) =>
            `subnav__item ${isActive ? "subnav__item--active" : ""}`
          }
        >
          Página pública
        </NavLink>
      </nav>

      <div className="grid grid--4" style={{ marginBottom: 18 }}>
        <StatCard
          label="Embarcações sob gestão"
          value={managedVessels}
          icon="fleet"
          tone="primary"
          hint="frota própria + clientes"
        />
        <StatCard
          label="Ocupação"
          value={`${marina.occupancyPercent}%`}
          icon="boat"
          tone="warning"
          hint={`${marina.occupied} de ${marina.berths} vagas`}
        />
        <StatCard
          label="Solicitações abertas"
          value={openRequests.length}
          icon="send"
          tone="accent"
          hint="recebidas de proprietários"
        />
        <StatCard
          label="Chegadas hoje"
          value={counts.arrivals}
          icon="boat"
          tone="info"
          hint="movimentações previstas"
        />
      </div>

      <div className="grid grid--4" style={{ marginBottom: 18 }}>
        <StatCard
          label="Saídas hoje"
          value={counts.departures}
          icon="logout"
          tone="neutral"
          hint="movimentações do dia"
        />
        <StatCard
          label="Serviços em andamento"
          value={openServices.length}
          icon="wrench"
          tone="warning"
          hint={`${operations.length} no total`}
        />
        <StatCard
          label="Funcionários ativos"
          value={activeStaff.length}
          icon="users"
          tone="primary"
          hint={`${team.length} na equipe`}
        />
        <StatCard
          label="Serviços publicados"
          value={published}
          icon="shopping"
          tone="success"
          hint="no catálogo"
        />
      </div>

      <div className="grid grid--stack">
        <div className="stack">
          <section className="card card--padding">
            <div className="section-title">
              <h2>Insights desta semana</h2>
              <Link className="section-title__link" to="/marina/ai">
                Abrir IA da marina
              </Link>
            </div>
            <div className="ai-banner">
              <span className="ai-banner__icon"><Icon name="star" size={17} /></span>
              <div>
                <strong>Ocupação prevista para o feriado</strong>
                <p>
                  Sexta e sábado devem atingir 92% — sugira pré-reserva de
                  serviços de água e energia.
                </p>
              </div>
            </div>
            <div className="ai-banner">
              <span className="ai-banner__icon"><Icon name="wrench" size={17} /></span>
              <div>
                <strong>Serviços em alta</strong>
                <p>
                  Lavagem e inspeção subaquática cresceram 18% nas últimas duas
                  semanas — reforce o catálogo.
                </p>
              </div>
            </div>
          </section>
        </div>
      </div>

      <div className="grid grid--stack">
        <div className="stack">
          <section className="card card--padding">
            <div className="section-title">
              <h2>Ocupação atual</h2>
              <div className="berth-legend">
                {Object.keys(berthSlotMeta).map((key) => (
                  <span className="berth-legend__item" key={key}>
                    <span className={`berth-legend__dot berth-legend__dot--${key}`} />
                    {berthSlotMeta[key].label}
                  </span>
                ))}
              </div>
            </div>
            <div className="berth-grid">
              {slots.map((slot) => (
                <div
                  key={slot.id}
                  className={`berth-slot berth-slot--${slot.status}`}
                >
                  <span className="berth-slot__berth">{slot.berth}</span>
                  <span className="berth-slot__label">
                    {slot.vessel || berthSlotMeta[slot.status].label}
                  </span>
                  <span className="berth-slot__sub">
                    {slot.owner || slot.eta || slot.note || ""}
                  </span>
                </div>
              ))}
            </div>
          </section>

          <section className="card">
            <div className="card--padding">
              <div className="section-title">
                <h2>Agenda de hoje</h2>
              </div>
            </div>
            {movements.map((movement) => (
              <div className="mnt" key={movement.id}>
                <span className="mnt__icon">
                  <Icon name="boat" size={18} />
                </span>
                <div>
                  <p className="mnt__title">
                    {movement.vessel} · {movement.type}
                  </p>
                  <p className="mnt__meta">
                    <span>{movement.owner}</span> ·{" "}
                    <span>{movement.berth}</span>
                  </p>
                </div>
                <div className="mnt__due">
                  <span className="mnt__due-date">{movement.time}</span>
                  <span className="mnt__due-label">
                    <StatusBadge label={movement.status} tone={movement.tone} />
                  </span>
                </div>
              </div>
            ))}
          </section>
        </div>

        <div className="stack">
          <section className="card">
            <div className="card--padding">
              <div className="section-title">
                <h2>Operação de serviços</h2>
                <Link className="section-title__link" to="/marina/services">
                  Ver operação
                </Link>
              </div>
            </div>
            {openServices.slice(0, 5).map((operation) => {
              const statusTone = getMarinaOperationStatusTone(operation.status);
              const origin = getMarinaOperationOrigin(operation.origin);

              return (
                <div className="mnt" key={operation.id}>
                  <span className="mnt__icon">
                    <Icon name={origin.icon} size={18} />
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
                  </div>
                  <div className="mnt__due">
                    <StatusBadge
                      label={operation.status}
                      tone={statusTone}
                    />
                  </div>
                </div>
              );
            })}
          </section>

          <section className="card">
            <div className="card--padding">
              <div className="section-title">
                <h2>Equipe</h2>
                <Link className="section-title__link" to="/marina/team">
                  Ver equipe
                </Link>
              </div>
            </div>
            {team.map((member) => (
              <div className="mnt" key={member.id}>
                <Avatar initials={member.initials} size={36} />
                <div>
                  <p className="mnt__title">{member.name}</p>
                  <p className="mnt__meta">
                    <span>{member.role}</span> ·{" "}
                    <span>{member.tasks} tarefas</span>
                  </p>
                </div>
                <span className="mnt__due">
                  <StatusBadge label={member.status} tone={member.statusTone} />
                </span>
              </div>
            ))}
          </section>
        </div>
      </div>
    </div>
  );
}
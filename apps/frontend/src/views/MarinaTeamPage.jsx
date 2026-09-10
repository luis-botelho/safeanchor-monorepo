import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import { useAuth } from "../context/AuthContext";
import { getMarinaById } from "../services/marinaService";
import { getTeamByMarina } from "../services/teamService";
import PageHeader from "../components/PageHeader";
import StatusBadge from "../components/StatusBadge";
import Avatar from "../components/Avatar";
import StatCard from "../components/StatCard";
import Icon from "../components/Icon";

export default function MarinaTeamPage() {
  const { user } = useAuth();
  const marinaId = user?.marinaId || "marin-costa-azul";

  const [marina, setMarina] = useState(null);
  const [team, setTeam] = useState([]);

  useEffect(() => {
    async function load() {
      setMarina(await getMarinaById(marinaId));
      setTeam(await getTeamByMarina(marinaId));
    }

    load();
  }, [marinaId]);

  if (!marina) {
    return <p>Carregando equipe...</p>;
  }

  const active = team.filter((member) => member.status !== "Em folga").length;
  const totalTasks = team.reduce((sum, member) => sum + member.tasks, 0);

  return (
    <div>
      <PageHeader
        eyebrow={`${marina.name} · Operação`}
        title="Equipe"
        subtitle="Funcionários e responsabilidades da operação da marina."
        actions={
          <Link className="btn btn--ghost" to="/marina/dashboard">
            <Icon name="dashboard" size={17} />
            Voltar ao dashboard
          </Link>
        }
      />

      <div className="grid grid--3" style={{ marginBottom: 18 }}>
        <StatCard
          label="Membros da equipe"
          value={team.length}
          icon="users"
          tone="primary"
        />
        <StatCard
          label="Ativos agora"
          value={active}
          icon="check"
          tone="success"
        />
        <StatCard
          label="Tarefas em curso"
          value={totalTasks}
          icon="wrench"
          tone="warning"
        />
      </div>

      <div className="grid grid--2">
        {team.map((member) => (
          <section className="card card--padding" key={member.id}>
            <div className="vessel-hero__main">
              <div className="provider-card__body">
                <div className="provider-card__title">
                  {member.name}
                  <span style={{ marginLeft: 8 }}>
                    <StatusBadge label={member.status} tone={member.statusTone} />
                  </span>
                </div>
                <p className="provider-card__company">{member.role}</p>
                <div className="provider-card__meta">
                  <span className="provider-card__role">{member.specialty}</span>
                </div>
                <p className="page-header__subtitle" style={{ margin: "10px 0 0" }}>
                  {member.bio}
                </p>
              </div>
              <Avatar initials={member.initials} size={64} tone="info" />
            </div>
            <div className="provider-card__stats" style={{ marginTop: 14 }}>
              <span>{member.tasks} tarefas em curso</span>
              <span>·</span>
              <span>na marina desde {member.since}</span>
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
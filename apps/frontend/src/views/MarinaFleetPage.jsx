import LoadingFallback from "../components/LoadingFallback";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import { getFleetVessels, getVesselStatus } from "../services/vesselService";
import { getMarinaById } from "../services/marinaService";
import { useAuth } from "../context/AuthContext";
import CoverImage from "../components/CoverImage";
import ReadinessGauge from "../components/ReadinessGauge";
import StatusBadge from "../components/StatusBadge";
import PageHeader from "../components/PageHeader";
import StatCard from "../components/StatCard";
import Icon from "../components/Icon";

export default function MarinaFleetPage() {
  const { user } = useAuth();
  const marinaId = user?.marinaId || "marin-costa-azul";

  const [vessels, setVessels] = useState([]);
  const [marina, setMarina] = useState(null);

  useEffect(() => {
    async function load() {
      setVessels(await getFleetVessels());
      setMarina(await getMarinaById(marinaId));
    }

    load();
  }, [marinaId]);

  if (vessels.length === 0) {
    return <LoadingFallback label="Carregando frota da organização..." />;
  }

  const readinessValues = vessels
    .map((vessel) => vessel.readiness)
    .filter((value) => typeof value === "number");
  const avgReadiness = readinessValues.length
    ? Math.round(
        readinessValues.reduce((sum, value) => sum + value, 0) /
          readinessValues.length,
      )
    : 0;
  const inMaintenance = vessels.filter(
    (vessel) => vessel.status === "EM MANUTENÇÃO",
  ).length;

  return (
    <div>
      <PageHeader
        eyebrow={marina ? `${marina.name} · Operação` : "Operação"}
        title="Frota da organização"
        subtitle="Embarcações próprias da marina, usadas em passeios, manobras, segurança e operações no píer."
        actions={
          <Link className="btn btn--ghost" to="/marina/dashboard">
            <Icon name="dashboard" size={17} />
            Voltar ao dashboard
          </Link>
        }
      />

      <div className="grid grid--3" style={{ marginBottom: 18 }}>
        <StatCard
          label="Embarcações próprias"
          value={vessels.length}
          icon="fleet"
          tone="primary"
        />
        <StatCard
          label="Prontidão média"
          value={`${avgReadiness}%`}
          icon="check"
          tone="success"
        />
        <StatCard
          label="Em manutenção"
          value={inMaintenance}
          icon="wrench"
          tone="warning"
        />
      </div>

      <div className="grid grid--3">
        {vessels.map((vessel) => {
          const status = getVesselStatus(vessel.status);

          return (
            <Link className="card vessel-card" to={`/fleet/${vessel.id}`} key={vessel.id}>
              <CoverImage
                seed={vessel.imageSeed}
                hint={vessel.name}
                className="vessel-card__cover"
              />
              <div className="vessel-card__body">
                <div className="vessel-card__top">
                  <span className="vessel-card__type">{vessel.type}</span>
                  <ReadinessGauge value={vessel.readiness} size={52} />
                </div>
                <h3 className="vessel-card__title">{vessel.name}</h3>
                <div className="vessel-card__meta">
                  <span>{vessel.length}</span>
                  <span>· {vessel.year}</span>
                  <span>· {vessel.engine}</span>
                </div>
                <div className="vessel-card__footer">
                  <StatusBadge label={status.label} tone={status.tone} />
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
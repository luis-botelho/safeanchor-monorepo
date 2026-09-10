import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import { getFleetVessels } from "../services/vesselService";
import { getVesselStatus } from "../services/vesselService";
import CoverImage from "../components/CoverImage";
import ReadinessGauge from "../components/ReadinessGauge";
import StatusBadge from "../components/StatusBadge";
import PageHeader from "../components/PageHeader";
import Icon from "../components/Icon";

export default function FleetPage() {
  const [vessels, setVessels] = useState([]);

  useEffect(() => {
    getFleetVessels().then(setVessels);
  }, []);

  if (vessels.length === 0) {
    return <p>Carregando frota...</p>;
  }

  return (
    <div>
      <PageHeader
        eyebrow="Minha frota"
        title="Embarcações"
        subtitle="Acompanhe a prontidão operacional, o checklist mais recente e a próxima manutenção de cada embarcação."
        actions={
          <Link className="btn btn--ghost" to="/fleet/new">
            <Icon name="plus" size={17} />
            Nova embarcação
          </Link>
        }
      />

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
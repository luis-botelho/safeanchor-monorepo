import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import { getFleetVessels, getVesselStatus } from "../services/vesselService";
import CoverImage from "../components/CoverImage";
import ReadinessGauge from "../components/ReadinessGauge";
import StatusBadge from "../components/StatusBadge";
import PageHeader from "../components/PageHeader";
import Icon from "../components/Icon";
import ErrorState from "../components/ErrorState";
import { VesselGridSkeleton } from "../components/PageSkeletons";

export default function FleetPage() {
  const [vessels, setVessels] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    getFleetVessels()
      .then((list) => {
        if (active) setVessels(list);
      })
      .catch((error) => {
        if (active) setError(error.message || "Não foi possível carregar a frota.");
      })
      .finally(() => {
        if (active) setIsLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  if (isLoading) {
    return <VesselGridSkeleton count={3} />;
  }

  if (error) {
    return <ErrorState title="Não foi possível carregar a frota" message={error} />;
  }

  return (
    <div>
      <PageHeader
        eyebrow="Minha frota"
        title="Embarcações"
        subtitle="Acompanhe as embarcações cadastradas e seus dados de operação."
        actions={
          <Link className="btn btn--ghost" to="/fleet/new">
            <Icon name="plus" size={17} />
            Nova embarcação
          </Link>
        }
      />

      {vessels.length === 0 ? (
        <div className="card card--padding">
          <p className="page-header__subtitle">
            Nenhuma embarcação cadastrada. Comece pela primeira da sua frota.
          </p>
        </div>
      ) : (
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
      )}
    </div>
  );
}

import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import PageHeader from "../components/PageHeader";
import StatusBadge from "../components/StatusBadge";
import Icon from "../components/Icon";
import { getTrips } from "../services/tripService";
import { getVesselProfile } from "../services/tripService";

export default function TripsPage() {
  const [trips, setTrips] = useState([]);
  const [profiles, setProfiles] = useState({});

  useEffect(() => {
    getTrips().then(async (list) => {
      setTrips(list);
      const map = {};
      for (const trip of list) {
        map[trip.vesselId] = (await getVesselProfile(trip.vesselId)).vessel;
      }
      setProfiles(map);
    });
  }, []);

  const active = trips.filter((trip) => trip.status !== "Rascunho");
  const drafts = trips.filter((trip) => trip.status === "Rascunho");

  return (
    <div>
      <PageHeader
        eyebrow="Planejamento de rotas"
        title="Viagens"
        subtitle="Da rota no mapa ao itinerário por dia, com marinas conectadas, POIs e preparação da tripulação."
        actions={
          <Link className="btn btn--primary" to="/trips/new">
            <Icon name="plus" size={17} />
            Planejar nova viagem
          </Link>
        }
      />

      <section className="card card--padding" style={{ marginTop: 4 }}>
        <div className="section-title">
          <h2>Próximas viagens</h2>
        </div>
        {active.length === 0 ? (
          <p className="page-header__subtitle">
            Nenhuma viagem planejada ainda. Planeje uma rota para explorar o ecossistema.
          </p>
        ) : (
          active.map((trip) => {
            const vessel = profiles[trip.vesselId];
            return (
              <Link to={`/trips/${trip.id}`} className="mnt" key={trip.id}>
                <span className="mnt__icon">
                  <Icon name="locationPin" size={19} />
                </span>
                <div>
                  <p className="mnt__title">{trip.title}</p>
                  <p className="mnt__meta">
                    <span>
                      {trip.summary}
                    </span>
                    <StatusBadge label={trip.status} tone={trip.statusTone} />
                  </p>
                  <p className="mnt__meta">
                    <span>
                      {trip.startDate} → {trip.endDate} · {trip.totalDistanceNm} nm ·{" "}
                      {trip.totalHours}
                      {vessel ? ` · ${vessel.name}` : ""}
                    </span>
                  </p>
                </div>
                <span className="mnt__views">{trip.views} visualizações</span>
              </Link>
            );
          })
        )}
      </section>

      {drafts.length > 0 && (
        <section className="card card--padding" style={{ marginTop: 20 }}>
          <div className="section-title">
            <h2>Rascunhos</h2>
          </div>
          {drafts.map((trip) => {
            const vessel = profiles[trip.vesselId];
            return (
              <Link to={`/trips/${trip.id}`} className="mnt" key={trip.id}>
                <span className="mnt__icon">
                  <Icon name="doc" size={19} />
                </span>
                <div>
                  <p className="mnt__title">{trip.title}</p>
                  <p className="mnt__meta">
                    <span>
                      {trip.startDate} · {trip.totalDistanceNm} nm ·{" "}
                      {vessel ? vessel.name : "Embarcação"}
                    </span>
                    <StatusBadge label="Rascunho" tone="neutral" />
                  </p>
                </div>
              </Link>
            );
          })}
        </section>
      )}

      <section className="card" style={{ marginTop: 20 }}>
        <EcosystemHint />
      </section>
    </div>
  );
}

function EcosystemHint() {
  return (
    <div className="card--padding">
      <div className="section-title">
        <h2>Como o ecossistema se conecta</h2>
      </div>
      <p className="page-header__subtitle">
        A embarcação escolhida define a rota; a rota sugere marinas e prestadores; a
        tripulação necessária gera oportunidades de trabalho para a comunidade; e a
        experiência publicada inspira novas viagens.
      </p>
    </div>
  );
}
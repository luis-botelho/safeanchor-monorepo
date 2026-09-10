import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";

import PageHeader, { BackLink } from "../components/PageHeader";
import StatusBadge from "../components/StatusBadge";
import Icon from "../components/Icon";
import TripMap from "../components/TripMap";
import Avatar from "../components/Avatar";

import {
  getTripById,
  getVesselProfile,
  getDestinationById,
  getReadiness,
  getFloatPlan,
} from "../services/tripService";
import { addTripPost } from "../services/communityService";

export default function TripDetailPage() {
  const { id } = useParams();
  const [trip, setTrip] = useState(null);
  const [vessel, setVessel] = useState(null);
  const [shared, setShared] = useState(false);
  const [props, setProps] = useState(null);

  useEffect(() => {
    getTripById(id).then(async (data) => {
      setTrip(data);
      if (data) {
        const profile = await getVesselProfile(data.vesselId);
        setVessel(profile.vessel);
      }
    });
  }, [id]);

  useEffect(() => {
    Promise.all([getReadiness(), getFloatPlan()]).then(([r, f]) => {
      setProps({ readiness: r, floatPlan: f });
    });
  }, []);

  const stops = useMemo(() => (trip ? trip.stops.map(getDestinationById) : []), [trip]);

  if (!trip) {
    return <p>Carregando viagem...</p>;
  }

  function handleShare() {
    addTripPost(trip);
    setShared(true);
  }

  return (
    <div>
      <BackLink to="/trips" label="Voltar para viagens" />
      <PageHeader
        eyebrow="Plano de viagem"
        title={trip.title}
        subtitle={trip.summary}
        actions={
          <>
            <StatusBadge label={trip.status} tone={trip.statusTone} />
            <button
              className={`btn ${shared ? "btn--ghost" : "btn--primary"}`}
              type="button"
              onClick={handleShare}
            >
              <Icon name="message" size={16} />
              {shared ? "Compartilhada na comunidade" : "Compartilhar na comunidade"}
            </button>
          </>
        }
      />

      <div className="grid grid--stack">
        <div className="stack">
          <section className="card card--padding">
            <div className="section-title">
              <h2>Resumo</h2>
              <Link className="section-title__link" to="/trips">
                Editar no planejador
              </Link>
            </div>
            <div className="plan-stats">
              <div className="plan-stat">
                <strong>{trip.startDate} → {trip.endDate}</strong>
                <span>Datas</span>
              </div>
              <div className="plan-stat">
                <strong>{trip.totalDistanceNm} nm</strong>
                <span>Distancia total</span>
              </div>
              <div className="plan-stat">
                <strong>{trip.totalHours}</strong>
                <span>Tempo de navegacao</span>
              </div>
              <div className="plan-stat">
                <strong>{stops.length}</strong>
                <span>Paradas</span>
              </div>
            </div>
            <div className="mnt" style={{ marginTop: 12 }}>
              <span className="mnt__icon">
                <Icon name="boat" size={19} />
              </span>
              <div>
                <p className="mnt__title">{vessel ? vessel.name : "Embarcação"}</p>
                <p className="mnt__meta">
                  <span>
                    {vessel ? `${vessel.type} · ${vessel.length} pés` : ""}
                  </span>
                  <StatusBadge label={vessel ? `prontidão ${vessel.readiness}%` : ""} tone="success" />
                </p>
              </div>
            </div>
          </section>

          <section className="card card--padding">
            <div className="section-title">
              <h2>Rota no mapa</h2>
              <Link className="section-title__link" to="/boat-rentals">Alugue uma embarcação para esta rota</Link>
            </div>
            <TripMap points={trip.waypoints} label={trip.routeName} />
          </section>

          <section className="card card--padding">
            <div className="section-title">
              <h2>Itinerário dia a dia</h2>
            </div>
            {trip.itinerary.map((day) => (
              <div className="itinerary" key={day.day}>
                <div className="itinerary__head">
                  <span className="itinerary__day">Dia {day.day}</span>
                  <strong>{day.title}</strong>
                  <span className="itinerary__meta">
                    {day.distance} · {day.eta} · saída {day.start}
                  </span>
                </div>
                <p className="itinerary__stop">
                  <Icon name="anchor" size={14} /> {day.stop} · {day.marina}
                </p>
                <p className="itinerary__notes">{day.notes}</p>
              </div>
            ))}
            {trip.itinerary.length === 0 && (
              <p className="page-header__subtitle">Itinerário ainda não gerado (rascunho).</p>
            )}
          </section>

          <section className="card card--padding">
            <div className="section-title">
              <h2>Crew necessária</h2>
            </div>
            {trip.crew.needed.length === 0 && trip.crew.selected.length === 0 ? (
              <p className="page-header__subtitle">Nenhuma tripulação definida.</p>
            ) : (
              <>
                {trip.crew.needed.map((item) => (
                  <div className="mnt mnt--column" key={`${item.role}-needed`}>
                    <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
                      <span className="mnt__icon">
                        <Icon name="users" size={18} />
                      </span>
                      <div>
                        <p className="mnt__title">{item.role}</p>
                        <p className="mnt__meta">
                          <span>{item.required} vaga(s)</span>
                          <StatusBadge label={`${item.selected} confirmada(s)`} tone={item.selected > 0 ? "success" : "warning"} />
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
                {trip.crew.selected.map((item) => (
                  <div className="mnt mnt--column" key={`${item.role}-selected`}>
                    <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
                      <span className="mnt__icon">
                        <Avatar initials="LB" size={28} />
                      </span>
                      <div>
                        <p className="mnt__title">{item.person}</p>
                        <p className="mnt__meta">
                          <span>{item.role}</span>
                          <StatusBadge label={item.status} tone="success" />
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </>
            )}
          </section>
        </div>

        <div className="stack">
          <section className="card card--padding">
            <div className="section-title">
              <h2>Marinas e paradas</h2>
            </div>
            {stops.map((dest) =>
              dest ? (
                <div className="mnt mnt--column" key={dest.id}>
                  <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
                    <span className="mnt__icon">
                      <Icon name="anchor" size={18} />
                    </span>
                    <div>
                      <p className="mnt__title">{dest.name}</p>
                      <p className="mnt__meta">
                        <span>{dest.marina.name}</span>
                        <StatusBadge
                          label={dest.marina.registered ? "Cadastrada" : "Local"}
                          tone={dest.marina.registered ? "success" : "warning"}
                        />
                      </p>
                      {dest.marina.registered && (
                        <Link className="section-title__link" to={`/marinas/${dest.marina.marinaId}`}>
                          Ver marina
                        </Link>
                      )}
                    </div>
                  </div>
                </div>
              ) : null,
            )}
          </section>

          <section className="card card--padding">
            <div className="section-title">
              <h2>Prontidão da viagem</h2>
            </div>
            {props &&
              props.readiness.map((section) => (
                <div className="readiness readiness--compact" key={section.id}>
                  <div className="readiness__head">
                    <Icon name={section.icon} size={15} />
                    <strong>{section.title}</strong>
                    <span className="readiness__count">
                      {section.items.filter((item) => item.status === "ok").length}/{section.items.length}
                    </span>
                  </div>
                </div>
              ))}
          </section>

          <section className="card card--padding">
            <div className="section-title">
              <h2>Float plan</h2>
            </div>
            {props && props.floatPlan && (
              <div className="float-plan float-plan--border">
                <div>
                  <span className="itinerary__label">A bordo</span>
                  <span>{props.floatPlan.onboard.join(", ")}</span>
                </div>
                <div>
                  <span className="itinerary__label">Rota</span>
                  <span>{props.floatPlan.route}</span>
                </div>
                <div>
                  <span className="itinerary__label">Contato em terra</span>
                  <span>{props.floatPlan.landContact}</span>
                </div>
              </div>
            )}
          </section>

          {trip.requests.length > 0 && (
            <section className="card card--padding">
              <div className="section-title">
                <h2>Solicitações da viagem</h2>
              </div>
              {trip.requests.map((request) => (
                <div className="mnt mnt--column" key={request.id}>
                  <p className="mnt__title">{request.role}</p>
                  <p className="mnt__meta">
                    {request.duration} · {request.location} · {request.value}
                  </p>
                  <StatusBadge label={request.status} tone="info" />
                </div>
              ))}
            </section>
          )}

          <section className="card card--padding">
            <div className="section-title">
              <h2>Comunidade da viagem</h2>
              <span className="badge badge--accent">{trip.shares} compartilhamentos</span>
            </div>
            <p className="page-header__subtitle">
              Publicar a viagem na comunidade cria um post ligado a este plano.
              {trip.communityPostId ? " Já publicado." : ""}
            </p>
            {shared && (
              <div className="ai-thread">
                <strong>Publicado!</strong>
                <p>O post "{trip.title}" apareceu na comunidade, na categoria Viagens.</p>
              </div>
            )}
          </section>
        </div>
      </div>

      <section className="card card--padding" style={{ marginTop: 20 }}>
        <div className="ai-banner">
          <span className="ai-banner__icon"><Icon name="star" size={20} /></span>
          <div>
            <strong>SafeAnchor IA · sugestão desta viagem</strong>
            <p>{trip.aiSuggestion}</p>
          </div>
        </div>
      </section>
    </div>
  );
}
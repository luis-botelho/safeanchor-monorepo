import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import PageHeader, { BackLink } from "../components/PageHeader";
import Icon from "../components/Icon";
import StatusBadge from "../components/StatusBadge";
import TripMap from "../components/TripMap";

import { getVesselsByOwner } from "../services/vesselService";
import {
  getVesselProfile,
  buildItinerary,
  createTrip,
  getCrewRoles,
  getReadiness,
  getFloatPlan,
} from "../services/tripService";
import { destinations, poiCategories } from "../mock/destinations";
import { ownerAi } from "../mock/ai";

const STEPS = [
  { id: "vessel", label: "Embarcação" },
  { id: "route", label: "Rota" },
  { id: "marinas", label: "Marinas" },
  { id: "pois", label: "POIs" },
  { id: "itinerary", label: "Itinerário" },
  { id: "readiness", label: "Prontidão" },
  { id: "crew", label: "Crew" },
  { id: "requests", label: "Solicitações" },
  { id: "ai", label: "IA" },
];

export default function TripPlannerPage() {
  const navigate = useNavigate();
  const [vessels, setVessels] = useState([]);
  const [stepIndex, setStepIndex] = useState(0);
  const [vesselId, setVesselId] = useState("ves-horizonte");
  const [stops, setStops] = useState(["dst-angra", "dst-ilha-grande", "dst-paraty", "dst-trindade"]);
  const [poiCategory, setPoiCategory] = useState("Todas");
  const [confirmed, setConfirmed] = useState(false);

  useEffect(() => {
    getVesselsByOwner("usr-luis").then((list) => {
      setVessels(list);
      if (list.length > 0 && !list.some((v) => v.id === vesselId)) {
        setVesselId(list[0].id);
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const [profile, setProfile] = useState(null);
  useEffect(() => {
    if (!vesselId) return;
    getVesselProfile(vesselId).then(setProfile);
  }, [vesselId]);

  const itinerary = useMemo(
    () => buildItinerary(stops, vesselId),
    [stops, vesselId],
  );
  const waypoints = useMemo(() => {
    const list = [
      { id: "wp-start", label: "Saída", coords: { x: 8, y: 88 }, kind: "start" },
    ];
    stops.forEach((stopId, index) => {
      const dest = destinations.find((item) => item.id === stopId);
      if (dest) {
        list.push({
          id: `wp-${stopId}`,
          label: dest.name.split(" ")[0],
          coords: dest.coords,
          kind: index === stops.length - 1 ? "dest" : "stop",
        });
      }
    });
    return list;
  }, [stops]);

  const poisForMap = useMemo(() => {
    return stops.flatMap((stopId, index) => {
      const dest = destinations.find((d) => d.id === stopId);
      if (!dest) return [];
      return dest.pois.slice(0, 3).map((poi, poiIndex) => ({
        id: `${stopId}-${poi.id}`,
        x: dest.coords.x + poiIndex * 3 - 3,
        y: dest.coords.y + (poiIndex % 2) * 3 + 2,
        category: poi.category,
        label: poi.name,
      }));
    });
  }, [stops]);

  const activeDestinations = stops.map((stopId) =>
    destinations.find((d) => d.id === stopId),
  );

  const totalDistance = itinerary.reduce((sum, day) => {
    const n = parseInt(day.distance, 10);
    return sum + (Number.isNaN(n) ? 0 : n);
  }, 0);

  async function handleFinish() {
    setConfirmed(true);
    await new Promise((resolve) => setTimeout(resolve, 700));
    const trip = createTrip({
      vesselId,
      title: "Nova rota na Costa Verde",
      startDate: "12/09/2026",
      endDate: "16/09/2026",
      routeName: "Costa Verde",
      summary: `Rota planejada com ${stops.length} paradas e ${totalDistance} nm de extensão total, incluindo marinas conectadas e POIs filtrados.`,
      stops,
      waypoints,
      totalDistanceNm: totalDistance,
      totalHours: `${Math.max(4, Math.round(totalDistance / 12))}h`,
      legs: [],
      itinerary,
      crew: { needed: [], selected: [] },
      requests: [],
      aiSuggestion: ownerAi.insights[0].preview,
    });
    navigate(`/trips/${trip.id}`);
  }

  const step = STEPS[stepIndex];

  return (
    <div>
      <BackLink to="/trips" label="Voltar para viagens" />

      <PageHeader
        eyebrow="Novo planejamento"
        title="Planejador de viagem"
        subtitle="Escolha a embarcação, desenhe a rota no mapa e prepare a tripulação — cada etapa mostra uma parte do ecossistema SafeAnchor."
      />

      <div className="wizard">
        <nav className="wizard__steps" aria-label="Etapas do planejador">
          {STEPS.map((item, index) => (
            <button
              type="button"
              key={item.id}
              className={`wizard__step ${
                index === stepIndex
                  ? "wizard__step--active"
                  : index < stepIndex
                    ? "wizard__step--done"
                    : ""
              }`}
              onClick={() =>
                (index < stepIndex || confirmStepLeave()) && setStepIndex(index)
              }
            >
              <span className="wizard__number">
                {index < stepIndex ? <Icon name="check" size={13} /> : index + 1}
              </span>
              {item.label}
            </button>
          ))}
        </nav>

        <section className="card card--padding wizard__body">
          <div className="wizard__title">
            <h2>{step.label}</h2>
            <span className="wizard__position">
              Passo {stepIndex + 1} de {STEPS.length}
            </span>
          </div>

          {stepIndex === 0 && (
            <div className="stack">
              <p className="page-header__subtitle">
                Qual embarcação vai viajar? O perfil dela define autonomia,
                velocidade de cruzeiro e capacidade da tripulação.
              </p>
              {profile && (
                <div className="mnt">
                  <span className="mnt__icon">
                    <Icon name="fleet" size={19} />
                  </span>
                  <div>
                    <p className="mnt__title">{profile.vessel?.name}</p>
                    <p className="mnt__meta">
                      <span>
                        {profile.des} · cruzeiro {profile.spec?.cruiseSpeedKt} kt
                      </span>
                    </p>
                  </div>
                  <div className="mnt__due">
                    <span className="mnt__due-date">{profile.spec?.autonomyNm} nm</span>
                    <span className="mnt__due-label">autonomia</span>
                  </div>
                  <div className="mnt__due">
                    <span className="mnt__due-date">{profile.spec?.capacity} pess.</span>
                    <span className="mnt__due-label">capacidade</span>
                  </div>
                </div>
              )}
              <div className="grid grid--2">
                {vessels.map((v) => (
                  <label
                    className={`select-card ${v.id === vesselId ? "select-card--checked" : ""}`}
                    key={v.id}
                  >
                    <input
                      type="radio"
                      name="vessel"
                      value={v.id}
                      checked={vesselId === v.id}
                      onChange={() => setVesselId(v.id)}
                    />
                    <span className="select-card__icon">
                      <Icon name="boat" size={18} />
                    </span>
                    <span>
                      <strong className="select-card__title">{v.name}</strong>
                      <span className="select-card__meta">
                        {v.type} · {v.length} pés · prontidão {v.readiness}%
                      </span>
                    </span>
                    {v.id === vesselId && (
                      <StatusBadge label="Selecionada" tone="accent" />
                    )}
                  </label>
                ))}
              </div>
            </div>
          )}

          {stepIndex === 1 && (
            <div className="stack">
              <p className="page-header__subtitle">
                Marque ou desmarque as paradas da rota. O mapa abaixo é a camada
                demonstrativa e pode ser substituída por um provider geográfico real.
              </p>
              <TripMap points={waypoints} pois={poisForMap} />
              <div className="grid grid--2">
                {destinations.map((dest) => {
                  const active = stops.includes(dest.id);
                  return (
                    <button
                      type="button"
                      key={dest.id}
                      className={`select-card select-card--button ${
                        active ? "select-card--checked" : ""
                      }`}
                      onClick={() =>
                        setStops((prev) =>
                          active
                            ? prev.filter((id) => id !== dest.id)
                            : [...prev, dest.id],
                        )
                      }
                    >
                      <span className="select-card__icon">
                        <Icon name="locationPin" size={18} />
                      </span>
                      <span>
                        <strong className="select-card__title">{dest.name}</strong>
                        <span className="select-card__meta">{dest.region}</span>
                      </span>
                      <StatusBadge label={active ? "Na rota" : "Adicionar"} tone={active ? "accent" : "neutral"} />
                    </button>
                  );
                })}
              </div>
              <p className="page-header__subtitle">
                Extensão total estimada: <strong>{totalDistance} nm</strong> com{" "}
                {stops.length} paradas.
              </p>
            </div>
          )}

          {stepIndex === 2 && (
            <div className="stack">
              <p className="page-header__subtitle">
                Marinas e paradas da rota: cadastradas no SafeAnchor abrem reserva e
                serviços; não cadastradas geram uma solicitação de contato.
              </p>
              {activeDestinations.map((dest) => (
                <div className="mnt mnt--column" key={dest.id}>
                  <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
                    <span className="mnt__icon">
                      <Icon name="anchor" size={19} />
                    </span>
                    <div>
                      <p className="mnt__title">{dest.name}</p>
                      <p className="mnt__meta">
                        <span>{dest.marina.name}</span>
                        <StatusBadge
                          label={dest.marina.registered ? "Cadastrada" : "Marina local"}
                          tone={dest.marina.registered ? "success" : "warning"}
                        />
                      </p>
                    </div>
                  </div>
                  <div className="wizard__meta-row">
                    <span>Vagas: <strong>{dest.marina.availability}</strong></span>
                    {dest.marina.contact && (
                      <span className="mnt__meta">
                        {dest.marina.contact.phone} · {dest.marina.contact.email}
                      </span>
                    )}
                  </div>
                  <div className="tags">
                    {dest.marina.services.map((service) => (
                      <span className="tag" key={service}>{service}</span>
                    ))}
                  </div>
                  <div className="form-actions">
                    {dest.marina.registered ? (
                      <button className="btn btn--ghost" type="button">
                        <Icon name="calendar" size={16} />
                        Reservar vaga (demo)
                      </button>
                    ) : (
                      <button className="btn btn--ghost" type="button">
                        <Icon name="send" size={16} />
                        Solicitar contato local
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

          {stepIndex === 3 && (
            <div className="stack">
              <p className="page-header__subtitle">
                Pontos de interesse nas paradas, filtráveis por categoria. POIs
                marcados aparecem também na rota do mapa.
              </p>
              <div className="tags">
                {["Todas", ...poiCategories].map((category) => (
                  <button
                    type="button"
                    className={`tag ${
                      poiCategory === category ? "tag--active" : ""
                    }`}
                    key={category}
                    onClick={() => setPoiCategory(category)}
                  >
                    {category}
                  </button>
                ))}
              </div>

              <div className="grid grid--3">
                {activeDestinations.map((dest) => {
                  const pois = dest.pois.filter(
                    (poi) => poiCategory === "Todas" || poi.category === poiCategory,
                  );
                  if (pois.length === 0) return null;
                  return (
                    <section className="poi-card" key={dest.id}>
                      <span className="poi-card__head">
                        <Icon name="locationPin" size={15} />
                        {dest.name}
                      </span>
                      {pois.map((poi) => (
                        <div className="poi-card__item" key={poi.id}>
                          <span className="poi-card__category">{poi.category}</span>
                          <span>{poi.name}</span>
                        </div>
                      ))}
                    </section>
                  );
                })}
              </div>
            </div>
          )}

          {stepIndex === 4 && (
            <ItineraryStep itinerary={itinerary} />
          )}

          {stepIndex === 5 && (
            <ReadinessStep />
          )}

          {stepIndex === 6 && (
            <CrewStep />
          )}

          {stepIndex === 7 && (
            <RequestsStep />
          )}

          {stepIndex === 8 && (
            <AiStep totalDistance={totalDistance} />
          )}
        </section>

        {confirmed && (
          <div className="wizard__done">
            <Icon name="check" size={18} />
            Viagem criada! Redirecionando para o plano completo...
          </div>
        )}
      </div>

      <div className="form-actions" style={{ marginTop: 16 }}>
        <button
          className="btn btn--ghost"
          type="button"
          disabled={stepIndex === 0}
          onClick={() => setStepIndex((s) => Math.max(0, s - 1))}
        >
          Voltar
        </button>
        {stepIndex < STEPS.length - 1 ? (
          <button className="btn btn--primary" type="button" onClick={() => setStepIndex((s) => s + 1)}>
            Continuar
          </button>
        ) : (
          <button className="btn btn--primary" type="button" onClick={handleFinish}>
            <Icon name="plus" size={17} />
            Criar viagem
          </button>
        )}
      </div>
    </div>
  );
}

function confirmStepLeave() {
  return false;
}

function ItineraryStep({ itinerary }) {
  return (
    <div className="stack">
      <p className="page-header__subtitle">
        Itinerário dia a dia gerado a partir das paradas selecionadas.
      </p>
      {itinerary.map((day) => (
        <div className="itinerary" key={day.day}>
          <div className="itinerary__head">
            <span className="itinerary__day">Dia {day.day}</span>
            <strong>{day.title}</strong>
            <span className="itinerary__meta">
              {day.distance} · {day.eta} · saída {day.start}
            </span>
          </div>
          <div className="itinerary__grid">
            <div className="itinerary__col">
              <span className="itinerary__label">Atividades</span>
              {day.activities.map((a) => <span className="tag" key={a}>{a}</span>)}
            </div>
            <div className="itinerary__col">
              <span className="itinerary__label">Restaurantes</span>
              {day.restaurants.join(" · ") || "—"}
            </div>
            <div className="itinerary__col">
              <span className="itinerary__label">Hospedagem</span>
              <span>{day.lodging.join(" · ")}</span>
            </div>
            <div className="itinerary__col">
              <span className="itinerary__label">Serviços</span>
              {day.services.join(" · ") || "—"}
            </div>
          </div>
          <p className="itinerary__notes">{day.notes}</p>
        </div>
      ))}
    </div>
  );
}

function ReadinessStep() {
  const [sections, setSections] = useState([]);
  const [floatPlan, setFloatPlan] = useState(null);

  useEffect(() => {
    getReadiness().then((list) =>
      setSections(
        list.map((section) => ({
          ...section,
          items: section.items.map((item) => ({ ...item, checked: item.status === "ok" })),
        })),
      ),
    );
    getFloatPlan().then(setFloatPlan);
  }, []);

  function toggleItem(sectionId, itemIndex) {
    setSections((prev) =>
      prev.map((section) =>
        section.id !== sectionId
          ? section
          : {
              ...section,
              items: section.items.map((item, i) =>
                i === itemIndex ? { ...item, checked: !item.checked } : item,
              ),
            },
      ),
    );
  }

  return (
    <div className="stack">
      <p className="page-header__subtitle">
        Pré-checklist da viagem. Itens sem <StatusBadge label="ok" tone="success" /> já
        vinham em atenção; confirme cada item conforme a preparação.
      </p>
      {sections.map((section) => (
        <div className="readiness" key={section.id}>
          <div className="readiness__head">
            <Icon name={section.icon} size={17} />
            <strong>{section.title}</strong>
            <span className="readiness__count">
              {section.items.filter((item) => item.checked).length}/{section.items.length}
            </span>
          </div>
          {section.items.map((item, index) => (
            <label className="readiness__item" key={item.label}>
              <input
                type="checkbox"
                checked={item.checked}
                onChange={() => toggleItem(section.id, index)}
              />
              <span>
                <span className="readiness__label">{item.label}</span>
                <span className={`readiness__note readiness__note--${item.status}`}>
                  {item.note}
                </span>
              </span>
            </label>
          ))}
        </div>
      ))}

      {floatPlan && (
        <div className="float-plan">
          <div className="readiness__head">
            <Icon name="doc" size={17} />
            <strong>Float plan (plano de viagem)</strong>
          </div>
          <div className="float-plan__grid">
            <div>
              <span className="itinerary__label">A bordo</span>
              <span>{floatPlan.onboard.join(", ")}</span>
            </div>
            <div>
              <span className="itinerary__label">Origem</span>
              <span>{floatPlan.origin}</span>
            </div>
            <div>
              <span className="itinerary__label">Destino</span>
              <span>{floatPlan.destination}</span>
            </div>
            <div>
              <span className="itinerary__label">Rota</span>
              <span>{floatPlan.route}</span>
            </div>
            <div>
              <span className="itinerary__label">Retorno previsto</span>
              <span>{floatPlan.returnForecast}</span>
            </div>
            <div>
              <span className="itinerary__label">Contato em terra</span>
              <span>{floatPlan.landContact}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function CrewStep() {
  const [roles, setRoles] = useState([]);

  useEffect(() => {
    getCrewRoles().then((list) =>
      setRoles(list.slice(0, 5).map((role) => ({ ...role, needed: false, people: 1 }))),
    );
  }, []);

  function toggleNeeded(index) {
    setRoles((prev) =>
      prev.map((role, i) =>
        i === index ? { ...role, needed: !role.needed, people: role.needed ? 1 : role.people } : role,
      ),
    );
  }

  return (
    <div className="stack">
      <p className="page-header__subtitle">
        Defina a tripulação necessária. Cada vaga aprovada gera oportunidades de
        servico que aparecem para prestadores na seção <em>Oportunidades</em>.
      </p>
      {roles.map((role, index) => (
        <div className="crew-row" key={role.role}>
          <span className="crew-row__icon">
            <Icon name={role.icon} size={18} />
          </span>
          <div className="crew-row__main">
            <strong>{role.role}</strong>
            <span className="mnt__meta">{role.skill}</span>
          </div>
          <button
            type="button"
            className={`btn ${role.needed ? "btn--primary" : "btn--ghost"}`}
            onClick={() => toggleNeeded(index)}
          >
            {role.needed ? "Necessário" : "Necessário?"}
          </button>
        </div>
      ))}
    </div>
  );
}

function RequestsStep() {
  const [sent, setSent] = useState(false);
  const [role, setRole] = useState("Marinheiro");
  const [message, setMessage] = useState(
    "Preciso de apoio para manobras e fundeio durante a Costa Verde (4 dias).",
  );

  return (
    <div className="stack">
      <p className="page-header__subtitle">
        Solicite tripulacao ou servico de bordo. A solicitação entra no fluxo de
        serviços (timeline) e os prestadores compatíveis são notificados.
      </p>
      <div className="field">
        <label className="field__label" htmlFor="req-role">
          Função
        </label>
        <select
          id="req-role"
          className="input"
          value={role}
          onChange={(e) => setRole(e.target.value)}
        >
          {["Marinheiro", "Capitão local", "Chef", "Fotógrafo", "Guia turístico"].map((r) => (
            <option key={r}>{r}</option>
          ))}
        </select>
      </div>
      <div className="field">
        <label className="field__label" htmlFor="req-msg">
          Detalhes
        </label>
        <textarea
          id="req-msg"
          className="input"
          rows={3}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
      </div>
      <div className="form-actions">
        {sent ? (
          <StatusBadge label="Solicitação enviada ao ecossistema" tone="success" />
        ) : (
          <button className="btn btn--primary" type="button" onClick={() => setSent(true)}>
            <Icon name="send" size={16} />
            Enviar solicitação
          </button>
        )}
      </div>
    </div>
  );
}

function AiStep({ totalDistance }) {
  const [visible, setVisible] = useState(false);

  return (
    <div className="stack">
      <p className="page-header__subtitle">
        Conselhos do SafeAnchor IA para fechar o planejamento. As respostas são
        demonstrativas — nenhuma chamada externa de IA é feita.
      </p>
      <div className="ai-banner">
        <span className="ai-banner__icon"><Icon name="star" size={20} /></span>
        <div>
          <strong>{ownerAi.insights[0].title}</strong>
          <p>{ownerAi.insights[0].preview}</p>
        </div>
      </div>
      <div className="ai-banner">
        <span className="ai-banner__icon"><Icon name="users" size={20} /></span>
        <div>
          <strong>{ownerAi.insights[2].title}</strong>
          <p>{ownerAi.insights[2].preview}</p>
        </div>
      </div>
      <div className="ai-banner">
        <span className="ai-banner__icon"><Icon name="locationPin" size={20} /></span>
        <div>
          <strong>Resumo do plano</strong>
          <p>
            {totalDistance} nm, {ownerAi.insights[1].preview}
          </p>
        </div>
      </div>
      <div className="form-actions">
        <button
          className={`btn ${visible ? "btn--ghost" : "btn--primary"}`}
          type="button"
          onClick={() => setVisible((v) => !v)}
        >
          {visible ? "Ocultar revisão" : "Revisar com IA"}
        </button>
      </div>
      {visible && (
        <div className="ai-thread">
          <p>
            <strong>SafeAnchor IA:</strong> analisei {totalDistance} nm, {` `}
            possíveis paradas e a disponibilidade local. Recomendo manter o
            trecho mais longo no início da viagem e antecipar a reserva do píer
            na Paraty Yacht Marina. As solicitações de tripulação já estão
            listadas no painel de serviços.
          </p>
        </div>
      )}
    </div>
  );
}
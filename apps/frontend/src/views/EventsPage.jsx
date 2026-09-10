import { useEffect, useState } from "react";

import { getEvents, getEventTypes } from "../services/eventService";
import PageHeader from "../components/PageHeader";
import StatusBadge from "../components/StatusBadge";
import Icon from "../components/Icon";

export default function EventsPage() {
  const [events, setEvents] = useState([]);
  const [types, setTypes] = useState([]);
  const [type, setType] = useState("Todos");
  const [joined, setJoined] = useState([]);

  useEffect(() => {
    setTypes(getEventTypes());
  }, []);

  useEffect(() => {
    getEvents().then(setEvents);
  }, []);

  function join(eventId) {
    setJoined((current) => [...current, eventId]);
  }

  const visible = events.filter(
    (event) => type === "Todos" || event.type === type,
  );

  return (
    <div>
      <PageHeader
        eyebrow="Agenda náutica"
        title="Eventos"
        subtitle="Regatas, encontros, cursos e feiras para a comunidade náutica do Sul do Brasil."
      />

      <div className="filters">
        <div className="field">
          <label className="field__label" htmlFor="event-type">
            Tipo de evento
          </label>
          <select
            id="event-type"
            className="select"
            value={type}
            onChange={(event) => setType(event.target.value)}
          >
            {["Todos", ...types].map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
        </div>
      </div>

      <section className="card">
        {visible.length === 0 ? (
          <div className="card--padding">
            <p className="page-header__subtitle">Nenhum evento neste filtro.</p>
          </div>
        ) : (
          visible.map((event) => {
            const [day, month] = event.date.split("/");

            return (
              <div className="event-card" key={event.id}>
                <span className="event-card__date">
                  <span className="event-card__day">{day}</span>
                  <span className="event-card__month">{month}</span>
                </span>
                <div style={{ minWidth: 0 }}>
                  <div className="event-card__title">
                    {event.name}{" "}
                    <StatusBadge label={event.type} tone="accent" />
                  </div>
                  <p className="event-card__meta">
                    <span>{event.time}</span> · <span>{event.location}</span> ·{" "}
                    <span>{event.organizer}</span>
                  </p>
                  <p className="post__content" style={{ margin: "6px 0" }}>
                    {event.description}
                  </p>
                  <p className="event-card__meta">
                    <span>{event.participants}/{event.capacity} confirmados</span>
                    <span>·</span>
                    <span>{event.ticket}</span>
                  </p>
                  {joined.includes(event.id) ? (
                    <span className="btn btn--accent btn--sm">
                      <Icon name="check" size={16} />
                      Você confirmou presença
                    </span>
                  ) : (
                    <button
                      className="btn btn--primary btn--sm"
                      onClick={() => join(event.id)}
                    >
                      Confirmar presença
                    </button>
                  )}
                </div>
              </div>
            );
          })
        )}
      </section>
    </div>
  );
}
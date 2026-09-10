import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

import { getMarinaById } from "../services/marinaService";
import { getTeamByMarina } from "../services/teamService";
import { getCatalog } from "../services/marinaCatalogService";
import { BackLink } from "../components/PageHeader";
import CoverImage from "../components/CoverImage";
import Rating from "../components/Rating";
import StatusBadge from "../components/StatusBadge";
import Avatar from "../components/Avatar";
import Icon from "../components/Icon";
import StatCard from "../components/StatCard";

export default function MarinaDetailPage() {
  const { id } = useParams();
  const [marina, setMarina] = useState(null);
  const [team, setTeam] = useState([]);
  const [catalog, setCatalog] = useState([]);

  useEffect(() => {
    getMarinaById(id)
      .then(setMarina)
      .catch(() => setMarina(null));
  }, [id]);

  useEffect(() => {
    getTeamByMarina(id).then(setTeam).catch(() => setTeam([]));
    getCatalog().then(setCatalog).catch(() => setCatalog([]));
  }, [id]);

  if (!marina) {
    return <p>Carregando marina...</p>;
  }

  return (
    <div>
      <BackLink to="/marinas" label="Voltar para marinas" />

      <CoverImage
        seed={marina.imageSeed}
        hint={marina.name}
        className="vessel-hero__cover"
      />

      <div className="vessel-hero__main">
        <div>
          <h1 className="vessel-hero__title">{marina.name}</h1>
          <p className="vessel-hero__subtitle" style={{ marginTop: 4 }}>
            <Icon name="locationPin" size={15} /> {marina.address}
          </p>
          <p className="page-header__subtitle" style={{ marginTop: 12 }}>
            {marina.description}
          </p>
          <div className="provider-card__meta">
            <Rating value={marina.rating} size={17} />
            <span className="provider-card__role">
              {marina.reviewsCount} avaliações
            </span>
          </div>
        </div>
        <div className="vessel-hero__gauge" style={{ flexDirection: "column", alignItems: "flex-end" }}>
          <strong className="mnt__due-date">{marina.occupancyPercent}% ocupação</strong>
          <span className="mnt__due-label">
            {marina.availableBerths} vagas disponíveis de {marina.berths}
          </span>
        </div>
      </div>

      <nav className="subnav" style={{ marginTop: 18 }} aria-label="Áreas da marina">
        <Link className="subnav__item" to={`/marina/dashboard`}>
          Dashboard
        </Link>
        <Link className="subnav__item" to={`/marina/fleet`}>
          Frota
        </Link>
        <Link className="subnav__item" to={`/marina/team`}>
          Equipe
        </Link>
        <Link className="subnav__item" to={`/marina/services`}>
          Serviços
        </Link>
        <Link className="subnav__item" to={`/marina/services/catalog`}>
          Catálogo
        </Link>
      </nav>

      <div className="grid grid--2" style={{ marginTop: 18 }}>
        <section className="card card--padding">
          <div className="section-title">
            <h2>Estrutura</h2>
          </div>
          <div className="tags">
            {(marina.structure || []).map((item) => (
              <span className="tag" key={item}>
                {item}
              </span>
            ))}
          </div>

          <div className="section-title" style={{ marginTop: 22 }}>
            <h2>Serviços oferecidos</h2>
          </div>
          <div className="tags">
            {(marina.services || []).map((item) => (
              <span className="tag" key={item}>
                {item}
              </span>
            ))}
          </div>

          {marina.contact && (
            <div className="detail-list" style={{ marginTop: 18 }}>
              <div className="detail-row">
                <span className="detail-row__label">Telefone</span>
                <span className="detail-row__value">{marina.contact.phone}</span>
              </div>
              <div className="detail-row">
                <span className="detail-row__label">E-mail</span>
                <span className="detail-row__value">{marina.contact.email}</span>
              </div>
              <div className="detail-row">
                <span className="detail-row__label">Horário</span>
                <span className="detail-row__value">{marina.contact.hours}</span>
              </div>
            </div>
          )}
        </section>

        <section className="card card--padding">
          <div className="section-title">
            <h2>Prestadores parceiros</h2>
          </div>
          {(marina.partnerProviders || []).length === 0 ? (
            <p className="page-header__subtitle">Sem parceiros vinculados.</p>
          ) : (
            (marina.partnerProviders || []).map((provider) => (
              <Link className="mnt" key={provider.id} to={`/service-providers/${provider.id}`}>
                <Avatar initials={provider.initials} size={38} />
                <div>
                  <p className="mnt__title">{provider.name}</p>
                  <p className="mnt__meta">
                    <span>{provider.company}</span> ·{" "}
                    <Rating value={provider.rating} size={13} />
                  </p>
                </div>
                <span className="mnt__due">
                  <StatusBadge
                    label={provider.availability}
                    tone={provider.availabilityTone}
                  />
                </span>
              </Link>
            ))
          )}
        </section>
      </div>

      {(marina.events || []).length > 0 && (
        <section className="card" style={{ marginTop: 18 }}>
          <div className="card--padding">
            <div className="section-title">
              <h2>Eventos na marina</h2>
            </div>
          </div>
          {(marina.events || []).map((event) => {
            const [day, month] = event.date.split("/");

            return (
              <Link className="event-card" key={event.id} to="/events">
                <span className="event-card__date">
                  <span className="event-card__day">{day}</span>
                  <span className="event-card__month">{month}</span>
                </span>
                <div>
                  <p className="event-card__title">{event.name}</p>
                  <p className="event-card__meta">
                    <span>{event.type}</span> · <span>{event.time}</span> ·{" "}
                    <span>{event.organizer}</span>
                  </p>
                </div>
              </Link>
            );
          })}
        </section>
      )}

      <div className="grid grid--stack" style={{ marginTop: 18 }}>
        <div className="stack">
          <section className="card">
            <div className="card--padding">
              <div className="section-title">
                <h2>Embarcações sob gestão</h2>
                <Link className="section-title__link" to="/marina/fleet">
                  Ver frota
                </Link>
              </div>
            </div>
            {(marina.clients || []).map((client) => (
              <div className="mnt" key={`${marina.id}-${client.boat}`}>
                <span className="mnt__icon">
                  <Icon name="boat" size={18} />
                </span>
                <div>
                  <p className="mnt__title">{client.boat}</p>
                  <p className="mnt__meta">
                    <span>{client.type}</span> · <span>{client.owner}</span>
                  </p>
                </div>
                <div className="mnt__due">
                  <span className="mnt__due-date">{client.berth}</span>
                  <span className="mnt__due-label">vaga</span>
                </div>
              </div>
            ))}
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
            {team.length === 0 ? (
              <p className="page-header__subtitle">
                Sem equipe cadastrada para esta marina.
              </p>
            ) : (
              team.map((member) => (
                <div className="mnt" key={member.id}>
                  <Avatar initials={member.initials} size={34} />
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
              ))
            )}
          </section>
        </div>

        <div className="stack">
          <section className="card card--padding">
            <div className="section-title">
              <h2>Serviços disponíveis</h2>
              <Link className="section-title__link" to="/marina/services/catalog">
                Ver catálogo
              </Link>
            </div>
            <div className="tags" style={{ marginTop: 10 }}>
              {catalog.slice(0, 8).map((service) => (
                <span className="tag" key={service.id}>
                  {service.name}
                </span>
              ))}
            </div>
            <div className="grid grid--2" style={{ marginTop: 16 }}>
              <StatCard
                label="Catálogo publicado"
                value={catalog.filter((service) => service.published).length}
                icon="shopping"
                tone="success"
              />
              <StatCard
                label="Serviços no total"
                value={catalog.length}
                icon="wrench"
                tone="primary"
              />
            </div>
          </section>

          <section className="card">
            <div className="card--padding">
              <div className="section-title">
                <h2>Avaliações</h2>
              </div>
            </div>
            {!marina.reviews || marina.reviews.length === 0 ? (
              <div className="card--padding">
                <p className="page-header__subtitle">
                  Nenhuma avaliação cadastrada.
                </p>
              </div>
            ) : (
              marina.reviews.map((review) => (
                <div className="mnt" key={`${marina.id}-${review.author}`}>
                  <Avatar initials={review.initials} size={34} />
                  <div>
                    <p className="mnt__title">{review.author}</p>
                    <p className="mnt__meta">
                      <Rating value={review.rating} size={13} /> ·{" "}
                      <span>{review.date}</span>
                    </p>
                    <p className="page-header__subtitle" style={{ marginTop: 4 }}>
                      {review.text}
                    </p>
                  </div>
                </div>
              ))
            )}
          </section>
        </div>
      </div>
    </div>
  );
}
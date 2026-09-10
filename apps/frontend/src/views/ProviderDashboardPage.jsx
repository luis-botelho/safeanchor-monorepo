import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import { useAuth } from "../context/AuthContext";
import { getProviderById } from "../services/providerService";
import { getRequestsByProvider } from "../services/requestService";
import PageHeader from "../components/PageHeader";
import StatusBadge from "../components/StatusBadge";
import Avatar from "../components/Avatar";
import Rating from "../components/Rating";
import StatCard from "../components/StatCard";
import Icon from "../components/Icon";

const requestStatusMeta = {
  "Aguardando orçamento": "info",
  "Em andamento": "warning",
  "Concluído": "success",
  "Cancelado": "neutral",
};

export default function ProviderDashboardPage() {
  const { user } = useAuth();
  const providerId = user?.providerId || "prov-carlos";

  const [provider, setProvider] = useState(null);
  const [requests, setRequests] = useState([]);

  useEffect(() => {
    getProviderById(providerId).then(setProvider);
    getRequestsByProvider(providerId).then(setRequests);
  }, [providerId]);

  if (!provider) {
    return <p>Carregando visão do prestador...</p>;
  }

  const pending = requests.filter((r) => r.status === "Aguardando orçamento");
  const active = requests.filter((r) => r.status === "Em andamento");
  const done = requests.filter((r) => r.status === "Concluído");

  return (
    <div>
      <PageHeader
        eyebrow="Visão do prestador"
        title={`Olá, ${user?.name}!`}
        subtitle={`${provider.company} · ${provider.role} · Atende em ${provider.area}`}
        actions={
          <>
            <Link className="btn btn--ghost" to={`/service-providers/${provider.id}`}>
              Ver perfil público
            </Link>
            <Link className="btn btn--primary" to="/jobs">
              Jobs & oportunidades
            </Link>
          </>
        }
      />

      <div className="grid grid--4" style={{ marginBottom: 20 }}>
        <StatCard
          label="Solicitações pendentes"
          value={pending.length}
          icon="send"
          tone="info"
          hint="aguardando orçamento"
        />
        <StatCard label="Em andamento" value={active.length} icon="wrench" tone="warning" />
        <StatCard label="Oportunidades em aberto" value="3" icon="users" tone="accent" hint="2 com match ideal" />
        <StatCard
          label="Avaliação média"
          value={provider.rating.toFixed(1)}
          icon="star"
          tone="success"
          hint={`${provider.reviewsCount} avaliações`}
        />
      </div>

      <div className="grid grid--stack">
        <div className="stack">
          <section className="card card--padding" style={{ marginBottom: 16 }}>
            <div className="ai-banner">
              <span className="ai-banner__icon"><Icon name="star" size={17} /></span>
              <div>
                <strong>SafeAnchor IA para o seu negócio</strong>
                <p>
                  Sugestão: priorize a preventiva Yamaha 2x200 (2 propostas, vencendo em
                  breve) — aprove agora para responder mais rápido e fechar o mês com folga.
                </p>
                <Link className="section-title__link" to="/provider/ai">
                  Perguntar à IA do prestador
                </Link>
              </div>
            </div>
          </section>

          <section className="card">
            <div className="card--padding">
              <div className="section-title">
                <h2>Solicitações recebidas</h2>
                <Link className="section-title__link" to="/service-requests">
                  Ver todas
                </Link>
              </div>
            </div>
            {pending.length + active.length === 0 ? (
              <div className="card--padding">
                <p className="page-header__subtitle">
                  Nenhuma solicitação pendente. Você está em dia.
                </p>
              </div>
            ) : (
              [...pending, ...active].map((request) => (
                <div className="mnt" key={request.id}>
                  <span className="mnt__icon">
                    <Icon name="send" size={18} />
                  </span>
                  <div>
                    <p className="mnt__title">
                      {request.category} — {request.vesselName}
                    </p>
                    <p className="mnt__meta">
                      <StatusBadge
                        label={request.status}
                        tone={requestStatusMeta[request.status]}
                      />
                      <span>solicitada em {request.createdAt}</span>
                    </p>
                    {request.description && (
                      <p className="page-header__subtitle" style={{ marginTop: 6 }}>
                        {request.description}
                      </p>
                    )}
                  </div>
                  <div className="mnt__due">
                    <span className="mnt__due-date">{request.price || "orçamento pendente"}</span>
                  </div>
                </div>
              ))
            )}
          </section>

          <section className="card">
            <div className="card--padding">
              <div className="section-title">
                <h2>Histórico executado</h2>
              </div>
            </div>
            {done.length === 0 ? (
              <div className="card--padding">
                <p className="page-header__subtitle">
                  Nenhum serviço concluído registrado nesta demo.
                </p>
              </div>
            ) : (
              done.map((request) => (
                <div className="mnt mnt--concluida" key={request.id}>
                  <span className="mnt__icon">
                    <Icon name="check" size={17} />
                  </span>
                  <div>
                    <p className="mnt__title">
                      {request.category} — {request.vesselName}
                    </p>
                    <p className="mnt__meta">
                      <StatusBadge label="Concluído" tone="success" />
                      <span>nota {request.rating}/5</span>
                      <span>{request.price}</span>
                    </p>
                  </div>
                  <div className="mnt__due">
                    <span className="mnt__due-date">{request.dueDate}</span>
                    <span className="mnt__due-label">entregue</span>
                  </div>
                </div>
              ))
            )}
          </section>
        </div>

        <div className="stack">
          <section className="card card--padding">
            <div className="vessel-hero__main">
              <div className="provider-card__body">
                <div className="provider-card__title">
                  {provider.name}{" "}
                  {provider.isPartner && (
                    <StatusBadge label="Parceiro SafeAnchor" tone="accent" />
                  )}
                </div>
                <p className="provider-card__company">{provider.company}</p>
                <p className="provider-card__role">{provider.location}</p>
                <div className="provider-card__meta">
                  <Rating value={provider.rating} />
                  <span className="provider-card__role">
                    {provider.experienceYears} anos · {provider.responsesTime}
                  </span>
                </div>
                <StatusBadge
                  label={provider.availability}
                  tone={provider.availabilityTone}
                />
              </div>
              <Avatar
                initials={provider.initials}
                size={64}
                tone={provider.rating >= 4.8 ? "success" : "neutral"}
              />
            </div>
          </section>

          <section className="card card--padding">
            <div className="section-title">
              <h2>Serviços oferecidos</h2>
            </div>
            <div className="stack" style={{ gap: 10 }}>
              {provider.offerings.map((offering) => (
                <div className="detail-row" key={offering.title}>
                  <span className="detail-row__label">{offering.title}</span>
                  <span className="detail-row__value">{offering.price}</span>
                </div>
              ))}
            </div>
            <div className="tags" style={{ marginTop: 16 }}>
              {provider.specialities.map((item) => (
                <span className="tag" key={item}>
                  {item}
                </span>
              ))}
            </div>
          </section>

          <section className="card card--padding">
            <div className="section-title">
              <h2>Crescer no ecossistema</h2>
            </div>
            <Link className="btn btn--ghost" to="/provider/academy" style={{ marginBottom: 8 }}>
              <Icon name="doc" size={16} />
              Academy — trilhas e certificações
            </Link>
            <Link className="btn btn--ghost" to="/provider/ai" style={{ marginBottom: 8 }}>
              <Icon name="star" size={16} />
              IA do prestador
            </Link>
            <Link className="btn btn--ghost" to="/jobs">
              <Icon name="users" size={16} />
              Trabalhos e vagas
            </Link>
          </section>

          <section className="card">
            <div className="card--padding">
              <div className="section-title">
                <h2>Avaliações recebidas</h2>
              </div>
            </div>
            {provider.reviews.map((review) => (
              <div className="post" key={`${provider.id}-${review.author}`}>
                <div className="post__header">
                  <Avatar initials={review.avatar} size={34} />
                  <div>
                    <p className="post__author">{review.author}</p>
                    <p className="post__author-role">{review.date}</p>
                  </div>
                  <span className="post__time">
                    <Rating value={review.rating} size={13} />
                  </span>
                </div>
                <p className="post__content" style={{ marginTop: 8 }}>
                  {review.comment}
                </p>
              </div>
            ))}
          </section>
        </div>
      </div>
    </div>
  );
}
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

import { useAuth } from "../context/AuthContext";
import { getProviderById } from "../services/providerService";
import PageHeader, { BackLink } from "../components/PageHeader";
import StatusBadge from "../components/StatusBadge";
import Avatar from "../components/Avatar";
import Rating from "../components/Rating";
import Icon from "../components/Icon";

import { getMatchesForProvider } from "../mock/jobs";

export default function ProviderProfilePage() {
  const { id } = useParams();
  const { user } = useAuth();
  const [provider, setProvider] = useState(null);
  const [tab, setTab] = useState("profissional");

  useEffect(() => {
    getProviderById(id).then(setProvider);
  }, [id]);

  if (!provider) {
    return <p>Carregando prestador...</p>;
  }

  const matches = getMatchesForProvider(provider.id);
  const isSelf = user?.providerId === provider.id;

  return (
    <div>
      <BackLink to="/service-providers" label="Voltar para prestadores" />

      <section className="card card--padding">
        <div className="vessel-hero__main">
          <div className="provider-card__body">
            <div className="provider-card__title">
              {provider.name}
              {provider.isPartner && (
                <StatusBadge label="Parceiro SafeAnchor" tone="accent" />
              )}
            </div>
            <p className="provider-card__company">
              {provider.company} · {provider.role}
            </p>
            <p className="provider-card__role">
              Chamado {provider.area} · {provider.location}
            </p>
            <div className="provider-card__meta">
              <Rating value={provider.rating} size={17} />
              <span className="provider-card__role">
                {provider.reviewsCount} avaliações
              </span>
              <StatusBadge
                label={provider.availability}
                tone={provider.availabilityTone}
              />
            </div>
            <div className="provider-card__stats">
              <span>{provider.experienceYears} anos de experiência</span>
              <span>·</span>
              <span>{provider.servicesDone} serviços concluídos</span>
              <span>·</span>
              <span>{provider.responsesTime}</span>
            </div>
            <p className="page-header__subtitle" style={{ margin: "10px 0 0" }}>
              {provider.bio}
            </p>
          </div>
          <div className="vessel-hero__gauge">
            <Avatar
              initials={provider.initials}
              size={72}
              tone={provider.rating >= 4.8 ? "success" : "neutral"}
            />
          </div>
        </div>

        <div className="subnav" style={{ marginTop: 12 }}>
          <button
            type="button"
            className={`subnav__item ${tab === "profissional" ? "subnav__item--active" : ""}`}
            onClick={() => setTab("profissional")}
          >
            Profissional
          </button>
          <button
            type="button"
            className={`subnav__item ${tab === "trabalho" ? "subnav__item--active" : ""}`}
            onClick={() => setTab("trabalho")}
          >
            Trabalho
            {matches.length > 0 && <span className="badge badge--accent">{matches.length}</span>}
          </button>
        </div>

        <div className="form-actions">
          {user?.persona === "OWNER" ? (
            <Link className="btn btn--primary" to="/service-requests/new">
              <Icon name="send" size={17} />
              Solicitar serviço com {provider.name.split(" ")[0]}
            </Link>
          ) : isSelf ? (
            <Link className="btn btn--ghost" to="/dashboard">
              Este é o meu perfil público — voltar ao dashboard
            </Link>
          ) : (
            <Link className="btn btn--ghost" to="/dashboard">
              Voltar ao dashboard
            </Link>
          )}
        </div>
      </section>

      {tab === "profissional" && (
        <div className="stack" style={{ marginTop: 20 }}>
          <section className="card card--padding">
            <div className="section-title">
              <h2>Especialidades</h2>
            </div>
            <div className="tags">
              {provider.specialities.map((item) => (
                <span className="tag" key={item}>
                  {item}
                </span>
              ))}
            </div>
            {provider.skills && (
              <>
                <h3 className="progress__label" style={{ margin: "16px 0 8px" }}>
                  Habilidades para match
                </h3>
                <div className="tags">
                  {provider.skills.map((skill) => (
                    <span className="tag tag--accent" key={skill}>
                      {skill}
                    </span>
                  ))}
                </div>
              </>
            )}
          </section>

          {provider.certifications && (
            <section className="card card--padding">
              <div className="section-title">
                <h2>Certificações</h2>
              </div>
              <div className="tags">
                {provider.certifications.map((cert) => (
                  <span className="tag tag--accent" key={cert}>
                    <Icon name="check" size={12} />
                    {cert}
                  </span>
                ))}
              </div>
            </section>
          )}

          <section className="card card--padding">
            <div className="section-title">
              <h2>Serviços oferecidos</h2>
            </div>
            {provider.offerings.map((offering) => (
              <div className="mnt" key={offering.title}>
                <span className="mnt__icon">
                  <Icon name="wrench" size={18} />
                </span>
                <div>
                  <p className="mnt__title">{offering.title}</p>
                  <p className="mnt__meta">{offering.price}</p>
                </div>
              </div>
            ))}
          </section>

          <section className="card">
            <div className="card--padding">
              <div className="section-title">
                <h2>Avaliações</h2>
              </div>
            </div>
            {provider.reviews.length === 0 ? (
              <div className="card--padding">
                <p className="page-header__subtitle">
                  Ainda não há avaliações deste prestador.
                </p>
              </div>
            ) : (
              provider.reviews.map((review) => (
                <div className="post" key={review.author}>
                  <div className="post__header">
                    <Avatar initials={review.avatar} size={36} />
                    <div>
                      <p className="post__author">{review.author}</p>
                      <p className="post__author-role">Avaliação em {review.date}</p>
                    </div>
                    <span className="post__time">
                      <Rating value={review.rating} size={14} />
                    </span>
                  </div>
                  <p className="post__content" style={{ marginTop: 10 }}>
                    {review.comment}
                  </p>
                </div>
              ))
            )}
          </section>
        </div>
      )}

      {tab === "trabalho" && (
        <div className="stack" style={{ marginTop: 20 }}>
          <section className="card card--padding">
            <div className="section-title">
              <h2>Oportunidades em aberto</h2>
              <Link className="section-title__link" to="/jobs">
                Ver todos os jobs
              </Link>
            </div>
            {matches.length === 0 ? (
              <p className="page-header__subtitle">
                Nenhuma oportunidade com match no momento.
              </p>
            ) : (
              matches.map((job) => (
                <div className="mnt mnt--column" key={job.id}>
                  <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
                    <span className="mnt__icon">
                      <Icon name="wrench" size={18} />
                    </span>
                    <div>
                      <p className="mnt__title">{job.title}</p>
                      <p className="mnt__meta">
                        {job.vessel} · {job.duration} · {job.estimate}
                      </p>
                    </div>
                    <StatusBadge label={job.status} tone={job.statusTone} />
                  </div>
                  <p className="job-card__requirements">{job.requirements}</p>
                  <Link className="btn btn--ghost" to="/jobs">
                    Candidatar-se na seção Jobs
                  </Link>
                </div>
              ))
            )}
          </section>

          <section className="card card--padding">
            <div className="section-title">
              <h2>Próximos passos para crescer</h2>
            </div>
            <p className="page-header__subtitle">
              Com base no seu histórico e certificações, o SafeAnchor sugere:
            </p>
            <div className="ai-banner">
              <span className="ai-banner__icon">
                <Icon name="doc" size={18} />
              </span>
              <div>
                <strong>Conclua "Diagnóstico eletrônico" no Academy</strong>
                <p>
                  Aumenta o match para jobs de manutenção de motores em até 18%.
                </p>
              </div>
            </div>
            <Link className="btn btn--accent" to="/provider/academy" style={{ marginTop: 12 }}>
              <Icon name="doc" size={16} />
              Abrir o Academy
            </Link>
          </section>
        </div>
      )}
    </div>
  );
}
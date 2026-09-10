import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import PageHeader from "../components/PageHeader";
import Icon from "../components/Icon";
import StatusBadge from "../components/StatusBadge";
import Avatar from "../components/Avatar";

import { useAuth } from "../context/AuthContext";
import { getJobsForProvider, applyToJob } from "../services/jobsService";
import { getProviderById } from "../services/providerService";

export default function JobsPage() {
  const { user } = useAuth();
  const [provider, setProvider] = useState(null);
  const [matched, setMatched] = useState([]);
  const [applied, setApplied] = useState({});

  useEffect(() => {
    if (user?.providerId) {
      getProviderById(user.providerId).then(setProvider);
      getJobsForProvider(user.providerId).then((list) => {
        setMatched(list);
        setApplied(list.reduce((acc, job) => ({ ...acc, [job.id]: false }), {}));
      });
    }
  }, [user]);

  function handleApply(jobId) {
    applyToJob(jobId);
    setApplied((prev) => ({ ...prev, [jobId]: true }));
  }

  return (
    <div>
      <PageHeader
        eyebrow="Oportunidades para prestadores"
        title="Jobs & Crew"
        subtitle="Vagas de tripulação, manutenção e serviço geradas por viagens e marinas conectadas — com match pelo seu perfil."
      />

      {provider && (
        <section className="card card--padding" style={{ marginBottom: 16 }}>
          <div className="mnt">
            <span className="mnt__icon">
              <Avatar initials={provider.initials} size={32} />
            </span>
            <div>
              <p className="mnt__title">{provider.name} · {provider.company}</p>
              <p className="mnt__meta">
                <span>
                  {matched.length} oportunidades combinam com o seu perfil · taxa de resposta{" "}
                  {provider.responsesTime}
                </span>
              </p>
            </div>
            <Link className="btn btn--ghost" to="/provider/ai">
              Perguntar à IA do prestador
            </Link>
          </div>
        </section>
      )}

      <div className="grid grid--stack">
        <div className="stack">
          {matched.length === 0 ? (
            <section className="card card--padding">
              <h2 className="section-title">Match para seu perfil</h2>
              <p className="page-header__subtitle">
                Nenhuma oportunidade com correspondência neste momento.
              </p>
            </section>
          ) : (
            matched.map((job) => (
              <section className="card card--padding job-card" key={job.id}>
                <div className="job-card__head">
                  <span className="job-card__icon">
                    <Icon name="wrench" size={18} />
                  </span>
                  <div>
                    <p className="mnt__title">{job.title}</p>
                    <p className="mnt__meta">
                      {job.vessel} · {job.location}
                    </p>
                  </div>
                  <StatusBadge label={job.status} tone={job.statusTone} />
                </div>
                <div className="job-card__meta">
                  <span>
                    <Icon name="calendar" size={14} /> {job.duration}
                  </span>
                  <span>
                    <Icon name="shopping" size={14} /> {job.estimate}
                  </span>
                </div>
                <p className="job-card__requirements">{job.requirements}</p>
                <div className="tags">
                  {job.skills.map((skill) => (
                    <span className="tag" key={skill}>{skill}</span>
                  ))}
                </div>
                <div className="job-card__foot">
                  <span className="mnt__meta">{job.proposals} propostas já</span>
                  <button
                    type="button"
                    className={`btn ${applied[job.id] ? "btn--ghost" : "btn--primary"}`}
                    onClick={() => handleApply(job.id)}
                    disabled={applied[job.id]}
                  >
                    {applied[job.id] ? "Proposta enviada" : "Enviar proposta"}
                  </button>
                </div>
              </section>
            ))
          )}
        </div>

        <div className="stack">
          <section className="card card--padding">
            <div className="section-title">
              <h2>Como o match funciona</h2>
            </div>
            <p className="page-header__subtitle">
              Vagas de tripulação e serviço são criadas quando um dono planeja uma
              viagem ou uma marina agenda operação. O SafeAnchor compara o seu perfil
              (especialidades, certificações e disponibilidade) e sugere as melhores
              combinações.
            </p>
            <Link className="btn btn--accent" to="/provider/academy" style={{ marginTop: 12 }}>
              <Icon name="doc" size={16} />
              Melhorar perfil no Academy
            </Link>
          </section>
        </div>
      </div>
    </div>
  );
}
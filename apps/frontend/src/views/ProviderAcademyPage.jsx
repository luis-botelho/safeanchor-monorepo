import { useEffect, useState } from "react";

import PageHeader from "../components/PageHeader";
import Icon from "../components/Icon";
import StatusBadge from "../components/StatusBadge";

import { getAcademyProfile } from "../services/academyService";

const STATUS_META = {
  "Concluído": "success",
  "Em curso": "info",
  "Iniciar": "accent",
  "Bloqueado": "neutral",
};

export default function ProviderAcademyPage() {
  const [academy, setAcademy] = useState(null);

  useEffect(() => {
    getAcademyProfile().then(setAcademy);
  }, []);

  if (!academy) {
    return <p>Carregando Academy...</p>;
  }

  return (
    <div>
      <PageHeader
        eyebrow="Capacitação continua"
        title="SafeAnchor Academy"
        subtitle="Trilhas de aprendizado para crescer como prestador do ecossistema náutico."
      />

      <section className="card card--padding">
        <div className="vessel-hero__main">
          <div>
            <div className="provider-card__title">
              {academy.level}
              <StatusBadge label={academy.nextLevel} tone="warning" />
            </div>
            <p className="page-header__subtitle">Nível atual · Progresso de evolução</p>
            <div className="progress" style={{ maxWidth: 520 }}>
              <div className="progress__bar" style={{ width: `${academy.progressToNext}%` }} />
            </div>
            <p className="mnt__meta">{academy.progressToNext}% para {academy.nextLevel}</p>
          </div>
          <div className="vessel-hero__gauge">
            <strong className="readiness-gauge__number" style={{ fontSize: 40 }}>{academy.progressToNext}</strong>
            <span className="progress__label">%</span>
          </div>
        </div>
      </section>

      <section className="card card--padding" style={{ marginTop: 20 }}>
        <div className="section-title">
          <h2>Competências</h2>
        </div>
        <div className="grid grid--2">
          {academy.competencies.map((item) => (
            <div className="competency" key={item.name}>
              <div className="competency__head">
                <strong>{item.name}</strong>
                <span className="competency__value">{item.value}% · {item.level}</span>
              </div>
              <div className="progress">
                <div className="progress__bar" style={{ width: `${item.value}%` }} />
              </div>
            </div>
          ))}
        </div>
      </section>

      <div className="grid grid--2" style={{ marginTop: 20 }}>
        {academy.tracks.map((track) => (
          <section className="card card--padding" key={track.id}>
            <div className="section-title">
              <h2>{track.title}</h2>
              <span className="section-title__link">
                <Icon name={track.icon} size={15} />
              </span>
            </div>
            <p className="mnt__meta">{track.tagline}</p>
            {track.courses.map((course) => (
              <div className="mnt" key={course.id}>
                <span className={`mnt__icon mnt__icon--${STATUS_META[course.status]}`}>
                  <Icon
                    name={course.status === "Concluído" ? "check" : "doc"}
                    size={16}
                  />
                </span>
                <div>
                  <p className="mnt__title">{course.title}</p>
                  <p className="mnt__meta">
                    {course.hours}h · nível {course.level}
                  </p>
                </div>
                <StatusBadge label={course.status} tone={STATUS_META[course.status]} />
              </div>
            ))}
          </section>
        ))}
      </div>

      <section className="card card--padding" style={{ marginTop: 20 }}>
        <p className="page-header__subtitle">
          {academy.disclaimer}
        </p>
      </section>
    </div>
  );
}
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

import { getVessel } from "../services/vesselService";
import { getVesselStatus } from "../services/vesselService";
import { getMaintenancesByVesselId } from "../services/maintenanceService";
import { getDocumentsByVessel } from "../services/documentService";
import { getMarinaById } from "../services/marinaService";
import CoverImage from "../components/CoverImage";
import ReadinessGauge from "../components/ReadinessGauge";
import StatusBadge from "../components/StatusBadge";
import PageHeader, { BackLink } from "../components/PageHeader";
import Icon from "../components/Icon";

export default function VesselDetailPage() {
  const { id } = useParams();

  const [vessel, setVessel] = useState(null);
  const [maintenances, setMaintenances] = useState([]);
  const [documents, setDocuments] = useState([]);
  const [marina, setMarina] = useState(null);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      const loadedVessel = await getVessel(id);
      if (cancelled || !loadedVessel) return;

      setVessel(loadedVessel);
      setMaintenances(await getMaintenancesByVesselId(id));
      setDocuments(await getDocumentsByVessel(id));

      if (loadedVessel.marinaId) {
        setMarina(await getMarinaById(loadedVessel.marinaId));
      }
    }

    load();

    return () => {
      cancelled = true;
    };
  }, [id]);

  if (!vessel) {
    return <p>Carregando embarcação...</p>;
  }

  const status = getVesselStatus(vessel.status);
  const factors = vessel.readinessFactors;
  const latestMaintenance = maintenances[0];

  return (
    <div>
      <BackLink to="/fleet" label="Voltar para a frota" />

      <CoverImage
        seed={vessel.imageSeed}
        hint={vessel.name}
        className="vessel-hero__cover"
      />

      <div className="vessel-hero__main">
        <div>
          <div className="stack" style={{ gap: 10 }}>
            <StatusBadge label={status.label} tone={status.tone} />
            <h1 className="vessel-hero__title">{vessel.name}</h1>
            <p className="vessel-hero__subtitle">
              {vessel.type} · {vessel.length} · {vessel.year} · {vessel.engine}
            </p>
            <p className="page-header__subtitle" style={{ marginTop: 4 }}>
              {vessel.mission}
            </p>
          </div>
        </div>
        <div className="vessel-hero__gauge">
          <ReadinessGauge value={vessel.readiness} size={84} label="prontidão" />
          <div className="vessel-hero__gauge-caption">
            <strong>Prontidão operacional</strong>
            <span>
              Último checklist: {vessel.lastChecklist.date} ·{" "}
              {vessel.lastChecklist.score}/100
            </span>
          </div>
        </div>
      </div>

      <div className="grid grid--2" style={{ marginTop: 24 }}>
        <section className="card card--padding">
          <div className="section-title">
            <h2>Detalhes</h2>
          </div>
          <div className="detail-list">
            <DetailRow label="Categoria" value={vessel.category} />
            <DetailRow label="Registro" value={vessel.registration} />
            <DetailRow
              label="Localização atual"
              value={vessel.location}
            />
            <DetailRow label="Proprietário" value={vessel.owner} />
            {marina && (
              <div className="detail-row">
                <span className="detail-row__label">Atracada em</span>
                <Link className="detail-row__value" style={{ color: "var(--primary)" }} to={`/marinas/${marina.id}`}>
                  {marina.name}
                </Link>
              </div>
            )}
          </div>
        </section>

        <section className="card card--padding">
          <div className="section-title">
            <h2>Fatores de prontidão</h2>
          </div>
          <FactorBar label="Manutenção" value={factors.maintenance} />
          <FactorBar label="Documentação" value={factors.documentation} />
          <FactorBar label="Checklists" value={factors.checklist} />
          <FactorBar label="Segurança" value={factors.safety} />
        </section>
      </div>

      <div className="grid grid--2" style={{ marginTop: 18 }}>
        <section className="card card--padding">
          <div className="section-title">
            <h2>Histórico de manutenção</h2>
            <Link className="section-title__link" to="/maintenance">
              Ver geral
            </Link>
          </div>
          {maintenances.length === 0 ? (
            <p className="page-header__subtitle">Nenhuma manutenção registrada.</p>
          ) : (
            maintenances.slice(0, 4).map((item) => (
              <div className="mnt" key={item.id}>
                <span className="mnt__icon">
                  <Icon name="wrench" size={18} />
                </span>
                <div>
                  <p className="mnt__title">{item.title}</p>
                  <p className="mnt__meta">
                    <span>{item.type}</span> ·{" "}
                    <StatusBadge label={item.status} tone={item.statusTone} />
                  </p>
                </div>
                <div className="mnt__due">
                  <span className="mnt__due-date">{item.date}</span>
                  <span className="mnt__due-label">{item.priority}</span>
                </div>
              </div>
            ))
          )}
        </section>

        <section className="card card--padding">
          <div className="section-title">
            <h2>Documentos</h2>
            <Link className="section-title__link" to="/documents">
              Ver geral
            </Link>
          </div>
          {documents.length === 0 ? (
            <p className="page-header__subtitle">Nenhum documento cadastrado.</p>
          ) : (
            documents.map((document) => (
              <div className="doc-row" key={document.id}>
                <div className="doc-row__info">
                  <span className="doc-row__icon">
                    <Icon name="doc" size={18} />
                  </span>
                  <div>
                    <p className="doc-row__name">{document.name}</p>
                    <p className="doc-row__meta">
                      {document.category} · nº {document.number}
                    </p>
                  </div>
                </div>
                <div className="doc-row__right">
                  <StatusBadge label={document.status.label} tone={document.status.tone} />
                  <p className="doc-row__expires">vence {document.expiresAt}</p>
                </div>
              </div>
            ))
          )}
        </section>
      </div>
    </div>
  );
}

function DetailRow({ label, value }) {
  return (
    <div className="detail-row">
      <span className="detail-row__label">{label}</span>
      <span className="detail-row__value">{value}</span>
    </div>
  );
}

function FactorBar({ label, value }) {
  const tone =
    value >= 80 ? "" : value >= 60 ? "factor__fill--warning" : "factor__fill--danger";

  return (
    <div className="factor">
      <span className="factor__label">{label}</span>
      <span className="factor__bar">
        <span className={`factor__fill ${tone}`} style={{ width: `${value}%` }} />
      </span>
      <span className="factor__value">{value}%</span>
    </div>
  );
}
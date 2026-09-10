import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import { getDocuments, getDocumentsSummary } from "../services/documentService";
import PageHeader from "../components/PageHeader";
import StatusBadge from "../components/StatusBadge";
import Icon from "../components/Icon";
import StatCard from "../components/StatCard";
import { getFleetVessels } from "../services/vesselService";

export default function DocumentsPage() {
  const [documents, setDocuments] = useState([]);
  const [vessels, setVessels] = useState([]);

  useEffect(() => {
    getDocuments().then(setDocuments);
    getFleetVessels().then(setVessels);
  }, []);

  const summary = getDocumentsSummary(documents);

  function vesselName(vesselId) {
    const vessel = vessels.find((item) => item.id === vesselId);
    return vessel ? vessel.name : "Embarcação";
  }

  return (
    <div>
      <PageHeader
        eyebrow="Conformidade"
        title="Documentos"
        subtitle="Acompanhe seguros, vistorias, registros e certificados de cada embarcação."
      />

      <div className="grid grid--3" style={{ marginBottom: 20 }}>
        <StatCard label="Documentos válidos" value={summary.valid} icon="check" tone="primary" />
        <StatCard label="Próximos do vencimento" value={summary.expiring} icon="calendar" tone="warning" hint="30 dias ou menos" />
        <StatCard label="Vencidos" value={summary.expired} icon="alert" tone="danger" />
      </div>

      <section className="card">
        {documents.length === 0 ? (
          <div className="card--padding">
            <p className="page-header__subtitle">Nenhum documento cadastrado.</p>
          </div>
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
                    {vesselName(document.vesselId)} · {document.category} · nº {document.number}
                  </p>
                </div>
              </div>
              <div className="doc-row__right">
                <StatusBadge label={document.status.label} tone={document.status.tone} />
                <p className="doc-row__expires">
                  {document.status.key === "vencido"
                    ? `vencido em ${document.expiresAt}`
                    : `renova em ${document.expiresAt}`}
                </p>
              </div>
            </div>
          ))
        )}
      </section>
    </div>
  );
}
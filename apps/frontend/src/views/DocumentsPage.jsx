import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import { getDocuments, getDocumentsSummary } from "../services/documentService";
import PageHeader from "../components/PageHeader";
import StatusBadge from "../components/StatusBadge";
import Icon from "../components/Icon";
import StatCard from "../components/StatCard";
import { getFleetVessels } from "../services/vesselService";
import ErrorState from "../components/ErrorState";
import { ListSkeleton } from "../components/PageSkeletons";

export default function DocumentsPage() {
  const [documents, setDocuments] = useState([]);
  const [vessels, setVessels] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    Promise.all([getDocuments(), getFleetVessels()])
      .then(([loadedDocuments, loadedVessels]) => {
        if (!active) return;

        setDocuments(loadedDocuments);
        setVessels(loadedVessels);
      })
      .catch((error) => {
        if (active) setError(error.message || "Não foi possível carregar os documentos.");
      })
      .finally(() => {
        if (active) setIsLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  if (isLoading) {
    return <ListSkeleton label="Carregando documentos" rows={5} />;
  }

  if (error) {
    return <ErrorState title="Não foi possível carregar os documentos" message={error} />;
  }

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
        actions={
          <Link className="btn btn--ghost" to="/documents/new">
            <Icon name="plus" size={17} />
            Novo documento
          </Link>
        }
      />

      <div className="grid grid--3" style={{ marginBottom: 20 }}>
        <StatCard label="Documentos válidos" value={summary.valid} icon="check" tone="primary" />
        <StatCard label="Próximos do vencimento" value={summary.expiring} icon="calendar" tone="warning" hint="30 dias ou menos" />
        <StatCard label="Vencidos" value={summary.expired} icon="alert" tone="danger" />
      </div>

      <section className="card">
        {documents.length === 0 ? (
          <div className="card--padding">
            <p className="page-header__subtitle">
              Nenhum documento cadastrado. Comece pelo primeiro documento da sua frota.
            </p>
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

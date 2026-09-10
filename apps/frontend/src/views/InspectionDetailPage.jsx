import { useParams } from "react-router-dom";

import {
  useInspectionDetailViewModel,
  getInspectionTypeLabel,
  getInspectionStatusLabel,
  getInspectionStatusTone,
  getChecklistItemStatusLabel,
  getChecklistItemStatusTone,
} from "../viewmodels/useInspectionViewModel";
import { BackLink } from "../components/PageHeader";
import StatusBadge from "../components/StatusBadge";
import Icon from "../components/Icon";
import { formatDate, formatTime } from "../components/InspectionCard";

export default function InspectionDetailPage() {
  const { id } = useParams();
  const {
    inspection,
    isLoading,
    error,
    updateChecklist,
    completeInspection,
    cancelInspection,
  } = useInspectionDetailViewModel(id);

  if (isLoading) {
    return <p>Carregando inspeção...</p>;
  }

  if (error || !inspection) {
    return <p>{error || "Inspeção não encontrada."}</p>;
  }

  const completedItems = inspection.checklist.filter(
    (item) => item.status !== "pending",
  ).length;
  const totalItems = inspection.checklist.length;
  const allReviewed = completedItems === totalItems;
  const hasFailure = inspection.checklist.some(
    (item) => item.status === "failed",
  );
  const canComplete = allReviewed && !hasFailure;
  const isActive =
    inspection.status === "scheduled" || inspection.status === "in_progress";

  async function handleStatusChange(index, newStatus) {
    const item = inspection.checklist[index];
    await updateChecklist(index, newStatus, item.notes);
  }

  async function handleNotesChange(index, newNotes) {
    const item = inspection.checklist[index];
    await updateChecklist(index, item.status, newNotes);
  }

  async function handleComplete() {
    const result = await completeInspection();
    if (!result) {
      alert("Preencha todos os itens do checklist antes de concluir.");
    }
  }

  async function handleCancel() {
    if (window.confirm("Deseja cancelar esta inspeção?")) {
      await cancelInspection();
    }
  }

  return (
    <div>
      <BackLink to="/inspections" label="Voltar para inspeções" />

      <div className="vessel-hero__main">
        <div>
          <h1 className="vessel-hero__title">{inspection.vesselName}</h1>
          <p className="vessel-hero__subtitle" style={{ marginTop: 4 }}>
            <Icon name="check" size={15} /> {inspection.vesselType}
          </p>
          <p className="page-header__subtitle" style={{ marginTop: 12 }}>
            {inspection.notes}
          </p>
          <div className="provider-card__meta">
            <StatusBadge
              label={getInspectionStatusLabel(inspection.status)}
              tone={getInspectionStatusTone(inspection.status)}
            />
            <span className="provider-card__role">
              {getInspectionTypeLabel(inspection.type)}
            </span>
            <span className="provider-card__role">
              Inspetor: {inspection.inspector}
            </span>
          </div>
        </div>
        <div
          className="vessel-hero__gauge"
          style={{ flexDirection: "column", alignItems: "flex-end" }}
        >
          <strong className="mnt__due-date">
            {completedItems}/{totalItems} itens
          </strong>
          <span className="mnt__due-label">checklist</span>
        </div>
      </div>

      <div className="card" style={{ marginTop: 18 }}>
        <div className="card--padding">
          <div className="section-title">
            <h2>Checklist de inspeção</h2>
          </div>
        </div>
        {inspection.checklist.map((item, index) => (
          <div className="mnt" key={index}>
            <span className="mnt__icon">
              <Icon name="check" size={18} />
            </span>
            <div style={{ flex: 1 }}>
              <p className="mnt__title">{item.item}</p>
              <p className="mnt__meta">
                <StatusBadge
                  label={getChecklistItemStatusLabel(item.status)}
                  tone={getChecklistItemStatusTone(item.status)}
                />
              </p>
              {isActive && (
                <div style={{ marginTop: 8, display: "flex", gap: 6 }}>
                  {["ok", "attention", "failed"].map((status) => (
                    <button
                      key={status}
                      className={`btn btn--sm ${item.status === status ? "btn--primary" : "btn--ghost"}`}
                      onClick={() => handleStatusChange(index, status)}
                    >
                      {getChecklistItemStatusLabel(status)}
                    </button>
                  ))}
                </div>
              )}
              {item.notes && (
                <p className="page-header__subtitle" style={{ marginTop: 6 }}>
                  {item.notes}
                </p>
              )}
              {isActive && (
                <input
                  className="input"
                  style={{ marginTop: 6, width: "100%" }}
                  placeholder="Observações..."
                  value={item.notes}
                  onChange={(e) => handleNotesChange(index, e.target.value)}
                />
              )}
            </div>
          </div>
        ))}
      </div>

      {isActive && (
        <div style={{ marginTop: 18, display: "flex", gap: 10 }}>
          <button
            className="btn btn--primary"
            disabled={!canComplete}
            onClick={handleComplete}
          >
            <Icon name="check" size={16} />
            Concluir inspeção
          </button>
          <button className="btn btn--ghost" onClick={handleCancel}>
            Cancelar
          </button>
        </div>
      )}

      {inspection.certificate && (
        <div className="card" style={{ marginTop: 18 }}>
          <div className="card--padding">
            <div className="section-title">
              <h2>Certificado emitido</h2>
            </div>
          </div>
          <div className="card--padding">
            <div className="detail-list">
              <div className="detail-row">
                <span className="detail-row__label">Tipo</span>
                <span className="detail-row__value">
                  {inspection.certificate.type}
                </span>
              </div>
              <div className="detail-row">
                <span className="detail-row__label">ID</span>
                <span className="detail-row__value">
                  {inspection.certificate.id}
                </span>
              </div>
              <div className="detail-row">
                <span className="detail-row__label">Emitido em</span>
                <span className="detail-row__value">
                  {formatDate(inspection.certificate.issuedAt)}
                </span>
              </div>
              <div className="detail-row">
                <span className="detail-row__label">Válido até</span>
                <span className="detail-row__value">
                  {inspection.certificate.validUntil}
                </span>
              </div>
              <div className="detail-row">
                <span className="detail-row__label">Inspetor</span>
                <span className="detail-row__value">
                  {inspection.certificate.inspector}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {hasFailure && inspection.status === "in_progress" && (
        <div className="card" style={{ marginTop: 18, borderColor: "var(--color-danger)" }}>
          <div className="card--padding">
            <p className="page-header__subtitle" style={{ color: "var(--color-danger)" }}>
              Esta inspeção contém itens reprovados. Corrija os problemas antes de concluir.
            </p>
          </div>
        </div>
      )}

      <div className="card" style={{ marginTop: 18 }}>
        <div className="card--padding">
          <div className="section-title">
            <h2>Detalhes</h2>
          </div>
        </div>
        <div className="card--padding">
          <div className="detail-list">
            <div className="detail-row">
              <span className="detail-row__label">Agendamento</span>
              <span className="detail-row__value">
                {formatDate(inspection.scheduledAt)} às{" "}
                {formatTime(inspection.scheduledAt)}
              </span>
            </div>
            {inspection.completedAt && (
              <div className="detail-row">
                <span className="detail-row__label">Conclusão</span>
                <span className="detail-row__value">
                  {formatDate(inspection.completedAt)} às{" "}
                  {formatTime(inspection.completedAt)}
                </span>
              </div>
            )}
            <div className="detail-row">
              <span className="detail-row__label">Criado em</span>
              <span className="detail-row__value">
                {formatDate(inspection.createdAt)}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

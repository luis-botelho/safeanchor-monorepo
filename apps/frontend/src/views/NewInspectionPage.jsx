import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { useNewInspectionViewModel } from "../viewmodels/useInspectionViewModel";
import { BackLink } from "../components/PageHeader";
import Icon from "../components/Icon";

export default function NewInspectionPage() {
  const navigate = useNavigate();
  const { vessels, isSubmitting, error, handleSubmit, inspectionTypes } =
    useNewInspectionViewModel();

  const [vesselId, setVesselId] = useState("");
  const [type, setType] = useState("routine");
  const [scheduledDate, setScheduledDate] = useState("");
  const [scheduledTime, setScheduledTime] = useState("");
  const [inspector, setInspector] = useState("");
  const [notes, setNotes] = useState("");

  async function onSubmit(e) {
    e.preventDefault();

    const vessel = vessels.find((v) => v.id === vesselId);
    if (!vessel) return;

    const scheduledAt = new Date(`${scheduledDate}T${scheduledTime}`);

    const result = await handleSubmit({
      vesselId: vessel.id,
      vesselName: vessel.name,
      vesselType: `${vessel.type} ${vessel.length}`,
      providerId: "prov-ricardo",
      type,
      scheduledAt: scheduledAt.toISOString(),
      inspector,
      notes,
    });

    if (result) {
      navigate(`/inspections/${result.id}`);
    }
  }

  return (
    <div>
      <BackLink to="/inspections" label="Voltar para inspeções" />

      <h1 className="vessel-hero__title">Agendar inspeção</h1>
      <p className="page-header__subtitle" style={{ marginTop: 4 }}>
        Selecione a embarcação, o tipo de inspeção e o horário desejado.
      </p>

      {error && (
        <div className="card" style={{ marginTop: 18, borderColor: "var(--color-danger)" }}>
          <div className="card--padding">
            <p className="page-header__subtitle" style={{ color: "var(--color-danger)" }}>
              {error}
            </p>
          </div>
        </div>
      )}

      <form onSubmit={onSubmit} style={{ marginTop: 18 }}>
        <div className="card card--padding">
          <div className="section-title">
            <h2>Embarcação</h2>
          </div>
          <select
            className="input"
            value={vesselId}
            onChange={(e) => setVesselId(e.target.value)}
            required
          >
            <option value="">Selecione uma embarcação</option>
            {vessels.map((v) => (
              <option key={v.id} value={v.id}>
                {v.name} — {v.type} {v.length}
              </option>
            ))}
          </select>
        </div>

        <div className="card card--padding" style={{ marginTop: 12 }}>
          <div className="section-title">
            <h2>Tipo de inspeção</h2>
          </div>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            {inspectionTypes.map((t) => (
              <button
                key={t.value}
                type="button"
                className={`btn btn--sm ${type === t.value ? "btn--primary" : "btn--ghost"}`}
                onClick={() => setType(t.value)}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>

        <div className="card card--padding" style={{ marginTop: 12 }}>
          <div className="section-title">
            <h2>Data e horário</h2>
          </div>
          <div style={{ display: "flex", gap: 12 }}>
            <input
              className="input"
              type="date"
              value={scheduledDate}
              onChange={(e) => setScheduledDate(e.target.value)}
              required
              style={{ flex: 1 }}
            />
            <input
              className="input"
              type="time"
              value={scheduledTime}
              onChange={(e) => setScheduledTime(e.target.value)}
              required
              style={{ flex: 1 }}
            />
          </div>
        </div>

        <div className="card card--padding" style={{ marginTop: 12 }}>
          <div className="section-title">
            <h2>Inspetor</h2>
          </div>
          <input
            className="input"
            placeholder="Nome do inspetor responsável"
            value={inspector}
            onChange={(e) => setInspector(e.target.value)}
            required
          />
        </div>

        <div className="card card--padding" style={{ marginTop: 12 }}>
          <div className="section-title">
            <h2>Observações</h2>
          </div>
          <textarea
            className="input"
            placeholder="Detalhes sobre a inspeção..."
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={3}
            style={{ resize: "vertical" }}
          />
        </div>

        <div style={{ marginTop: 18, display: "flex", gap: 10 }}>
          <button
            className="btn btn--primary"
            type="submit"
            disabled={isSubmitting || !vesselId || !scheduledDate || !scheduledTime || !inspector}
          >
            <Icon name="check" size={16} />
            {isSubmitting ? "Agendando..." : "Agendar inspeção"}
          </button>
          <button
            type="button"
            className="btn btn--ghost"
            onClick={() => navigate("/inspections")}
          >
            Cancelar
          </button>
        </div>
      </form>
    </div>
  );
}

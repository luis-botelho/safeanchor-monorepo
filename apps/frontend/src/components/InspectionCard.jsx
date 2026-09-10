import { Link } from "react-router-dom";

import StatusBadge from "./StatusBadge";
import Icon from "./Icon";
import {
  getInspectionTypeLabel,
  getInspectionStatusLabel,
  getInspectionStatusTone,
} from "../viewmodels/useInspectionViewModel";

function formatDate(dateString) {
  if (!dateString) return "—";
  const date = new Date(dateString);
  return date.toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

function formatTime(dateString) {
  if (!dateString) return "";
  const date = new Date(dateString);
  return date.toLocaleTimeString("pt-BR", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function InspectionCard({ inspection }) {
  const completedItems = inspection.checklist.filter(
    (item) => item.status !== "pending",
  ).length;
  const totalItems = inspection.checklist.length;

  return (
    <Link className="mnt" to={`/inspections/${inspection.id}`}>
      <span className="mnt__icon">
        <Icon name="check" size={18} />
      </span>
      <div>
        <p className="mnt__title">{inspection.vesselName}</p>
        <p className="mnt__meta">
          <span>{getInspectionTypeLabel(inspection.type)}</span>
          <StatusBadge
            label={getInspectionStatusLabel(inspection.status)}
            tone={getInspectionStatusTone(inspection.status)}
          />
        </p>
        <p className="mnt__meta">
          <span>{inspection.vesselType}</span>
          <span>·</span>
          <span>{inspection.inspector}</span>
        </p>
      </div>
      <div className="mnt__due">
        {inspection.status === "completed" && inspection.certificate ? (
          <>
            <span className="mnt__due-date" style={{ color: "var(--color-success)" }}>
              Certificado
            </span>
            <span className="mnt__due-label">emitido</span>
          </>
        ) : (
          <>
            <span className="mnt__due-date">
              {completedItems}/{totalItems}
            </span>
            <span className="mnt__due-label">itens</span>
          </>
        )}
      </div>
    </Link>
  );
}

export { formatDate, formatTime };

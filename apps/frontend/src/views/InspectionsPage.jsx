import { Link } from "react-router-dom";

import { useInspectionsViewModel } from "../viewmodels/useInspectionViewModel";
import PageHeader from "../components/PageHeader";
import InspectionCard from "../components/InspectionCard";
import Icon from "../components/Icon";

export default function InspectionsPage() {
  const { inspections, isLoading, error } = useInspectionsViewModel();

  if (isLoading) {
    return <p>Carregando inspeções...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  const scheduled = inspections.filter((i) => i.status === "scheduled");
  const inProgress = inspections.filter((i) => i.status === "in_progress");
  const completed = inspections.filter((i) => i.status === "completed");

  return (
    <div>
      <PageHeader
        eyebrow="Vistorias e laudos"
        title="Inspeções"
        subtitle="Agendamentos, checklists e certificados de inspeção de embarcações."
        actions={
          <Link className="btn btn--ghost" to="/inspections/new">
            <Icon name="plus" size={17} />
            Agendar inspeção
          </Link>
        }
      />

      {inProgress.length > 0 && (
        <section className="card" style={{ marginBottom: 18 }}>
          <div className="card--padding">
            <div className="section-title">
              <h2>Em andamento</h2>
            </div>
          </div>
          {inProgress.map((inspection) => (
            <InspectionCard key={inspection.id} inspection={inspection} />
          ))}
        </section>
      )}

      <section className="card" style={{ marginBottom: 18 }}>
        <div className="card--padding">
          <div className="section-title">
            <h2>Agendadas</h2>
          </div>
        </div>
        {scheduled.length === 0 ? (
          <div className="card--padding">
            <p className="page-header__subtitle">
              Nenhuma inspeção agendada no momento.
            </p>
          </div>
        ) : (
          scheduled.map((inspection) => (
            <InspectionCard key={inspection.id} inspection={inspection} />
          ))
        )}
      </section>

      <section className="card">
        <div className="card--padding">
          <div className="section-title">
            <h2>Concluídas</h2>
          </div>
        </div>
        {completed.length === 0 ? (
          <div className="card--padding">
            <p className="page-header__subtitle">
              Nenhuma inspeção concluída ainda.
            </p>
          </div>
        ) : (
          completed.map((inspection) => (
            <InspectionCard key={inspection.id} inspection={inspection} />
          ))
        )}
      </section>
    </div>
  );
}

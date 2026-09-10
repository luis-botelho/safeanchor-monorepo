import EmptyState from "../components/EmptyState";
import { BackLink } from "../components/PageHeader";

export default function ComingSoonPage({ title, description }) {
  return (
    <div>
      <BackLink to="/dashboard" label="Voltar ao dashboard" />
      <section className="card">
        <EmptyState
          icon="wrench"
          title={title || "Em breve"}
          description={
            description ||
            "Essa funcionalidade faz parte da próxima etapa desta demonstração."
          }
        />
      </section>
    </div>
  );
}
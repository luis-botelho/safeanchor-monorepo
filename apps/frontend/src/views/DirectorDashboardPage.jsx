import { Link } from "react-router-dom";

import Icon from "../components/Icon";
import LoadingFallback from "../components/LoadingFallback";
import PageHeader from "../components/PageHeader";
import StatCard from "../components/StatCard";
import useDirectorViewModel from "../viewmodels/useDirectorViewModel";

function countMap(map) {
  return Object.entries(map || {})
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);
}

export default function DirectorDashboardPage() {
  const model = useDirectorViewModel();

  if (model.loading) {
    return <LoadingFallback label="Carregando análise da diretoria" />;
  }

  const { insights } = model;

  return (
    <div>
      <PageHeader
        eyebrow="Diretoria · Inteligência"
        title="Análise da pesquisa"
        subtitle="Respostas capturadas somente com consentimento explícito. Use os dados para decidir o que muda no produto."
        actions={
          <Link className="btn btn--primary" to="/director/responses">
            <Icon name="doc" size={17} />
            Analisar respostas
          </Link>
        }
      />

      {model.error && <p className="alert alert--error">{model.error}</p>}

      <div className="grid grid--4" style={{ marginBottom: 18 }}>
        <StatCard label="Respostas capturadas" value={insights.total} icon="users" tone="primary" />
        <StatCard label="Últimos 7 dias" value={insights.last7Days} icon="calendar" tone="info" />
        <StatCard label="Com contato" value={insights.withContact} icon="message" tone="warning" />
        <StatCard
          label="Aguardando análise"
          value={insights.byStatus?.NEW || 0}
          icon="doc"
          tone="primary"
        />
      </div>

      <div className="grid grid--2">
        <section className="card card--padding">
          <h2 className="section-title">Perfis que mais responderam</h2>
          {countMap(insights.byProfile).length === 0 ? (
            <p className="page-header__subtitle">Nenhuma resposta capturada ainda.</p>
          ) : (
            <div className="director-bars">
              {countMap(insights.byProfile).map(([label, count]) => (
                <div className="director-bar" key={label}>
                  <span>{label}</span>
                  <strong>{count}</strong>
                </div>
              ))}
            </div>
          )}
        </section>

        <section className="card card--padding">
          <h2 className="section-title">Cidades em destaque</h2>
          {countMap(insights.byCity).length === 0 ? (
            <p className="page-header__subtitle">Nenhuma cidade informada ainda.</p>
          ) : (
            <div className="director-bars">
              {countMap(insights.byCity).map(([label, count]) => (
                <div className="director-bar" key={label}>
                  <span>{label}</span>
                  <strong>{count}</strong>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>

      <section className="card card--padding director-panel">
        <h2 className="section-title">Últimas respostas</h2>
        {insights.latest?.length ? (
          <div className="table-wrap">
            <table className="table">
              <thead>
                <tr>
                  <th>Perfil</th>
                  <th>Cidade</th>
                  <th>Status</th>
                  <th>Recebida em</th>
                </tr>
              </thead>
              <tbody>
                {insights.latest.map((item) => (
                  <tr key={item.id}>
                    <td>{item.profile || "Não informado"}</td>
                    <td>{item.city || "Não informada"}</td>
                    <td>{item.status}</td>
                    <td>{new Date(item.createdAt).toLocaleString("pt-BR")}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="page-header__subtitle">
            As respostas aparecem aqui quando o visitante autorizar a captura na pesquisa.
          </p>
        )}
      </section>
    </div>
  );
}

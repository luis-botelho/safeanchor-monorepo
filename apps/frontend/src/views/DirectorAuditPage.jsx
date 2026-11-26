import LoadingFallback from "../components/LoadingFallback";
import PageHeader from "../components/PageHeader";
import useDirectorViewModel from "../viewmodels/useDirectorViewModel";

function actionLabel(action) {
  if (action === "UPDATE_USER") return "Alteração de usuário";
  if (action === "UPDATE_RESPONSE") return "Decisão sobre resposta";
  return action;
}

export default function DirectorAuditPage() {
  const model = useDirectorViewModel();

  if (model.loading) {
    return <LoadingFallback label="Carregando auditoria" />;
  }

  return (
    <div>
      <PageHeader
        eyebrow="Diretoria · Auditoria"
        title="Histórico de decisões"
        subtitle="Registro mínimo de quem alterou usuários ou respostas. Senhas e tokens nunca entram na auditoria."
      />

      {model.error && <p className="alert alert--error">{model.error}</p>}

      <section className="card director-panel">
        {model.actions.length === 0 ? (
          <div className="card--padding">
            <p className="page-header__subtitle">Nenhuma alteração registrada ainda.</p>
          </div>
        ) : (
          <div className="table-wrap">
            <table className="table">
              <thead>
                <tr>
                  <th>Quando</th>
                  <th>Ação</th>
                  <th>Alvo</th>
                  <th>Detalhes</th>
                </tr>
              </thead>
              <tbody>
                {model.actions.map((item) => (
                  <tr key={item.id}>
                    <td>{new Date(item.createdAt).toLocaleString("pt-BR")}</td>
                    <td>{actionLabel(item.action)}</td>
                    <td>
                      {item.targetType} · <code>{item.targetId}</code>
                    </td>
                    <td>
                      <pre className="director-json">
                        {JSON.stringify(item.details)}
                      </pre>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}

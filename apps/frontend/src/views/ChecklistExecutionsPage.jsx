import { useEffect } from "react";
import { Link } from "react-router-dom";

import { useChecklistExecutionViewModel } from "../viewmodels/useChecklistExecutionViewModel";

export default function ChecklistExecutionsPage() {
  const viewModel = useChecklistExecutionViewModel();

  useEffect(() => {
    viewModel.loadChecklistExecutions();
  }, []);

  if (viewModel.isLoadingList) {
    return <p>Carregando...</p>;
  }

  if (viewModel.error) {
    return <p>{viewModel.error}</p>;
  }

  return (
    <main>
      <h1>Execuções de Checklist</h1>

      <Link to="/checklist-executions/new">
        Nova execução
      </Link>

      {viewModel.checklistExecutions.length === 0 ? (
        <p>Nenhuma execução cadastrada.</p>
      ) : (
        viewModel.checklistExecutions.map((execution) => (
          <article key={execution.id}>
            <h2>Execução {execution.id}</h2>

            <p>Template: {execution.templateId}</p>

            <p>Embarcação: {execution.vesselId}</p>

            <p>Executado em: {execution.executedAt}</p>

            {Array.isArray(execution.responses) && execution.responses.length > 0 ? (
              <ul>
                {execution.responses.map((response, index) => (
                  <li key={index}>
                    {typeof response === "string"
                      ? response
                      : JSON.stringify(response)}
                  </li>
                ))}
              </ul>
            ) : (
              <p>Sem respostas registradas.</p>
            )}
          </article>
        ))
      )}
    </main>
  );
}
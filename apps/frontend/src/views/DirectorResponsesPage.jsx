import { useEffect, useState } from "react";

import Icon from "../components/Icon";
import LoadingFallback from "../components/LoadingFallback";
import PageHeader from "../components/PageHeader";
import { buildPath } from "../mock/researchQuestions";
import useDirectorViewModel from "../viewmodels/useDirectorViewModel";

const EMPTY_EDITOR = { status: "NEW", decision: "" };

function answerLines(response) {
  const questions = buildPath(response.profile);
  const entries = Object.entries(response.answers || {});

  return entries.map(([key, value]) => {
    const question = questions.find(
      (item) => item.id === key || `${item.id}__other` === key,
    );
    const values = Array.isArray(value) ? value : [value];
    const readable = values
      .map((item) => {
        const option = question?.options?.find(
          (candidate) => candidate.value === item,
        );
        return option?.label || String(item);
      })
      .join("; ");

    return {
      label: question?.question || key,
      value: readable,
    };
  });
}

export default function DirectorResponsesPage() {
  const model = useDirectorViewModel();
  const [selectedId, setSelectedId] = useState(null);
  const [editor, setEditor] = useState(EMPTY_EDITOR);

  useEffect(() => {
    if (!model.responses.length) {
      setSelectedId(null);
      setEditor(EMPTY_EDITOR);
      return;
    }

    const selected = model.responses.find((item) => item.id === selectedId);
    const current = selected || model.responses[0];
    setSelectedId(current.id);
    setEditor({ status: current.status, decision: current.decision || "" });
  }, [model.responses, selectedId]);

  if (model.loading) {
    return <LoadingFallback label="Carregando respostas" />;
  }

  const selected = model.responses.find((item) => item.id === selectedId);

  function choose(response) {
    setSelectedId(response.id);
    setEditor({ status: response.status, decision: response.decision || "" });
    setEditor((current) => ({ ...current }));
  }

  function updateFilter(field, value) {
    model.applyFilters({ ...model.filters, [field]: value });
  }

  async function save() {
    if (!selected) return;
    await model.saveResponse(selected.id, editor);
  }

  return (
    <div>
      <PageHeader
        eyebrow="Diretoria · Pesquisa"
        title="Respostas capturadas"
        subtitle="Filtre, leia e registre a decisão tomada. Cada alteração entra na auditoria."
        actions={
          <button type="button" className="btn btn--ghost" onClick={model.refresh}>
            <Icon name="back" size={16} />
            Recarregar
          </button>
        }
      />

      {model.error && <p className="alert alert--error">{model.error}</p>}
      {model.notice && <p className="alert alert--success">{model.notice}</p>}

      <section className="card card--padding director-panel">
        <div className="grid grid--3">
          <div className="field">
            <label className="field__label" htmlFor="director-status">Status</label>
            <select
              id="director-status"
              className="select"
              value={model.filters.status}
              onChange={(event) => updateFilter("status", event.target.value)}
            >
              <option value="">Todos</option>
              <option value="NEW">Novas</option>
              <option value="REVIEWED">Em análise</option>
              <option value="ACTIONED">Com decisão</option>
            </select>
          </div>
          <div className="field">
            <label className="field__label" htmlFor="director-profile">Perfil</label>
            <input
              id="director-profile"
              className="input"
              value={model.filters.profile}
              onChange={(event) => updateFilter("profile", event.target.value)}
              placeholder="Ex.: marina"
            />
          </div>
          <div className="field">
            <label className="field__label" htmlFor="director-city">Cidade</label>
            <input
              id="director-city"
              className="input"
              value={model.filters.city}
              onChange={(event) => updateFilter("city", event.target.value)}
              placeholder="Ex.: Santos"
            />
          </div>
        </div>
      </section>

      <div className="director-split">
        <section className="card director-panel">
          <div className="card--padding">
            <h2 className="section-title">{model.responses.length} respostas</h2>
          </div>
          {model.responses.length === 0 ? (
            <div className="card--padding">
              <p className="page-header__subtitle">
                Nenhuma resposta com esses filtros. Visitantes que recusam a captura
                não aparecem aqui.
              </p>
            </div>
          ) : (
            <div className="director-list">
              {model.responses.map((item) => (
                <button
                  type="button"
                  key={item.id}
                  className={`director-list__item${item.id === selectedId ? " director-list__item--active" : ""}`}
                  onClick={() => choose(item)}
                >
                  <strong>{item.profile || "Não informado"}</strong>
                  <small>
                    {item.city || "Sem cidade"} · {item.status}
                  </small>
                </button>
              ))}
            </div>
          )}
        </section>

        <section className="card card--padding director-panel">
          {!selected ? (
            <p className="page-header__subtitle">Selecione uma resposta para analisar.</p>
          ) : (
            <>
              <h2 className="section-title">Detalhe da resposta</h2>
              <p className="director-meta">
                Recebida em {new Date(selected.createdAt).toLocaleString("pt-BR")}
                {" · "}consentimento v{selected.consentVersion}
              </p>

              <div className="director-answers">
                {answerLines(selected).map((line, index) => (
                  <div key={`${line.label}-${index}`}>
                    <strong>{line.label}</strong>
                    <span>{line.value}</span>
                  </div>
                ))}
              </div>

              <div className="field director-field">
                <label className="field__label" htmlFor="director-decision">
                  Decisão / mudança para os usuários
                </label>
                <textarea
                  id="director-decision"
                  className="textarea"
                  value={editor.decision}
                  onChange={(event) =>
                    setEditor((current) => ({ ...current, decision: event.target.value }))
                  }
                  placeholder="Ex.: criar alerta de documentos a vencer em 30 dias"
                  rows={4}
                />
              </div>

              <div className="field director-field">
                <label className="field__label" htmlFor="director-response-status">
                  Status
                </label>
                <select
                  id="director-response-status"
                  className="select"
                  value={editor.status}
                  onChange={(event) =>
                    setEditor((current) => ({ ...current, status: event.target.value }))
                  }
                >
                  <option value="NEW">Nova</option>
                  <option value="REVIEWED">Em análise</option>
                  <option value="ACTIONED">Com decisão</option>
                </select>
              </div>

              <button
                type="button"
                className="btn btn--primary"
                onClick={save}
                disabled={model.saving}
              >
                <Icon name="check" size={16} />
                {model.saving ? "Salvando…" : "Salvar decisão"}
              </button>
            </>
          )}
        </section>
      </div>
    </div>
  );
}

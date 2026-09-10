import { useState } from "react";

import Icon from "./Icon";

// Painel conceitual de IA: pergunta sugerida (chip) -> resposta mockada.
// Nenhuma chamada externa: respostas vem do mock/ai.js conforme a persona.
export default function AiCard({ title, intro, questions, onAsk, answers = {} }) {
  const [selected, setSelected] = useState(null);
  const [answer, setAnswer] = useState(null);

  async function handleAsk(question) {
    setSelected(question);
    const result = await onAsk(question);
    setAnswer(result);
  }

  return (
    <section className="card ai">
      <div className="card--padding">
        <div className="ai__head">
          <span className="ai__icon">
            <Icon name="star" size={18} />
          </span>
          <div>
            <h2 className="ai__title">{title}</h2>
            <p className="page-header__subtitle">{intro}</p>
          </div>
        </div>

        <div className="tags" style={{ marginTop: 12 }}>
          {questions.map((question) => (
            <button
              className="tag tag--interactive"
              type="button"
              key={question}
              onClick={() => handleAsk(question)}
            >
              {question}
            </button>
          ))}
        </div>

        {selected && (
          <div className="ai__thread">
            <div className="ai__question">
              <span className="ai__q-label">Você</span>
              <p>{selected}</p>
            </div>
            <div className="ai__answer">
              <span className="ai__q-label">SafeAnchor IA</span>
              <p>{answer || "Analisando contexto náutico..."}</p>
            </div>
          </div>
        )}

        <p className="ai__disclaimer">
          Demonstração conceitual — as respostas são geradas localmente e não
          usam serviços externos de IA.
        </p>
      </div>
    </section>
  );
}
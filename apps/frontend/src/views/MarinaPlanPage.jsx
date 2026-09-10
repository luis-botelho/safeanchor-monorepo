import { useEffect, useState } from "react";

import PageHeader from "../components/PageHeader";
import Icon from "../components/Icon";
import StatusBadge from "../components/StatusBadge";

import { getPlans, getB2bData } from "../services/marinaPlanService";

export default function MarinaPlanPage() {
  const [plans, setPlans] = useState([]);
  const [b2b, setB2b] = useState(null);

  useEffect(() => {
    getPlans().then(setPlans);
    getB2bData().then(setB2b);
  }, []);

  if (!b2b) {
    return <p>Carregando planos...</p>;
  }

  return (
    <div>
      <PageHeader
        eyebrow="Marina Costa Azul · B2B"
        title="Plano e ecossistema conectado"
        subtitle="Cada plano destrava camadas do SafeAnchor — do mural de vagas à integração de API com o sistema da marina."
      />

      <div className="grid grid--3" style={{ marginBottom: 20 }}>
        {plans.map((plan) => (
          <div
            className={`plan-card ${plan.highlighted ? "plan-card--highlight" : ""}`}
            key={plan.id}
          >
            <div className="plan-card__head">
              <span className="badge badge--neutral">{plan.name}</span>
              <StatusBadge label="Plano" tone={plan.tone} />
            </div>
            <strong className="plan-card__price">{plan.price}</strong>
            <ul className="plan-card__list">
              {plan.includes.map((item) => (
                <li key={item}>
                  <Icon name="check" size={14} />
                  {item}
                </li>
              ))}
            </ul>
            <button
              type="button"
              className={`btn ${plan.highlighted ? "btn--primary" : "btn--ghost"}`}
            >
              {plan.id === "plan-ecossistema" ? "Falar com especialista" : "Assinar em demo"}
            </button>
          </div>
        ))}
      </div>

      <div className="grid grid--stack">
        <div className="stack">
          <section className="card card--padding">
            <div className="section-title">
              <h2>Parcerias da marina</h2>
              <span className="badge badge--accent">{b2b.pilotMarinas} marinas piloto</span>
            </div>
            {b2b.partnerships.map((partnership) => (
              <div className="mnt mnt--column" key={partnership.id}>
                <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
                  <span className="mnt__icon">
                    <Icon name="users" size={17} />
                  </span>
                  <div>
                    <p className="mnt__title">{partnership.name}</p>
                    <p className="mnt__meta">
                      {partnership.type} · {partnership.benefit}
                    </p>
                  </div>
                  <StatusBadge
                    label={partnership.status}
                    tone={partnership.status === "Ativo" ? "success" : "warning"}
                  />
                </div>
              </div>
            ))}
          </section>
        </div>
        <div className="stack">
          <section className="card card--padding">
            <div className="section-title">
              <h2>Vantagens do ecossistema</h2>
            </div>
            <div className="ai-banner">
              <span className="ai-banner__icon"><Icon name="check" size={17} /></span>
              <div>
                <strong>Dados conectados</strong>
                <p>
                  Reservas, operação e serviços publicados alimentam a página
                  pública da marina e o Marketplace automaticamente.
                </p>
              </div>
            </div>
            <div className="ai-banner">
              <span className="ai-banner__icon"><Icon name="star" size={17} /></span>
              <div>
                <strong>Marina verificada</strong>
                <p>
                  O selo aparece na comunidade e nas rotas de quem planeja
                  viagem na sua região.
                </p>
              </div>
            </div>
            <div className="ai-banner">
              <span className="ai-banner__icon"><Icon name="shopping" size={17} /></span>
              <div>
                <strong>Receita B2B</strong>
                <p>
                  Pacotes combinados com prestadores e fornecedores parceiros
                  ampliam a receita sem custo extra de equipe.
                </p>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
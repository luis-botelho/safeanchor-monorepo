import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import PageHeader from "../components/PageHeader";
import StatCard from "../components/StatCard";
import AiCard from "../components/AiCard";
import Icon from "../components/Icon";

import { getProviderAi, askProvider } from "../services/aiService";
import { useAuth } from "../context/AuthContext";
import { getProviderById } from "../services/providerService";

export default function ProviderAIPage() {
  const { user } = useAuth();
  const [ai, setAi] = useState(null);
  const [provider, setProvider] = useState(null);

  useEffect(() => {
    getProviderAi().then(setAi);
    if (user?.providerId) {
      getProviderById(user.providerId).then(setProvider);
    }
  }, [user]);

  if (!ai) {
    return <p>Carregando assistente...</p>;
  }

  return (
    <div>
      <PageHeader
        eyebrow="Assistente do prestador"
        title="SafeAnchor IA"
        subtitle={ai.intro}
      />

      <div className="grid grid--4" style={{ marginBottom: 20 }}>
        {ai.stats.map((stat) => (
          <StatCard
            key={stat.label}
            label={stat.label}
            value={stat.value}
            icon={stat.label === "Taxa de resposta" ? "message" : stat.label.includes("Oportunidades") ? "users" : "shopping"}
            tone="primary"
            hint={stat.note}
          />
        ))}
        {provider && (
          <StatCard
            label="Match atual"
            value="92%"
            icon="star"
            tone="accent"
            hint="com o job Yamaha 2x200"
          />
        )}
      </div>

      <div className="grid grid--stack">
        <div className="stack">
          <AiCard
            title="Pergunte sobre seus jobs e orçamentos"
            intro="O assistente usa o seu perfil e o estado da operação para responder."
            questions={Object.keys(ai.answerByQuestion)}
            onAsk={askProvider}
          />
        </div>
        <div className="stack">
          <section className="card card--padding">
            <div className="section-title">
              <h2>O que a IA não substitui</h2>
            </div>
            <p className="page-header__subtitle">
              As respostas são conceituais e ajudam a preparar orçamentos e priorizar
              agenda. A decisão final e a responsabilidade técnica permanecem com o
              prestador habilitado.
            </p>
          </section>
          <section className="card card--padding">
            <div className="section-title">
              <h2>Ferramentas relacionadas</h2>
            </div>
            <Link className="btn btn--ghost" to="/jobs" style={{ marginBottom: 8 }}>
              <Icon name="wrench" size={16} />
              Ver jobs e oportunidades
            </Link>
            <Link className="btn btn--ghost" to="/provider/academy" style={{ marginBottom: 8 }}>
              <Icon name="doc" size={16} />
              Melhorar perfil no Academy
            </Link>
            <Link className="btn btn--ghost" to="/service-requests">
              <Icon name="message" size={16} />
              Solicitações de serviço
            </Link>
          </section>
        </div>
      </div>
    </div>
  );
}
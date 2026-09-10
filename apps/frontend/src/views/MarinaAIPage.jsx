import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import PageHeader from "../components/PageHeader";
import AiCard from "../components/AiCard";
import Icon from "../components/Icon";
import StatusBadge from "../components/StatusBadge";

import { getMarinaAi, askMarina } from "../services/aiService";
import { useAuth } from "../context/AuthContext";
import { getMarinaById } from "../services/marinaService";

export default function MarinaAIPage() {
  const { user } = useAuth();
  const [ai, setAi] = useState(null);
  const [marina, setMarina] = useState(null);

  useEffect(() => {
    getMarinaAi().then(setAi);
    const marinaId = user?.marinaId || "marin-costa-azul";
    getMarinaById(marinaId).then(setMarina);
  }, [user]);

  if (!ai) {
    return <p>Carregando assistente da marina...</p>;
  }

  return (
    <div>
      <PageHeader
        eyebrow="Marina Costa Azul · Inteligência"
        title="SafeAnchor IA (Marina)"
        subtitle={ai.intro}
      />

      <div className="grid grid--stack" style={{ marginBottom: 20 }}>
        {ai.insights.map((insight) => (
          <div className="ai-banner" key={insight.title}>
            <span className="ai-banner__icon">
              <Icon name="star" size={18} />
            </span>
            <div>
              <strong>{insight.title}</strong>
              <p>{insight.preview}</p>
            </div>
          </div>
        ))}
      </div>

      <AiCard
        title="Pergunte sobre ocupação, serviços e B2B"
        intro="O assistente lê os dados simulados de ocupação, operação e parcerias."
        questions={Object.keys(ai.answerByQuestion)}
        onAsk={askMarina}
      />

      <div className="grid grid--3" style={{ marginTop: 20 }}>
        <Link className="mini-link" to="/marina/reservations">
          <Icon name="calendar" size={17} />
          <div>
            <strong>Reservas</strong>
            <span>Próximos 7 dias de vagas</span>
          </div>
        </Link>
        <Link className="mini-link" to="/marina/plan">
          <Icon name="shopping" size={17} />
          <div>
            <strong>Plano B2B</strong>
            <span>Comparar planos da marina</span>
          </div>
        </Link>
        <Link className="mini-link" to="/marketplace">
          <Icon name="shopping" size={17} />
          <div>
            <strong>Catálogo no Marketplace</strong>
            <span>O que a marina publica</span>
          </div>
        </Link>
        {marina && (
          <div className="mini-link mini-link--static">
            <StatusBadge label={`Ocupação ${marina.occupancyPercent}%`} tone="warning" />
            <div>
              <strong>{marina.berths} vagas</strong>
              <span>{marina.occupied} ocupadas agora</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
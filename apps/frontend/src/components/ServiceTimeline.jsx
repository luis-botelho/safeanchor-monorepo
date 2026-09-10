export default function ServiceTimeline({ steps, tone = "neutral" }) {
  if (!steps || steps.length === 0) {
    return <p className="page-header__subtitle">Nenhum evento registrado.</p>;
  }

  return (
    <ol className="timeline">
      {steps.map((step, index) => (
        <li className="timeline__item" key={`${step.label}-${index}`}>
          <div className={`timeline__marker timeline__marker--${step.tone || tone}`}>
            {index === steps.length - 1 ? "•" : index + 1}
          </div>
          <div className="timeline__body">
            <div className="timeline__head">
              <strong className="timeline__label">{step.label}</strong>
              {step.time && <span className="timeline__time">{step.time}</span>}
            </div>
            {step.actor && (
              <p className="timeline__actor">{step.actor}</p>
            )}
            {step.observation && (
              <p className="timeline__observation">{step.observation}</p>
            )}
          </div>
        </li>
      ))}
    </ol>
  );
}
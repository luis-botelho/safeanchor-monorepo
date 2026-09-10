function toneFor(value) {
  if (value >= 80) return "success";
  if (value >= 60) return "warning";
  return "danger";
}

export default function ReadinessGauge({ value = 0, size = 72, label }) {
  const tone = toneFor(value);
  const angle = Math.round(value * 3.6);

  return (
    <div
      className={`gauge gauge--${tone}`}
      style={{
        "--gauge-angle": `${angle}deg`,
        width: size,
        height: size,
      }}
      role="img"
      aria-label={`Prontidão operacional ${value}%`}
    >
      <div className="gauge__inner">
        <strong className="gauge__value">{value}%</strong>
        {label && <span className="gauge__label">{label}</span>}
      </div>
    </div>
  );
}
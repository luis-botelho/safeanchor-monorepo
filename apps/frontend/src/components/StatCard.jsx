import Icon from "./Icon";

export default function StatCard({ label, value, icon, tone = "primary", hint }) {
  return (
    <div className={`stat-card stat-card--${tone}`}>
      <span className="stat-card__icon">
        <Icon name={icon} size={20} />
      </span>
      <div className="stat-card__body">
        <strong className="stat-card__value">{value}</strong>
        <span className="stat-card__label">{label}</span>
        {hint && <span className="stat-card__hint">{hint}</span>}
      </div>
    </div>
  );
}
import { Link } from "react-router-dom";

import Icon from "./Icon";

export default function PageHeader({ eyebrow, title, subtitle, actions }) {
  return (
    <header className="page-header">
      <div className="page-header__text">
        {eyebrow && <span className="page-header__eyebrow">{eyebrow}</span>}
        <h1 className="page-header__title">{title}</h1>
        {subtitle && <p className="page-header__subtitle">{subtitle}</p>}
      </div>
      {actions && <div className="page-header__actions">{actions}</div>}
    </header>
  );
}

export function BackLink({ to, label }) {
  return (
    <Link className="back-link" to={to}>
      <Icon name="back" size={16} />
      {label}
    </Link>
  );
}
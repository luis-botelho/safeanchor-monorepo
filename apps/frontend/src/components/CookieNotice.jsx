import { useState } from "react";
import { Link } from "react-router-dom";

import Icon from "./Icon";

const CONSENT_KEY = "safeanchor.cookieConsent";

function alreadyAnswered() {
  try {
    return Boolean(localStorage.getItem(CONSENT_KEY));
  } catch {
    return true;
  }
}

export default function CookieNotice() {
  const [visible, setVisible] = useState(() => !alreadyAnswered());

  if (!visible) {
    return null;
  }

  function accept() {
    try {
      localStorage.setItem(CONSENT_KEY, "accepted");
    } catch {
      /* navegação privada: apenas esconde o aviso */
    }
    setVisible(false);
  }

  return (
    <aside className="cookie-notice" aria-label="Aviso sobre privacidade">
      <span className="cookie-notice__icon" aria-hidden="true">
        <Icon name="doc" size={20} />
      </span>

      <div className="cookie-notice__body">
        <strong className="cookie-notice__title">
          Privacidade e armazenamento local
        </strong>
        <p className="cookie-notice__text">
          Guardamos no seu navegador apenas o necessário para manter a sessão,
          salvar o rascunho da pesquisa e lembrar desta escolha. Não usamos cookies
          de rastreamento nem publicidade.
        </p>
        <div className="cookie-notice__actions">
          <button
            type="button"
            className="btn btn--primary btn--sm"
            onClick={accept}
          >
            Entendi e aceitar
          </button>
          <Link className="cookie-notice__link" to="/privacidade">
            Ler a política de privacidade
          </Link>
        </div>
      </div>
    </aside>
  );
}

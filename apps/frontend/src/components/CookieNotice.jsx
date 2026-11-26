import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import Icon from "./Icon";
import {
  CONSENT_CHANGED_EVENT,
  PRIVACY_NOTICE_KEY,
  markPrivacyNoticeSeen,
  readResearchConsent,
  saveResearchConsent,
} from "../services/researchConsent";

function noticeAnswered() {
  try {
    return Boolean(localStorage.getItem(PRIVACY_NOTICE_KEY));
  } catch {
    return true;
  }
}

export default function CookieNotice() {
  const [visible, setVisible] = useState(() => !noticeAnswered() || !readResearchConsent());

  useEffect(() => {
    function refresh() {
      setVisible(!noticeAnswered() || !readResearchConsent());
    }

    window.addEventListener(CONSENT_CHANGED_EVENT, refresh);
    return () => window.removeEventListener(CONSENT_CHANGED_EVENT, refresh);
  }, []);

  if (!visible) {
    return null;
  }

  function decide(decision) {
    saveResearchConsent(decision);
    markPrivacyNoticeSeen();
    setVisible(false);
  }

  return (
    <aside className="cookie-notice" aria-label="Aviso sobre privacidade">
      <span className="cookie-notice__icon" aria-hidden="true">
        <Icon name="doc" size={20} />
      </span>

      <div className="cookie-notice__body">
        <strong className="cookie-notice__title">
          Sua privacidade nesta demonstração
        </strong>
        <p className="cookie-notice__text">
          Não usamos cookies de rastreamento, analytics ou publicidade. Se você
          <strong> aceitar</strong>, as respostas da pesquisa serão enviadas ao
          servidor e analisadas pela diretoria para decidir o que construir. Se
          <strong> recusar</strong>, você ainda pode responder: nada é capturado
          no servidor e o resumo fica só no seu navegador.
        </p>
        <div className="cookie-notice__actions">
          <button
            type="button"
            className="btn btn--primary btn--sm"
            onClick={() => decide("accepted")}
          >
            Aceitar captura
          </button>
          <button
            type="button"
            className="btn btn--ghost btn--sm"
            onClick={() => decide("declined")}
          >
            Recusar captura
          </button>
          <Link className="cookie-notice__link" to="/privacidade">
            Ler a política de privacidade
          </Link>
        </div>
      </div>
    </aside>
  );
}

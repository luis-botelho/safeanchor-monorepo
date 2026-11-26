import { useState } from "react";

import {
  buildWhatsappUrl,
  hasWhatsappTarget,
} from "../services/researchService";
import Icon from "./Icon";

const greeting =
  "Olá! Vim pelo site SafeAnchor e gostaria de entrar em contato.";

export default function WhatsAppButton() {
  const [open, setOpen] = useState(false);

  if (!hasWhatsappTarget()) {
    return null;
  }

  return (
    <div className="whatsapp-widget">
      {open && (
        <div
          className="whatsapp-widget__card"
          role="dialog"
          aria-label="Contato pelo WhatsApp"
        >
          <div className="whatsapp-widget__card-head">
            <span className="whatsapp-widget__avatar">
              <Icon name="whatsapp" size={18} />
            </span>
            <span className="whatsapp-widget__card-title">
              <strong>SafeAnchor</strong>
              <small>Respondemos pelo WhatsApp</small>
            </span>
          </div>

          <p className="whatsapp-widget__text">
            Tem dúvida sobre a demonstração ou quer falar com a equipe? Envie uma
            mensagem — a conversa abre no seu WhatsApp.
          </p>

          <a
            className="whatsapp-widget__cta"
            href={buildWhatsappUrl(greeting)}
            target="_blank"
            rel="noopener noreferrer"
          >
            Iniciar conversa
            <Icon name="send" size={15} />
          </a>
        </div>
      )}

      <button
        type="button"
        className={`whatsapp-widget__fab${open ? " whatsapp-widget__fab--open" : ""}`}
        onClick={() => setOpen((value) => !value)}
        aria-label={
          open ? "Fechar contato pelo WhatsApp" : "Abrir contato pelo WhatsApp"
        }
        aria-expanded={open}
      >
        {open ? (
          <span className="whatsapp-widget__close" aria-hidden="true">
            ×
          </span>
        ) : (
          <Icon name="whatsapp" size={27} />
        )}
      </button>
    </div>
  );
}

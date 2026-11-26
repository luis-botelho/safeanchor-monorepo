import { useEffect, useState } from "react";

import Icon from "./Icon";

const slides = [
  {
    icon: "fleet",
    eyebrow: "Frota sob controle",
    title: "Tudo em um só painel",
    text: "Embarcações, status, documentos e prazos organizados para a operação diária.",
  },
  {
    icon: "wrench",
    eyebrow: "Manutenção",
    title: "Sem surpresas na maré",
    text: "Preventivas, ordens de serviço e histórico por embarcação, com responsáveis claros.",
  },
  {
    icon: "doc",
    eyebrow: "Inspeções",
    title: "Evidência em cada checklist",
    text: "Checklists digitais, itens reprovados e certificado emitido ao concluir a inspeção.",
  },
  {
    icon: "users",
    eyebrow: "Comunidade",
    title: "A rede náutica junto",
    text: "Prestadores, marinas, vagas e serviços para manter a embarcação pronta para navegar.",
  },
];

const SLIDE_INTERVAL = 5000;

export default function AuthCarousel() {
  const [active, setActive] = useState(0);
  const slide = slides[active];

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return undefined;
    }

    const timer = window.setInterval(() => {
      setActive((current) => (current + 1) % slides.length);
    }, SLIDE_INTERVAL);

    return () => window.clearInterval(timer);
  }, []);

  function select(index) {
    setActive((index + slides.length) % slides.length);
  }

  return (
    <section className="auth-carousel" aria-label="Funcionalidades do SafeAnchor">
      <div className="auth-carousel__item" key={active} aria-live="polite">
        <span className="auth-carousel__icon">
          <Icon name={slide.icon} size={22} />
        </span>
        <p className="auth-carousel__eyebrow">{slide.eyebrow}</p>
        <p className="auth-carousel__title">{slide.title}</p>
        <p className="auth-carousel__text">{slide.text}</p>
      </div>

      <div className="auth-carousel__controls">
        <button
          type="button"
          className="auth-carousel__arrow"
          onClick={() => select(active - 1)}
          aria-label="Funcionalidade anterior"
        >
          ‹
        </button>

        <div className="auth-carousel__dots">
          {slides.map((item, index) => (
            <button
              type="button"
              key={item.title}
              className={`auth-carousel__dot${index === active ? " auth-carousel__dot--active" : ""}`}
              onClick={() => select(index)}
              aria-label={`Mostrar funcionalidade ${index + 1}: ${item.title}`}
              aria-current={index === active ? "true" : undefined}
            />
          ))}
        </div>

        <button
          type="button"
          className="auth-carousel__arrow"
          onClick={() => select(active + 1)}
          aria-label="Próxima funcionalidade"
        >
          ›
        </button>
      </div>
    </section>
  );
}

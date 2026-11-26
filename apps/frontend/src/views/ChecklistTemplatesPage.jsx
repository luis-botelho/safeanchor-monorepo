import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import { getChecklistTemplates } from "../services/checklistTemplateService";

export default function ChecklistTemplatesPage() {
  const [templates, setTemplates] = useState([]);
  const [loadError, setLoadError] = useState("");

  useEffect(() => {
    loadTemplates();
  }, []);

  async function loadTemplates() {
    try {
      const data = await getChecklistTemplates();
      setTemplates(data);
      setLoadError("");
    } catch {
      // Evita console.error: mensagens de erro podem incluir URLs com token,
      // detalhes da API ou stack trace. Mostra texto genérico ao usuário.
      setLoadError("Não foi possível carregar os modelos de checklist.");
    }
  }

  return (
    <div>
      <h1>Checklist Templates</h1>

      <Link to="/checklist-templates/new">
        Novo Template
      </Link>

      {loadError && <p className="field__error">{loadError}</p>}

      {templates.length === 0 ? (
        <p>Nenhum template cadastrado.</p>
      ) : (
        <ul>
          {templates.map((template) => (
            <li key={template.id}>
              <h3>{template.title}</h3>

              <p>{template.vesselType}</p>

              <ul>
                {template.items.map((item, index) => (
                  <li key={index}>{item}</li>
                ))}
              </ul>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
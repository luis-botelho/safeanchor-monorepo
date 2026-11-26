import { useState } from "react";

import Icon from "../components/Icon";
import LoadingFallback from "../components/LoadingFallback";
import PageHeader from "../components/PageHeader";
import { useAuth } from "../context/AuthContext";
import useDirectorViewModel from "../viewmodels/useDirectorViewModel";

const ROLE_OPTIONS = [
  ["USER", "Proprietário (USER)"],
  ["MANAGER", "Gestor (MANAGER)"],
  ["ADMIN", "Administrador (ADMIN)"],
  ["DIRECTOR", "Admin da diretoria (DIRECTOR)"],
];

const PERSONA_OPTIONS = [
  ["OWNER", "Proprietário"],
  ["SERVICE_PROVIDER", "Prestador"],
  ["MARINA", "Marina"],
];

export default function DirectorUsersPage() {
  const model = useDirectorViewModel();
  const { user: currentUser } = useAuth();
  const [drafts, setDrafts] = useState({});

  if (model.loading) {
    return <LoadingFallback label="Carregando usuários" />;
  }

  function draftFor(user) {
    return drafts[user.id] || { role: user.role, persona: user.persona };
  }

  function updateDraft(id, field, value) {
    setDrafts((current) => ({
      ...current,
      [id]: { ...(current[id] || {}), [field]: value },
    }));
  }

  async function save(user) {
    await model.saveUser(user.id, draftFor(user));
  }

  return (
    <div>
      <PageHeader
        eyebrow="Diretoria · Usuários"
        title="Permissões e personas"
        subtitle="Autorização real usa o papel (role). A persona apenas escolhe a navegação exibida."
      />

      {model.error && <p className="alert alert--error">{model.error}</p>}
      {model.notice && <p className="alert alert--success">{model.notice}</p>}

      <section className="card director-panel">
        <div className="table-wrap">
          <table className="table">
            <thead>
              <tr>
                <th>Usuário</th>
                <th>Papel</th>
                <th>Persona</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {model.users.map((item) => {
                const draft = draftFor(item);
                const isSelf = item.id === currentUser?.id;
                return (
                  <tr key={item.id}>
                    <td>
                      <strong>{item.name}</strong>
                      <br />
                      <small>{item.email}</small>
                    </td>
                    <td>
                      <select
                        className="select"
                        value={draft.role}
                        disabled={isSelf}
                        onChange={(event) => updateDraft(item.id, "role", event.target.value)}
                        aria-label={`Papel de ${item.name}`}
                      >
                        {ROLE_OPTIONS.map(([value, label]) => (
                          <option key={value} value={value}>{label}</option>
                        ))}
                      </select>
                    </td>
                    <td>
                      <select
                        className="select"
                        value={draft.persona}
                        disabled={isSelf}
                        onChange={(event) => updateDraft(item.id, "persona", event.target.value)}
                        aria-label={`Persona de ${item.name}`}
                      >
                        {PERSONA_OPTIONS.map(([value, label]) => (
                          <option key={value} value={value}>{label}</option>
                        ))}
                      </select>
                    </td>
                    <td>
                      <button
                        type="button"
                        className="btn btn--primary btn--sm"
                        onClick={() => save(item)}
                        disabled={model.saving || isSelf}
                        title={isSelf ? "Você não pode alterar seu próprio papel" : undefined}
                      >
                        <Icon name="check" size={14} />
                        Salvar
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}

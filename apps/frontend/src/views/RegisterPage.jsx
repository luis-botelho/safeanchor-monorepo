import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import { useAuth } from "../context/AuthContext";
import Icon from "../components/Icon";
import SubmitButton from "../components/SubmitButton";

const personas = [
  { value: "OWNER", label: "Proprietário" },
  { value: "SERVICE_PROVIDER", label: "Prestador de serviços" },
  { value: "MARINA", label: "Marina" },
];

export default function RegisterPage() {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [persona, setPersona] = useState("OWNER");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");

    if (!name || !email || password.length < 6) {
      setError("Preencha nome, e-mail e uma senha com pelo menos 6 caracteres.");
      return;
    }

    try {
      setIsLoading(true);
      await register(name, email, password, persona);
      navigate("/dashboard");
    } catch (err) {
      setError(err.message || "Não foi possível criar a conta. Tente novamente.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="auth">
      <aside className="auth__brand">
        <div>
          <span className="auth__brand-mark">
            <Icon name="anchor" size={24} />
          </span>
          <p className="auth__brand-name">SafeAnchor</p>
          <p className="auth__brand-tagline">
            Crie sua conta e comece a organizar sua frota em minutos.
          </p>
        </div>
        <p className="auth__brand-quote">
          "Seus dados ficam salvos no servidor: frota, manutenção, documentos e inspeções
          em um só lugar."
        </p>
      </aside>

      <main className="auth__panel">
        <div className="card auth__card">
          <div className="card--padding">
            <h1 className="auth__card-title">Criar conta</h1>
            <p className="auth__card-subtitle">
              Comece agora, gratuitamente.
            </p>

            <form onSubmit={handleSubmit} className="stack" style={{ marginTop: 6 }}>
              <div className="field">
                <label className="field__label" htmlFor="register-name">
                  Nome completo
                </label>
                <input
                  id="register-name"
                  className="input"
                  type="text"
                  value={name}
                  placeholder="Seu nome"
                  onChange={(event) => setName(event.target.value)}
                />
              </div>

              <div className="field">
                <label className="field__label" htmlFor="register-email">
                  E-mail
                </label>
                <input
                  id="register-email"
                  className="input"
                  type="email"
                  value={email}
                  placeholder="voce@exemplo.com"
                  onChange={(event) => setEmail(event.target.value)}
                />
              </div>

              <div className="field">
                <label className="field__label" htmlFor="register-password">
                  Senha
                </label>
                <input
                  id="register-password"
                  className="input"
                  type="password"
                  value={password}
                  placeholder="Mínimo 6 caracteres"
                  onChange={(event) => setPassword(event.target.value)}
                />
              </div>

              <div className="field">
                <label className="field__label" htmlFor="register-persona">
                  Como você usa o SafeAnchor?
                </label>
                <select
                  id="register-persona"
                  className="select"
                  value={persona}
                  onChange={(event) => setPersona(event.target.value)}
                >
                  {personas.map((item) => (
                    <option key={item.value} value={item.value}>
                      {item.label}
                    </option>
                  ))}
                </select>
              </div>

              {error && <p className="field__error">{error}</p>}

              <SubmitButton
                busy={isLoading}
                idleLabel="Criar conta"
                busyLabel="Criando conta..."
                className="btn btn--primary btn--block"
              />
            </form>

            <p className="auth__footer">
              Já tem conta? <Link to="/login">Entrar</Link>
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}

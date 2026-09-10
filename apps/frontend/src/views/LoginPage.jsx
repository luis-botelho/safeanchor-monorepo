import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import { useAuth } from "../context/AuthContext";
import { personaAccounts } from "../mock/users";
import Icon from "../components/Icon";

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");

    if (!email || !password) {
      setError("Informe e-mail e senha para continuar.");
      return;
    }

    await login(email, password);
    navigate("/dashboard");
  }

  function quickLogin(accountEmail) {
    setEmail(accountEmail);
    setPassword("demo123");
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
            Gestão náutica, manutenção e comunidade para quem vive o mar.
          </p>
        </div>
        <p className="auth__brand-quote">
          "Sua frota operacionalmente pronta, com manutenção em dia e a comunidade náutica
          ao seu lado — tudo em um só lugar."
        </p>
      </aside>

      <main className="auth__panel">
        <div className="card auth__card">
          <div className="card--padding">
            <h1 className="auth__card-title">Bem-vindo de volta</h1>
            <p className="auth__card-subtitle">
              Entre para acompanhar sua frota e serviços.
            </p>

            <div className="demo-banner">
              <strong>MVP demonstrativo — sem backend</strong>
              Escolha uma das três personas ou crie a sua.
            </div>

            {personaAccounts.map((account) => (
              <button
                key={account.persona}
                type="button"
                className="demo-chip"
                onClick={() => quickLogin(account.email)}
              >
                <Icon name={account.icon} size={16} />
                <span>
                  <strong>{account.label}</strong> — <code>{account.email}</code> /{" "}
                  <code>demo123</code>
                </span>
              </button>
            ))}

            <form onSubmit={handleSubmit} className="stack" style={{ marginTop: 18 }}>
              <div className="field">
                <label className="field__label" htmlFor="login-email">
                  E-mail
                </label>
                <input
                  id="login-email"
                  className="input"
                  type="email"
                  value={email}
                  placeholder="voce@exemplo.com"
                  onChange={(event) => setEmail(event.target.value)}
                />
              </div>

              <div className="field">
                <label className="field__label" htmlFor="login-password">
                  Senha
                </label>
                <input
                  id="login-password"
                  className="input"
                  type="password"
                  value={password}
                  placeholder="••••••••"
                  onChange={(event) => setPassword(event.target.value)}
                />
              </div>

              {error && <p className="field__error">{error}</p>}

              <button type="submit" className="btn btn--primary btn--block">
                Entrar
              </button>
            </form>

            <p className="auth__footer">
              Ainda não tem conta? <Link to="/register">Criar conta</Link>
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
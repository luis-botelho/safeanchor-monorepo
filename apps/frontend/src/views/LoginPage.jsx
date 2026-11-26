import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import { useAuth } from "../context/AuthContext";
import AuthCarousel from "../components/AuthCarousel";
import Icon from "../components/Icon";
import SubmitButton from "../components/SubmitButton";
import { personaAccounts as personasForDemo } from "../mock/users";

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");

    if (!email || !password) {
      setError("Informe e-mail e senha para continuar.");
      return;
    }

    try {
      setIsLoading(true);
      const profile = await login(email, password);
      navigate(profile.roleKey === "DIRECTOR" ? "/director" : "/dashboard");
    } catch (err) {
      setError(err.message || "Não foi possível entrar. Tente novamente.");
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
            Gestão náutica, manutenção e comunidade para quem vive o mar.
          </p>
        </div>
        <AuthCarousel />
      </aside>

      <main className="auth__panel">
        <div className="card auth__card">
          <div className="card--padding">
            <h1 className="auth__card-title">Bem-vindo de volta</h1>
            <p className="auth__card-subtitle">
              Entre com sua conta para acompanhar sua frota e serviços.
            </p>

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

              <SubmitButton
                busy={isLoading}
                idleLabel="Entrar"
                busyLabel="Entrando..."
                className="btn btn--primary btn--block"
              />
            </form>

            <div className="demo-access">
              <p className="demo-access__title">Acessos de demonstração</p>
              <p className="demo-access__hint">
                Escolha um perfil para preencher o login e percorrer o fluxo completo.
              </p>
              <div className="demo-access__list">
                {personasForDemo.map((account) => (
                  <button
                    type="button"
                    className="demo-access__item"
                    key={account.email}
                    onClick={() => {
                      setEmail(account.email);
                      setPassword(account.password);
                      setError("");
                    }}
                  >
                    <span className="demo-access__icon">
                      <Icon name={account.icon} size={16} />
                    </span>
                    <span className="demo-access__text">
                      <strong>{account.label}</strong>
                      <small>{account.email}</small>
                    </span>
                    <span className="demo-access__action">Usar</span>
                  </button>
                ))}
              </div>
            </div>

            <p className="auth__footer">
              Ainda não tem conta? <Link to="/register">Criar conta</Link>
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}

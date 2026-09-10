import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import { useAuth } from "../context/AuthContext";
import Icon from "../components/Icon";

export default function RegisterPage() {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");

    if (!name || !email || password.length < 6) {
      setError("Preencha nome, e-mail e uma senha com pelo menos 6 caracteres.");
      return;
    }

    await register(name, email, password);
    navigate("/dashboard");
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
          "Tudo é simulado nesta demonstração: não há envio de dados nem cadastro real.
          Apenas navegue e explore."
        </p>
      </aside>

      <main className="auth__panel">
        <div className="card auth__card">
          <div className="card--padding">
            <h1 className="auth__card-title">Criar conta</h1>
            <p className="auth__card-subtitle">
              Comece agora, gratuitamente.
            </p>

            <div className="demo-banner">
              <strong>Modo demonstrativo</strong>
              Nenhum dado real é criado ou enviado.
            </div>

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

              {error && <p className="field__error">{error}</p>}

              <button type="submit" className="btn btn--primary btn--block">
                Criar conta
              </button>
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
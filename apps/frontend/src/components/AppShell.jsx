import { useState } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";

import { useAuth } from "../context/AuthContext";
import { personaAccounts } from "../mock/users";
import Avatar from "./Avatar";
import Icon from "./Icon";

function navFor(user) {
  if (user?.persona === "SERVICE_PROVIDER") {
    return [
      {
        title: "Visão geral",
        items: [{ to: "/dashboard", label: "Dashboard", icon: "dashboard" }],
      },
      {
        title: "Atendimento",
        items: [
          { to: "/service-requests", label: "Solicitações recebidas", icon: "send" },
          { to: "/inspections", label: "Inspeções", icon: "check" },
        ],
      },
      {
        title: "Oportunidades",
        items: [
          { to: "/jobs", label: "Jobs & Crew", icon: "wrench" },
          { to: "/provider/academy", label: "Academy", icon: "doc" },
          { to: "/provider/ai", label: "IA do prestador", icon: "star" },
        ],
      },
      {
        title: "Reputação",
        items: [
          { to: "/profile", label: "Perfil profissional", icon: "user" },
          {
            to: `/service-providers/${user.providerId || "prov-carlos"}`,
            label: "Página pública",
            icon: "users",
          },
        ],
      },
      {
        title: "Comunidade",
        items: [
          { to: "/marketplace", label: "Marketplace", icon: "shopping" },
          { to: "/events", label: "Eventos", icon: "calendar" },
          { to: "/community", label: "Comunidade", icon: "message" },
        ],
      },
    ];
  }

  if (user?.persona === "MARINA") {
    return [
      {
        title: "Gestão",
        items: [
          { to: "/marina/dashboard", label: "Dashboard", icon: "dashboard" },
          {
            to: `/marinas/${user.marinaId || "marin-costa-azul"}`,
            label: "Minha marina",
            icon: "anchor",
          },
        ],
      },
      {
        title: "Operação",
        items: [
          { to: "/marina/fleet", label: "Frota", icon: "fleet" },
          { to: "/marina/team", label: "Equipe", icon: "users" },
          { to: "/marina/reservations", label: "Reservas", icon: "calendar" },
          { to: "/marina/services", label: "Serviços", icon: "send" },
          {
            to: "/marina/services/catalog",
            label: "Catálogo",
            icon: "shopping",
          },
        ],
      },
      {
        title: "Inteligência",
        items: [
          { to: "/marina/ai", label: "IA da marina", icon: "star" },
          { to: "/marina/plan", label: "Plano B2B", icon: "shopping" },
        ],
      },
      {
        title: "Comunidade",
        items: [
          { to: "/marketplace", label: "Marketplace", icon: "shopping" },
          { to: "/events", label: "Eventos", icon: "calendar" },
          { to: "/service-providers", label: "Prestadores", icon: "users" },
          { to: "/community", label: "Comunidade", icon: "message" },
        ],
      },
      {
        title: "Conta",
        items: [{ to: "/profile", label: "Perfil", icon: "user" }],
      },
    ];
  }

  return [
    {
      title: "Gestão",
      items: [
        { to: "/dashboard", label: "Dashboard", icon: "dashboard" },
        { to: "/fleet", label: "Minha frota", icon: "fleet" },
        { to: "/maintenance", label: "Manutenção", icon: "wrench" },
        { to: "/documents", label: "Documentos", icon: "doc" },
      ],
    },
    {
      title: "Planejamento",
      items: [
        { to: "/trips", label: "Viagens", icon: "locationPin" },
        { to: "/trips/new", label: "Planejar viagem", icon: "plus" },
        { to: "/boat-rentals", label: "Boat rentals", icon: "boat" },
      ],
    },
    {
      title: "Serviços",
      items: [
        { to: "/service-providers", label: "Prestadores", icon: "users" },
        { to: "/service-requests", label: "Solicitações", icon: "send" },
        { to: "/marinas", label: "Marinas", icon: "anchor" },
        { to: "/marketplace", label: "Marketplace", icon: "shopping" },
      ],
    },
    {
      title: "Comunidade",
      items: [
        { to: "/events", label: "Eventos", icon: "calendar" },
        { to: "/community", label: "Comunidade", icon: "message" },
        { to: "/ecosystem", label: "Ecossistema", icon: "fleet" },
      ],
    },
    {
      title: "Conta",
      items: [{ to: "/profile", label: "Perfil", icon: "user" }],
    },
  ];
}

export default function AppShell() {
  const { user, login, logout } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const navSections = navFor(user);

  function handleLogout() {
    logout();
    navigate("/login");
  }

  async function switchPersona(account) {
    if (user?.persona === account.persona) {
      return;
    }

    await login(account.email, account.password);
    navigate("/dashboard");
  }

  return (
    <div className="app-shell">
      <aside
        className={`app-shell__sidebar ${menuOpen ? "app-shell__sidebar--open" : ""}`}
      >
        <div className="app-shell__brand">
          <span className="app-shell__brand-mark">
            <Icon name="anchor" size={22} />
          </span>
          <span className="app-shell__brand-name">SafeAnchor</span>
        </div>

        <nav className="app-shell__nav" aria-label="Navegação principal">
          {navSections.map((section) => (
            <div className="app-shell__section" key={section.title}>
              <span className="app-shell__section-title">{section.title}</span>
              {section.items.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  className={({ isActive }) =>
                    `app-shell__link ${isActive ? "app-shell__link--active" : ""}`
                  }
                  onClick={() => setMenuOpen(false)}
                >
                  <Icon name={item.icon} size={18} />
                  <span>{item.label}</span>
                </NavLink>
              ))}
            </div>
          ))}
        </nav>

        <div className="app-shell__footer">
          <span className="app-shell__personas-title">Alternar visão (demo)</span>
          <div className="app-shell__personas">
            {personaAccounts.map((account) => (
              <button
                key={account.persona}
                type="button"
                className={`persona-switch ${
                  user?.persona === account.persona ? "persona-switch--active" : ""
                }`}
                onClick={() => switchPersona(account)}
                title={`${account.label} — ${account.description}`}
              >
                <Icon name={account.icon} size={15} />
                <span>{account.label}</span>
              </button>
            ))}
          </div>
          <span className="app-shell__version">
            MVP demonstrativo · dados de exemplo
          </span>
        </div>
      </aside>

      {menuOpen && (
        <div className="app-shell__backdrop" onClick={() => setMenuOpen(false)} />
      )}

      <div className="app-shell__main">
        <header className="topbar">
          <button
            className="topbar__menu"
            onClick={() => setMenuOpen((open) => !open)}
            aria-label="Abrir menu"
          >
            <Icon name="menu" size={22} />
          </button>
          <div className="topbar__greeting">
            <span className="topbar__hello">Olá,</span>
            <strong>{user?.name || "Proprietário"}</strong>
          </div>
          <div className="topbar__account">
            <span className="topbar__location">
              <Icon name="locationPin" size={15} />
              {user?.location || "Florianópolis, SC"}
            </span>
            <Avatar initials={user?.initials || "U"} size={36} />
            <button
              className="topbar__logout"
              onClick={handleLogout}
              aria-label="Sair"
              title="Sair"
            >
              <Icon name="logout" size={18} />
            </button>
          </div>
        </header>

        <main className="app-shell__content">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
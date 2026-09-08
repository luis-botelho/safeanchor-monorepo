import { useNavigate, Link } from "react-router-dom";
import { useVesselsViewModel } from "../viewmodels/useVesselsViewModel";
import { useAuth } from "../context/AuthContext";

export default function VesselsPage() {
  const { vessels, isLoading, source, hasError } = useVesselsViewModel();
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  if (isLoading) {
    return <p>Carregando...</p>;
  }

  return (
    <div>
      <div className="topbar">
        <span>
          Olá, {user?.name}!
        </span>
        <button className="topbar__logout" onClick={handleLogout}>
          Sair
        </button>
      </div>
      <h1>Embarcações</h1>
      <Link to="/create">Nova Embarcação</Link>
      <p>{source === "api" ? "🟢 Backend conectado" : "🟡 Dados locais"}</p>
      {hasError && (
        <div className="alert" style={{ color: "red", margin: "10px 0" }}>
          Backend indisponível. Exibindo dados locais.
        </div>
      )}
      {vessels.map((vessel) => (
        <Link key={vessel.id} to={`/vessels/${vessel.id}`}>
          {" "}
          <div key={vessel.id}>
            <h2>{vessel.name}</h2>

            <p>Tipo: {vessel.type}</p>

            <p>Status: {vessel.status}</p>
          </div>
        </Link>
      ))}
    </div>
  );
}

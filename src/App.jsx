import { BrowserRouter, Routes, Route, NavLink, Navigate } from "react-router-dom";
import Home from "./pages/Home.jsx";
import Fipe from "./pages/Fipe.jsx";
import Compare from "./pages/Compare.jsx";
import CarrosAVenda from "./pages/CarrosAVenda.jsx";

function Navbar() {
  const linkStyle = ({ isActive }) => ({
    padding: "10px 12px",
    borderRadius: 10,
    textDecoration: "none",
    border: "1px solid #2a2a2a",
    opacity: isActive ? 1 : 0.75,
    color: "#fff",
    background: isActive ? "rgba(255,255,255,0.08)" : "transparent",
  });

  return (
    <header
      style={{
        position: "sticky",
        top: 0,
        zIndex: 20,
        backdropFilter: "blur(10px)",
        background: "rgba(10,10,14,0.85)",
        borderBottom: "1px solid rgba(255,255,255,0.08)",
      }}
    >
      <div
        style={{
          maxWidth: 1100,
          margin: "0 auto",
          padding: 14,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 12,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div
            style={{
              width: 34,
              height: 34,
              borderRadius: 12,
              display: "grid",
              placeItems: "center",
              fontWeight: 800,
              background: "rgba(255,255,255,0.10)",
              border: "1px solid rgba(255,255,255,0.10)",
              color: "#fff",
            }}
          >
            TC
          </div>
          <div>
            <div style={{ fontWeight: 700, color: "#fff" }}>TudoCarro</div>
            <div style={{ fontSize: 12, opacity: 0.7, color: "#fff" }}>
              FIPE • notícias • comparação • comprar
            </div>
          </div>
        </div>

        <nav style={{ display: "flex", gap: 10 }}>
          <NavLink to="/" style={linkStyle}>
            Home
          </NavLink>
          <NavLink to="/fipe" style={linkStyle}>
            FIPE
          </NavLink>
          <NavLink to="/comparacao" style={linkStyle}>
            Comparação
          </NavLink>
          <NavLink to="/carros-a-venda" style={linkStyle}>
            Carros à venda
          </NavLink>
        </nav>
      </div>
    </header>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/fipe" element={<Fipe />} />
        <Route path="/comparacao" element={<Compare />} />
        <Route path="/carros-a-venda" element={<CarrosAVenda />} />
        <Route path="/comprar" element={<Navigate to="/carros-a-venda" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:4000/api/fipe";

function getBackendOrigin() {
  try {
    if (API_URL.includes("/api/")) {
      return API_URL.split("/api/")[0];
    }
    return API_URL.replace(/\/$/, "");
  } catch {
    return "http://localhost:4000";
  }
}

// 👇 helpers para descrição
function stripHtml(html = "") {
  return String(html)
    .replace(/<[^>]*>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function clampText(text = "", max = 280) {
  if (!text) return "";
  return text.length > max ? text.slice(0, max).trimEnd() + "…" : text;
}

export default function Home() {
  const BACKEND_ORIGIN = useMemo(() => getBackendOrigin(), []);

  const [g1News, setG1News] = useState([]);
  const [gnews, setGnews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const gnewsQuery = "carros leilão indústria";

  useEffect(() => {
    let alive = true;

    async function loadNews() {
      setLoading(true);
      setError("");

      try {
        const [resG1, resGnews] = await Promise.allSettled([
          fetch(`${BACKEND_ORIGIN}/api/news/g1`),
          fetch(
            `${BACKEND_ORIGIN}/api/news/gnews?q=${encodeURIComponent(
              gnewsQuery
            )}`)
        ]);

        if (resG1.status === "fulfilled") {
          const json = await resG1.value.json();
          if (alive) setG1News(json?.data || []);
        }

        if (resGnews.status === "fulfilled") {
          const json = await resGnews.value.json();
          if (alive) setGnews(json?.data || []);
        }
      } catch {
        if (alive) setError("Erro ao carregar notícias.");
      } finally {
        if (alive) setLoading(false);
      }
    }

    loadNews();
    return () => (alive = false);
  }, [BACKEND_ORIGIN]);

  const mergedNews = useMemo(() => {
    const all = [...g1News, ...gnews];
    const map = new Map();

    all.forEach((n) => {
      if (n?.url && !map.has(n.url)) {
        map.set(n.url, n);
      }
    });

    return Array.from(map.values()).sort((a, b) => {
      const da = Date.parse(a?.publishedAt || "") || 0;
      const db = Date.parse(b?.publishedAt || "") || 0;
      return db - da;
    });
  }, [g1News, gnews]);

  function formatDate(date) {
    if (!date) return "";
    return new Date(date).toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  }

  return (
    <div
      style={{
        maxWidth: 1100,
        margin: "0 auto",
        padding: "24px 16px 48px",
        color: "#ffffff"
      }}
    >
      {/* HERO */}
      <div
        style={{
          borderRadius: 18,
          padding: 24,
          background:
            "linear-gradient(180deg, rgba(255,255,255,0.10), rgba(255,255,255,0.04))",
          border: "1px solid rgba(255,255,255,0.12)",
          boxShadow: "0 20px 80px rgba(0,0,0,0.55)"
        }}
      >
        <h1 style={{ margin: 0, fontSize: 26, color: "#fff" }}>
          Bem-vindo ao TudoCarro
        </h1>

        <p style={{ margin: "6px 0 18px", opacity: 0.9 }}>
          Consulte a FIPE, veja notícias e em breve compare carros lado a lado.
        </p>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 14 }}>
          {[
            {
              title: "Consulte FIPE",
              text: "Veja valor de mercado pela tabela FIPE e referência do mês.",
              to: "/fipe"
            },
            {
              title: "Compare carros",
              text: "Compare dois veículos lado a lado (preço, ano, especificações).",
              to: "/comparacao"
            },
            {
              title: "Fique por dentro",
              text: "Notícias de carros, leilões e mercado automotivo.",
              to: null
            }
          ].map((c, i) => {
            const cardStyle = {
              padding: 16,
              borderRadius: 14,
              background: "rgba(255,255,255,0.05)",
              border: "1px solid rgba(255,255,255,0.10)",
              color: "#fff",
              textDecoration: "none",
              display: "block",
              cursor: c.to ? "pointer" : "default",
              transition: "background 0.2s, border-color 0.2s"
            };
            const content = (
              <>
                <strong style={{ display: "block", marginBottom: 6 }}>
                  {c.title}
                </strong>
                <span style={{ opacity: 0.85, fontSize: 13 }}>
                  {c.text}
                </span>
              </>
            );
            return c.to ? (
              <Link key={i} to={c.to} style={cardStyle} className="home-card-link">
                {content}
              </Link>
            ) : (
              <div key={i} style={cardStyle}>
                {content}
              </div>
            );
          })}
        </div>
      </div>

      {/* NOTÍCIAS */}
      <div style={{ marginTop: 26 }}>
        <h2 style={{ marginBottom: 6, color: "#fff" }}>
          Notícias • G1 Carros
        </h2>

        <p style={{ opacity: 0.85, fontSize: 13 }}>
          Últimas do mundo automotivo.
        </p>

        {loading && (
          <div style={{ marginTop: 14, opacity: 0.9 }}>
            Carregando notícias...
          </div>
        )}

        {error && (
          <div style={{ marginTop: 14, color: "#ff9a9a" }}>
            {error}
          </div>
        )}

        {!loading && !error && (
          <div style={{ marginTop: 14, display: "grid", gap: 14 }}>
            {mergedNews.map((n, i) => {
              const description = clampText(stripHtml(n.description), 300);

              return (
                <a
                  key={i}
                  href={n.url}
                  target="_blank"
                  rel="noreferrer"
                  style={{
                    textDecoration: "none",
                    color: "#fff",
                    display: "flex",
                    gap: 14,
                    padding: 14,
                    borderRadius: 14,
                    background: "rgba(255,255,255,0.05)",
                    border: "1px solid rgba(255,255,255,0.10)"
                  }}
                >
                  {n.image && (
                    <img
                      src={n.image}
                      alt=""
                      style={{
                        width: 90,
                        height: 60,
                        objectFit: "cover",
                        borderRadius: 10
                      }}
                    />
                  )}

                  <div>
                    <strong style={{ display: "block", lineHeight: 1.3 }}>
                      {n.title}
                    </strong>

                    {/* 👇 DESCRIÇÃO (NOVO) */}
                    {description && (
                      <p
                        style={{
                          margin: "6px 0 0",
                          fontSize: 13,
                          lineHeight: 1.4,
                          opacity: 0.85
                        }}
                      >
                        {description}
                      </p>
                    )}

                    <div
                      style={{
                        marginTop: 6,
                        fontSize: 12,
                        opacity: 0.8
                      }}
                    >
                      {n.source} • {formatDate(n.publishedAt)} •{" "}
                      <span style={{ fontWeight: 600 }}>Saiba mais…</span>
                    </div>
                  </div>
                </a>
              );
            })}
          </div>
        )}

        <div style={{ marginTop: 30, fontSize: 12, opacity: 0.6 }}>
          Gabriel Silva • TudoCarro • {new Date().getFullYear()}
        </div>
      </div>
    </div>
  );
}

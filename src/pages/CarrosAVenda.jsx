import { useEffect, useState } from "react";
import { buildWebmotorsSearchUrl } from "../utils/buildWebmotorsSearchUrl";

const API_BASE =
  import.meta.env.VITE_API_URL || "https://tudocarro-backend.onrender.com/api/cars";

const TIPOS = [
  { value: "carros", label: "Carros (todos)" },
  { value: "carros-usados", label: "Usados" },
  { value: "carros-novos", label: "Novos" },
];

const UFS = [
  "", "AC", "AL", "AP", "AM", "BA", "CE", "DF", "ES", "GO", "MA", "MT", "MS",
  "MG", "PA", "PB", "PR", "PE", "PI", "RJ", "RN", "RS", "RO", "RR", "SC", "SP", "SE", "TO",
];

const ANO_ATUAL = new Date().getFullYear();
const ANOS_GERAL = Array.from({ length: ANO_ATUAL - 1999 }, (_, i) => ANO_ATUAL - i);

const cardStyle = {
  padding: 20,
  borderRadius: 14,
  background: "rgba(255,255,255,0.05)",
  border: "1px solid rgba(255,255,255,0.12)",
  color: "#fff",
};

const fieldStyle = {
  width: "100%",
  padding: "10px 12px",
  borderRadius: 10,
  border: "1px solid rgba(255,255,255,0.2)",
  background: "rgba(0,0,0,0.25)",
  color: "#fff",
  fontSize: 14,
};

const labelStyle = { display: "block", marginBottom: 6, fontSize: 13, opacity: 0.9 };

export default function CarrosAVenda() {
  const [brands, setBrands] = useState([]);
  const [models, setModels] = useState([]);
  const [years, setYears] = useState([]);
  const [brandCode, setBrandCode] = useState("");
  const [modelCode, setModelCode] = useState("");
  const [anoMin, setAnoMin] = useState("");
  const [anoMax, setAnoMax] = useState("");
  const [precoMin, setPrecoMin] = useState("");
  const [precoMax, setPrecoMax] = useState("");
  const [uf, setUf] = useState("");
  const [cidade, setCidade] = useState("");
  const [tipo, setTipo] = useState("carros");
  const [openInNewTab, setOpenInNewTab] = useState(true);
  const [validationError, setValidationError] = useState("");
  const [loadingBrands, setLoadingBrands] = useState(true);
  const [loadingModels, setLoadingModels] = useState(false);
  const [loadingYears, setLoadingYears] = useState(false);
  const [apiError, setApiError] = useState("");

  useEffect(() => {
    setLoadingBrands(true);
    setApiError("");
    fetch(`${API_BASE}/brands`)
      .then((res) => res.json())
      .then((data) => setBrands(Array.isArray(data) ? data : []))
      .catch(() => setApiError("Erro ao carregar marcas."))
      .finally(() => setLoadingBrands(false));
  }, []);

  useEffect(() => {
    if (!brandCode) {
      setModels([]);
      setModelCode("");
      setYears([]);
      return;
    }
    setLoadingModels(true);
    fetch(`${API_BASE}/models/${brandCode}`)
      .then((res) => res.json())
      .then((data) => {
        setModels(data.modelos || []);
        setModelCode("");
        setYears([]);
      })
      .catch(() => setApiError("Erro ao carregar modelos."))
      .finally(() => setLoadingModels(false));
  }, [brandCode]);

  useEffect(() => {
    if (!brandCode || !modelCode) {
      setYears([]);
      return;
    }
    setLoadingYears(true);
    fetch(`${API_BASE}/years/${brandCode}/${modelCode}`)
      .then((res) => res.json())
      .then((data) => {
        const list = Array.isArray(data) ? data : [];
        setYears(list);
      })
      .catch(() => setYears([]))
      .finally(() => setLoadingYears(false));
  }, [brandCode, modelCode]);

  const anosUnicos = years.length > 0
    ? [...new Set(years.map((y) => {
        const n = y.nome || y.codigo || "";
        const match = String(n).match(/^(\d{4})/);
        return match ? Number(match[1]) : null;
      }).filter(Boolean))].sort((a, b) => b - a)
    : ANOS_GERAL;
  const anosParaSelect = years.length > 0 ? anosUnicos : ANOS_GERAL;

  useEffect(() => {
    document.title = "Carros à venda | TudoCarro";
    const meta = document.querySelector('meta[name="description"]');
    if (meta) {
      const original = meta.getAttribute("content");
      meta.setAttribute("content", "Encontre carros novos e usados. Escolha os filtros e veja ofertas na Webmotors.");
      return () => {
        meta.setAttribute("content", original || "TudoCarro - FIPE, notícias e comparação de veículos");
      };
    }
    return () => {
      document.title = "TudoCarro";
    };
  }, []);

  function validate() {
    setValidationError("");
    const aMin = anoMin !== "" ? Number(anoMin) : null;
    const aMax = anoMax !== "" ? Number(anoMax) : null;
    const pMin = precoMin !== "" ? Number(precoMin) : null;
    const pMax = precoMax !== "" ? Number(precoMax) : null;

    if (aMin != null && aMax != null && aMin > aMax) {
      setValidationError("Ano mínimo não pode ser maior que o ano máximo.");
      return false;
    }
    if (pMin != null && pMax != null && pMin > pMax) {
      setValidationError("Preço mínimo não pode ser maior que o preço máximo.");
      return false;
    }
    const anoMaxVal = anosParaSelect.length > 0 ? Math.max(...anosParaSelect) : ANO_ATUAL + 1;
    const anoMinVal = anosParaSelect.length > 0 ? Math.min(...anosParaSelect) : 1990;
    if (aMin != null && (aMin < anoMinVal || aMin > anoMaxVal)) {
      setValidationError("Ano mínimo deve estar entre " + anoMinVal + " e " + anoMaxVal + ".");
      return false;
    }
    if (aMax != null && (aMax < anoMinVal || aMax > anoMaxVal)) {
      setValidationError("Ano máximo deve estar entre " + anoMinVal + " e " + anoMaxVal + ".");
      return false;
    }
    if (pMin != null && pMin < 0) {
      setValidationError("Preço mínimo não pode ser negativo.");
      return false;
    }
    if (pMax != null && pMax < 0) {
      setValidationError("Preço máximo não pode ser negativo.");
      return false;
    }
    return true;
  }

  function handleVerOfertas(e) {
    e.preventDefault();
    if (!validate()) return;

    const marcaSlug = brandCode ? brands.find((b) => String(b.codigo) === String(brandCode))?.nome?.toLowerCase().trim() : undefined;
    const modeloNome = modelCode ? models.find((m) => String(m.codigo) === String(modelCode))?.nome?.trim() : undefined;

    const filters = {
      marca: marcaSlug || undefined,
      modelo: modeloNome || undefined,
      anoMin: anoMin !== "" ? Number(anoMin) : undefined,
      anoMax: anoMax !== "" ? Number(anoMax) : undefined,
      precoMin: precoMin !== "" ? Number(precoMin) : undefined,
      precoMax: precoMax !== "" ? Number(precoMax) : undefined,
      uf: uf || undefined,
      cidade: cidade.trim() || undefined,
      tipo,
    };
    const url = buildWebmotorsSearchUrl(filters);
    if (openInNewTab) {
      window.open(url, "_blank", "noopener,noreferrer");
    } else {
      window.location.href = url;
    }
  }

  const sugestoes = [
    { label: "Carros até R$ 50.000", filters: { precoMax: 50000 } },
    { label: "SUVs 2019+", filters: { anoMin: 2019 } },
    { label: "Econômicos (hatch) até R$ 40.000", filters: { precoMax: 40000 } },
  ];

  return (
    <div
      style={{
        maxWidth: 1100,
        margin: "0 auto",
        padding: "24px 16px 48px",
        color: "#fff",
      }}
    >
      <h1 style={{ margin: "0 0 8px", fontSize: 26 }}>Carros à venda</h1>
      <p style={{ margin: 0, opacity: 0.9, fontSize: 15 }}>
        Escolha os filtros e veja ofertas na Webmotors. Você será redirecionado ao site da Webmotors para conferir os anúncios.
      </p>

      {/* Sugestões rápidas */}
      <div style={{ marginTop: 24 }}>
        <h2 style={{ margin: "0 0 12px", fontSize: 18 }}>Sugestões rápidas</h2>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
          {sugestoes.map((s, i) => (
            <a
              key={i}
              href={buildWebmotorsSearchUrl(s.filters)}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                padding: "12px 16px",
                borderRadius: 10,
                background: "rgba(255,255,255,0.08)",
                border: "1px solid rgba(255,255,255,0.15)",
                color: "#fff",
                textDecoration: "none",
                fontSize: 14,
                transition: "background 0.2s, border-color 0.2s",
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.background = "rgba(255,255,255,0.12)";
                e.currentTarget.style.borderColor = "rgba(255,255,255,0.25)";
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.background = "rgba(255,255,255,0.08)";
                e.currentTarget.style.borderColor = "rgba(255,255,255,0.15)";
              }}
            >
              {s.label}
            </a>
          ))}
        </div>
      </div>

      {/* Filtros */}
      <form onSubmit={handleVerOfertas} style={{ marginTop: 28 }}>
        <div style={cardStyle}>
          <h2 style={{ margin: "0 0 16px", fontSize: 18 }}>Filtros</h2>

          {apiError && (
            <div
              style={{
                marginBottom: 14,
                padding: "10px 12px",
                borderRadius: 10,
                background: "rgba(248,113,113,0.15)",
                border: "1px solid rgba(248,113,113,0.5)",
                color: "#fecaca",
                fontSize: 14,
              }}
            >
              {apiError}
            </div>
          )}

          {validationError && (
            <div
              style={{
                marginBottom: 14,
                padding: "10px 12px",
                borderRadius: 10,
                background: "rgba(248,113,113,0.15)",
                border: "1px solid rgba(248,113,113,0.5)",
                color: "#fecaca",
                fontSize: 14,
              }}
            >
              {validationError}
            </div>
          )}

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))",
              gap: 16,
            }}
          >
            <div>
              <label style={labelStyle}>Marca</label>
              <select
                value={brandCode}
                onChange={(e) => setBrandCode(e.target.value)}
                style={fieldStyle}
                disabled={loadingBrands}
              >
                <option value="">Todas as marcas</option>
                {brands.map((b) => (
                  <option key={b.codigo} value={b.codigo}>
                    {b.nome}
                  </option>
                ))}
              </select>
              {loadingBrands && <span style={{ fontSize: 12, opacity: 0.8 }}> Carregando…</span>}
            </div>

            <div>
              <label style={labelStyle}>Modelo</label>
              <select
                value={modelCode}
                onChange={(e) => setModelCode(e.target.value)}
                style={{ ...fieldStyle, opacity: brandCode ? 1 : 0.6 }}
                disabled={!brandCode || loadingModels}
              >
                <option value="">Todos os modelos</option>
                {models.map((m) => (
                  <option key={m.codigo} value={m.codigo}>
                    {m.nome}
                  </option>
                ))}
              </select>
              {loadingModels && <span style={{ fontSize: 12, opacity: 0.8 }}> Carregando…</span>}
            </div>

            <div>
              <label style={labelStyle}>Ano mínimo</label>
              <select
                value={anoMin}
                onChange={(e) => setAnoMin(e.target.value)}
                style={{ ...fieldStyle, opacity: (brandCode && modelCode && loadingYears) ? 0.7 : 1 }}
                disabled={brandCode && modelCode && loadingYears}
              >
                <option value="">Qualquer</option>
                {anosParaSelect.map((y) => (
                  <option key={y} value={y}>
                    {y}
                  </option>
                ))}
              </select>
              {brandCode && modelCode && loadingYears && <span style={{ fontSize: 12, opacity: 0.8 }}> Carregando anos…</span>}
            </div>

            <div>
              <label style={labelStyle}>Ano máximo</label>
              <select
                value={anoMax}
                onChange={(e) => setAnoMax(e.target.value)}
                style={{ ...fieldStyle, opacity: (brandCode && modelCode && loadingYears) ? 0.7 : 1 }}
                disabled={brandCode && modelCode && loadingYears}
              >
                <option value="">Qualquer</option>
                {anosParaSelect.map((y) => (
                  <option key={y} value={y}>
                    {y}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label style={labelStyle}>Preço mínimo (R$)</label>
              <input
                type="number"
                min={0}
                step={1000}
                value={precoMin}
                onChange={(e) => setPrecoMin(e.target.value)}
                placeholder="Ex: 30000"
                style={fieldStyle}
              />
            </div>

            <div>
              <label style={labelStyle}>Preço máximo (R$)</label>
              <input
                type="number"
                min={0}
                step={1000}
                value={precoMax}
                onChange={(e) => setPrecoMax(e.target.value)}
                placeholder="Ex: 100000"
                style={fieldStyle}
              />
            </div>

            <div>
              <label style={labelStyle}>UF</label>
              <select
                value={uf}
                onChange={(e) => setUf(e.target.value)}
                style={fieldStyle}
              >
                <option value="">Todo Brasil</option>
                {UFS.filter(Boolean).map((u) => (
                  <option key={u} value={u}>
                    {u}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label style={labelStyle}>Cidade</label>
              <input
                type="text"
                value={cidade}
                onChange={(e) => setCidade(e.target.value)}
                placeholder="Ex: São Paulo"
                style={fieldStyle}
              />
            </div>

            <div>
              <label style={labelStyle}>Tipo</label>
              <select
                value={tipo}
                onChange={(e) => setTipo(e.target.value)}
                style={fieldStyle}
              >
                {TIPOS.map((t) => (
                  <option key={t.value} value={t.value}>
                    {t.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div style={{ marginTop: 18, display: "flex", flexWrap: "wrap", alignItems: "center", gap: 16 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 14 }}>
              <span style={{ opacity: 0.9 }}>Abrir em uma nova guia</span>
              <div style={{ display: "flex", alignItems: "center", gap: 0 }}>
                <span style={{ fontSize: 11, fontWeight: 600, color: openInNewTab ? "rgba(255,255,255,0.45)" : "#fff", marginRight: 6, transition: "color 0.2s" }}>
                  OFF
                </span>
                <button
                  type="button"
                  role="switch"
                  aria-checked={openInNewTab}
                  onClick={() => setOpenInNewTab(!openInNewTab)}
                  style={{
                    width: 56,
                    height: 26,
                    borderRadius: 13,
                    border: "1px solid rgba(255,255,255,0.3)",
                    background: "rgba(0,0,0,0.4)",
                    cursor: "pointer",
                    padding: 0,
                    position: "relative",
                    transition: "background 0.2s",
                  }}
                >
                  <span
                    style={{
                      position: "absolute",
                      top: 2,
                      left: 2,
                      width: 20,
                      height: 20,
                      borderRadius: 10,
                      background: openInNewTab ? "#22c55e" : "rgba(255,255,255,0.6)",
                      boxShadow: "0 1px 3px rgba(0,0,0,0.3)",
                      transition: "transform 0.2s ease",
                      transform: openInNewTab ? "translateX(30px)" : "translateX(0)",
                    }}
                  />
                </button>
                <span style={{ fontSize: 11, fontWeight: 600, color: openInNewTab ? "#fff" : "rgba(255,255,255,0.45)", marginLeft: 6, transition: "color 0.2s" }}>
                  ON
                </span>
              </div>
            </div>
            <button
              type="submit"
              style={{
                padding: "12px 24px",
                borderRadius: 10,
                border: "none",
                background: "linear-gradient(135deg, #38bdf8, #22c55e)",
                color: "#020617",
                fontWeight: 700,
                fontSize: 15,
                cursor: "pointer",
              }}
            >
              Ver ofertas na Webmotors
            </button>
          </div>
        </div>
      </form>

      <p style={{ marginTop: 20, fontSize: 13, opacity: 0.75 }}>
        As ofertas são exibidas no site da Webmotors. O TudoCarro não vende veículos; apenas facilita a busca com filtros e o redirecionamento.
      </p>
    </div>
  );
}

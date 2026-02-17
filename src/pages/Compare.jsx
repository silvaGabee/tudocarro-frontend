import { useEffect, useState } from "react";

const API_BASE =
  import.meta.env.VITE_API_URL || "https://tudocarro-backend.onrender.com/api/cars";

function mapFuelType(fuel) {
  if (!fuel) return "-";
  const f = String(fuel).toLowerCase();
  if (f === "gas" || f === "gasoline" || f === "petrol") return "Gasolina";
  if (f === "diesel") return "Diesel";
  if (f === "electricity" || f === "ev" || f === "electric") return "Elétrico";
  if (f.includes("flex")) return "Flex";
  if (f.includes("hybrid")) return "Híbrido";
  return fuel;
}

function mapTransmission(trans) {
  if (!trans) return "-";
  const t = String(trans).toLowerCase();
  if (t === "a" || t.includes("auto")) return "Automática";
  if (t === "m" || t.includes("manual")) return "Manual";
  return trans;
}

function mapDrive(drive) {
  if (!drive) return "-";
  const d = String(drive).toLowerCase();
  if (d === "awd" || d.includes("all")) return "Integral (AWD)";
  if (d === "4wd") return "4x4 (4WD)";
  if (d === "fwd" || d.includes("front")) return "Dianteira (FWD)";
  if (d === "rwd" || d.includes("rear")) return "Traseira (RWD)";
  return drive;
}

const cardStyle = {
  padding: 16,
  borderRadius: 14,
  background: "rgba(255,255,255,0.05)",
  border: "1px solid rgba(255,255,255,0.12)",
  color: "#fff",
};

const fieldStyle = {
  width: "100%",
  padding: "8px 10px",
  borderRadius: 10,
  border: "1px solid rgba(255,255,255,0.2)",
  background: "rgba(0,0,0,0.25)",
  color: "#fff",
  fontSize: 14,
};

export default function Compare() {
  const [brands, setBrands] = useState([]);

  const [modelsA, setModelsA] = useState([]);
  const [yearsA, setYearsA] = useState([]);
  const [brandCodeA, setBrandCodeA] = useState("");
  const [modelCodeA, setModelCodeA] = useState("");
  const [yearCodeA, setYearCodeA] = useState("");
  const [brandSearchA, setBrandSearchA] = useState("");
  const [modelSearchA, setModelSearchA] = useState("");

  const [modelsB, setModelsB] = useState([]);
  const [yearsB, setYearsB] = useState([]);
  const [brandCodeB, setBrandCodeB] = useState("");
  const [modelCodeB, setModelCodeB] = useState("");
  const [yearCodeB, setYearCodeB] = useState("");
  const [brandSearchB, setBrandSearchB] = useState("");
  const [modelSearchB, setModelSearchB] = useState("");

  const [detailsA, setDetailsA] = useState(null);
  const [detailsB, setDetailsB] = useState(null);
  const [loadingA, setLoadingA] = useState(false);
  const [loadingB, setLoadingB] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch(`${API_BASE}/brands`)
      .then((res) => res.json())
      .then((data) => setBrands(Array.isArray(data) ? data : []))
      .catch(() => setError("Erro ao carregar marcas"));
  }, []);

  useEffect(() => {
    if (!brandCodeA) {
      setModelsA([]);
      setModelCodeA("");
      setModelSearchA("");
      setYearsA([]);
      setYearCodeA("");
      setDetailsA(null);
      return;
    }
    fetch(`${API_BASE}/models/${brandCodeA}`)
      .then((res) => res.json())
      .then((data) => {
        setModelsA(data.modelos || []);
        setModelCodeA("");
        setModelSearchA("");
        setYearsA([]);
        setYearCodeA("");
        setDetailsA(null);
      })
      .catch(() => setError("Erro ao carregar modelos (Carro A)"));
  }, [brandCodeA]);

  useEffect(() => {
    if (!brandCodeA || !modelCodeA) {
      setYearsA([]);
      setYearCodeA("");
      setDetailsA(null);
      return;
    }
    fetch(`${API_BASE}/years/${brandCodeA}/${modelCodeA}`)
      .then((res) => res.json())
      .then((data) => {
        setYearsA(Array.isArray(data) ? data : []);
        setYearCodeA("");
        setDetailsA(null);
      })
      .catch(() => setError("Erro ao carregar anos (Carro A)"));
  }, [brandCodeA, modelCodeA]);

  useEffect(() => {
    if (!brandCodeA || !modelCodeA || !yearCodeA) {
      setDetailsA(null);
      return;
    }
    setLoadingA(true);
    setError("");
    fetch(`${API_BASE}/details/${brandCodeA}/${modelCodeA}/${yearCodeA}`)
      .then((res) => res.json())
      .then((data) => setDetailsA(data))
      .catch(() => setError("Erro ao carregar detalhes do Carro A"))
      .finally(() => setLoadingA(false));
  }, [brandCodeA, modelCodeA, yearCodeA]);

  useEffect(() => {
    if (!brandCodeB) {
      setModelsB([]);
      setModelCodeB("");
      setModelSearchB("");
      setYearsB([]);
      setYearCodeB("");
      setDetailsB(null);
      return;
    }
    fetch(`${API_BASE}/models/${brandCodeB}`)
      .then((res) => res.json())
      .then((data) => {
        setModelsB(data.modelos || []);
        setModelCodeB("");
        setModelSearchB("");
        setYearsB([]);
        setYearCodeB("");
        setDetailsB(null);
      })
      .catch(() => setError("Erro ao carregar modelos (Carro B)"));
  }, [brandCodeB]);

  useEffect(() => {
    if (!brandCodeB || !modelCodeB) {
      setYearsB([]);
      setYearCodeB("");
      setDetailsB(null);
      return;
    }
    fetch(`${API_BASE}/years/${brandCodeB}/${modelCodeB}`)
      .then((res) => res.json())
      .then((data) => {
        setYearsB(Array.isArray(data) ? data : []);
        setYearCodeB("");
        setDetailsB(null);
      })
      .catch(() => setError("Erro ao carregar anos (Carro B)"));
  }, [brandCodeB, modelCodeB]);

  useEffect(() => {
    if (!brandCodeB || !modelCodeB || !yearCodeB) {
      setDetailsB(null);
      return;
    }
    setLoadingB(true);
    setError("");
    fetch(`${API_BASE}/details/${brandCodeB}/${modelCodeB}/${yearCodeB}`)
      .then((res) => res.json())
      .then((data) => setDetailsB(data))
      .catch(() => setError("Erro ao carregar detalhes do Carro B"))
      .finally(() => setLoadingB(false));
  }, [brandCodeB, modelCodeB, yearCodeB]);

  const handleBrandInputA = (e) => {
    const value = e.target.value;
    setBrandSearchA(value);
    const found = brands.find((b) => b.nome?.toLowerCase() === value.toLowerCase());
    setBrandCodeA(found ? found.codigo : "");
  };

  const handleModelInputA = (e) => {
    const value = e.target.value;
    setModelSearchA(value);
    const found = modelsA.find((m) => m.nome?.toLowerCase() === value.toLowerCase());
    setModelCodeA(found ? found.codigo : "");
  };

  const handleBrandInputB = (e) => {
    const value = e.target.value;
    setBrandSearchB(value);
    const found = brands.find((b) => b.nome?.toLowerCase() === value.toLowerCase());
    setBrandCodeB(found ? found.codigo : "");
  };

  const handleModelInputB = (e) => {
    const value = e.target.value;
    setModelSearchB(value);
    const found = modelsB.find((m) => m.nome?.toLowerCase() === value.toLowerCase());
    setModelCodeB(found ? found.codigo : "");
  };

  const fipeA = detailsA?.fipe;
  const fipeB = detailsB?.fipe;
  const specsA = detailsA?.specs;
  const specsB = detailsB?.specs;
  const canCompare = fipeA && fipeB;

  return (
    <div
      style={{
        minHeight: "100vh",
        color: "#fff",
        padding: "24px 16px 48px",
        maxWidth: 1100,
        margin: "0 auto",
      }}
    >
      <h1 style={{ margin: "0 0 6px", fontSize: 26 }}>Comparação de veículos</h1>
      <p style={{ margin: 0, opacity: 0.85, fontSize: 14 }}>
        Escolha dois carros e veja valor FIPE e especificações lado a lado.
      </p>

      {error && (
        <div
          style={{
            marginTop: 14,
            padding: "10px 14px",
            borderRadius: 10,
            background: "rgba(248,113,113,0.15)",
            border: "1px solid rgba(248,113,113,0.5)",
            color: "#fecaca",
          }}
        >
          {error}
        </div>
      )}

      {/* Seleção Carro A e Carro B */}
      <div className="compare-grid" style={{ marginTop: 24 }}>
        <div style={cardStyle}>
          <h2 style={{ margin: "0 0 14px", fontSize: 18 }}>Carro A</h2>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <div>
              <label style={{ display: "block", marginBottom: 4, fontSize: 12, opacity: 0.9 }}>
                Marca
              </label>
              <input
                type="text"
                list="compare-brand-a"
                value={brandSearchA}
                onChange={handleBrandInputA}
                placeholder="Ex: BMW, VW, Fiat..."
                style={fieldStyle}
              />
              <datalist id="compare-brand-a">
                {brands.map((b) => (
                  <option key={b.codigo} value={b.nome} />
                ))}
              </datalist>
            </div>
            <div>
              <label style={{ display: "block", marginBottom: 4, fontSize: 12, opacity: 0.9 }}>
                Modelo
              </label>
              <input
                type="text"
                list="compare-model-a"
                value={modelSearchA}
                onChange={handleModelInputA}
                placeholder={brandCodeA ? "Digite o modelo..." : "Selecione a marca primeiro"}
                disabled={!brandCodeA}
                style={{ ...fieldStyle, opacity: brandCodeA ? 1 : 0.6 }}
              />
              <datalist id="compare-model-a">
                {modelsA.map((m) => (
                  <option key={m.codigo} value={m.nome} />
                ))}
              </datalist>
            </div>
            <div>
              <label style={{ display: "block", marginBottom: 4, fontSize: 12, opacity: 0.9 }}>
                Ano
              </label>
              <select
                value={yearCodeA}
                onChange={(e) => setYearCodeA(e.target.value)}
                disabled={!brandCodeA || !modelCodeA}
                style={{ ...fieldStyle, opacity: brandCodeA && modelCodeA ? 1 : 0.6 }}
              >
                <option value="">Selecione</option>
                {yearsA.map((y) => (
                  <option key={y.codigo} value={y.codigo}>
                    {y.nome}
                  </option>
                ))}
              </select>
            </div>
          </div>
          {loadingA && (
            <p style={{ marginTop: 12, fontSize: 13, opacity: 0.8 }}>Carregando...</p>
          )}
          {!loadingA && fipeA && (
            <p style={{ marginTop: 12, fontSize: 13, opacity: 0.9 }}>
              {fipeA.Marca} {fipeA.Modelo} • {fipeA.AnoModelo}
            </p>
          )}
        </div>

        <div style={cardStyle}>
          <h2 style={{ margin: "0 0 14px", fontSize: 18 }}>Carro B</h2>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <div>
              <label style={{ display: "block", marginBottom: 4, fontSize: 12, opacity: 0.9 }}>
                Marca
              </label>
              <input
                type="text"
                list="compare-brand-b"
                value={brandSearchB}
                onChange={handleBrandInputB}
                placeholder="Ex: BMW, VW, Fiat..."
                style={fieldStyle}
              />
              <datalist id="compare-brand-b">
                {brands.map((b) => (
                  <option key={b.codigo} value={b.nome} />
                ))}
              </datalist>
            </div>
            <div>
              <label style={{ display: "block", marginBottom: 4, fontSize: 12, opacity: 0.9 }}>
                Modelo
              </label>
              <input
                type="text"
                list="compare-model-b"
                value={modelSearchB}
                onChange={handleModelInputB}
                placeholder={brandCodeB ? "Digite o modelo..." : "Selecione a marca primeiro"}
                disabled={!brandCodeB}
                style={{ ...fieldStyle, opacity: brandCodeB ? 1 : 0.6 }}
              />
              <datalist id="compare-model-b">
                {modelsB.map((m) => (
                  <option key={m.codigo} value={m.nome} />
                ))}
              </datalist>
            </div>
            <div>
              <label style={{ display: "block", marginBottom: 4, fontSize: 12, opacity: 0.9 }}>
                Ano
              </label>
              <select
                value={yearCodeB}
                onChange={(e) => setYearCodeB(e.target.value)}
                disabled={!brandCodeB || !modelCodeB}
                style={{ ...fieldStyle, opacity: brandCodeB && modelCodeB ? 1 : 0.6 }}
              >
                <option value="">Selecione</option>
                {yearsB.map((y) => (
                  <option key={y.codigo} value={y.codigo}>
                    {y.nome}
                  </option>
                ))}
              </select>
            </div>
          </div>
          {loadingB && (
            <p style={{ marginTop: 12, fontSize: 13, opacity: 0.8 }}>Carregando...</p>
          )}
          {!loadingB && fipeB && (
            <p style={{ marginTop: 12, fontSize: 13, opacity: 0.9 }}>
              {fipeB.Marca} {fipeB.Modelo} • {fipeB.AnoModelo}
            </p>
          )}
        </div>
      </div>

      {/* Comparação lado a lado */}
      {canCompare && (
        <div style={{ marginTop: 28 }}>
          <h2 style={{ margin: "0 0 14px", fontSize: 20 }}>Comparação</h2>
          <div className="compare-grid" style={{ alignItems: "start" }}>
            <div style={cardStyle}>
              <h3 style={{ margin: "0 0 12px", fontSize: 16 }}>
                {fipeA.Marca} {fipeA.Modelo}
              </h3>
              <p style={{ margin: "0 0 14px", fontSize: 13, opacity: 0.85 }}>
                {fipeA.AnoModelo} • {fipeA.Combustivel}
              </p>
              <div
                style={{
                  padding: "10px 12px",
                  borderRadius: 10,
                  background: "rgba(56,189,248,0.15)",
                  border: "1px solid rgba(56,189,248,0.4)",
                  marginBottom: 14,
                }}
              >
                <span style={{ fontSize: 11, opacity: 0.9 }}>Valor FIPE</span>
                <div style={{ fontSize: 18, fontWeight: 700 }}>{fipeA.Valor}</div>
                <span style={{ fontSize: 11, opacity: 0.8 }}>{fipeA.MesReferencia}</span>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 6, fontSize: 13 }}>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span style={{ opacity: 0.8 }}>Código FIPE</span>
                  <span>{fipeA.CodigoFipe || "-"}</span>
                </div>
                {specsA && (
                  <>
                    <div style={{ display: "flex", justifyContent: "space-between" }}>
                      <span style={{ opacity: 0.8 }}>Combustível</span>
                      <span>{mapFuelType(specsA.fuel_type)}</span>
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between" }}>
                      <span style={{ opacity: 0.8 }}>Motor</span>
                      <span>{specsA.engine || "-"}</span>
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between" }}>
                      <span style={{ opacity: 0.8 }}>Transmissão</span>
                      <span>{mapTransmission(specsA.transmission)}</span>
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between" }}>
                      <span style={{ opacity: 0.8 }}>Tração</span>
                      <span>{mapDrive(specsA.drive)}</span>
                    </div>
                    {specsA.displacement && (
                      <div style={{ display: "flex", justifyContent: "space-between" }}>
                        <span style={{ opacity: 0.8 }}>Cilindrada</span>
                        <span>{specsA.displacement} L</span>
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>

            <div style={cardStyle}>
              <h3 style={{ margin: "0 0 12px", fontSize: 16 }}>
                {fipeB.Marca} {fipeB.Modelo}
              </h3>
              <p style={{ margin: "0 0 14px", fontSize: 13, opacity: 0.85 }}>
                {fipeB.AnoModelo} • {fipeB.Combustivel}
              </p>
              <div
                style={{
                  padding: "10px 12px",
                  borderRadius: 10,
                  background: "rgba(56,189,248,0.15)",
                  border: "1px solid rgba(56,189,248,0.4)",
                  marginBottom: 14,
                }}
              >
                <span style={{ fontSize: 11, opacity: 0.9 }}>Valor FIPE</span>
                <div style={{ fontSize: 18, fontWeight: 700 }}>{fipeB.Valor}</div>
                <span style={{ fontSize: 11, opacity: 0.8 }}>{fipeB.MesReferencia}</span>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 6, fontSize: 13 }}>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span style={{ opacity: 0.8 }}>Código FIPE</span>
                  <span>{fipeB.CodigoFipe || "-"}</span>
                </div>
                {specsB && (
                  <>
                    <div style={{ display: "flex", justifyContent: "space-between" }}>
                      <span style={{ opacity: 0.8 }}>Combustível</span>
                      <span>{mapFuelType(specsB.fuel_type)}</span>
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between" }}>
                      <span style={{ opacity: 0.8 }}>Motor</span>
                      <span>{specsB.engine || "-"}</span>
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between" }}>
                      <span style={{ opacity: 0.8 }}>Transmissão</span>
                      <span>{mapTransmission(specsB.transmission)}</span>
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between" }}>
                      <span style={{ opacity: 0.8 }}>Tração</span>
                      <span>{mapDrive(specsB.drive)}</span>
                    </div>
                    {specsB.displacement && (
                      <div style={{ display: "flex", justifyContent: "space-between" }}>
                        <span style={{ opacity: 0.8 }}>Cilindrada</span>
                        <span>{specsB.displacement} L</span>
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {!canCompare && !loadingA && !loadingB && (
        <p style={{ marginTop: 24, opacity: 0.75, fontSize: 14 }}>
          Selecione marca, modelo e ano dos dois veículos para ver a comparação.
        </p>
      )}
    </div>
  );
}

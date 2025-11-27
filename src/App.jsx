import { useEffect, useState } from "react";
import "./App.css";

const API_URL = "http://localhost:4000/api/cars";

function App() {
  const [brands, setBrands] = useState([]);
  const [models, setModels] = useState([]);
  const [years, setYears] = useState([]);

  const [brandCode, setBrandCode] = useState("");
  const [modelCode, setModelCode] = useState("");
  const [yearCode, setYearCode] = useState("");

  const [brandSearch, setBrandSearch] = useState("");
  const [modelSearch, setModelSearch] = useState("");

  const [details, setDetails] = useState(null);
  const [loadingDetails, setLoadingDetails] = useState(false);
  const [error, setError] = useState("");

  // Carrega marcas ao iniciar
  useEffect(() => {
    fetch(`${API_URL}/brands`)
      .then((res) => res.json())
      .then((data) => setBrands(data))
      .catch(() => setError("Erro ao carregar marcas"));
  }, []);

  // Quando a marca (código) muda -> carrega modelos
  useEffect(() => {
    if (!brandCode) {
      setModels([]);
      setModelCode("");
      setModelSearch("");
      setYears([]);
      setYearCode("");
      setDetails(null);
      return;
    }

    fetch(`${API_URL}/models/${brandCode}`)
      .then((res) => res.json())
      .then((data) => {
        setModels(data.modelos || []);
        setModelCode("");
        setModelSearch("");
        setYears([]);
        setYearCode("");
        setDetails(null);
      })
      .catch(() => setError("Erro ao carregar modelos"));
  }, [brandCode]);

  // Quando modelo muda -> carrega anos
  useEffect(() => {
    if (!brandCode || !modelCode) {
      setYears([]);
      setYearCode("");
      setDetails(null);
      return;
    }

    fetch(`${API_URL}/years/${brandCode}/${modelCode}`)
      .then((res) => res.json())
      .then((data) => {
        setYears(data || []);
        setYearCode("");
        setDetails(null);
      })
      .catch(() => setError("Erro ao carregar anos"));
  }, [brandCode, modelCode]);

  // Quando ano muda -> carrega detalhes
  useEffect(() => {
    if (!brandCode || !modelCode || !yearCode) {
      setDetails(null);
      return;
    }

    setLoadingDetails(true);
    setError("");

    fetch(`${API_URL}/details/${brandCode}/${modelCode}/${yearCode}`)
      .then((res) => res.json())
      .then((data) => {
        setDetails(data);
      })
      .catch(() => setError("Erro ao carregar detalhes do veículo"))
      .finally(() => setLoadingDetails(false));
  }, [brandCode, modelCode, yearCode]);

  // ====== HANDLERS COM DATALIST (marca / modelo) ======

  const handleBrandInput = (e) => {
    const value = e.target.value;
    setBrandSearch(value);

    if (!value) {
      // limpou o campo
      setBrandCode("");
      setModels([]);
      setModelCode("");
      setModelSearch("");
      setYears([]);
      setYearCode("");
      setDetails(null);
      return;
    }

    const found = brands.find(
      (b) => b.nome.toLowerCase() === value.toLowerCase()
    );

    if (found) {
      if (found.codigo !== brandCode) {
        setBrandCode(found.codigo);
      }
    } else {
      setBrandCode("");
    }
  };

  const handleModelInput = (e) => {
    const value = e.target.value;
    setModelSearch(value);

    if (!value) {
      setModelCode("");
      setYears([]);
      setYearCode("");
      setDetails(null);
      return;
    }

    const found = models.find(
      (m) => m.nome.toLowerCase() === value.toLowerCase()
    );

    if (found) {
      if (found.codigo !== modelCode) {
        setModelCode(found.codigo);
      }
    } else {
      setModelCode("");
    }
  };

  const currentStep =
    !brandCode && !modelCode && !yearCode
      ? "marca"
      : brandCode && !modelCode
      ? "modelo"
      : brandCode && modelCode && !yearCode
      ? "ano"
      : "detalhes";

  return (
    <div className="app">
      <div className="layout">
        <header className="app-header">
          <div className="logo-circle">TC</div>
          <div>
            <h1 className="app-title">TudoCarro</h1>
            <p className="app-subtitle">
              Consulte Tabela FIPE e ficha técnica de forma rápida e agradável.
            </p>
          </div>
        </header>

        <main className="app-main">
          {error && <p className="alert alert-error">{error}</p>}

          {/* CARD DE BUSCA */}
          <section className="card search-card">
            <div className="card-header">
              <div>
                <h2>Buscar veículo</h2>
                <p>Digite a marca e o modelo, depois selecione o ano.</p>
              </div>
              <div className="steps">
                <span
                  className={`step-pill ${
                    currentStep === "marca" ? "active" : ""
                  }`}
                >
                  1. Marca
                </span>
                <span
                  className={`step-pill ${
                    currentStep === "modelo" ? "active" : ""
                  }`}
                >
                  2. Modelo
                </span>
                <span
                  className={`step-pill ${currentStep === "ano" ? "active" : ""}`}
                >
                  3. Ano
                </span>
                <span
                  className={`step-pill ${
                    currentStep === "detalhes" ? "active" : ""
                  }`}
                >
                  4. Detalhes
                </span>
              </div>
            </div>

            <div className="fields-grid">
              {/* Marca */}
              <div className="field">
                <label className="field-label">Marca</label>
                <input
                  type="text"
                  list="brand-options"
                  value={brandSearch}
                  onChange={handleBrandInput}
                  placeholder="Ex: BMW, VW, Fiat..."
                  className="field-input"
                />
                <datalist id="brand-options">
                  {brands.map((b) => (
                    <option key={b.codigo} value={b.nome} />
                  ))}
                </datalist>
                <p className="field-hint">
                  Digite a marca e escolha uma opção sugerida.
                </p>
              </div>

              {/* Modelo */}
              <div className="field">
                <label className="field-label">Modelo</label>
                <input
                  type="text"
                  list="model-options"
                  value={modelSearch}
                  onChange={handleModelInput}
                  placeholder={
                    brandCode
                      ? "Ex: 320i, Gol, Civic..."
                      : "Selecione uma marca primeiro"
                  }
                  disabled={!brandCode}
                  className="field-input"
                />
                <datalist id="model-options">
                  {models.map((m) => (
                    <option key={m.codigo} value={m.nome} />
                  ))}
                </datalist>
                <p className="field-hint">
                  Os modelos são filtrados pela marca escolhida.
                </p>
              </div>

              {/* Ano */}
              <div className="field">
                <label className="field-label">Ano</label>
                <select
                  value={yearCode}
                  onChange={(e) => setYearCode(e.target.value)}
                  className="field-input"
                  disabled={!brandCode || !modelCode}
                >
                  <option value="">Selecione</option>
                  {years.map((y) => (
                    <option key={y.codigo} value={y.codigo}>
                      {y.nome}
                    </option>
                  ))}
                </select>
                <p className="field-hint">
                  Mostramos apenas os anos disponíveis na FIPE.
                </p>
              </div>
            </div>
          </section>

          {/* CARD DE DETALHES */}
          <section className="card details-card">
            <div className="card-header">
              <div>
                <h2>Detalhes do veículo</h2>
                <p>Veja o valor FIPE e informações principais.</p>
              </div>
            </div>

            {loadingDetails && (
              <div className="details-placeholder">
                <div className="skeleton skeleton-title" />
                <div className="skeleton skeleton-line" />
                <div className="skeleton skeleton-line" />
                <div className="skeleton skeleton-line short" />
              </div>
            )}

            {!loadingDetails && !details && (
              <div className="details-placeholder">
                <p>
                  Comece selecionando marca, modelo e ano para ver os detalhes
                  aqui.
                </p>
              </div>
            )}

            {!loadingDetails && details && details.fipe && (
              <div className="details-content">
                <div className="details-main">
                  <div className="details-header-row">
                    <div>
                      <h3>{details.fipe.Modelo}</h3>
                      <p className="details-sub">
                        {details.fipe.Marca} • {details.fipe.AnoModelo} •{" "}
                        {details.fipe.Combustivel}
                      </p>
                    </div>
                    <div className="price-badge">
                      <span className="price-label">Valor FIPE</span>
                      <span className="price-value">{details.fipe.Valor}</span>
                      <span className="price-ref">
                        {details.fipe.MesReferencia}
                      </span>
                    </div>
                  </div>

                  <div className="details-grid">
                    <div className="details-item">
                      <span className="details-item-label">Código FIPE</span>
                      <span className="details-item-value">
                        {details.fipe.CodigoFipe}
                      </span>
                    </div>
                    <div className="details-item">
                      <span className="details-item-label">Combustível</span>
                      <span className="details-item-value">
                        {details.fipe.Combustivel}
                      </span>
                    </div>
                    <div className="details-item">
                      <span className="details-item-label">Ano Modelo</span>
                      <span className="details-item-value">
                        {details.fipe.AnoModelo}
                      </span>
                    </div>
                    <div className="details-item">
                      <span className="details-item-label">Tipo veículo</span>
                      <span className="details-item-value">
                        {details.fipe.TipoVeiculo === 1
                          ? "Automóvel"
                          : details.fipe.TipoVeiculo}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="details-extra">
                  <h4>Especificações técnicas (API externa)</h4>
                  {details.specs ? (
                    <pre className="specs-json">
                      {JSON.stringify(details.specs, null, 2)}
                    </pre>
                  ) : (
                    <p className="details-note">
                      Nenhuma especificação extra encontrada para este modelo.
                      <br />
                      Você ainda pode usar as informações da FIPE acima.
                    </p>
                  )}
                </div>
              </div>
            )}
          </section>
        </main>

        <footer className="app-footer">
          <span>
            Projeto de estudo • FIPE + React • {new Date().getFullYear()}
          </span>
        </footer>
      </div>
    </div>
  );
}

export default App;

/**
 * Constrói a URL de busca da Webmotors a partir dos filtros.
 * Usa apenas a URL pública de listagem (estoque). Não consome API privada.
 *
 * Parâmetros conhecidos (podem mudar se a Webmotors alterar o site):
 * - tipoveiculo: carros | carros-usados | carros-novos
 * - marca1: slug da marca (ex: volkswagen, fiat)
 * - anode: ano mínimo (ex: 2019)
 * - anoate: ano máximo (ex: 2024)
 * - precode: preço mínimo em reais (ex: 30000)
 * - precoate: preço máximo em reais (ex: 150000)
 * - page: página (default 1)
 *
 * @param {Object} filters
 * @param {string} [filters.marca] - Slug ou nome da marca (ex: "volkswagen")
 * @param {string} [filters.modelo] - Modelo (texto; nem sempre há param na URL pública)
 * @param {number} [filters.anoMin] - Ano mínimo
 * @param {number} [filters.anoMax] - Ano máximo
 * @param {number} [filters.precoMin] - Preço mínimo (R$)
 * @param {number} [filters.precoMax] - Preço máximo (R$)
 * @param {string} [filters.uf] - Sigla do estado (ex: "SP")
 * @param {string} [filters.cidade] - Nome da cidade
 * @param {string} [filters.tipo] - "carros" | "carros-usados" | "carros-novos"
 * @returns {string} URL completa para abrir na Webmotors
 */

/** Remove acentos e gera slug para cidade (ex: "São Paulo" -> "sao-paulo"). */
function cidadeToSlug(cidade) {
  if (!cidade || typeof cidade !== "string") return "";
  const normalized = String(cidade)
    .trim()
    .normalize("NFD")
    .replace(/\u0300-\u036f/g, "")
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "");
  return normalized || "";
}

/**
 * Converte nome do modelo no slug que a Webmotors usa.
 * Ex: "A5 2.0 TFSI" -> "a5", "A 5" (com espaço) -> "a5", "GOL 1.0" -> "gol".
 */
function modelNameToSlug(name) {
  if (!name || typeof name !== "string") return "";
  const trimmed = name.trim();
  if (!trimmed) return "";
  const parts = trimmed.split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "";
  let slug = parts[0].toLowerCase().replace(/[^a-z0-9]/g, "");
  if (parts.length >= 2 && parts[0].length <= 2 && /^\d+$/.test(parts[1].replace(/[^0-9]/g, ""))) {
    slug = (parts[0] + parts[1]).toLowerCase().replace(/[^a-z0-9]/g, "");
  }
  return slug || "";
}

export function buildWebmotorsSearchUrl(filters) {
  const BASE_HOST = "https://www.webmotors.com.br";
  const params = new URLSearchParams();

  if (!filters || typeof filters !== "object") {
    params.set("tipoveiculo", "carros");
    params.set("page", "1");
    return `${BASE_HOST}/carros/estoque?${params.toString()}`;
  }

  const tipo = filters.tipo && ["carros", "carros-usados", "carros-novos"].includes(filters.tipo)
    ? filters.tipo
    : "carros";
  params.set("tipoveiculo", tipo);
  params.set("page", "1");

  const ufSlug = filters.uf && String(filters.uf).trim()
    ? String(filters.uf).trim().toUpperCase().slice(0, 2).toLowerCase()
    : "";
  const cidadeSlug = filters.cidade && String(filters.cidade).trim()
    ? cidadeToSlug(filters.cidade)
    : "";
  const locationSlug =
    ufSlug && cidadeSlug
      ? `${ufSlug}-${cidadeSlug}`
      : ufSlug
        ? ufSlug
        : "";

  const BASE_PATH = `${BASE_HOST}/${tipo}/estoque`;

  const marcaSlug = filters.marca && String(filters.marca).trim()
    ? String(filters.marca).trim().toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "")
    : "";
  const modeloSlug = filters.modelo && String(filters.modelo).trim()
    ? modelNameToSlug(filters.modelo)
    : "";

  if (marcaSlug) {
    params.set("marca1", marcaSlug);
  }
  if (modeloSlug) {
    params.set("modelo1", modeloSlug);
  }

  let path;
  if (locationSlug) {
    path = `${BASE_HOST}/${tipo}/${locationSlug}`;
    params.set("estado1", ufSlug || "");
    if (cidadeSlug) params.set("cidade1", String(filters.cidade).trim());
  } else {
    path = BASE_PATH;
  }

  if (marcaSlug && modeloSlug) {
    path = `${path}/${marcaSlug}/${modeloSlug}`;
  } else if (marcaSlug) {
    path = `${path}/${marcaSlug}`;
  }

  const anoMinNum = filters.anoMin != null && filters.anoMin !== "" ? Number(filters.anoMin) : NaN;
  const anoMaxNum = filters.anoMax != null && filters.anoMax !== "" ? Number(filters.anoMax) : NaN;
  const hasAnoMin = !Number.isNaN(anoMinNum);
  const hasAnoMax = !Number.isNaN(anoMaxNum);

  if (hasAnoMin || hasAnoMax) {
    if (hasAnoMin) params.set("anode", String(anoMinNum));
    if (hasAnoMax) params.set("anoate", String(anoMaxNum));
    if (hasAnoMin && hasAnoMax) {
      path = `${path}/de.${anoMinNum}/ate.${anoMaxNum}`;
    } else if (hasAnoMin) {
      path = `${path}/de.${anoMinNum}/ate.${new Date().getFullYear() + 1}`;
    } else if (hasAnoMax) {
      path = `${path}/de.1990/ate.${anoMaxNum}`;
    }
  }
  if (filters.precoMin != null && filters.precoMin !== "") {
    const p = Number(filters.precoMin);
    if (!Number.isNaN(p) && p >= 0) params.set("precode", String(Math.round(p)));
  }
  if (filters.precoMax != null && filters.precoMax !== "") {
    const p = Number(filters.precoMax);
    if (!Number.isNaN(p) && p >= 0) params.set("precoate", String(Math.round(p)));
  }
  if (filters.uf && String(filters.uf).trim()) {
    params.set("estado1", String(filters.uf).trim().toUpperCase().slice(0, 2));
  }
  if (filters.cidade && String(filters.cidade).trim()) {
    params.set("cidade1", String(filters.cidade).trim());
  }

  return `${path}?${params.toString()}`;
}

/**
 * Exemplos de uso (entrada → URL gerada):
 *
 * 1) Carros até R$ 50.000:
 *    buildWebmotorsSearchUrl({ precoMax: 50000 })
 *    → https://www.webmotors.com.br/carros/estoque?tipoveiculo=carros&page=1&precoate=50000
 *
 * 2) SUVs 2019+ (marca pode ser genérica; tipo carros):
 *    buildWebmotorsSearchUrl({ anoMin: 2019 })
 *    → https://www.webmotors.com.br/carros/estoque?tipoveiculo=carros&page=1&anode=2019
 *
 * 3) Econômicos (hatch) até R$ 40.000:
 *    buildWebmotorsSearchUrl({ precoMax: 40000 })
 *    → https://www.webmotors.com.br/carros/estoque?tipoveiculo=carros&page=1&precoate=40000
 *
 * 4) Volkswagen, 2020 a 2023, R$ 80k–150k:
 *    buildWebmotorsSearchUrl({ marca: "volkswagen", anoMin: 2020, anoMax: 2023, precoMin: 80000, precoMax: 150000 })
 *    → ...?tipoveiculo=carros&page=1&marca1=volkswagen&anode=2020&anoate=2023&precode=80000&precoate=150000
 *
 * Se a URL pública da Webmotors mudar: edite BASE e os nomes dos params (marca1, anode, anoate, precode, precoate, estado1, cidade1, modelo1) conforme o novo padrão do site.
 */

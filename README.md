# TudoCarro - Frontend

Frontend da aplicação TudoCarro, uma plataforma para consulta de valores FIPE, especificações técnicas de veículos e notícias do mercado automotivo.

## Tecnologias

- **React 19.2.0** - Biblioteca JavaScript para construção de interfaces
- **Vite 7.2.4** - Build tool e dev server de alta performance
- **React Router DOM 7.12.0** - Roteamento para aplicações React
- **ESLint** - Linter para garantir qualidade de código

## Pré-requisitos

- Node.js (versão 18 ou superior)
- npm ou yarn

## Instalação

1. Clone o repositório e navegue até a pasta do frontend:
```bash
cd tudocarro-frontend
```

2. Instale as dependências:
```bash
npm install
```

## Executando o projeto

### Modo de desenvolvimento

```bash
npm run dev
```

O servidor de desenvolvimento será iniciado em `http://localhost:5173` (porta padrão do Vite).

### Build para produção

```bash
npm run build
```

Os arquivos otimizados serão gerados na pasta `dist/`.

### Preview da build de produção

```bash
npm run preview
```

### Linting

```bash
npm run lint
```

## Estrutura do Projeto

```
tudocarro-frontend/
├── public/
│   ├── logotudocarro.png    # Logo da aplicação
│   └── vite.svg
├── src/
│   ├── assets/              # Assets estáticos
│   ├── pages/               # Páginas da aplicação
│   │   ├── Home.jsx         # Página inicial com notícias
│   │   ├── Fipe.jsx         # Consulta FIPE e especificações
│   │   └── Compare.jsx      # Comparação de veículos (em desenvolvimento)
│   ├── App.jsx              # Componente principal e roteamento
│   ├── App.css             # Estilos globais
│   ├── index.css           # Estilos base
│   └── main.jsx            # Ponto de entrada da aplicação
├── index.html              # HTML base
├── vite.config.js          # Configuração do Vite
├── eslint.config.js        # Configuração do ESLint
└── package.json            # Dependências e scripts
```

## Funcionalidades

### Home
- Exibição de notícias do mercado automotivo
- Integração com feeds RSS do G1 Carros
- Busca de notícias via GNews API
- Layout responsivo com cards de notícias

### FIPE
- Consulta de valores FIPE por marca, modelo e ano
- Busca inteligente com autocomplete
- Exibição de detalhes do veículo:
  - Valor FIPE atualizado
  - Código FIPE
  - Tipo de combustível
  - Ano do modelo
- Especificações técnicas complementares:
  - Motor e cilindrada
  - Transmissão
  - Tração
  - Consumo (cidade/estrada)
  - Carroceria
  - E mais...

### Comparação (Em desenvolvimento)
- Comparação lado a lado de dois veículos
- Comparação de preços FIPE
- Comparação de especificações técnicas

## Configuração

### Variáveis de Ambiente

Crie um arquivo `.env` na raiz do projeto (opcional):

```env
VITE_API_URL=http://localhost:4000/api
```

Se não configurado, o frontend usará `http://localhost:4000/api` como padrão.

## Integração com Backend

O frontend consome as seguintes APIs do backend:

- **Notícias:**
  - `GET /api/news/g1` - Notícias do G1 Carros
  - `GET /api/news/gnews?q={query}` - Busca de notícias via GNews

- **FIPE e Especificações:**
  - `GET /api/cars/brands` - Lista de marcas
  - `GET /api/cars/models/:brandCode` - Modelos de uma marca
  - `GET /api/cars/years/:brandCode/:modelCode` - Anos de um modelo
  - `GET /api/cars/details/:brandCode/:modelCode/:yearCode` - Detalhes completos do veículo

## Design

- Interface moderna com tema escuro
- Layout responsivo
- Navegação intuitiva com navbar fixa
- Cards e componentes visuais bem estruturados
- Feedback visual durante carregamento

## Scripts Disponíveis

- `npm run dev` - Inicia servidor de desenvolvimento
- `npm run build` - Cria build de produção
- `npm run preview` - Preview da build de produção
- `npm run lint` - Executa o linter

## Troubleshooting

### Erro de conexão com o backend

Certifique-se de que:
1. O backend está rodando na porta configurada (padrão: 4000)
2. A variável `VITE_API_URL` está configurada corretamente
3. Não há problemas de CORS (o backend deve permitir requisições do frontend)

### Problemas de build

```bash
# Limpe o cache e reinstale dependências
rm -rf node_modules package-lock.json
npm install
```

## Licença

Este projeto é parte do TudoCarro.

## Autor

Gabriel Silva

---

**TudoCarro** - FIPE • Notícias • Comparação

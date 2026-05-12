# chave-shell

Shell host do projeto Chave. Esta aplicação React + Vite é o ponto de entrada
do navegador e delega os fluxos de autenticação para o microfrontend
`chave-mfe-auth` via Module Federation.

## Responsabilidade

- Executar em `http://localhost:3000`.
- Controlar o `BrowserRouter` de topo.
- Renderizar o dashboard em `/`.
- Encaminhar as demais rotas, como `/login`, `/register` e `/profile`, para o
  remote `mfe_auth/AuthApp`.

## Module Federation

O host se chama `shell` e consome o remote `mfe_auth`.

| Item | Valor |
| --- | --- |
| Remote module | `mfe_auth/AuthApp` |
| URL padrão | `http://localhost:4001/assets/remoteEntry.js` |
| Variável de build | `MFE_AUTH_URL` |
| Shared packages | `react`, `react-dom`, `react-router-dom` |

Exemplo com URL customizada:

```bash
MFE_AUTH_URL=http://localhost:4001/assets/remoteEntry.js npm run build
```

## Desenvolvimento local

```bash
npm ci
npm run dev
```

URLs locais padrão:

| Serviço | URL |
| --- | --- |
| Shell | `http://localhost:3000` |
| Auth MFE | `http://localhost:4001` |
| Auth remoteEntry | `http://localhost:4001/assets/remoteEntry.js` |
| Auth API | `http://localhost:3001` |
| Swagger | `http://localhost:3001/docs` |

## Docker

Build:

```bash
docker build \
  --build-arg MFE_AUTH_URL=http://localhost:4001/assets/remoteEntry.js \
  -t chave-shell .
```

Run:

```bash
docker run --rm -p 3000:3000 chave-shell
```

A imagem usa `npm ci`, gera o build Vite e serve `dist/` com nginx na porta
`3000`, com fallback de SPA para as rotas delegadas ao microfrontend.

## Docker Compose

Na stack completa, este serviço deve ser iniciado pelo repositório
`chave-infra`, junto com:

- PostgreSQL
- `chave-ms-auth`
- `chave-mfe-auth`
- `chave-shell`
- serviço AWS-compatible local em `http://localhost:4566`

O Compose deve passar `MFE_AUTH_URL` durante o build da imagem do shell.

## CI/CD

O workflow em `.github/workflows/ci.yml` executa:

- `npm ci`
- `npm run build`
- `docker build`
- empacotamento e upload do artefato `chave-shell-dist.tar.gz`
- release quando a referência for uma tag `v*`

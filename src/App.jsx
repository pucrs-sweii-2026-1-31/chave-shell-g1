import { Component, Suspense, lazy } from "react";
import { BrowserRouter, Link, Route, Routes } from "react-router-dom";
import "./App.css";

const AuthApp = lazy(() => import("mfe_auth/AuthApp"));

class RemoteErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error) {
    console.error("Unable to load auth microfrontend", error);
  }

  render() {
    if (this.state.hasError) {
      return (
        <main className="shell-page">
          <section className="shell-panel" aria-labelledby="remote-error-title">
            <p className="shell-eyebrow">Autenticação</p>
            <h1 id="remote-error-title">Não foi possível abrir esta área</h1>
            <p className="shell-copy">
              O microfrontend de autenticação não respondeu. Verifique se o
              chave-mfe-auth está disponível e tente novamente.
            </p>
            <Link className="shell-link shell-link-primary" to="/">
              Voltar ao painel
            </Link>
          </section>
        </main>
      );
    }

    return this.props.children;
  }
}

function Dashboard() {
  return (
    <main className="shell-page">
      <section className="shell-panel" aria-labelledby="dashboard-title">
        <p className="shell-eyebrow">Chave</p>
        <h1 id="dashboard-title">Painel</h1>
        <p className="shell-copy">
          Acesse os fluxos de autenticação pelo shell da aplicação.
        </p>

        <nav className="shell-actions" aria-label="Rotas de autenticação">
          <Link className="shell-link shell-link-primary" to="/login">
            Entrar
          </Link>
          <Link className="shell-link" to="/register">
            Criar conta
          </Link>
          <Link className="shell-link" to="/profile">
            Conta
          </Link>
        </nav>
      </section>
    </main>
  );
}

function RemoteAuthApp() {
  return (
    <RemoteErrorBoundary>
      <Suspense
        fallback={
          <main className="shell-page">
            <div className="shell-loading" role="status" aria-live="polite">
              Carregando autenticação...
            </div>
          </main>
        }
      >
        <AuthApp />
      </Suspense>
    </RemoteErrorBoundary>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/*" element={<RemoteAuthApp />} />
      </Routes>
    </BrowserRouter>
  );
}

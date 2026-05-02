import { Switch, Route, Router as WouterRouter } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/lib/auth-context";
import { Home } from "@/pages/home";
import { Servicos } from "@/pages/servicos";
import { ComoFunciona } from "@/pages/como-funciona";
import { ParaPrestadores } from "@/pages/para-prestadores";
import { Entrar } from "@/pages/entrar";
import { Cadastrar } from "@/pages/cadastrar";
import { MinhaArea } from "@/pages/minha-area";
import { AdminPage } from "@/pages/admin";
import NotFound from "@/pages/not-found";

const queryClient = new QueryClient();

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/servicos" component={Servicos} />
      <Route path="/como-funciona" component={ComoFunciona} />
      <Route path="/para-prestadores" component={ParaPrestadores} />
      <Route path="/entrar" component={Entrar} />
      <Route path="/cadastrar" component={Cadastrar} />
      <Route path="/minha-area" component={MinhaArea} />
      <Route path="/admin" component={AdminPage} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <AuthProvider>
          <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
            <Router />
          </WouterRouter>
          <Toaster />
        </AuthProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;

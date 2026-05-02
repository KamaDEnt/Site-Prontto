import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Layout } from "@/components/layout";
import { FadeIn } from "@/components/fade-in";
import { useAuth, apiFetch, type PublicUser } from "@/lib/auth-context";
import {
  LayoutDashboard, Clock, CheckCircle, Star, Plus, ChevronRight,
  Bell, Settings, CreditCard, Heart, FileText, Search,
  Calendar, Wrench, Sparkles, TreePine, Zap, Hammer, Droplet,
  TrendingUp, MessageSquare, LogOut, AlertCircle, Loader,
  BadgeCheck, DollarSign, MapPin, User, Phone, Mail,
  Building, Hash, Landmark, Pencil, Save, X,
} from "lucide-react";

// ─── Banking form ──────────────────────────────────────────────────────────

interface BankingData {
  pixKeyType: string; pixKey: string; fullName: string; cpfCnpj: string;
  bankName: string; agency: string; accountNumber: string; bankAccountType: string;
}

const EMPTY_BANKING: BankingData = {
  pixKeyType: "cpf", pixKey: "", fullName: "", cpfCnpj: "",
  bankName: "", agency: "", accountNumber: "", bankAccountType: "checking",
};

function BankingForm({ existing, onSaved }: { existing: BankingData | null; onSaved: (d: BankingData) => void }) {
  const [form, setForm] = useState<BankingData>(existing ?? EMPTY_BANKING);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const upd = (k: keyof BankingData) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    setForm(f => ({ ...f, [k]: e.target.value }));

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(""); setSuccess(false); setLoading(true);
    try {
      const res = await apiFetch("/auth/banking", {
        method: "POST",
        body: JSON.stringify(form),
      });
      const data = await res.json() as { error?: string; banking?: BankingData };
      if (!res.ok || data.error) { setError(data.error ?? "Erro ao salvar"); }
      else { setSuccess(true); onSaved(form); }
    } catch { setError("Erro de conexão"); }
    finally { setLoading(false); }
  };

  const field = (label: string, key: keyof BankingData, opts?: { placeholder?: string; type?: string; icon?: React.ElementType; required?: boolean; hint?: string }) => (
    <div className="flex flex-col gap-1.5">
      <label className="text-sm font-medium text-secondary/80 flex items-center gap-1">
        {label} {opts?.hint && <span className="text-xs text-muted-foreground font-normal">({opts.hint})</span>}
      </label>
      <div className="relative">
        {opts?.icon && <opts.icon size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" />}
        <input type={opts?.type ?? "text"} placeholder={opts?.placeholder} value={form[key]} onChange={upd(key)} required={opts?.required}
          className={`w-full bg-background border border-border rounded-xl px-4 py-3 ${opts?.icon ? "pl-10" : ""} text-secondary placeholder:text-muted-foreground/50 text-sm focus:outline-none focus:border-primary transition-all`} />
      </div>
    </div>
  );

  return (
    <form onSubmit={handleSave} className="flex flex-col gap-5">
      {error && (
        <div className="flex items-center gap-2 bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-red-600 text-sm">
          <AlertCircle size={15} className="shrink-0" />{error}
        </div>
      )}
      {success && (
        <div className="flex items-center gap-2 bg-green-50 border border-green-200 rounded-xl px-4 py-3 text-green-700 text-sm">
          <CheckCircle size={15} className="shrink-0" />Dados bancários salvos com sucesso!
        </div>
      )}

      {/* Pix section */}
      <div className="bg-primary/5 border border-primary/20 rounded-2xl p-5 flex flex-col gap-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-primary/15 flex items-center justify-center"><DollarSign size={16} className="text-primary" /></div>
          <h3 className="font-bold text-secondary">Dados Pix</h3>
        </div>
        <div className="grid sm:grid-cols-2 gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-secondary/80">Tipo de chave Pix</label>
            <select value={form.pixKeyType} onChange={upd("pixKeyType")} required
              className="w-full bg-background border border-border rounded-xl px-4 py-3 text-secondary text-sm focus:outline-none focus:border-primary transition-all">
              <option value="cpf">CPF</option>
              <option value="cnpj">CNPJ</option>
              <option value="email">E-mail</option>
              <option value="phone">Telefone</option>
              <option value="random">Chave aleatória</option>
            </select>
          </div>
          {field("Chave Pix", "pixKey", { placeholder: form.pixKeyType === "cpf" ? "000.000.000-00" : form.pixKeyType === "email" ? "seu@email.com" : "Sua chave", required: true })}
        </div>
      </div>

      {/* Personal/entity section */}
      <div className="bg-background border border-border rounded-2xl p-5 flex flex-col gap-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center"><User size={16} className="text-blue-500" /></div>
          <h3 className="font-bold text-secondary">Titular da conta</h3>
        </div>
        <div className="grid sm:grid-cols-2 gap-4">
          {field("Nome completo / Razão social", "fullName", { placeholder: "Nome do titular", icon: User, required: true })}
          {field("CPF / CNPJ", "cpfCnpj", { placeholder: "000.000.000-00", icon: Hash, required: true })}
        </div>
      </div>

      {/* Bank account section */}
      <div className="bg-background border border-border rounded-2xl p-5 flex flex-col gap-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-green-50 flex items-center justify-center"><Landmark size={16} className="text-green-600" /></div>
          <h3 className="font-bold text-secondary">Dados bancários <span className="text-sm text-muted-foreground font-normal">(opcional)</span></h3>
        </div>
        <div className="grid sm:grid-cols-3 gap-4">
          {field("Banco", "bankName", { placeholder: "Ex: Nubank, Itaú", icon: Building })}
          {field("Agência", "agency", { placeholder: "0000", icon: Hash })}
          {field("Conta", "accountNumber", { placeholder: "00000-0", icon: Hash })}
        </div>
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-secondary/80">Tipo de conta</label>
          <div className="flex gap-3">
            {[{ v: "checking", l: "Corrente" }, { v: "savings", l: "Poupança" }].map(opt => (
              <label key={opt.v} className="flex items-center gap-2 cursor-pointer">
                <div onClick={() => setForm(f => ({ ...f, bankAccountType: opt.v }))}
                  className={`w-4 h-4 rounded-full border-2 flex items-center justify-center transition-colors ${form.bankAccountType === opt.v ? "border-primary" : "border-border"}`}>
                  {form.bankAccountType === opt.v && <div className="w-2 h-2 rounded-full bg-primary" />}
                </div>
                <span className="text-sm text-secondary">{opt.l}</span>
              </label>
            ))}
          </div>
        </div>
      </div>

      <Button type="submit" disabled={loading} className="w-full sm:w-auto sm:self-end h-12 px-8 rounded-xl bg-primary text-white font-bold hover:bg-primary/90 shadow-lg shadow-primary/30 disabled:opacity-60">
        {loading ? <><Loader size={16} className="animate-spin mr-2" />Salvando...</> : <><Save size={16} className="mr-2" />Salvar dados bancários</>}
      </Button>
    </form>
  );
}

// ─── Professional dashboard ────────────────────────────────────────────────

const PRESTADOR_TABS = ["Visão Geral", "Pedidos", "Dados Bancários", "Configurações"] as const;
type PrestadorTab = (typeof PRESTADOR_TABS)[number];

function PrestadorDashboard({ user, onLogout }: { user: PublicUser; onLogout: () => void }) {
  const [activeTab, setActiveTab] = useState<PrestadorTab>("Visão Geral");
  const [banking, setBanking] = useState<BankingData | null>(null);
  const [bankingLoaded, setBankingLoaded] = useState(false);
  const [showNotif, setShowNotif] = useState(false);

  useEffect(() => {
    if (activeTab === "Dados Bancários" && !bankingLoaded) {
      apiFetch("/auth/banking").then(r => r.json()).then((d: { banking: BankingData | null }) => {
        setBanking(d.banking);
        setBankingLoaded(true);
      }).catch(() => setBankingLoaded(true));
    }
  }, [activeTab, bankingLoaded]);

  return (
    <div className="bg-background min-h-screen">
      {/* Header */}
      <section className="bg-secondary pt-28 pb-10">
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-primary/20 flex items-center justify-center text-2xl font-bold text-primary border border-primary/30">
                {user.name.charAt(0).toUpperCase()}
              </div>
              <div>
                <div className="flex items-center gap-2 mb-0.5">
                  <p className="text-white/50 text-sm">Prestador de Serviços</p>
                  <span className="px-2 py-0.5 rounded-full bg-primary/20 text-primary text-[10px] font-bold flex items-center gap-1">
                    <BadgeCheck size={10} />PRESTADOR
                  </span>
                </div>
                <h1 className="text-2xl font-bold text-white">{user.name}</h1>
                <p className="text-white/40 text-xs mt-0.5">{user.specialty ?? "Serviços Gerais"} {user.city ? `· ${user.city}` : ""}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 relative">
              <motion.button whileHover={{ scale: 1.05 }} onClick={() => setShowNotif(!showNotif)}
                className="w-10 h-10 rounded-xl bg-white/8 border border-white/10 flex items-center justify-center text-white/70 hover:bg-white/12 transition-colors">
                <Bell size={18} />
              </motion.button>
              {showNotif && (
                <motion.div initial={{ opacity: 0, y: 8, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }}
                  className="absolute right-0 top-12 w-72 bg-white rounded-2xl shadow-2xl border border-border z-50 overflow-hidden">
                  <div className="p-4 border-b border-border font-bold text-secondary text-sm">Notificações</div>
                  <div className="p-4 text-sm text-muted-foreground text-center py-8">Nenhuma notificação</div>
                </motion.div>
              )}
              <Button onClick={onLogout} variant="outline" size="sm" className="rounded-xl border-white/20 text-white hover:bg-white/10 gap-2">
                <LogOut size={14} />Sair
              </Button>
            </div>
          </div>

          {/* Stats row */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-8">
            {[
              { label: "Avaliação", value: "—", sub: "Sem avaliações ainda", icon: Star },
              { label: "Serviços feitos", value: "0", sub: "Nenhum ainda", icon: CheckCircle },
              { label: "Pedidos ativos", value: "0", sub: "Aguardando pedidos", icon: Clock },
              { label: "Este mês", value: "R$ 0", sub: "Sem ganhos ainda", icon: DollarSign },
            ].map(s => (
              <div key={s.label} className="bg-white/8 border border-white/10 rounded-2xl p-4">
                <s.icon size={18} className="text-primary mb-2" />
                <p className="text-2xl font-bold text-white">{s.value}</p>
                <p className="text-xs text-white/50 mt-0.5">{s.label}</p>
              </div>
            ))}
          </div>

          {/* Tabs */}
          <div className="flex gap-1 mt-8 bg-white/5 border border-white/10 rounded-xl p-1 w-fit flex-wrap">
            {PRESTADOR_TABS.map(tab => (
              <button key={tab} onClick={() => setActiveTab(tab)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${activeTab === tab ? "bg-primary text-white shadow-md" : "text-white/50 hover:text-white"}`}>
                {tab}
                {tab === "Dados Bancários" && !banking && bankingLoaded && (
                  <span className="ml-1.5 w-2 h-2 rounded-full bg-yellow-400 inline-block" />
                )}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Content */}
      <div className="container mx-auto px-4 md:px-6 py-10">
        <AnimatePresence mode="wait">
          <motion.div key={activeTab} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.25 }}>

            {activeTab === "Visão Geral" && (
              <div className="flex flex-col gap-8">
                {/* Banking alert */}
                {bankingLoaded && !banking && (
                  <FadeIn>
                    <div className="bg-yellow-50 border border-yellow-200 rounded-2xl p-5 flex flex-col sm:flex-row items-start sm:items-center gap-4">
                      <div className="w-10 h-10 rounded-xl bg-yellow-100 flex items-center justify-center shrink-0"><AlertCircle size={20} className="text-yellow-600" /></div>
                      <div className="flex-1">
                        <h3 className="font-bold text-yellow-800 mb-1">Complete seus dados bancários</h3>
                        <p className="text-sm text-yellow-700">Para receber pagamentos por Pix, cadastre sua chave e informações bancárias.</p>
                      </div>
                      <Button onClick={() => setActiveTab("Dados Bancários")} className="rounded-xl bg-yellow-500 hover:bg-yellow-600 text-white text-sm shrink-0">Cadastrar agora</Button>
                    </div>
                  </FadeIn>
                )}

                <FadeIn>
                  <div className="bg-primary/5 border border-primary/20 rounded-2xl p-6 flex flex-col sm:flex-row items-center gap-5">
                    <div className="flex-1">
                      <h3 className="font-bold text-xl text-secondary mb-2">Seu perfil está pronto!</h3>
                      <p className="text-muted-foreground text-sm">Assim que clientes fizerem pedidos na sua área, você receberá notificações aqui.</p>
                    </div>
                    <Link href="/servicos">
                      <Button className="rounded-xl bg-primary text-white shrink-0">Ver serviços disponíveis <ChevronRight size={16} className="ml-1" /></Button>
                    </Link>
                  </div>
                </FadeIn>

                <FadeIn delay={0.1}>
                  <h2 className="font-bold text-secondary text-lg mb-4">Ações Rápidas</h2>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    {[
                      { icon: DollarSign, label: "Dados Bancários", color: "bg-green-50 text-green-600", tab: "Dados Bancários" as PrestadorTab },
                      { icon: User, label: "Meu Perfil", color: "bg-blue-50 text-blue-600", tab: "Configurações" as PrestadorTab },
                      { icon: Star, label: "Avaliações", color: "bg-yellow-50 text-yellow-600", tab: "Pedidos" as PrestadorTab },
                      { icon: TrendingUp, label: "Estatísticas", color: "bg-purple-50 text-purple-600", tab: "Visão Geral" as PrestadorTab },
                    ].map(a => (
                      <motion.div key={a.label} whileHover={{ scale: 1.03 }} onClick={() => setActiveTab(a.tab)}
                        className="flex flex-col items-center gap-3 p-5 rounded-2xl bg-white border border-border/40 hover:shadow-md hover:border-primary/20 cursor-pointer transition-all">
                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${a.color}`}><a.icon size={22} /></div>
                        <span className="text-sm font-medium text-secondary text-center">{a.label}</span>
                      </motion.div>
                    ))}
                  </div>
                </FadeIn>
              </div>
            )}

            {activeTab === "Dados Bancários" && (
              <div className="max-w-2xl flex flex-col gap-6">
                <div>
                  <h2 className="text-xl font-bold text-secondary mb-1">Dados Bancários & Pix</h2>
                  <p className="text-muted-foreground text-sm">Cadastre sua chave Pix para receber pagamentos diretamente da plataforma após a conclusão de cada serviço.</p>
                </div>
                {!bankingLoaded ? (
                  <div className="flex items-center gap-3 text-muted-foreground py-8"><Loader size={20} className="animate-spin" />Carregando...</div>
                ) : (
                  <BankingForm existing={banking} onSaved={data => { setBanking(data); setBankingLoaded(true); }} />
                )}
              </div>
            )}

            {(activeTab === "Pedidos" || activeTab === "Configurações") && (
              <div className="flex flex-col items-center justify-center py-24 text-center gap-5">
                <div className="w-20 h-20 rounded-3xl bg-secondary/5 flex items-center justify-center">
                  {activeTab === "Pedidos" ? <Wrench size={32} className="text-secondary/30" /> : <Settings size={32} className="text-secondary/30" />}
                </div>
                <div>
                  <h3 className="font-bold text-secondary text-xl mb-2">{activeTab}</h3>
                  <p className="text-muted-foreground max-w-xs">Esta seção estará disponível em breve.</p>
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}

// ─── Client dashboard ─────────────────────────────────────────────────────

const CLIENTE_TABS = ["Visão Geral", "Meus Pedidos", "Favoritos", "Pagamentos"] as const;
type ClienteTab = (typeof CLIENTE_TABS)[number];

const recentServices = [
  { icon: Sparkles, name: "Limpeza Residencial", provider: "Ana Souza", date: "28 Abr 2026", status: "concluído", rating: 5, value: "R$ 180" },
  { icon: Zap, name: "Instalação Elétrica", provider: "Carlos Lima", date: "15 Abr 2026", status: "concluído", rating: 5, value: "R$ 220" },
  { icon: TreePine, name: "Jardinagem", provider: "Pedro Costa", date: "02 Mai 2026", status: "em andamento", rating: null, value: "R$ 130" },
];

const clientQuickActions = [
  { icon: Plus, label: "Novo Pedido", color: "bg-primary/15 text-primary", href: "/servicos" },
  { icon: Heart, label: "Favoritos", color: "bg-red-50 text-red-500", href: "#" },
  { icon: FileText, label: "Histórico", color: "bg-blue-50 text-blue-500", href: "#" },
  { icon: CreditCard, label: "Pagamentos", color: "bg-green-50 text-green-500", href: "#" },
  { icon: MessageSquare, label: "Mensagens", color: "bg-purple-50 text-purple-500", href: "#" },
  { icon: Settings, label: "Configurações", color: "bg-gray-50 text-gray-500", href: "#" },
];

function ClienteDashboard({ user, onLogout }: { user: PublicUser; onLogout: () => void }) {
  const [activeTab, setActiveTab] = useState<ClienteTab>("Visão Geral");
  const [showNotif, setShowNotif] = useState(false);

  return (
    <div className="bg-background min-h-screen">
      <section className="bg-secondary pt-28 pb-10">
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-primary/20 flex items-center justify-center text-2xl font-bold text-primary border border-primary/30">
                {user.name.charAt(0).toUpperCase()}
              </div>
              <div>
                <p className="text-white/50 text-sm">Bem-vindo de volta</p>
                <h1 className="text-2xl font-bold text-white">{user.name}</h1>
                <p className="text-white/40 text-xs mt-0.5">Cliente · {user.city ?? "Brasil"}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 relative">
              <motion.button whileHover={{ scale: 1.05 }} onClick={() => setShowNotif(!showNotif)}
                className="w-10 h-10 rounded-xl bg-white/8 border border-white/10 flex items-center justify-center text-white/70 hover:bg-white/12 transition-colors relative">
                <Bell size={18} />
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-primary rounded-full text-[9px] font-bold text-white flex items-center justify-center">2</span>
              </motion.button>
              {showNotif && (
                <motion.div initial={{ opacity: 0, y: 8, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }}
                  className="absolute right-0 top-12 w-80 bg-white rounded-2xl shadow-2xl border border-border z-50 overflow-hidden">
                  <div className="p-4 border-b border-border flex items-center justify-between">
                    <span className="font-bold text-secondary">Notificações</span>
                    <button onClick={() => setShowNotif(false)} className="text-xs text-muted-foreground hover:text-primary">Marcar como lido</button>
                  </div>
                  {[
                    { text: "Pedro Costa está a caminho — Jardinagem hoje", time: "Agora mesmo", unread: true },
                    { text: "Avalie o serviço de Elétrica com Carlos Lima", time: "2 dias atrás", unread: true },
                    { text: "Pagamento de R$ 180 confirmado", time: "5 dias atrás", unread: false },
                  ].map((n, i) => (
                    <div key={i} className={`p-4 border-b border-border/50 last:border-0 flex gap-3 ${n.unread ? "bg-primary/3" : ""}`}>
                      {n.unread ? <div className="w-2 h-2 rounded-full bg-primary mt-1.5 shrink-0" /> : <div className="w-2 shrink-0" />}
                      <div><p className="text-sm text-secondary leading-snug">{n.text}</p><p className="text-xs text-muted-foreground mt-1">{n.time}</p></div>
                    </div>
                  ))}
                </motion.div>
              )}
              <Button onClick={onLogout} variant="outline" size="sm" className="rounded-xl border-white/20 text-white hover:bg-white/10 gap-2">
                <LogOut size={14} />Sair
              </Button>
            </div>
          </div>

          <div className="flex gap-1 mt-8 bg-white/5 border border-white/10 rounded-xl p-1 w-fit">
            {CLIENTE_TABS.map(tab => (
              <button key={tab} onClick={() => setActiveTab(tab)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${activeTab === tab ? "bg-primary text-white shadow-md" : "text-white/50 hover:text-white"}`}>
                {tab}
              </button>
            ))}
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 md:px-6 py-10">
        {activeTab === "Visão Geral" && (
          <div className="flex flex-col gap-8">
            <FadeIn>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                  { icon: LayoutDashboard, label: "Pedidos Totais", value: "0", sub: "Nenhum ainda", color: "bg-blue-50 text-blue-600" },
                  { icon: CheckCircle, label: "Concluídos", value: "0", sub: "—", color: "bg-green-50 text-green-600" },
                  { icon: Clock, label: "Em Andamento", value: "0", sub: "—", color: "bg-orange-50 text-orange-600" },
                  { icon: Star, label: "Avaliações dadas", value: "0", sub: "—", color: "bg-yellow-50 text-yellow-600" },
                ].map(s => (
                  <Card key={s.label} className="bg-white border-border/40 hover:shadow-md transition-shadow">
                    <CardContent className="p-5 flex flex-col gap-3">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${s.color}`}><s.icon size={18} /></div>
                      <div>
                        <p className="text-3xl font-bold text-secondary">{s.value}</p>
                        <p className="text-sm font-medium text-secondary/80">{s.label}</p>
                        <p className="text-xs text-muted-foreground mt-0.5">{s.sub}</p>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </FadeIn>

            <FadeIn delay={0.1}>
              <h2 className="font-bold text-secondary text-lg mb-4">Ações Rápidas</h2>
              <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
                {clientQuickActions.map(a => (
                  <Link key={a.label} href={a.href}>
                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                      className="flex flex-col items-center gap-2.5 p-4 rounded-2xl bg-white border border-border/40 hover:shadow-md hover:border-primary/20 cursor-pointer transition-all">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${a.color}`}><a.icon size={18} /></div>
                      <span className="text-xs font-medium text-secondary text-center leading-snug">{a.label}</span>
                    </motion.div>
                  </Link>
                ))}
              </div>
            </FadeIn>

            <FadeIn delay={0.15}>
              <div className="bg-primary/5 border border-primary/20 rounded-2xl p-6 flex flex-col sm:flex-row items-center gap-5">
                <div className="flex-1">
                  <h3 className="font-bold text-xl text-secondary mb-2">Solicite seu primeiro serviço</h3>
                  <p className="text-muted-foreground text-sm">Mais de 500 profissionais verificados disponíveis hoje na sua região.</p>
                </div>
                <Link href="/servicos">
                  <Button className="rounded-xl bg-primary text-white shrink-0">Solicitar Serviço <ChevronRight size={16} className="ml-1" /></Button>
                </Link>
              </div>
            </FadeIn>
          </div>
        )}

        {activeTab !== "Visão Geral" && (
          <FadeIn dir="none">
            <div className="flex flex-col items-center justify-center py-24 text-center gap-5">
              <div className="w-20 h-20 rounded-3xl bg-secondary/5 flex items-center justify-center">
                {activeTab === "Meus Pedidos" && <Wrench size={32} className="text-secondary/30" />}
                {activeTab === "Favoritos" && <Heart size={32} className="text-secondary/30" />}
                {activeTab === "Pagamentos" && <CreditCard size={32} className="text-secondary/30" />}
              </div>
              <div>
                <h3 className="font-bold text-secondary text-xl mb-2">{activeTab}</h3>
                <p className="text-muted-foreground max-w-xs">Esta seção estará disponível em breve.</p>
              </div>
              <Link href="/servicos">
                <Button className="rounded-xl bg-primary text-white mt-2">Solicitar Novo Serviço</Button>
              </Link>
            </div>
          </FadeIn>
        )}
      </div>
    </div>
  );
}

// ─── Main component ────────────────────────────────────────────────────────

export function MinhaArea() {
  const { user, loading, logout } = useAuth();
  const [, navigate] = useLocation();

  useEffect(() => {
    if (!loading && !user) navigate("/entrar");
    if (!loading && user?.role === "admin") navigate("/admin");
  }, [user, loading, navigate]);

  if (loading) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="flex flex-col items-center gap-4 text-muted-foreground">
            <Loader size={36} className="animate-spin text-primary" />
            <p>Carregando sua conta...</p>
          </div>
        </div>
      </Layout>
    );
  }

  if (!user) return null;

  const handleLogout = () => { logout(); navigate("/"); };

  return (
    <Layout>
      {user.accountType === "prestador"
        ? <PrestadorDashboard user={user} onLogout={handleLogout} />
        : <ClienteDashboard user={user} onLogout={handleLogout} />
      }
    </Layout>
  );
}

import { useState, useEffect, useCallback } from "react";
import { Link, useLocation } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useAuth, apiFetch } from "@/lib/auth-context";
import {
  LayoutDashboard, Users, Briefcase, MessageSquare, DollarSign,
  LogOut, TrendingUp, CheckCircle, Clock, XCircle, AlertCircle,
  ChevronDown, Send, Loader, RefreshCw, BadgeCheck, Shield,
  User, Wrench, Filter, Eye,
} from "lucide-react";

// ─── Types ──────────────────────────────────────────────────────────────────

interface Stats {
  users: { total: number; clients: number; providers: number };
  services: { total: number; pending: number; inProgress: number; completed: number };
  revenue: { earned: number; pending: number; gmv: number };
}

interface AdminUser {
  id: string; name: string; email: string; phone: string | null;
  accountType: "cliente" | "prestador"; role: string;
  specialty: string | null; city: string | null; createdAt: string;
}

interface AdminService {
  id: string; title: string; description: string | null; category: string;
  price: string; adminFeeRate: string; status: string;
  address: string | null; scheduledAt: string | null; completedAt: string | null;
  createdAt: string;
  client: { name: string; email: string } | null;
  provider: { name: string; email: string } | null;
}

interface ChatMessage {
  id: string; content: string; senderRole: "client" | "provider" | "admin";
  senderName: string; createdAt: string;
}

interface AdminCharge {
  id: string; serviceId: string; totalAmount: string; adminFee: string;
  providerAmount: string; status: string; paidAt: string | null; createdAt: string;
  service: { title: string; category: string; clientId: string | null; providerId: string | null } | null;
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

const fmt = (v: number) => v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
const fmtDate = (s: string | null) => s ? new Date(s).toLocaleString("pt-BR", { dateStyle: "short", timeStyle: "short" }) : "—";

const STATUS_META: Record<string, { label: string; color: string; icon: React.ElementType }> = {
  pending_approval: { label: "Aguardando aprovação", color: "text-yellow-600 bg-yellow-50 border-yellow-200", icon: AlertCircle },
  in_progress:      { label: "Em andamento",          color: "text-blue-600 bg-blue-50 border-blue-200",     icon: Clock },
  completed:        { label: "Concluído",              color: "text-green-600 bg-green-50 border-green-200", icon: CheckCircle },
  cancelled:        { label: "Cancelado",              color: "text-red-600 bg-red-50 border-red-200",       icon: XCircle },
};

function StatusBadge({ status }: { status: string }) {
  const m = STATUS_META[status] ?? STATUS_META["pending_approval"]!;
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${m.color}`}>
      <m.icon size={11} />{m.label}
    </span>
  );
}

// ─── Sidebar ─────────────────────────────────────────────────────────────────

const TABS = [
  { id: "overview",  label: "Visão Geral",   icon: LayoutDashboard },
  { id: "users",     label: "Cadastros",      icon: Users },
  { id: "services",  label: "Serviços",       icon: Briefcase },
  { id: "chat",      label: "Chat",           icon: MessageSquare },
  { id: "financial", label: "Financeiro",     icon: DollarSign },
] as const;
type Tab = (typeof TABS)[number]["id"];

// ─── Overview tab ─────────────────────────────────────────────────────────────

function OverviewTab({ stats }: { stats: Stats | null }) {
  if (!stats) return <div className="flex items-center gap-3 text-muted-foreground py-20 justify-center"><Loader size={22} className="animate-spin text-primary" />Carregando...</div>;

  const kpis = [
    { label: "Usuários cadastrados", value: stats.users.total, sub: `${stats.users.clients} clientes · ${stats.users.providers} prestadores`, icon: Users, color: "bg-blue-50 text-blue-600", border: "border-blue-100" },
    { label: "Serviços totais", value: stats.services.total, sub: `${stats.services.inProgress} em andamento`, icon: Briefcase, color: "bg-purple-50 text-purple-600", border: "border-purple-100" },
    { label: "Aguardando aprovação", value: stats.services.pending, sub: "Requer ação do admin", icon: AlertCircle, color: "bg-yellow-50 text-yellow-600", border: "border-yellow-100" },
    { label: "Serviços concluídos", value: stats.services.completed, sub: "Pagamentos liberados", icon: CheckCircle, color: "bg-green-50 text-green-600", border: "border-green-100" },
    { label: "Receita da plataforma (20%)", value: fmt(stats.revenue.earned), sub: `${fmt(stats.revenue.pending)} pendente`, icon: TrendingUp, color: "bg-primary/10 text-primary", border: "border-primary/20", wide: true },
    { label: "Volume total movimentado", value: fmt(stats.revenue.gmv), sub: "Total pago pelos clientes", icon: DollarSign, color: "bg-emerald-50 text-emerald-600", border: "border-emerald-100", wide: true },
  ];

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h2 className="text-xl font-bold text-secondary mb-1">Painel de Controle</h2>
        <p className="text-muted-foreground text-sm">Visão consolidada da plataforma Prontto.</p>
      </div>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {kpis.map(k => (
          <Card key={k.label} className={`border ${k.border} ${k.wide ? "col-span-2 lg:col-span-2" : ""} hover:shadow-md transition-shadow`}>
            <CardContent className="p-5">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 ${k.color}`}><k.icon size={20} /></div>
              <p className="text-2xl font-bold text-secondary">{typeof k.value === "number" ? k.value : k.value}</p>
              <p className="text-sm font-medium text-secondary/80 mt-0.5">{k.label}</p>
              <p className="text-xs text-muted-foreground mt-1">{k.sub}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-3 gap-4">
        {[
          { label: "Taxa da plataforma", value: "20%", desc: "por serviço concluído", icon: "💰" },
          { label: "Clientes ativos", value: stats.users.clients, desc: "contratantes cadastrados", icon: "👤" },
          { label: "Prestadores ativos", value: stats.users.providers, desc: "profissionais cadastrados", icon: "🔧" },
        ].map(s => (
          <div key={s.label} className="bg-white border border-border/40 rounded-2xl p-5 flex items-center gap-4">
            <span className="text-3xl">{s.icon}</span>
            <div>
              <p className="text-2xl font-bold text-secondary">{s.value}</p>
              <p className="text-sm font-medium text-secondary/80">{s.label}</p>
              <p className="text-xs text-muted-foreground">{s.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Users tab ────────────────────────────────────────────────────────────────

function UsersTab({ users, loading }: { users: AdminUser[]; loading: boolean }) {
  const [filter, setFilter] = useState<"all" | "cliente" | "prestador">("all");
  const filtered = filter === "all" ? users : users.filter(u => u.accountType === filter);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h2 className="text-xl font-bold text-secondary">Cadastros</h2>
          <p className="text-muted-foreground text-sm">{users.length} usuários registrados</p>
        </div>
        <div className="flex gap-2">
          {(["all", "cliente", "prestador"] as const).map(f => (
            <button key={f} onClick={() => setFilter(f)}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${filter === f ? "bg-primary text-white" : "bg-white border border-border text-secondary hover:border-primary/40"}`}>
              {f === "all" ? "Todos" : f === "cliente" ? "Clientes" : "Prestadores"}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="flex items-center gap-3 text-muted-foreground py-12 justify-center"><Loader size={22} className="animate-spin text-primary" />Carregando usuários...</div>
      ) : (
        <div className="bg-white border border-border/40 rounded-2xl overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-secondary/3 border-b border-border/40">
              <tr>
                {["Usuário", "Tipo", "Especialidade / Cidade", "Telefone", "Cadastro"].map(h => (
                  <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-border/30">
              {filtered.map(u => (
                <tr key={u.id} className="hover:bg-secondary/2 transition-colors">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary font-bold text-sm shrink-0">
                        {u.name.charAt(0)}
                      </div>
                      <div>
                        <p className="font-medium text-secondary">{u.name}</p>
                        <p className="text-xs text-muted-foreground">{u.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold ${u.accountType === "prestador" ? "bg-orange-50 text-orange-600 border border-orange-200" : "bg-blue-50 text-blue-600 border border-blue-200"}`}>
                      {u.accountType === "prestador" ? <Wrench size={10} /> : <User size={10} />}
                      {u.accountType === "cliente" ? "Cliente" : "Prestador"}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-secondary/70">{u.specialty ?? "—"} {u.city ? `· ${u.city}` : ""}</td>
                  <td className="px-4 py-3 text-secondary/70">{u.phone ?? "—"}</td>
                  <td className="px-4 py-3 text-muted-foreground text-xs">{fmtDate(u.createdAt)}</td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr><td colSpan={5} className="text-center py-12 text-muted-foreground">Nenhum usuário encontrado.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

// ─── Services tab ─────────────────────────────────────────────────────────────

function ServicesTab({ services, loading, onStatusChange, onSelectChat }: {
  services: AdminService[]; loading: boolean;
  onStatusChange: (id: string, status: string) => Promise<void>;
  onSelectChat: (id: string, title: string) => void;
}) {
  const [filter, setFilter] = useState<string>("all");
  const [updating, setUpdating] = useState<string | null>(null);

  const filtered = filter === "all" ? services : services.filter(s => s.status === filter);

  const handleStatus = async (id: string, status: string) => {
    setUpdating(id);
    await onStatusChange(id, status);
    setUpdating(null);
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h2 className="text-xl font-bold text-secondary">Serviços</h2>
          <p className="text-muted-foreground text-sm">{services.length} serviços na plataforma</p>
        </div>
        <div className="flex gap-2 flex-wrap">
          {["all", "pending_approval", "in_progress", "completed", "cancelled"].map(f => (
            <button key={f} onClick={() => setFilter(f)}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${filter === f ? "bg-primary text-white" : "bg-white border border-border text-secondary hover:border-primary/40"}`}>
              {f === "all" ? "Todos" : STATUS_META[f]?.label ?? f}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="flex items-center gap-3 text-muted-foreground py-12 justify-center"><Loader size={22} className="animate-spin text-primary" />Carregando serviços...</div>
      ) : (
        <div className="flex flex-col gap-4">
          {filtered.map(svc => {
            const adminFee = (Number(svc.price) * Number(svc.adminFeeRate)).toFixed(2);
            const providerAmt = (Number(svc.price) - Number(adminFee)).toFixed(2);
            return (
              <div key={svc.id} className="bg-white border border-border/40 rounded-2xl p-5 hover:shadow-md transition-shadow">
                <div className="flex flex-col sm:flex-row sm:items-start gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start gap-3 mb-3">
                      <div className="w-10 h-10 rounded-xl bg-primary/8 flex items-center justify-center shrink-0 text-primary font-bold text-sm">
                        {svc.category.charAt(0)}
                      </div>
                      <div className="min-w-0">
                        <h3 className="font-bold text-secondary truncate">{svc.title}</h3>
                        <p className="text-xs text-muted-foreground">{svc.category} · {fmtDate(svc.scheduledAt ?? svc.createdAt)}</p>
                        {svc.description && <p className="text-sm text-secondary/70 mt-1 line-clamp-2">{svc.description}</p>}
                        {svc.address && <p className="text-xs text-muted-foreground mt-1">📍 {svc.address}</p>}
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-3 text-sm">
                      <div className="bg-secondary/3 rounded-xl p-3">
                        <p className="text-xs text-muted-foreground mb-1">Contratante</p>
                        <p className="font-medium text-secondary">{svc.client?.name ?? "—"}</p>
                        <p className="text-xs text-muted-foreground">{svc.client?.email ?? ""}</p>
                      </div>
                      <div className="bg-secondary/3 rounded-xl p-3">
                        <p className="text-xs text-muted-foreground mb-1">Prestador</p>
                        <p className="font-medium text-secondary">{svc.provider?.name ?? "—"}</p>
                        <p className="text-xs text-muted-foreground">{svc.provider?.email ?? ""}</p>
                      </div>
                    </div>
                    <div className="flex gap-4 mt-3 text-sm">
                      <span className="text-secondary font-semibold">Total: {fmt(Number(svc.price))}</span>
                      <span className="text-primary font-semibold">Taxa admin (20%): {fmt(Number(adminFee))}</span>
                      <span className="text-muted-foreground">Prestador recebe: {fmt(Number(providerAmt))}</span>
                    </div>
                  </div>
                  <div className="flex flex-col gap-3 shrink-0">
                    <StatusBadge status={svc.status} />
                    <div className="flex flex-col gap-2">
                      {svc.status === "pending_approval" && (
                        <Button size="sm" disabled={updating === svc.id}
                          onClick={() => handleStatus(svc.id, "in_progress")}
                          className="rounded-xl bg-green-500 hover:bg-green-600 text-white text-xs h-8">
                          {updating === svc.id ? <Loader size={12} className="animate-spin mr-1" /> : <CheckCircle size={12} className="mr-1" />}
                          Aprovar
                        </Button>
                      )}
                      {svc.status === "in_progress" && (
                        <Button size="sm" disabled={updating === svc.id}
                          onClick={() => handleStatus(svc.id, "completed")}
                          className="rounded-xl bg-blue-500 hover:bg-blue-600 text-white text-xs h-8">
                          {updating === svc.id ? <Loader size={12} className="animate-spin mr-1" /> : <BadgeCheck size={12} className="mr-1" />}
                          Concluir
                        </Button>
                      )}
                      {!["completed", "cancelled"].includes(svc.status) && (
                        <Button size="sm" variant="outline" disabled={updating === svc.id}
                          onClick={() => handleStatus(svc.id, "cancelled")}
                          className="rounded-xl border-red-200 text-red-600 hover:bg-red-50 text-xs h-8">
                          <XCircle size={12} className="mr-1" />Cancelar
                        </Button>
                      )}
                      <Button size="sm" variant="outline" onClick={() => onSelectChat(svc.id, svc.title)}
                        className="rounded-xl text-xs h-8 border-border hover:border-primary/40">
                        <MessageSquare size={12} className="mr-1" />Chat
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
          {filtered.length === 0 && (
            <div className="text-center py-16 text-muted-foreground">Nenhum serviço encontrado para este filtro.</div>
          )}
        </div>
      )}
    </div>
  );
}

// ─── Chat tab ─────────────────────────────────────────────────────────────────

function ChatTab({ services, selectedServiceId, selectedTitle, onSelectService }: {
  services: AdminService[];
  selectedServiceId: string | null;
  selectedTitle: string;
  onSelectService: (id: string, title: string) => void;
}) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loadingMsgs, setLoadingMsgs] = useState(false);
  const [text, setText] = useState("");
  const [sending, setSending] = useState(false);

  const fetchMessages = useCallback(async (id: string) => {
    setLoadingMsgs(true);
    const res = await apiFetch(`/admin/services/${id}/messages`);
    const data = await res.json() as { messages: ChatMessage[] };
    setMessages(data.messages ?? []);
    setLoadingMsgs(false);
  }, []);

  useEffect(() => {
    if (selectedServiceId) void fetchMessages(selectedServiceId);
  }, [selectedServiceId, fetchMessages]);

  const sendMsg = async () => {
    if (!text.trim() || !selectedServiceId) return;
    setSending(true);
    const res = await apiFetch(`/admin/services/${selectedServiceId}/messages`, {
      method: "POST", body: JSON.stringify({ content: text }),
    });
    const data = await res.json() as { message: ChatMessage };
    if (data.message) setMessages(m => [...m, data.message]);
    setText("");
    setSending(false);
  };

  const roleColor: Record<string, string> = {
    client: "bg-blue-50 border-blue-100 text-blue-900",
    provider: "bg-orange-50 border-orange-100 text-orange-900",
    admin: "bg-primary/10 border-primary/20 text-primary",
  };
  const roleLabel: Record<string, string> = { client: "Contratante", provider: "Prestador", admin: "Admin" };

  return (
    <div className="flex flex-col gap-4">
      <div>
        <h2 className="text-xl font-bold text-secondary">Chat dos Serviços</h2>
        <p className="text-muted-foreground text-sm">Visualize e participe das conversas entre contratantes e prestadores.</p>
      </div>
      <div className="flex gap-4 h-[600px]">
        {/* Service list */}
        <div className="w-72 shrink-0 bg-white border border-border/40 rounded-2xl overflow-hidden flex flex-col">
          <div className="px-4 py-3 border-b border-border/40 bg-secondary/2">
            <p className="text-sm font-semibold text-secondary">Serviços</p>
          </div>
          <div className="flex-1 overflow-y-auto">
            {services.map(svc => (
              <button key={svc.id} onClick={() => onSelectService(svc.id, svc.title)}
                className={`w-full text-left px-4 py-3 border-b border-border/20 last:border-0 hover:bg-secondary/3 transition-colors ${selectedServiceId === svc.id ? "bg-primary/5 border-l-2 border-l-primary" : ""}`}>
                <p className="text-sm font-medium text-secondary truncate">{svc.title}</p>
                <div className="flex items-center gap-2 mt-1">
                  <StatusBadge status={svc.status} />
                </div>
                <p className="text-xs text-muted-foreground mt-1">{svc.client?.name ?? "—"} → {svc.provider?.name ?? "—"}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Chat panel */}
        <div className="flex-1 bg-white border border-border/40 rounded-2xl flex flex-col overflow-hidden">
          {!selectedServiceId ? (
            <div className="flex-1 flex items-center justify-center text-center">
              <div>
                <MessageSquare size={40} className="text-secondary/20 mx-auto mb-3" />
                <p className="text-secondary/50 font-medium">Selecione um serviço</p>
                <p className="text-muted-foreground text-sm mt-1">para ver a conversa</p>
              </div>
            </div>
          ) : (
            <>
              <div className="px-5 py-4 border-b border-border/40 bg-secondary/2 flex items-center gap-3">
                <MessageSquare size={18} className="text-primary" />
                <div>
                  <p className="font-semibold text-secondary text-sm truncate">{selectedTitle}</p>
                  <p className="text-xs text-muted-foreground">Chat do serviço</p>
                </div>
              </div>
              <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-3">
                {loadingMsgs ? (
                  <div className="flex items-center gap-2 text-muted-foreground justify-center py-8"><Loader size={18} className="animate-spin text-primary" />Carregando...</div>
                ) : messages.length === 0 ? (
                  <div className="text-center text-muted-foreground py-12">Nenhuma mensagem ainda.</div>
                ) : messages.map(m => (
                  <div key={m.id} className={`flex ${m.senderRole === "admin" ? "justify-end" : "justify-start"}`}>
                    <div className={`max-w-[75%] rounded-2xl border px-4 py-2.5 ${roleColor[m.senderRole] ?? ""}`}>
                      <p className="text-[10px] font-bold uppercase tracking-wide mb-1 opacity-60">
                        {roleLabel[m.senderRole]} · {m.senderName}
                      </p>
                      <p className="text-sm leading-snug">{m.content}</p>
                      <p className="text-[10px] opacity-50 mt-1 text-right">{fmtDate(m.createdAt)}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="px-4 py-3 border-t border-border/40 flex gap-3">
                <input value={text} onChange={e => setText(e.target.value)}
                  onKeyDown={e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); void sendMsg(); }}}
                  placeholder="Escreva uma mensagem como admin..."
                  className="flex-1 bg-background border border-border rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-primary transition-all" />
                <Button onClick={sendMsg} disabled={sending || !text.trim()} className="rounded-xl bg-primary text-white h-10 px-4 shrink-0">
                  {sending ? <Loader size={15} className="animate-spin" /> : <Send size={15} />}
                </Button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Financial tab ─────────────────────────────────────────────────────────────

function FinancialTab({ charges, loading }: { charges: AdminCharge[]; loading: boolean }) {
  const paid = charges.filter(c => c.status === "paid");
  const pending = charges.filter(c => c.status === "pending");
  const totalEarned = paid.reduce((s, c) => s + Number(c.adminFee), 0);
  const totalPending = pending.reduce((s, c) => s + Number(c.adminFee), 0);
  const totalGmv = paid.reduce((s, c) => s + Number(c.totalAmount), 0);

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="text-xl font-bold text-secondary">Financeiro</h2>
        <p className="text-muted-foreground text-sm">Controle de cobranças e ganhos da plataforma (20% por serviço).</p>
      </div>

      <div className="grid grid-cols-3 gap-4">
        {[
          { label: "Receita realizada", value: fmt(totalEarned), sub: "Pagamentos confirmados", icon: CheckCircle, color: "bg-green-50 text-green-600 border-green-100" },
          { label: "Receita pendente", value: fmt(totalPending), sub: "Serviços em andamento", icon: Clock, color: "bg-yellow-50 text-yellow-600 border-yellow-100" },
          { label: "Volume total (GMV)", value: fmt(totalGmv), sub: "Movimentado na plataforma", icon: TrendingUp, color: "bg-primary/10 text-primary border-primary/20" },
        ].map(k => (
          <Card key={k.label} className={`border ${k.color.split(" ").pop()}`}>
            <CardContent className="p-5">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 ${k.color}`}><k.icon size={20} /></div>
              <p className="text-2xl font-bold text-secondary">{k.value}</p>
              <p className="text-sm font-medium text-secondary/80 mt-0.5">{k.label}</p>
              <p className="text-xs text-muted-foreground mt-1">{k.sub}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {loading ? (
        <div className="flex items-center gap-3 text-muted-foreground py-12 justify-center"><Loader size={22} className="animate-spin text-primary" />Carregando cobranças...</div>
      ) : (
        <div className="bg-white border border-border/40 rounded-2xl overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-secondary/3 border-b border-border/40">
              <tr>
                {["Serviço", "Total Cobrado", "Taxa Admin (20%)", "Valor Prestador", "Status", "Data"].map(h => (
                  <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-border/30">
              {charges.map(c => (
                <tr key={c.id} className="hover:bg-secondary/2 transition-colors">
                  <td className="px-4 py-3">
                    <p className="font-medium text-secondary">{c.service?.title ?? "—"}</p>
                    <p className="text-xs text-muted-foreground">{c.service?.category ?? ""}</p>
                  </td>
                  <td className="px-4 py-3 font-semibold text-secondary">{fmt(Number(c.totalAmount))}</td>
                  <td className="px-4 py-3 font-semibold text-primary">{fmt(Number(c.adminFee))}</td>
                  <td className="px-4 py-3 text-secondary/70">{fmt(Number(c.providerAmount))}</td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold border ${c.status === "paid" ? "text-green-600 bg-green-50 border-green-200" : c.status === "pending" ? "text-yellow-600 bg-yellow-50 border-yellow-200" : "text-red-600 bg-red-50 border-red-200"}`}>
                      {c.status === "paid" ? "Pago" : c.status === "pending" ? "Pendente" : "Reembolsado"}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground text-xs">{fmtDate(c.paidAt ?? c.createdAt)}</td>
                </tr>
              ))}
              {charges.length === 0 && (
                <tr><td colSpan={6} className="text-center py-12 text-muted-foreground">Nenhuma cobrança registrada ainda.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

// ─── Main page ────────────────────────────────────────────────────────────────

export function AdminPage() {
  const { user, loading: authLoading, logout } = useAuth();
  const [, navigate] = useLocation();
  const [activeTab, setActiveTab] = useState<Tab>("overview");

  const [stats, setStats] = useState<Stats | null>(null);
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [services, setServices] = useState<AdminService[]>([]);
  const [charges, setCharges] = useState<AdminCharge[]>([]);
  const [dataLoading, setDataLoading] = useState(false);
  const [selectedServiceId, setSelectedServiceId] = useState<string | null>(null);
  const [selectedTitle, setSelectedTitle] = useState("");

  useEffect(() => {
    if (!authLoading && (!user || user.role !== "admin")) navigate("/entrar");
  }, [user, authLoading, navigate]);

  const loadData = useCallback(async () => {
    setDataLoading(true);
    const [statsRes, usersRes, servicesRes, chargesRes] = await Promise.all([
      apiFetch("/admin/stats"),
      apiFetch("/admin/users"),
      apiFetch("/admin/services"),
      apiFetch("/admin/charges"),
    ]);
    const [s, u, sv, ch] = await Promise.all([statsRes.json(), usersRes.json(), servicesRes.json(), chargesRes.json()]);
    setStats((s as { stats?: Stats }).stats ?? (s as Stats));
    setUsers((u as { users: AdminUser[] }).users ?? []);
    setServices((sv as { services: AdminService[] }).services ?? []);
    setCharges((ch as { charges: AdminCharge[] }).charges ?? []);
    setDataLoading(false);
  }, []);

  useEffect(() => {
    if (user?.role === "admin") void loadData();
  }, [user, loadData]);

  const handleStatusChange = async (id: string, status: string) => {
    await apiFetch(`/admin/services/${id}`, { method: "PATCH", body: JSON.stringify({ status }) });
    await loadData();
  };

  const handleSelectChat = (id: string, title: string) => {
    setSelectedServiceId(id);
    setSelectedTitle(title);
    setActiveTab("chat");
  };

  if (authLoading || !user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader size={32} className="animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar */}
      <aside className="w-64 bg-secondary shrink-0 flex flex-col min-h-screen">
        <div className="p-6 border-b border-white/10">
          <Link href="/">
            <span className="text-xl font-extrabold tracking-tight text-white cursor-pointer">
              PRON<span className="text-primary">TTO</span>
            </span>
          </Link>
          <div className="mt-3 flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-primary/25 flex items-center justify-center">
              <Shield size={14} className="text-primary" />
            </div>
            <span className="text-xs font-semibold text-primary">Painel Admin</span>
          </div>
        </div>

        <nav className="flex-1 p-4 flex flex-col gap-1">
          {TABS.map(tab => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all w-full text-left ${activeTab === tab.id ? "bg-primary text-white shadow-lg shadow-primary/25" : "text-white/50 hover:text-white hover:bg-white/5"}`}>
              <tab.icon size={18} />
              {tab.label}
              {tab.id === "services" && stats?.services.pending ? (
                <span className="ml-auto w-5 h-5 rounded-full bg-yellow-400 text-secondary text-[10px] font-bold flex items-center justify-center">{stats.services.pending}</span>
              ) : null}
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-white/10">
          <div className="flex items-center gap-3 mb-4 px-2">
            <div className="w-8 h-8 rounded-lg bg-primary/25 flex items-center justify-center text-primary font-bold text-sm">
              {user.name.charAt(0)}
            </div>
            <div className="min-w-0">
              <p className="text-sm font-medium text-white truncate">{user.name}</p>
              <p className="text-xs text-white/40">Administrador</p>
            </div>
          </div>
          <button onClick={() => { logout(); navigate("/"); }}
            className="flex items-center gap-2 w-full px-4 py-2.5 rounded-xl text-white/50 hover:text-white hover:bg-white/5 text-sm transition-all">
            <LogOut size={15} />Sair
          </button>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 overflow-auto">
        <div className="p-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-2xl font-bold text-secondary capitalize">
                {TABS.find(t => t.id === activeTab)?.label}
              </h1>
              <p className="text-muted-foreground text-sm mt-0.5">
                {new Date().toLocaleDateString("pt-BR", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
              </p>
            </div>
            <Button onClick={loadData} variant="outline" size="sm" disabled={dataLoading}
              className="rounded-xl border-border gap-2 text-secondary">
              <RefreshCw size={14} className={dataLoading ? "animate-spin" : ""} />Atualizar
            </Button>
          </div>

          <AnimatePresence mode="wait">
            <motion.div key={activeTab} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}>
              {activeTab === "overview"  && <OverviewTab stats={stats} />}
              {activeTab === "users"     && <UsersTab users={users} loading={dataLoading} />}
              {activeTab === "services"  && <ServicesTab services={services} loading={dataLoading} onStatusChange={handleStatusChange} onSelectChat={handleSelectChat} />}
              {activeTab === "chat"      && <ChatTab services={services} selectedServiceId={selectedServiceId} selectedTitle={selectedTitle} onSelectService={(id, t) => { setSelectedServiceId(id); setSelectedTitle(t); }} />}
              {activeTab === "financial" && <FinancialTab charges={charges} loading={dataLoading} />}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}

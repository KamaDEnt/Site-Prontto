import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from "react";

const API = "/api";

export interface PublicUser {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  accountType: "cliente" | "prestador";
  role: "user" | "admin";
  specialty: string | null;
  city: string | null;
  createdAt: string;
}

interface AuthState {
  user: PublicUser | null;
  token: string | null;
  loading: boolean;
}

interface AuthActions {
  login: (email: string, password: string) => Promise<{ error?: string }>;
  register: (data: RegisterData) => Promise<{ error?: string }>;
  logout: () => void;
  refresh: () => Promise<void>;
}

export interface RegisterData {
  name: string;
  email: string;
  phone?: string;
  password: string;
  accountType: "cliente" | "prestador";
  specialty?: string;
  city?: string;
}

const AuthContext = createContext<(AuthState & AuthActions) | null>(null);

const TOKEN_KEY = "prontto_token";

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<PublicUser | null>(null);
  const [token, setToken] = useState<string | null>(() => localStorage.getItem(TOKEN_KEY));
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    const t = localStorage.getItem(TOKEN_KEY);
    if (!t) { setLoading(false); return; }
    try {
      const res = await fetch(`${API}/auth/me`, {
        headers: { Authorization: `Bearer ${t}` },
      });
      if (res.ok) {
        const data = await res.json() as { user: PublicUser };
        setUser(data.user);
      } else {
        localStorage.removeItem(TOKEN_KEY);
        setToken(null);
        setUser(null);
      }
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { void refresh(); }, [refresh]);

  const login = useCallback(async (email: string, password: string) => {
    try {
      const res = await fetch(`${API}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json() as { token?: string; user?: PublicUser; error?: string };
      if (!res.ok || data.error) return { error: data.error ?? "Erro ao entrar" };
      localStorage.setItem(TOKEN_KEY, data.token!);
      setToken(data.token!);
      setUser(data.user!);
      return {};
    } catch {
      return { error: "Erro de conexão. Tente novamente." };
    }
  }, []);

  const register = useCallback(async (form: RegisterData) => {
    try {
      const res = await fetch(`${API}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json() as { token?: string; user?: PublicUser; error?: string };
      if (!res.ok || data.error) return { error: data.error ?? "Erro ao cadastrar" };
      localStorage.setItem(TOKEN_KEY, data.token!);
      setToken(data.token!);
      setUser(data.user!);
      return {};
    } catch {
      return { error: "Erro de conexão. Tente novamente." };
    }
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem(TOKEN_KEY);
    setToken(null);
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider value={{ user, token, loading, login, register, logout, refresh }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}

export async function apiFetch(path: string, opts?: RequestInit) {
  const token = localStorage.getItem(TOKEN_KEY);
  return fetch(`${API}${path}`, {
    ...opts,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(opts?.headers ?? {}),
    },
  });
}

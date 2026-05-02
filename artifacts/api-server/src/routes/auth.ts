import { Router } from "express";
import bcrypt from "bcryptjs";
import { eq } from "drizzle-orm";
import { db, usersTable, professionalBankingTable } from "@workspace/db";
import { requireAuth, signToken, type AuthPayload } from "../middlewares/auth.js";

const router = Router();

// POST /api/auth/register
router.post("/register", async (req, res) => {
  try {
    const { name, email, phone, password, accountType, specialty, city } = req.body as {
      name: string; email: string; phone?: string; password: string;
      accountType: "cliente" | "prestador"; specialty?: string; city?: string;
    };

    if (!name || !email || !password || !accountType) {
      res.status(400).json({ error: "Campos obrigatórios ausentes" });
      return;
    }
    if (password.length < 8) {
      res.status(400).json({ error: "Senha deve ter pelo menos 8 caracteres" });
      return;
    }
    if (!["cliente", "prestador"].includes(accountType)) {
      res.status(400).json({ error: "Tipo de conta inválido" });
      return;
    }

    const existing = await db.select({ id: usersTable.id }).from(usersTable).where(eq(usersTable.email, email.toLowerCase().trim())).limit(1);
    if (existing.length > 0) {
      res.status(409).json({ error: "E-mail já cadastrado" });
      return;
    }

    const passwordHash = await bcrypt.hash(password, 12);
    const [user] = await db.insert(usersTable).values({
      name: name.trim(),
      email: email.toLowerCase().trim(),
      phone: phone?.trim() ?? null,
      passwordHash,
      accountType,
      role: "user",
      specialty: specialty?.trim() ?? null,
      city: city?.trim() ?? null,
    }).returning({
      id: usersTable.id,
      name: usersTable.name,
      email: usersTable.email,
      accountType: usersTable.accountType,
      role: usersTable.role,
      phone: usersTable.phone,
      specialty: usersTable.specialty,
      city: usersTable.city,
      createdAt: usersTable.createdAt,
    });

    if (!user) throw new Error("Failed to create user");

    const token = signToken({ userId: user.id, email: user.email, accountType: user.accountType, role: user.role });
    res.status(201).json({ token, user });
  } catch (err) {
    req.log.error({ err }, "register error");
    res.status(500).json({ error: "Erro interno do servidor" });
  }
});

// POST /api/auth/login
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body as { email: string; password: string };
    if (!email || !password) {
      res.status(400).json({ error: "E-mail e senha são obrigatórios" });
      return;
    }

    const [user] = await db.select().from(usersTable).where(eq(usersTable.email, email.toLowerCase().trim())).limit(1);
    if (!user) {
      res.status(401).json({ error: "E-mail ou senha incorretos" });
      return;
    }

    const valid = await bcrypt.compare(password, user.passwordHash);
    if (!valid) {
      res.status(401).json({ error: "E-mail ou senha incorretos" });
      return;
    }

    const token = signToken({ userId: user.id, email: user.email, accountType: user.accountType, role: user.role });
    const { passwordHash: _, ...publicUser } = user;
    res.json({ token, user: publicUser });
  } catch (err) {
    req.log.error({ err }, "login error");
    res.status(500).json({ error: "Erro interno do servidor" });
  }
});

// GET /api/auth/me
router.get("/me", requireAuth, async (req, res) => {
  try {
    const auth = res.locals["user"] as AuthPayload;
    const [user] = await db.select({
      id: usersTable.id,
      name: usersTable.name,
      email: usersTable.email,
      phone: usersTable.phone,
      accountType: usersTable.accountType,
      role: usersTable.role,
      specialty: usersTable.specialty,
      city: usersTable.city,
      createdAt: usersTable.createdAt,
    }).from(usersTable).where(eq(usersTable.id, auth.userId)).limit(1);

    if (!user) {
      res.status(404).json({ error: "Usuário não encontrado" });
      return;
    }
    res.json({ user });
  } catch (err) {
    req.log.error({ err }, "me error");
    res.status(500).json({ error: "Erro interno do servidor" });
  }
});

// GET /api/auth/banking
router.get("/banking", requireAuth, async (req, res) => {
  try {
    const auth = res.locals["user"] as AuthPayload;
    const [banking] = await db.select().from(professionalBankingTable)
      .where(eq(professionalBankingTable.userId, auth.userId)).limit(1);
    res.json({ banking: banking ?? null });
  } catch (err) {
    req.log.error({ err }, "get banking error");
    res.status(500).json({ error: "Erro interno do servidor" });
  }
});

// POST /api/auth/banking
router.post("/banking", requireAuth, async (req, res) => {
  try {
    const auth = res.locals["user"] as AuthPayload;
    if (auth.accountType !== "prestador" && auth.role !== "admin") {
      res.status(403).json({ error: "Apenas prestadores podem cadastrar dados bancários" });
      return;
    }

    const { pixKeyType, pixKey, fullName, cpfCnpj, bankName, agency, accountNumber, bankAccountType } = req.body as {
      pixKeyType: string; pixKey: string; fullName: string; cpfCnpj: string;
      bankName?: string; agency?: string; accountNumber?: string; bankAccountType?: string;
    };

    if (!pixKeyType || !pixKey || !fullName || !cpfCnpj) {
      res.status(400).json({ error: "Chave Pix, nome completo e CPF/CNPJ são obrigatórios" });
      return;
    }
    if (!["cpf", "cnpj", "email", "phone", "random"].includes(pixKeyType)) {
      res.status(400).json({ error: "Tipo de chave Pix inválido" });
      return;
    }

    const existing = await db.select({ id: professionalBankingTable.id })
      .from(professionalBankingTable).where(eq(professionalBankingTable.userId, auth.userId)).limit(1);

    const values = {
      userId: auth.userId,
      pixKeyType: pixKeyType as "cpf" | "cnpj" | "email" | "phone" | "random",
      pixKey: pixKey.trim(),
      fullName: fullName.trim(),
      cpfCnpj: cpfCnpj.trim(),
      bankName: bankName?.trim() ?? null,
      agency: agency?.trim() ?? null,
      accountNumber: accountNumber?.trim() ?? null,
      bankAccountType: bankAccountType ?? null,
    };

    let banking;
    if (existing.length > 0) {
      [banking] = await db.update(professionalBankingTable).set({ ...values, updatedAt: new Date() })
        .where(eq(professionalBankingTable.userId, auth.userId)).returning();
    } else {
      [banking] = await db.insert(professionalBankingTable).values(values).returning();
    }

    res.json({ banking });
  } catch (err) {
    req.log.error({ err }, "post banking error");
    res.status(500).json({ error: "Erro interno do servidor" });
  }
});

export default router;

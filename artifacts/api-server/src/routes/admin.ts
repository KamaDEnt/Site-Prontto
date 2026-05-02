import { Router } from "express";
import { eq, desc, sql, count, sum, and, ne } from "drizzle-orm";
import {
  db, usersTable, servicesTable, serviceMessagesTable, chargesTable,
} from "@workspace/db";
import { requireAuth, type AuthPayload } from "../middlewares/auth.js";
import { type Request, type Response, type NextFunction } from "express";

const router = Router();

function requireAdmin(req: Request, res: Response, next: NextFunction): void {
  requireAuth(req, res, () => {
    const user = res.locals["user"] as AuthPayload;
    if (user.role !== "admin") {
      res.status(403).json({ error: "Acesso restrito ao administrador" });
      return;
    }
    next();
  });
}

// GET /api/admin/stats
router.get("/stats", requireAdmin, async (req, res) => {
  try {
    const [totalUsers] = await db.select({ count: count() }).from(usersTable).where(ne(usersTable.role, "admin"));
    const [totalClients] = await db.select({ count: count() }).from(usersTable).where(and(eq(usersTable.accountType, "cliente"), ne(usersTable.role, "admin")));
    const [totalProviders] = await db.select({ count: count() }).from(usersTable).where(and(eq(usersTable.accountType, "prestador"), ne(usersTable.role, "admin")));

    const [pendingCount] = await db.select({ count: count() }).from(servicesTable).where(eq(servicesTable.status, "pending_approval"));
    const [inProgressCount] = await db.select({ count: count() }).from(servicesTable).where(eq(servicesTable.status, "in_progress"));
    const [completedCount] = await db.select({ count: count() }).from(servicesTable).where(eq(servicesTable.status, "completed"));
    const [totalServices] = await db.select({ count: count() }).from(servicesTable);

    const [revenue] = await db.select({ total: sum(chargesTable.adminFee) }).from(chargesTable).where(eq(chargesTable.status, "paid"));
    const [pendingRevenue] = await db.select({ total: sum(chargesTable.adminFee) }).from(chargesTable).where(eq(chargesTable.status, "pending"));
    const [gmv] = await db.select({ total: sum(chargesTable.totalAmount) }).from(chargesTable).where(eq(chargesTable.status, "paid"));

    res.json({
      users: {
        total: Number(totalUsers?.count ?? 0),
        clients: Number(totalClients?.count ?? 0),
        providers: Number(totalProviders?.count ?? 0),
      },
      services: {
        total: Number(totalServices?.count ?? 0),
        pending: Number(pendingCount?.count ?? 0),
        inProgress: Number(inProgressCount?.count ?? 0),
        completed: Number(completedCount?.count ?? 0),
      },
      revenue: {
        earned: Number(revenue?.total ?? 0),
        pending: Number(pendingRevenue?.total ?? 0),
        gmv: Number(gmv?.total ?? 0),
      },
    });
  } catch (err) {
    req.log.error({ err }, "admin stats error");
    res.status(500).json({ error: "Erro interno" });
  }
});

// GET /api/admin/users
router.get("/users", requireAdmin, async (req, res) => {
  try {
    const users = await db.select({
      id: usersTable.id,
      name: usersTable.name,
      email: usersTable.email,
      phone: usersTable.phone,
      accountType: usersTable.accountType,
      role: usersTable.role,
      specialty: usersTable.specialty,
      city: usersTable.city,
      createdAt: usersTable.createdAt,
    }).from(usersTable).where(ne(usersTable.role, "admin")).orderBy(desc(usersTable.createdAt));
    res.json({ users });
  } catch (err) {
    req.log.error({ err }, "admin users error");
    res.status(500).json({ error: "Erro interno" });
  }
});

// GET /api/admin/services
router.get("/services", requireAdmin, async (req, res) => {
  try {
    const services = await db.select({
      id: servicesTable.id,
      title: servicesTable.title,
      description: servicesTable.description,
      category: servicesTable.category,
      price: servicesTable.price,
      adminFeeRate: servicesTable.adminFeeRate,
      status: servicesTable.status,
      address: servicesTable.address,
      scheduledAt: servicesTable.scheduledAt,
      completedAt: servicesTable.completedAt,
      createdAt: servicesTable.createdAt,
      clientId: servicesTable.clientId,
      providerId: servicesTable.providerId,
    }).from(servicesTable).orderBy(desc(servicesTable.createdAt));

    const enriched = await Promise.all(services.map(async s => {
      const [client] = s.clientId
        ? await db.select({ name: usersTable.name, email: usersTable.email }).from(usersTable).where(eq(usersTable.id, s.clientId)).limit(1)
        : [null];
      const [provider] = s.providerId
        ? await db.select({ name: usersTable.name, email: usersTable.email }).from(usersTable).where(eq(usersTable.id, s.providerId)).limit(1)
        : [null];
      return { ...s, client, provider };
    }));

    res.json({ services: enriched });
  } catch (err) {
    req.log.error({ err }, "admin services error");
    res.status(500).json({ error: "Erro interno" });
  }
});

// PATCH /api/admin/services/:id
router.patch("/services/:id", requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body as { status: "pending_approval" | "in_progress" | "completed" | "cancelled" };
    const validStatuses = ["pending_approval", "in_progress", "completed", "cancelled"];
    if (!validStatuses.includes(status)) {
      res.status(400).json({ error: "Status inválido" });
      return;
    }

    const updates: Record<string, unknown> = { status, updatedAt: new Date() };
    if (status === "completed") {
      updates.completedAt = new Date();

      const [svc] = await db.select({ price: servicesTable.price, adminFeeRate: servicesTable.adminFeeRate })
        .from(servicesTable).where(eq(servicesTable.id, id)).limit(1);

      if (svc) {
        const total = Number(svc.price);
        const rate = Number(svc.adminFeeRate);
        const adminFee = parseFloat((total * rate).toFixed(2));
        const providerAmount = parseFloat((total - adminFee).toFixed(2));
        await db.insert(chargesTable).values({
          serviceId: id,
          totalAmount: total.toFixed(2),
          adminFee: adminFee.toFixed(2),
          providerAmount: providerAmount.toFixed(2),
          status: "paid",
          paidAt: new Date(),
        }).onConflictDoNothing();
      }
    }

    const [updated] = await db.update(servicesTable).set(updates).where(eq(servicesTable.id, id)).returning();
    if (!updated) { res.status(404).json({ error: "Serviço não encontrado" }); return; }
    res.json({ service: updated });
  } catch (err) {
    req.log.error({ err }, "admin patch service error");
    res.status(500).json({ error: "Erro interno" });
  }
});

// GET /api/admin/services/:id/messages
router.get("/services/:id/messages", requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const messages = await db.select({
      id: serviceMessagesTable.id,
      content: serviceMessagesTable.content,
      senderRole: serviceMessagesTable.senderRole,
      senderId: serviceMessagesTable.senderId,
      createdAt: serviceMessagesTable.createdAt,
    }).from(serviceMessagesTable).where(eq(serviceMessagesTable.serviceId, id))
      .orderBy(serviceMessagesTable.createdAt);

    const enriched = await Promise.all(messages.map(async m => {
      const [sender] = m.senderId
        ? await db.select({ name: usersTable.name }).from(usersTable).where(eq(usersTable.id, m.senderId)).limit(1)
        : [null];
      return { ...m, senderName: sender?.name ?? "Sistema" };
    }));

    res.json({ messages: enriched });
  } catch (err) {
    req.log.error({ err }, "admin get messages error");
    res.status(500).json({ error: "Erro interno" });
  }
});

// POST /api/admin/services/:id/messages
router.post("/services/:id/messages", requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const { content } = req.body as { content: string };
    const auth = res.locals["user"] as AuthPayload;
    if (!content?.trim()) { res.status(400).json({ error: "Mensagem vazia" }); return; }

    const [msg] = await db.insert(serviceMessagesTable).values({
      serviceId: id,
      senderId: auth.userId,
      senderRole: "admin",
      content: content.trim(),
    }).returning();
    res.status(201).json({ message: { ...msg, senderName: "Admin" } });
  } catch (err) {
    req.log.error({ err }, "admin post message error");
    res.status(500).json({ error: "Erro interno" });
  }
});

// GET /api/admin/charges
router.get("/charges", requireAdmin, async (req, res) => {
  try {
    const charges = await db.select().from(chargesTable).orderBy(desc(chargesTable.createdAt));
    const enriched = await Promise.all(charges.map(async c => {
      const [svc] = await db.select({ title: servicesTable.title, category: servicesTable.category, clientId: servicesTable.clientId, providerId: servicesTable.providerId })
        .from(servicesTable).where(eq(servicesTable.id, c.serviceId)).limit(1);
      return { ...c, service: svc ?? null };
    }));
    res.json({ charges: enriched });
  } catch (err) {
    req.log.error({ err }, "admin charges error");
    res.status(500).json({ error: "Erro interno" });
  }
});

export default router;

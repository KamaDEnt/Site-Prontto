import { pgTable, uuid, text, timestamp, pgEnum, numeric, integer } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const accountTypeEnum = pgEnum("account_type", ["cliente", "prestador"]);
export const roleEnum = pgEnum("role", ["user", "admin"]);
export const pixKeyTypeEnum = pgEnum("pix_key_type", ["cpf", "cnpj", "email", "phone", "random"]);
export const serviceStatusEnum = pgEnum("service_status", [
  "pending_approval", "in_progress", "completed", "cancelled",
]);
export const chargeStatusEnum = pgEnum("charge_status", ["pending", "paid", "refunded"]);
export const senderRoleEnum = pgEnum("sender_role", ["client", "provider", "admin"]);

export const usersTable = pgTable("users", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  phone: text("phone"),
  passwordHash: text("password_hash").notNull(),
  accountType: accountTypeEnum("account_type").notNull(),
  role: roleEnum("role").default("user").notNull(),
  specialty: text("specialty"),
  city: text("city"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const professionalBankingTable = pgTable("professional_banking", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: uuid("user_id").references(() => usersTable.id, { onDelete: "cascade" }).notNull(),
  pixKeyType: pixKeyTypeEnum("pix_key_type").notNull(),
  pixKey: text("pix_key").notNull(),
  fullName: text("full_name").notNull(),
  cpfCnpj: text("cpf_cnpj").notNull(),
  bankName: text("bank_name"),
  agency: text("agency"),
  accountNumber: text("account_number"),
  bankAccountType: text("bank_account_type"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const servicesTable = pgTable("services", {
  id: uuid("id").defaultRandom().primaryKey(),
  title: text("title").notNull(),
  description: text("description"),
  category: text("category").notNull(),
  clientId: uuid("client_id").references(() => usersTable.id, { onDelete: "set null" }),
  providerId: uuid("provider_id").references(() => usersTable.id, { onDelete: "set null" }),
  price: numeric("price", { precision: 10, scale: 2 }).notNull(),
  adminFeeRate: numeric("admin_fee_rate", { precision: 5, scale: 4 }).default("0.2000").notNull(),
  status: serviceStatusEnum("status").default("pending_approval").notNull(),
  address: text("address"),
  scheduledAt: timestamp("scheduled_at"),
  completedAt: timestamp("completed_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const serviceMessagesTable = pgTable("service_messages", {
  id: uuid("id").defaultRandom().primaryKey(),
  serviceId: uuid("service_id").references(() => servicesTable.id, { onDelete: "cascade" }).notNull(),
  senderId: uuid("sender_id").references(() => usersTable.id, { onDelete: "set null" }),
  senderRole: senderRoleEnum("sender_role").notNull(),
  content: text("content").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const chargesTable = pgTable("charges", {
  id: uuid("id").defaultRandom().primaryKey(),
  serviceId: uuid("service_id").references(() => servicesTable.id, { onDelete: "cascade" }).notNull(),
  totalAmount: numeric("total_amount", { precision: 10, scale: 2 }).notNull(),
  adminFee: numeric("admin_fee", { precision: 10, scale: 2 }).notNull(),
  providerAmount: numeric("provider_amount", { precision: 10, scale: 2 }).notNull(),
  status: chargeStatusEnum("status").default("pending").notNull(),
  paidAt: timestamp("paid_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const insertUserSchema = createInsertSchema(usersTable).omit({
  id: true, passwordHash: true, createdAt: true, updatedAt: true,
}).extend({
  password: z.string().min(8, "Senha deve ter pelo menos 8 caracteres"),
});

export const insertBankingSchema = createInsertSchema(professionalBankingTable).omit({
  id: true, userId: true, createdAt: true, updatedAt: true,
});

export const selectUserSchema = createSelectSchema(usersTable).omit({ passwordHash: true });

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof usersTable.$inferSelect;
export type PublicUser = Omit<User, "passwordHash">;
export type InsertBanking = z.infer<typeof insertBankingSchema>;
export type Banking = typeof professionalBankingTable.$inferSelect;
export type Service = typeof servicesTable.$inferSelect;
export type ServiceMessage = typeof serviceMessagesTable.$inferSelect;
export type Charge = typeof chargesTable.$inferSelect;

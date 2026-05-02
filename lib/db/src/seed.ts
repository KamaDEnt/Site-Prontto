import { db, usersTable, servicesTable, serviceMessagesTable, chargesTable } from "./index.js";
import { eq } from "drizzle-orm";
import bcrypt from "bcryptjs";

async function seed() {
  console.log("🌱 Seeding admin and demo data...");

  // ── Admin user ──────────────────────────────────────────────────────────
  const adminHash = await bcrypt.hash("admin123", 12);
  await db.insert(usersTable).values({
    name: "Administrador Prontto",
    email: "admin@prontto.com",
    phone: "(11) 99999-0000",
    passwordHash: adminHash,
    accountType: "prestador",
    role: "admin",
    city: "São Paulo",
  }).onConflictDoNothing();

  const [adminRow] = await db.select().from(usersTable).where(eq(usersTable.email, "admin@prontto.com")).limit(1);
  const adminId = adminRow!.id;
  console.log("✅ Admin: admin@prontto.com / admin123");

  // ── Demo clients ──────────────────────────────────────────────────────
  const demoHash = await bcrypt.hash("demo1234", 12);
  const clientSeeds = [
    { name: "Lucas Ferreira",  email: "lucas@demo.com",  phone: "(11) 98765-4321", city: "São Paulo" },
    { name: "Camila Rocha",   email: "camila@demo.com", phone: "(21) 97654-3210", city: "Rio de Janeiro" },
    { name: "Rafael Mendes",  email: "rafael@demo.com", phone: "(31) 96543-2109", city: "Belo Horizonte" },
  ];
  const clientIds: string[] = [];
  for (const c of clientSeeds) {
    await db.insert(usersTable).values({ ...c, passwordHash: demoHash, accountType: "cliente", role: "user" }).onConflictDoNothing();
    const [row] = await db.select({ id: usersTable.id }).from(usersTable).where(eq(usersTable.email, c.email)).limit(1);
    if (row) { clientIds.push(row.id); console.log("✅ Client:", c.email); }
  }

  // ── Demo providers ─────────────────────────────────────────────────────
  const providerSeeds = [
    { name: "Maria Oliveira", email: "maria@demo.com", specialty: "Limpeza",   city: "São Paulo" },
    { name: "Carlos Lima",    email: "carlos@demo.com", specialty: "Elétrica",  city: "São Paulo" },
    { name: "Pedro Costa",    email: "pedro@demo.com",  specialty: "Jardinagem", city: "Rio de Janeiro" },
    { name: "Ana Souza",      email: "ana@demo.com",    specialty: "Pintura",    city: "Belo Horizonte" },
  ];
  const providerIds: string[] = [];
  for (const p of providerSeeds) {
    await db.insert(usersTable).values({ ...p, passwordHash: demoHash, accountType: "prestador", role: "user" }).onConflictDoNothing();
    const [row] = await db.select({ id: usersTable.id }).from(usersTable).where(eq(usersTable.email, p.email)).limit(1);
    if (row) { providerIds.push(row.id); console.log("✅ Provider:", p.email); }
  }

  if (clientIds.length < 3 || providerIds.length < 4) {
    console.log("⚠️  Not enough new users — skipping service seeding (already seeded?)");
    printCredentials();
    return;
  }

  // ── Demo services ──────────────────────────────────────────────────────
  const serviceSeeds = [
    {
      title: "Limpeza Residencial Completa",
      description: "Limpeza geral de apartamento 3 quartos, incluindo banheiros, cozinha e área de serviço.",
      category: "Limpeza", clientId: clientIds[0]!, providerId: providerIds[0]!,
      price: "180.00", status: "completed" as const,
      address: "Rua das Flores, 123 – Jardins, SP",
      scheduledAt: new Date("2026-04-28T09:00:00"), completedAt: new Date("2026-04-28T13:00:00"),
    },
    {
      title: "Instalação de Tomadas e Disjuntores",
      description: "Instalação de 6 tomadas novas e troca do quadro de disjuntores.",
      category: "Elétrica", clientId: clientIds[1]!, providerId: providerIds[1]!,
      price: "320.00", status: "in_progress" as const,
      address: "Av. Paulista, 900 – Bela Vista, SP",
      scheduledAt: new Date("2026-05-02T14:00:00"),
    },
    {
      title: "Manutenção de Jardim Mensal",
      description: "Corte de grama, poda de arbustos, adubação e limpeza do jardim.",
      category: "Jardinagem", clientId: clientIds[0]!, providerId: providerIds[2]!,
      price: "130.00", status: "in_progress" as const,
      address: "Rua Ipanema, 45 – Leblon, RJ",
      scheduledAt: new Date("2026-05-02T08:00:00"),
    },
    {
      title: "Pintura de Sala e Dois Quartos",
      description: "Pintura completa com duas demãos, inclui mão de obra e material.",
      category: "Pintura", clientId: clientIds[2]!, providerId: providerIds[3]!,
      price: "750.00", status: "pending_approval" as const,
      address: "Rua do Ouro, 321 – Savassi, BH",
      scheduledAt: new Date("2026-05-10T10:00:00"),
    },
    {
      title: "Limpeza Pós-Obra",
      description: "Remoção de entulho e limpeza pesada após reforma do banheiro.",
      category: "Limpeza", clientId: clientIds[1]!, providerId: providerIds[0]!,
      price: "250.00", status: "pending_approval" as const,
      address: "Rua Augusta, 88 – Consolação, SP",
      scheduledAt: new Date("2026-05-08T09:00:00"),
    },
    {
      title: "Conserto de Instalação Elétrica",
      description: "Diagnóstico e reparo de curto-circuito na cozinha.",
      category: "Elétrica", clientId: clientIds[0]!, providerId: providerIds[1]!,
      price: "200.00", status: "completed" as const,
      address: "Rua das Flores, 123 – Jardins, SP",
      scheduledAt: new Date("2026-04-15T11:00:00"), completedAt: new Date("2026-04-15T13:30:00"),
    },
  ];

  const serviceIds: string[] = [];
  for (const s of serviceSeeds) {
    const [svc] = await db.insert(servicesTable).values(s).returning({ id: servicesTable.id });
    if (svc) { serviceIds.push(svc.id); console.log("✅ Service:", s.title); }
  }

  // ── Charges for completed services ─────────────────────────────────────
  const completedIndexes = [0, 5]; // indexes in serviceSeeds that are "completed"
  for (const idx of completedIndexes) {
    const s = serviceSeeds[idx]!;
    const svcId = serviceIds[idx]!;
    if (!svcId) continue;
    const total = Number(s.price);
    const fee = parseFloat((total * 0.2).toFixed(2));
    const provider = parseFloat((total - fee).toFixed(2));
    await db.insert(chargesTable).values({
      serviceId: svcId,
      totalAmount: total.toFixed(2),
      adminFee: fee.toFixed(2),
      providerAmount: provider.toFixed(2),
      status: "paid",
      paidAt: (s as { completedAt?: Date }).completedAt ?? new Date(),
    });
    console.log(`✅ Charge: R$ ${total} → admin R$${fee} / provider R$${provider}`);
  }

  // Pending charge for in_progress services
  const pendingIndexes = [1, 2];
  for (const idx of pendingIndexes) {
    const s = serviceSeeds[idx]!;
    const svcId = serviceIds[idx]!;
    if (!svcId) continue;
    const total = Number(s.price);
    const fee = parseFloat((total * 0.2).toFixed(2));
    const provider = parseFloat((total - fee).toFixed(2));
    await db.insert(chargesTable).values({
      serviceId: svcId,
      totalAmount: total.toFixed(2),
      adminFee: fee.toFixed(2),
      providerAmount: provider.toFixed(2),
      status: "pending",
    });
    console.log(`✅ Pending charge: R$ ${total}`);
  }

  // ── Demo messages ───────────────────────────────────────────────────────
  if (serviceIds[0] && serviceIds[1]) {
    const msgs = [
      { serviceId: serviceIds[0]!, senderId: clientIds[0]!, senderRole: "client" as const,   content: "Olá Maria! Pode chegar às 9h mesmo?" },
      { serviceId: serviceIds[0]!, senderId: providerIds[0]!, senderRole: "provider" as const, content: "Claro! Estarei lá às 9h em ponto. Pode deixar o acesso para mim?" },
      { serviceId: serviceIds[0]!, senderId: clientIds[0]!, senderRole: "client" as const,   content: "Sim, vou deixar a chave com o porteiro. Nome é Lucas." },
      { serviceId: serviceIds[0]!, senderId: providerIds[0]!, senderRole: "provider" as const, content: "Perfeito! A limpeza foi concluída, ficou tudo organizado! 😊" },
      { serviceId: serviceIds[0]!, senderId: clientIds[0]!, senderRole: "client" as const,   content: "Ficou ótimo! Muito obrigado Maria. Já deixei a avaliação." },
      { serviceId: serviceIds[1]!, senderId: clientIds[1]!, senderRole: "client" as const,   content: "Carlos, qual o prazo estimado para a instalação?" },
      { serviceId: serviceIds[1]!, senderId: providerIds[1]!, senderRole: "provider" as const, content: "Olá Camila! Com esse escopo estimo umas 3 horas de serviço." },
      { serviceId: serviceIds[1]!, senderId: clientIds[1]!, senderRole: "client" as const,   content: "Ótimo! Tem como começar às 14h hoje?" },
      { serviceId: serviceIds[1]!, senderId: providerIds[1]!, senderRole: "provider" as const, content: "Sim! Estou a caminho. Prepara o acesso ao quadro elétrico." },
      { serviceId: serviceIds[1]!, senderId: adminId, senderRole: "admin" as const, content: "Serviço aprovado e em andamento. Qualquer problema entre em contato." },
    ];
    for (const m of msgs) await db.insert(serviceMessagesTable).values(m);
    console.log("✅ Messages seeded");
  }

  console.log("\n🎉 Seed complete!");
  printCredentials();
}

function printCredentials() {
  console.log("\n📋 Credenciais de acesso:");
  console.log("   Admin    → admin@prontto.com  / admin123");
  console.log("   Cliente  → lucas@demo.com      / demo1234");
  console.log("   Prestador→ maria@demo.com      / demo1234");
}

seed().then(() => process.exit(0)).catch(err => { console.error(err); process.exit(1); });

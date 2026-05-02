import { db, usersTable, servicesTable, serviceMessagesTable, chargesTable } from "@workspace/db";
import { eq } from "drizzle-orm";
import bcrypt from "bcryptjs";

async function seed() {
  console.log("🌱 Seeding admin and demo data...");

  // ── Admin user ────────────────────────────────────────────────────────────
  const adminHash = await bcrypt.hash("admin123", 12);
  const [admin] = await db.insert(usersTable).values({
    name: "Administrador Prontto",
    email: "admin@prontto.com",
    phone: "(11) 99999-0000",
    passwordHash: adminHash,
    accountType: "prestador",
    role: "admin",
    city: "São Paulo",
  }).onConflictDoNothing().returning();

  console.log("✅ Admin:", admin?.email ?? "already exists (admin@prontto.com)");

  // Fetch admin id even if skipped
  const [adminRow] = await db.select().from(usersTable).where(eq(usersTable.email, "admin@prontto.com")).limit(1);
  const adminId = adminRow!.id;

  // ── Demo clients ──────────────────────────────────────────────────────────
  const clientHash = await bcrypt.hash("demo1234", 12);
  const clientSeeds = [
    { name: "Lucas Ferreira", email: "lucas@demo.com", phone: "(11) 98765-4321", city: "São Paulo" },
    { name: "Camila Rocha", email: "camila@demo.com", phone: "(21) 97654-3210", city: "Rio de Janeiro" },
    { name: "Rafael Mendes", email: "rafael@demo.com", phone: "(31) 96543-2109", city: "Belo Horizonte" },
  ];
  const clientIds: string[] = [];
  for (const c of clientSeeds) {
    const [row] = await db.insert(usersTable).values({
      ...c, passwordHash: clientHash, accountType: "cliente", role: "user",
    }).onConflictDoNothing().returning();
    if (row) { clientIds.push(row.id); console.log("✅ Client:", row.email); }
    else {
      const [ex] = await db.select().from(usersTable).where(eq(usersTable.email, c.email)).limit(1);
      if (ex) clientIds.push(ex.id);
    }
  }

  // ── Demo providers ────────────────────────────────────────────────────────
  const providerSeeds = [
    { name: "Maria Oliveira", email: "maria@demo.com", specialty: "Limpeza", city: "São Paulo" },
    { name: "Carlos Lima", email: "carlos@demo.com", specialty: "Elétrica", city: "São Paulo" },
    { name: "Pedro Costa", email: "pedro@demo.com", specialty: "Jardinagem", city: "Rio de Janeiro" },
    { name: "Ana Souza", email: "ana@demo.com", specialty: "Pintura", city: "Belo Horizonte" },
  ];
  const providerIds: string[] = [];
  for (const p of providerSeeds) {
    const [row] = await db.insert(usersTable).values({
      ...p, passwordHash: clientHash, accountType: "prestador", role: "user",
    }).onConflictDoNothing().returning();
    if (row) { providerIds.push(row.id); console.log("✅ Provider:", row.email); }
    else {
      const [ex] = await db.select().from(usersTable).where(eq(usersTable.email, p.email)).limit(1);
      if (ex) providerIds.push(ex.id);
    }
  }

  if (clientIds.length < 2 || providerIds.length < 2) {
    console.log("⚠️  Demo users already exist, skipping service seeding");
    console.log("\n📋 Login Credentials:");
    console.log("   Admin  → admin@prontto.com / admin123");
    console.log("   Client → lucas@demo.com / demo1234");
    console.log("   Provider → maria@demo.com / demo1234");
    return;
  }

  // ── Demo services ─────────────────────────────────────────────────────────
  const serviceSeeds = [
    {
      title: "Limpeza Residencial Completa",
      description: "Limpeza geral de apartamento 3 quartos, incluindo banheiros, cozinha e área de serviço.",
      category: "Limpeza",
      clientId: clientIds[0]!,
      providerId: providerIds[0]!,
      price: "180.00",
      status: "completed" as const,
      address: "Rua das Flores, 123 – Jardins, SP",
      scheduledAt: new Date("2026-04-28T09:00:00"),
      completedAt: new Date("2026-04-28T13:00:00"),
    },
    {
      title: "Instalação de Tomadas e Disjuntores",
      description: "Instalação de 6 tomadas novas e troca do quadro de disjuntores.",
      category: "Elétrica",
      clientId: clientIds[1]!,
      providerId: providerIds[1]!,
      price: "320.00",
      status: "in_progress" as const,
      address: "Av. Paulista, 900 – Bela Vista, SP",
      scheduledAt: new Date("2026-05-02T14:00:00"),
    },
    {
      title: "Manutenção de Jardim Mensal",
      description: "Corte de grama, poda de arbustos, adubação e limpeza do jardim.",
      category: "Jardinagem",
      clientId: clientIds[0]!,
      providerId: providerIds[2]!,
      price: "130.00",
      status: "in_progress" as const,
      address: "Rua Ipanema, 45 – Leblon, RJ",
      scheduledAt: new Date("2026-05-02T08:00:00"),
    },
    {
      title: "Pintura de Sala e Dois Quartos",
      description: "Pintura completa com duas demãos, inclui mão de obra e material.",
      category: "Pintura",
      clientId: clientIds[2]!,
      providerId: providerIds[3]!,
      price: "750.00",
      status: "pending_approval" as const,
      address: "Rua do Ouro, 321 – Savassi, BH",
      scheduledAt: new Date("2026-05-10T10:00:00"),
    },
    {
      title: "Limpeza Pós-Obra",
      description: "Remoção de entulho e limpeza pesada após reforma do banheiro.",
      category: "Limpeza",
      clientId: clientIds[1]!,
      providerId: providerIds[0]!,
      price: "250.00",
      status: "pending_approval" as const,
      address: "Rua Augusta, 88 – Consolação, SP",
      scheduledAt: new Date("2026-05-08T09:00:00"),
    },
    {
      title: "Conserto de Instalação Elétrica",
      description: "Diagnóstico e reparo de curto-circuito na cozinha.",
      category: "Elétrica",
      clientId: clientIds[0]!,
      providerId: providerIds[1]!,
      price: "200.00",
      status: "completed" as const,
      address: "Rua das Flores, 123 – Jardins, SP",
      scheduledAt: new Date("2026-04-15T11:00:00"),
      completedAt: new Date("2026-04-15T13:30:00"),
    },
  ];

  const serviceIds: string[] = [];
  for (const s of serviceSeeds) {
    const [svc] = await db.insert(servicesTable).values(s).returning();
    if (svc) { serviceIds.push(svc.id); console.log("✅ Service:", svc.title); }
  }

  // ── Demo charges for completed services ───────────────────────────────────
  const completed = serviceSeeds.filter(s => s.status === "completed");
  for (let i = 0; i < completed.length; i++) {
    const s = completed[i]!;
    const svcId = serviceIds[serviceSeeds.indexOf(s)]!;
    const total = Number(s.price);
    const fee = parseFloat((total * 0.2).toFixed(2));
    const provider = parseFloat((total - fee).toFixed(2));
    await db.insert(chargesTable).values({
      serviceId: svcId,
      totalAmount: total.toFixed(2),
      adminFee: fee.toFixed(2),
      providerAmount: provider.toFixed(2),
      status: "paid",
      paidAt: s.completedAt ?? new Date(),
    });
    console.log(`✅ Charge: R$ ${total} → admin R$ ${fee} / provider R$ ${provider}`);
  }

  // ── Demo messages ─────────────────────────────────────────────────────────
  if (serviceIds.length >= 2) {
    const msgSeeds = [
      // Service 1 (completed - limpeza)
      { serviceId: serviceIds[0]!, senderId: clientIds[0]!, senderRole: "client" as const, content: "Olá Maria! Pode chegar às 9h mesmo?" },
      { serviceId: serviceIds[0]!, senderId: providerIds[0]!, senderRole: "provider" as const, content: "Claro! Estarei lá às 9h em ponto. Pode deixar o acesso para mim?" },
      { serviceId: serviceIds[0]!, senderId: clientIds[0]!, senderRole: "client" as const, content: "Sim, vou deixar a chave com o porteiro. Nome é Lucas." },
      { serviceId: serviceIds[0]!, senderId: providerIds[0]!, senderRole: "provider" as const, content: "Perfeito! Obrigada. A limpeza foi concluída, ficou tudo organizado! 😊" },
      { serviceId: serviceIds[0]!, senderId: clientIds[0]!, senderRole: "client" as const, content: "Ficou ótimo! Muito obrigado Maria. Já deixei a avaliação." },
      // Service 2 (in_progress - elétrica)
      { serviceId: serviceIds[1]!, senderId: clientIds[1]!, senderRole: "client" as const, content: "Carlos, qual o prazo estimado para a instalação?" },
      { serviceId: serviceIds[1]!, senderId: providerIds[1]!, senderRole: "provider" as const, content: "Olá Camila! Com esse escopo estimo umas 3 horas de serviço." },
      { serviceId: serviceIds[1]!, senderId: clientIds[1]!, senderRole: "client" as const, content: "Ótimo! Tem como começar às 14h hoje?" },
      { serviceId: serviceIds[1]!, senderId: providerIds[1]!, senderRole: "provider" as const, content: "Sim! Estou a caminho. Prepara o acesso ao quadro elétrico por favor." },
      { serviceId: serviceIds[1]!, senderId: adminId, senderRole: "admin" as const, content: "Serviço aprovado e em andamento. Qualquer problema entre em contato." },
    ];
    for (const m of msgSeeds) {
      await db.insert(serviceMessagesTable).values(m);
    }
    console.log("✅ Messages seeded");
  }

  console.log("\n🎉 Seed complete!\n");
  console.log("📋 Login Credentials:");
  console.log("   Admin    → admin@prontto.com    / admin123");
  console.log("   Client   → lucas@demo.com        / demo1234");
  console.log("   Provider → maria@demo.com        / demo1234");
}

seed().then(() => process.exit(0)).catch(err => { console.error(err); process.exit(1); });

import { PrismaClient } from "@prisma/client";
import { hash } from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Starting database seeding...");

  // Create sample currencies
  const htg = await prisma.currency.upsert({
    where: { code: "HTG" },
    update: {},
    create: {
      code: "HTG",
      name: "Haitian Gourde",
      symbol: "G",
      rate_to_htg: 1.0,
      is_default: true,
      is_active: true,
      decimal_places: 2,
    },
  });

  const usd = await prisma.currency.upsert({
    where: { code: "USD" },
    update: {},
    create: {
      code: "USD",
      name: "US Dollar",
      symbol: "$",
      rate_to_htg: 135.0, // Example rate
      is_default: false,
      is_active: true,
      decimal_places: 2,
    },
  });

  // Create sample exchange rates
  await prisma.exchangeRate.create({
    data: {
      from_currency: "USD",
      to_currency: "HTG",
      rate: 135.0,
      source: "manual",
    },
  });

  // Create system configuration
  await prisma.systemConfig.createMany({
    data: [
      {
        key: "min_refill_amount",
        value: 100,
        description: "Minimum refill amount in HTG",
      },
      {
        key: "max_daily_limit",
        value: 50000,
        description: "Maximum daily transaction limit in HTG",
      },
      {
        key: "transaction_fee_rate",
        value: 0.025,
        description: "Transaction fee rate (2.5%)",
      },
    ],
    skipDuplicates: true,
  });

  // Create a test admin user
  const hashedPassword = await hash("Admin123!", 12);

  const adminUser = await prisma.user.upsert({
    where: { email: "admin@kobklein.com" },
    update: {},
    create: {
      email: "admin@kobklein.com",
      phone: "+50912345678",
      first_name: "System",
      last_name: "Administrator",
      role: "SUPER_ADMIN",
      status: "ACTIVE",
      password: hashedPassword,
      country: "HT",
      language: "en",
      email_verified_at: new Date(),
    },
  });

  // Create admin profile
  await prisma.adminProfile.upsert({
    where: { user_id: adminUser.id },
    update: {},
    create: {
      user_id: adminUser.id,
      department: "Technology",
      permissions: [
        "users.read",
        "users.write",
        "transactions.read",
        "transactions.write",
        "system.config",
      ],
    },
  });

  // Create HTG wallet for admin
  await prisma.wallet.upsert({
    where: {
      user_id_currency: {
        user_id: adminUser.id,
        currency: "HTG",
      },
    },
    update: {},
    create: {
      user_id: adminUser.id,
      currency: "HTG",
      balance: 1000000, // 1M HTG for testing
      status: "ACTIVE",
      daily_limit: 1000000,
      monthly_limit: 10000000,
    },
  });

  // Create a test client user
  const clientUser = await prisma.user.upsert({
    where: { email: "client@kobklein.com" },
    update: {},
    create: {
      email: "client@kobklein.com",
      phone: "+50987654321",
      first_name: "Test",
      last_name: "Client",
      role: "CLIENT",
      status: "ACTIVE",
      password: await hash("Client123!", 12),
      country: "HT",
      language: "ht",
      email_verified_at: new Date(),
    },
  });

  // Create client profile
  await prisma.clientProfile.upsert({
    where: { user_id: clientUser.id },
    update: {},
    create: {
      user_id: clientUser.id,
      preferred_language: "ht",
      receive_notifications: true,
      preferred_currency: "HTG",
    },
  });

  // Create HTG wallet for client
  await prisma.wallet.upsert({
    where: {
      user_id_currency: {
        user_id: clientUser.id,
        currency: "HTG",
      },
    },
    update: {},
    create: {
      user_id: clientUser.id,
      currency: "HTG",
      balance: 5000, // 5,000 HTG for testing
      status: "ACTIVE",
      daily_limit: 50000,
      monthly_limit: 500000,
    },
  });

  console.log("✅ Database seeding completed!");
  console.log("📧 Admin login: admin@kobklein.com / Admin123!");
  console.log("📧 Client login: client@kobklein.com / Client123!");
}

main()
  .catch((e) => {
    console.error("❌ Seeding failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

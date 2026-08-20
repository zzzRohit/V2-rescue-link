import "dotenv/config";
import bcrypt from "bcrypt";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../generated/prisma/client.js";
import { Role } from "../generated/prisma/enums.js";

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  throw new Error("DATABASE_URL is required to seed the database.");
}

// This is the same Prisma 7 PostgreSQL adapter configuration used by the app.
const prisma = new PrismaClient({
  adapter: new PrismaPg({ connectionString: databaseUrl }),
});

async function main() {
  const [rescuerPassword, citizenPassword, adminPassword] = await Promise.all([
    bcrypt.hash("Rescuer@123", 10),
    bcrypt.hash("Citizen@123", 10),
    bcrypt.hash("Admin@123", 10),
  ]);

  const rescuer = await prisma.user.upsert({
    where: { email: "rescuer@test.com" },
    update: {
      password: rescuerPassword,
      name: "Test Rescuer",
      phoneNumber: "9876543210",
      role: Role.RESCUER,
      latitude: 15.3647,
      longitude: 75.124,
      serviceRadiusKm: 30,
      locationUpdatedAt: new Date(),
    },
    create: {
      email: "rescuer@test.com",
      password: rescuerPassword,
      name: "Test Rescuer",
      phoneNumber: "9876543210",
      role: Role.RESCUER,
      latitude: 15.3647,
      longitude: 75.124,
      serviceRadiusKm: 30,
      locationUpdatedAt: new Date(),
    },
  });

  const citizen = await prisma.user.upsert({
    where: { email: "citizen@test.com" },
    update: {
      password: citizenPassword,
      name: "Test Citizen",
      phoneNumber: "9876543211",
      role: Role.CITIZEN,
    },
    create: {
      email: "citizen@test.com",
      password: citizenPassword,
      name: "Test Citizen",
      phoneNumber: "9876543211",
      role: Role.CITIZEN,
    },
  });

  const citizenTwo = await prisma.user.upsert({
    where: { email: "citizen2@test.com" },
    update: {
      password: citizenPassword,
      name: "Test Citizen Two",
      phoneNumber: "9876543213",
      role: Role.CITIZEN,
    },
    create: {
      email: "citizen2@test.com",
      password: citizenPassword,
      name: "Test Citizen Two",
      phoneNumber: "9876543213",
      role: Role.CITIZEN,
    },
  });

  const citizenThree = await prisma.user.upsert({
    where: { email: "citizen3@test.com" },
    update: {
      password: citizenPassword,
      name: "Test Citizen Three",
      phoneNumber: "9876543214",
      role: Role.CITIZEN,
    },
    create: {
      email: "citizen3@test.com",
      password: citizenPassword,
      name: "Test Citizen Three",
      phoneNumber: "9876543214",
      role: Role.CITIZEN,
    },
  });

  const admin = await prisma.user.upsert({
    where: { email: "admin@test.com" },
    update: {
      password: adminPassword,
      name: "Test Admin",
      phoneNumber: "9876543212",
      role: Role.ADMIN,
    },
    create: {
      email: "admin@test.com",
      password: adminPassword,
      name: "Test Admin",
      phoneNumber: "9876543212",
      role: Role.ADMIN,
    },
  });

  const reports = await Promise.all([
    prisma.report.upsert({
      where: { trackingId: "RL-SEED-001" },
      update: { reporterId: citizen.id },
      create: {
        trackingId: "RL-SEED-001",
        title: "Injured street dog",
        animalType: "DOG",
        description: "A street dog appears injured near the public park.",
        phoneNumber: citizen.phoneNumber,
        latitude: 15.3647,
        longitude: 75.124,
        imageUrl: "https://placehold.co/800x600?text=Injured+Dog",
        reporterId: citizen.id,
      },
    }),
    prisma.report.upsert({
      where: { trackingId: "RL-SEED-002" },
      update: { reporterId: citizenTwo.id },
      create: {
        trackingId: "RL-SEED-002",
        title: "Trapped kitten",
        animalType: "CAT",
        description: "A kitten is trapped near a residential drain.",
        phoneNumber: citizenTwo.phoneNumber,
        latitude: 15.369,
        longitude: 75.13,
        imageUrl: "https://placehold.co/800x600?text=Trapped+Kitten",
        reporterId: citizenTwo.id,
      },
    }),
    prisma.report.upsert({
      where: { trackingId: "RL-SEED-003" },
      update: { reporterId: citizenThree.id },
      create: {
        trackingId: "RL-SEED-003",
        title: "Stranded bird",
        animalType: "BIRD",
        description: "An injured bird is unable to fly from a roadside area.",
        phoneNumber: citizenThree.phoneNumber,
        latitude: 15.358,
        longitude: 75.118,
        imageUrl: "https://placehold.co/800x600?text=Stranded+Bird",
        reporterId: citizenThree.id,
      },
    }),
  ]);

  console.log("Seed completed successfully:", {
    rescuer: rescuer.email,
    citizen: citizen.email,
    citizenTwo: citizenTwo.email,
    citizenThree: citizenThree.email,
    admin: admin.email,
    reports: reports.length,
  });
}

main()
  .catch((error: unknown) => {
    console.error("Seed failed:", error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

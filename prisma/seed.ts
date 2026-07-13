import { PrismaClient } from "../src/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

async function main() {
  const adminEmail = process.env.ADMIN_EMAIL;
  if (!adminEmail) {
    console.log("No ADMIN_EMAIL set in .env — skipping admin promotion.");
    return;
  }

  const user = await prisma.user.findUnique({ where: { email: adminEmail } });

  if (!user) {
    console.log(
      `No user found for ADMIN_EMAIL (${adminEmail}) yet. Sign up with this email ` +
        `(Google or email/password) and it will be promoted to admin automatically. ` +
        `You can also rerun "npm run db:seed" afterwards to promote it manually.`
    );
    return;
  }

  if (user.role === "ADMIN") {
    console.log(`${adminEmail} is already an admin.`);
    return;
  }

  await prisma.user.update({
    where: { email: adminEmail },
    data: { role: "ADMIN" },
  });
  console.log(`Promoted ${adminEmail} to ADMIN.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

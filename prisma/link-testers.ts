import { loadEnvConfig } from '@next/env';
import { PrismaClient } from '@prisma/client';
import { getTesters } from './testers';

// Points already-seeded users at real Firebase accounts without reseeding,
// so the shared DB keeps its data. Safe to re-run.
loadEnvConfig(process.cwd());
const prisma = new PrismaClient();

async function main() {
  for (const { placeholderUid, uid, email } of getTesters()) {
    if (!uid) {
      console.log(`⏭️  ${placeholderUid}: no UID set in .env, skipping`);
      continue;
    }

    const user = await prisma.user.findFirst({ where: { firebaseUid: { in: [placeholderUid, uid] } } });
    if (!user) {
      console.log(`⚠️  ${placeholderUid}: no matching user in DB (has it been seeded?)`);
      continue;
    }

    await prisma.user.update({
      where: { id: user.id },
      data: { firebaseUid: uid, ...(email && { email }) },
    });
    console.log(`✅ ${user.name} (${user.role}) → ${uid}`);
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());

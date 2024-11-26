// prisma/seed.ts

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const tags = [
    { name: 'kadai1' },
    { name: 'kadai1.1' },
    { name: 'kadai2' },
    { name: 'kadai3' },
    { name: 'kadai4' },
    { name: 'kadai5' },
  ];

  for (const tag of tags) {
    await prisma.tag.upsert({
      where: { name: tag.name },
      update: {},
      create: tag,
    });
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

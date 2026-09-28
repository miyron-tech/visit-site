import { PrismaClient } from '@prisma/client';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const prisma = new PrismaClient();

async function main() {
  const source = JSON.parse(readFileSync(resolve(__dirname, '../prisma/profile.json'), 'utf8'));
  const { links, skills, experience, projects, ...profile } = source;
  const ordered = (rows: Record<string, unknown>[]) =>
    rows.map((row, order) => ({ ...row, order }));
  await prisma.$transaction(async tx => {
    await tx.profile.deleteMany({ where: { id: 'vlad' } });
    await tx.profile.create({
      data: {
        id: 'vlad',
        ...profile,
        links: { create: ordered(links) },
        skills: { create: ordered(skills) },
        projects: { create: ordered(projects) },
        experience: {
          create: experience.map((item: { achievements: string[] }, order: number) => ({
            ...item,
            order,
            achievements: { create: item.achievements.map((text, order) => ({ text, order })) },
          })),
        },
      },
    });
  });
  console.log('Profile database seeded.');
}

main()
  .catch(error => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(() => prisma.$disconnect());

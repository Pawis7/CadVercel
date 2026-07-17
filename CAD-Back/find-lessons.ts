import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: 'postgresql://cad:cad_dev@localhost:5433/cad?schema=public',
    },
  },
});

async function main() {
  console.log('Connecting to database...');
  const lessons = await prisma.leccion.findMany({
    select: {
      id: true,
      titulo: true,
      tipo: true,
      contenidoHtml: true,
    },
  });
  console.log(`Found ${lessons.length} lessons:`);
  for (const l of lessons) {
    console.log(`- [${l.tipo}] ${l.titulo} (ID: ${l.id})`);
    if (l.contenidoHtml) {
      console.log(`  HTML length: ${l.contenidoHtml.length}`);
      const tLower = l.titulo.toLowerCase();
      const cLower = l.contenidoHtml.toLowerCase();
      if (tLower.includes('viral') || tLower.includes('fantasma') || tLower.includes('esquad') || tLower.includes('squad') || tLower.includes('voz') || cLower.includes('simulador') || cLower.includes('chat') || cLower.includes('mensaje')) {
        console.log(`  ★ MATCH: ${l.titulo}`);
        console.log(`  Content Preview:`);
        console.log(l.contenidoHtml);
        console.log('--------------------------------------------');
      }
    }
  }
}

main().catch(console.error).finally(() => prisma.$disconnect());

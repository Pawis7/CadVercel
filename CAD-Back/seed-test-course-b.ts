import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Iniciando creación de cursos de prueba (Respuestas en B)...');

  // 1. Buscar o crear usuario administrador
  let admin = await prisma.user.findFirst({
    where: { role: 'ADMIN' },
  });

  if (!admin) {
    admin = await prisma.user.findFirst();
  }

  if (!admin) {
    console.error('❌ No se encontró ningún usuario en la base de datos para asignar como autor.');
    return;
  }

  console.log(`👤 Usando autor: ${admin.firstName} ${admin.lastName} (${admin.email})`);

  // --- CURSO 1: Diseño de Interfaces y UX Moderno ---
  const curso1 = await prisma.curso.create({
    data: {
      nombre: 'Curso de Prueba: Diseño de Interfaces y UX Moderno (Respuestas B)',
      descripcion: 'Aprende los principios del diseño UI/UX premium. Este curso está diseñado para testing. NOTA: Todas las respuestas correctas de la evaluación son la opción B.',
      portada: 'https://images.unsplash.com/photo-1541462608143-67571c6738dd?q=80&w=1200&auto=format&fit=crop',
      etiquetas: ['ui', 'ux', 'diseño', 'prueba'],
      nivel: 'INTERMEDIO',
      estado: 'PUBLICADO',
      duracionEstimada: 35,
      autorId: admin.id,
    },
  });
  console.log(`📚 Curso 1 creado con ID: ${curso1.id}`);

  const modulo1_c1 = await prisma.modulo.create({
    data: {
      cursoId: curso1.id,
      titulo: 'Fundamentos de UI/UX',
      descripcion: 'Principios y conceptos básicos de diseño de interfaces.',
      orden: 1,
    },
  });

  await prisma.leccion.create({
    data: {
      moduloId: modulo1_c1.id,
      titulo: 'Concepto de Contraste y Colores',
      tipo: 'VIDEO',
      orden: 1,
      esObligatoria: true,
      recursoUrl: 'https://www.youtube.com/watch?v=L_LUpnjgPso',
      duracionSeg: 240,
    },
  });

  const modulo2_c1 = await prisma.modulo.create({
    data: {
      cursoId: curso1.id,
      titulo: 'Evaluación del Curso',
      descripcion: 'Cuestionario interactivo donde la respuesta correcta en todas las preguntas es la opción B.',
      orden: 2,
    },
  });

  const quiz1 = await prisma.leccion.create({
    data: {
      moduloId: modulo2_c1.id,
      titulo: 'Examen de UI/UX (Respuestas B)',
      tipo: 'CUESTIONARIO',
      orden: 1,
      esObligatoria: true,
      calificacionMinima: 60,
    },
  });

  // Pregunta 1
  const c1_preg1 = await prisma.pregunta.create({
    data: {
      leccionId: quiz1.id,
      texto: '¿Qué significa el término "Usabilidad" en el diseño de interfaces?',
      orden: 1,
    },
  });
  await prisma.opcion.createMany({
    data: [
      { preguntaId: c1_preg1.id, texto: 'Opción A: El costo de producción del software.', esCorrecta: false },
      { preguntaId: c1_preg1.id, texto: 'Opción B: La facilidad con la que los usuarios pueden utilizar una aplicación para lograr sus objetivos.', esCorrecta: true },
      { preguntaId: c1_preg1.id, texto: 'Opción C: El número de páginas e imágenes que contiene el sitio web.', esCorrecta: false },
      { preguntaId: c1_preg1.id, texto: 'Opción D: Todas las anteriores.', esCorrecta: false },
    ],
  });

  // Pregunta 2
  const c1_preg2 = await prisma.pregunta.create({
    data: {
      leccionId: quiz1.id,
      texto: '¿Cuál es el propósito principal de un boceto de baja fidelidad (wireframe)?',
      orden: 2,
    },
  });
  await prisma.opcion.createMany({
    data: [
      { preguntaId: c1_preg2.id, texto: 'Opción A: Definir el código de estilos CSS final.', esCorrecta: false },
      { preguntaId: c1_preg2.id, texto: 'Opción B: Organizar la estructura visual y distribución de elementos sin distraerse con el aspecto visual.', esCorrecta: true },
      { preguntaId: c1_preg2.id, texto: 'Opción C: Vender la versión final del diseño a clientes o patrocinadores.', esCorrecta: false },
      { preguntaId: c1_preg2.id, texto: 'Opción D: Ninguna de las opciones.', esCorrecta: false },
    ],
  });


  // --- CURSO 2: Desarrollo Web Seguro ---
  const curso2 = await prisma.curso.create({
    data: {
      nombre: 'Curso de Prueba: Desarrollo Web Seguro y OWASP (Respuestas B)',
      descripcion: 'Aprende los conceptos clave de la seguridad informática en aplicaciones web. Creado para testing. NOTA: Todas las respuestas correctas de la evaluación son la opción B.',
      portada: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?q=80&w=1200&auto=format&fit=crop',
      etiquetas: ['seguridad', 'desarrollo', 'web', 'prueba'],
      nivel: 'AVANZADO',
      estado: 'PUBLICADO',
      duracionEstimada: 50,
      autorId: admin.id,
    },
  });
  console.log(`📚 Curso 2 creado con ID: ${curso2.id}`);

  const modulo1_c2 = await prisma.modulo.create({
    data: {
      cursoId: curso2.id,
      titulo: 'Introducción a OWASP Top 10',
      descripcion: 'Las vulnerabilidades más comunes y peligrosas en la web.',
      orden: 1,
    },
  });

  await prisma.leccion.create({
    data: {
      moduloId: modulo1_c2.id,
      titulo: 'Inyección SQL: Concepto y Prevención',
      tipo: 'VIDEO',
      orden: 1,
      esObligatoria: true,
      recursoUrl: 'https://www.youtube.com/watch?v=L_LUpnjgPso',
      duracionSeg: 360,
    },
  });

  const modulo2_c2 = await prisma.modulo.create({
    data: {
      cursoId: curso2.id,
      titulo: 'Evaluación de Seguridad',
      descripcion: 'Cuestionario interactivo sobre seguridad web. Todas las respuestas correctas son la opción B.',
      orden: 2,
    },
  });

  const quiz2 = await prisma.leccion.create({
    data: {
      moduloId: modulo2_c2.id,
      titulo: 'Examen de Seguridad Web (Respuestas B)',
      tipo: 'CUESTIONARIO',
      orden: 1,
      esObligatoria: true,
      calificacionMinima: 60,
    },
  });

  // Pregunta 1
  const c2_preg1 = await prisma.pregunta.create({
    data: {
      leccionId: quiz2.id,
      texto: '¿Cuál es la forma más recomendada de prevenir ataques de inyección SQL?',
      orden: 1,
    },
  });
  await prisma.opcion.createMany({
    data: [
      { preguntaId: c2_preg1.id, texto: 'Opción A: Cambiar el nombre de las tablas de la base de datos de manera constante.', esCorrecta: false },
      { preguntaId: c2_preg1.id, texto: 'Opción B: Utilizar consultas parametrizadas (Prepared Statements) en todo el código.', esCorrecta: true },
      { preguntaId: c2_preg1.id, texto: 'Opción C: Encriptar todos los datos recibidos mediante hashing reversible MD5.', esCorrecta: false },
    ],
  });

  // Pregunta 2
  const c2_preg2 = await prisma.pregunta.create({
    data: {
      leccionId: quiz2.id,
      texto: '¿Qué significa el término XSS en seguridad web?',
      orden: 2,
    },
  });
  await prisma.opcion.createMany({
    data: [
      { preguntaId: c2_preg2.id, texto: 'Opción A: Extra Secret Style: inyectar hojas de estilo para alterar el diseño.', esCorrecta: false },
      { preguntaId: c2_preg2.id, texto: 'Opción B: Cross-Site Scripting: inyectar código malicioso (usualmente JavaScript) en páginas vistas por otros usuarios.', esCorrecta: true },
      { preguntaId: c2_preg2.id, texto: 'Opción C: XML System Server: un error de comunicación interna de archivos XML de servidor.', esCorrecta: false },
    ],
  });

  console.log('✅ ¡Cursos de prueba con respuestas en B creados y publicados exitosamente!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

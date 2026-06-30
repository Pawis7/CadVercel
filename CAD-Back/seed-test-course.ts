import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Iniciando creación del curso de prueba...');

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

  // 2. Crear curso
  const curso = await prisma.curso.create({
    data: {
      nombre: 'Curso de Prueba: Innovación y Liderazgo Digital',
      descripcion: 'Curso introductorio creado automáticamente para probar la visualización modular (videos, lecturas, descargas) y cuestionarios proporcionales donde todas las respuestas correctas son la opción A.',
      portada: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=1200&auto=format&fit=crop',
      etiquetas: ['innovación', 'liderazgo', 'prueba'],
      nivel: 'PRINCIPIANTE',
      estado: 'PUBLICADO',
      duracionEstimada: 45,
      autorId: admin.id,
    },
  });

  console.log(`📚 Curso creado con ID: ${curso.id}`);

  // 3. Crear Módulo 1
  const modulo1 = await prisma.modulo.create({
    data: {
      cursoId: curso.id,
      titulo: 'Fundamentos de la Transformación Digital',
      descripcion: 'Conceptos básicos, videos introductorios y material de lectura.',
      orden: 1,
    },
  });

  await prisma.leccion.create({
    data: {
      moduloId: modulo1.id,
      titulo: 'Bienvenida y Visión General',
      tipo: 'VIDEO',
      orden: 1,
      esObligatoria: true,
      recursoUrl: 'https://www.youtube.com/watch?v=L_LUpnjgPso',
      duracionSeg: 300,
    },
  });

  await prisma.leccion.create({
    data: {
      moduloId: modulo1.id,
      titulo: 'Lectura: Pilares del Liderazgo Digital',
      tipo: 'LECTURA',
      orden: 2,
      esObligatoria: true,
      contenidoHtml: `
        <h3>Los 3 Pilares Fundamentales</h3>
        <p>El liderazgo en la era digital no se trata solo de herramientas o software, sino de la mentalidad con la que guiamos a nuestros equipos hacia el cambio constante.</p>
        <ul>
          <li><strong>Cultura de Innovación:</strong> Fomentar la experimentación sin miedo al fallo calculado.</li>
          <li><strong>Decisiones basadas en datos:</strong> Utilizar métricas reales para evaluar el impacto.</li>
          <li><strong>Empatía Digital:</strong> Comprender las necesidades humanas detrás de cada pantalla.</li>
        </ul>
        <p>Asegúrate de revisar el documento de apoyo adjunto en la siguiente lección antes de presentar tu evaluación final.</p>
      `,
    },
  });

  await prisma.leccion.create({
    data: {
      moduloId: modulo1.id,
      titulo: 'Archivo Complementario: Guía Rápida de Trabajo',
      tipo: 'ARCHIVO',
      orden: 3,
      esObligatoria: true,
      recursoUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
      nombreArchivo: 'guia_rapida_liderazgo.pdf',
      tipoMime: 'application/pdf',
    },
  });

  // 4. Crear Módulo 2 con Cuestionario
  const modulo2 = await prisma.modulo.create({
    data: {
      cursoId: curso.id,
      titulo: 'Evaluación Oficial de Conocimientos',
      descripcion: 'Demuestra lo aprendido. Nota: Todas las respuestas correctas son la opción A.',
      orden: 2,
    },
  });

  const leccionQuiz = await prisma.leccion.create({
    data: {
      moduloId: modulo2.id,
      titulo: 'Cuestionario de Evaluación',
      tipo: 'CUESTIONARIO',
      orden: 1,
      esObligatoria: true,
      calificacionMinima: 60,
    },
  });

  // Pregunta 1
  const preg1 = await prisma.pregunta.create({
    data: {
      leccionId: leccionQuiz.id,
      texto: '¿Cuál es el pilar principal de la transformación digital sostenible?',
      orden: 1,
    },
  });
  await prisma.opcion.createMany({
    data: [
      { preguntaId: preg1.id, texto: 'Opción A: La adopción tecnológica centrada en las personas y la evolución cultural.', esCorrecta: true },
      { preguntaId: preg1.id, texto: 'Opción B: Comprar los servidores y computadoras más costosos del mercado.', esCorrecta: false },
      { preguntaId: preg1.id, texto: 'Opción C: Eliminar el uso de internet y comunicación en las oficinas locales.', esCorrecta: false },
      { preguntaId: preg1.id, texto: 'Opción D: Todas las anteriores.', esCorrecta: false },
    ],
  });

  // Pregunta 2
  const preg2 = await prisma.pregunta.create({
    data: {
      leccionId: leccionQuiz.id,
      texto: '¿Qué metodología favorece el aprendizaje continuo dentro de una organización?',
      orden: 2,
    },
  });
  await prisma.opcion.createMany({
    data: [
      { preguntaId: preg2.id, texto: 'Opción A: Aprendizaje ágil dividido en módulos iterativos y prácticos.', esCorrecta: true },
      { preguntaId: preg2.id, texto: 'Opción B: Esperar a que las herramientas de software se vuelvan completamente obsoletas.', esCorrecta: false },
      { preguntaId: preg2.id, texto: 'Opción C: Memorizar manuales extensos de 500 páginas sin aplicación real.', esCorrecta: false },
      { preguntaId: preg2.id, texto: 'Opción D: Ninguna de las opciones.', esCorrecta: false },
    ],
  });

  // Pregunta 3
  const preg3 = await prisma.pregunta.create({
    data: {
      leccionId: leccionQuiz.id,
      texto: '¿Cómo se debe medir el éxito de una nueva estrategia digital?',
      orden: 3,
    },
  });
  await prisma.opcion.createMany({
    data: [
      { preguntaId: preg3.id, texto: 'Opción A: Evaluando métricas reales de impacto y adopción por parte del usuario.', esCorrecta: true },
      { preguntaId: preg3.id, texto: 'Opción B: Contando el número de correos electrónicos enviados por la dirección.', esCorrecta: false },
      { preguntaId: preg3.id, texto: 'Opción C: Asumiendo que todo funciona bien sin realizar encuestas ni pruebas.', esCorrecta: false },
      { preguntaId: preg3.id, texto: 'Opción D: Ninguna de las anteriores.', esCorrecta: false },
    ],
  });

  console.log('✅ ¡Curso de prueba creado y publicado exitosamente con 3 preguntas donde la respuesta correcta es la A!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

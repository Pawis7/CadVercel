/**
 * mock-data.ts
 * ─────────────────────────────────────────────────────────────────────────────
 * Datos estáticos para el modo MOCK (demo sin backend).
 * Usado cuando environment.mock === true.
 * ─────────────────────────────────────────────────────────────────────────────
 */

import { User } from '../services/auth';
import { CursoApi } from '../services/cursos';

// ─────────────────────────────────────────────────────────────────────────────
// USUARIO DEMO
// ─────────────────────────────────────────────────────────────────────────────
export const MOCK_USER: User = {
  id: 'mock-user-001',
  firstName: 'Ana',
  lastName: 'García',
  email: 'demo@alfadigital.edu.mx',
  role: 'USER',
  createdAt: '2025-01-15T10:00:00.000Z',
  updatedAt: '2026-07-01T08:00:00.000Z',
};

// ─────────────────────────────────────────────────────────────────────────────
// CURSOS (catálogo — página de inicio y /cursos)
// Thumbnails via YouTube (hqdefault) o Unsplash
// ─────────────────────────────────────────────────────────────────────────────
export const MOCK_CURSOS: CursoApi[] = [
  {
    id: 'mock-curso-001',
    nombre: 'Inteligencia Artificial Práctica para la Educación y Trabajo',
    descripcion:
      'Descubre cómo utilizar herramientas de IA generativa para optimizar tus tareas diarias, crear contenido pedagógico y aumentar tu productividad sin conocimientos técnicos previos.',
    portada: null,
    // Video de YouTube: "ChatGPT: Guía COMPLETA para PRINCIPIANTES" (MoureDev en Español)
    etiquetas: ['IA', 'educación', 'tecnología', 'productividad'],
    nivel: 'PRINCIPIANTE',
    estado: 'PUBLICADO',
    duracionEstimada: 60,
    autor: { firstName: 'Carlos', lastName: 'Mendoza' },
    _count: { modulos: 2, inscritos: 1284 },
    inscripciones: [],
  },
  {
    id: 'mock-curso-002',
    nombre: 'Excel desde Cero para Administración Pública',
    descripcion:
      'Aprende a manejar hojas de cálculo, tablas dinámicas y fórmulas esenciales para tu trabajo administrativo. Sin conocimientos previos necesarios.',
    portada: null,
    etiquetas: ['Excel', 'administración', 'ofimática'],
    nivel: 'PRINCIPIANTE',
    estado: 'PUBLICADO',
    duracionEstimada: 120,
    autor: { firstName: 'Laura', lastName: 'Ramírez' },
    _count: { modulos: 4, inscritos: 2340 },
    inscripciones: [],
  },
  {
    id: 'mock-curso-003',
    nombre: 'Programación con Python — Nivel Básico',
    descripcion:
      'Inicia tu camino en la programación con Python. Aprenderás variables, ciclos, funciones y tu primer programa funcional desde cero.',
    portada: null,
    etiquetas: ['Python', 'programación', 'tecnología'],
    nivel: 'PRINCIPIANTE',
    estado: 'PUBLICADO',
    duracionEstimada: 180,
    autor: { firstName: 'Diego', lastName: 'Torres' },
    _count: { modulos: 5, inscritos: 987 },
    inscripciones: [],
  },
  {
    id: 'mock-curso-004',
    nombre: 'Marketing Digital para Negocios Locales',
    descripcion:
      'Estrategias prácticas de marketing en redes sociales, Google y WhatsApp Business para hacer crecer tu negocio o emprendimiento.',
    portada: null,
    etiquetas: ['marketing', 'redes sociales', 'negocios', 'digital'],
    nivel: 'INTERMEDIO',
    estado: 'PUBLICADO',
    duracionEstimada: 150,
    autor: { firstName: 'Sofía', lastName: 'Vega' },
    _count: { modulos: 4, inscritos: 1650 },
    inscripciones: [],
  },
  {
    id: 'mock-curso-005',
    nombre: 'Diseño Gráfico con Canva — Crea sin ser diseñador',
    descripcion:
      'Crea presentaciones, carteles, posts y materiales profesionales con Canva. Aprende los principios básicos del diseño visual de forma práctica.',
    portada: null,
    etiquetas: ['diseño', 'Canva', 'creatividad', 'redes sociales'],
    nivel: 'PRINCIPIANTE',
    estado: 'PUBLICADO',
    duracionEstimada: 90,
    autor: { firstName: 'Mariana', lastName: 'Flores' },
    _count: { modulos: 3, inscritos: 3120 },
    inscripciones: [],
  },
  {
    id: 'mock-curso-006',
    nombre: 'Seguridad en Internet y Protección de Datos Personales',
    descripcion:
      'Aprende a proteger tu información en línea, identificar fraudes y phishing, y configurar la privacidad en tus redes sociales y dispositivos.',
    portada: null,
    etiquetas: ['seguridad', 'privacidad', 'internet', 'ciberseguridad'],
    nivel: 'PRINCIPIANTE',
    estado: 'PUBLICADO',
    duracionEstimada: 60,
    autor: { firstName: 'Roberto', lastName: 'Gutiérrez' },
    _count: { modulos: 2, inscritos: 890 },
    inscripciones: [],
  },
  {
    id: 'mock-curso-007',
    nombre: 'Emprendimiento Digital — De la Idea al Negocio en Línea',
    descripcion:
      'Convierte tu idea en un negocio digital. Aprenderás validación de mercado, creación de tienda en línea, logística básica y primeras ventas.',
    portada: null,
    etiquetas: ['emprendimiento', 'ecommerce', 'negocios', 'digital'],
    nivel: 'INTERMEDIO',
    estado: 'PUBLICADO',
    duracionEstimada: 120,
    autor: { firstName: 'Carmen', lastName: 'Ortega' },
    _count: { modulos: 4, inscritos: 1420 },
    inscripciones: [],
  },
  {
    id: 'mock-curso-008',
    nombre: 'Ciudadanía Digital y Derechos en Internet',
    descripcion:
      'Conoce tus derechos y obligaciones en el entorno digital, el uso ético de las tecnologías y cómo participar activamente como ciudadano digital.',
    portada: null,
    etiquetas: ['ciudadanía digital', 'derechos', 'ética', 'internet'],
    nivel: 'PRINCIPIANTE',
    estado: 'PUBLICADO',
    duracionEstimada: 60,
    autor: { firstName: 'Ana', lastName: 'Pérez' },
    _count: { modulos: 2, inscritos: 540 },
    inscripciones: [],
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// VIDEO INTRO POR CURSO (videoIntro — YouTube IDs para thumbnails reales)
// ─────────────────────────────────────────────────────────────────────────────
export const MOCK_VIDEO_INTROS: Record<string, string> = {
  'mock-curso-001': 'https://www.youtube.com/watch?v=G2fqAlgmoPo', // IA generativa
  'mock-curso-002': 'https://www.youtube.com/watch?v=Vl0H-qTclOg', // Excel básico
  'mock-curso-003': 'https://www.youtube.com/watch?v=nKPbfIU442Y', // Python básico
  'mock-curso-004': 'https://www.youtube.com/watch?v=F3G1sG2VQDI', // Marketing digital
  'mock-curso-005': 'https://www.youtube.com/watch?v=X89Iq4r2xQA', // Canva diseño
  'mock-curso-006': 'https://www.youtube.com/watch?v=gqyPBzHj_8A', // Seguridad internet
  'mock-curso-007': 'https://www.youtube.com/watch?v=YpBpCiGJnAU', // Emprendimiento digital
  'mock-curso-008': 'https://www.youtube.com/watch?v=xRoYQkL2-74', // Ciudadanía digital
};

// ─────────────────────────────────────────────────────────────────────────────
// DETALLE COMPLETO — Curso 001 (para navegación a /cursos/:id)
// ─────────────────────────────────────────────────────────────────────────────
export const MOCK_CURSO_DETALLE: Record<string, any> = {
  'mock-curso-001': {
    id: 'mock-curso-001',
    nombre: 'Inteligencia Artificial Práctica para la Educación y Trabajo',
    descripcion:
      'Descubre cómo utilizar herramientas de IA generativa para optimizar tus tareas diarias, crear contenido pedagógico y aumentar tu productividad sin conocimientos técnicos previos.',
    portada: null,
    videoIntro: 'https://www.youtube.com/watch?v=G2fqAlgmoPo',
    etiquetas: ['IA', 'educación', 'tecnología', 'productividad'],
    nivel: 'PRINCIPIANTE',
    estado: 'PUBLICADO',
    duracionEstimada: 60,
    autor: { firstName: 'Carlos', lastName: 'Mendoza' },
    _count: { modulos: 2, inscritos: 1284 },
    // La usuaria ya está inscrita
    miInscripcion: {
      id: 'mock-insc-001',
      porcentaje: 40,
      completado: false,
      fechaInicio: '2026-07-10T10:00:00.000Z',
    },
    modulos: [
      {
        id: 'mock-mod-001',
        titulo: 'Módulo 1 — Introducción a la IA Generativa',
        descripcion: 'Conceptos clave sobre IA generativa, prompts y casos de uso cotidianos.',
        orden: 1,
        lecciones: [
          {
            id: 'mock-lec-001',
            titulo: '¿Qué es la Inteligencia Artificial Generativa?',
            tipo: 'VIDEO',
            orden: 1,
            esObligatoria: true,
            recursoUrl: 'https://www.youtube.com/watch?v=G2fqAlgmoPo',
            duracionSeg: 420,
          },
          {
            id: 'mock-lec-002',
            titulo: 'Guía: Buenas Prácticas al Diseñar Prompts',
            tipo: 'LECTURA',
            orden: 2,
            esObligatoria: true,
            contenidoHtml: `
              <h3>El Arte del Prompt Engineering</h3>
              <p>Para obtener los mejores resultados de una IA, la claridad de las instrucciones es crucial. Un buen prompt es como darle instrucciones precisas a un colaborador experto.</p>
              <h4>Principios fundamentales:</h4>
              <ul>
                <li><strong>Define el rol:</strong> Pídele a la IA que actúe como experto en el tema. Ejemplo: "Actúa como un maestro de primaria con 10 años de experiencia..."</li>
                <li><strong>Sé específico:</strong> Proporciona contexto, tono y formato deseado. Evita instrucciones ambiguas.</li>
                <li><strong>Itera sin miedo:</strong> Ajusta tu prompt si la primera respuesta no es exacta. La IA aprende del contexto de la conversación.</li>
                <li><strong>Usa ejemplos:</strong> Muéstrale a la IA el tipo de respuesta que esperas con un ejemplo concreto.</li>
              </ul>
              <h4>Ejemplo de prompt efectivo:</h4>
              <blockquote>"Eres un experto en comunicación para gobierno. Redacta un comunicado breve (máximo 3 párrafos) dirigido a ciudadanos adultos mayores explicando cómo registrarse en la plataforma digital de trámites. Usa lenguaje simple y amigable."</blockquote>
              <p>Con práctica, diseñar buenos prompts se convierte en una habilidad natural que mejora tu productividad significativamente.</p>
            `,
          },
          {
            id: 'mock-lec-003',
            titulo: 'Video: Herramientas de IA que debes conocer en 2025',
            tipo: 'VIDEO',
            orden: 3,
            esObligatoria: true,
            recursoUrl: 'https://www.youtube.com/watch?v=JMC-HdKGkl0',
            duracionSeg: 660,
          },
        ],
      },
      {
        id: 'mock-mod-002',
        titulo: 'Módulo 2 — Evaluación Final',
        descripcion: 'Demuestra tu comprensión de los conceptos fundamentales de IA.',
        orden: 2,
        lecciones: [
          {
            id: 'mock-lec-004',
            titulo: 'Lectura: Casos de Uso de IA en el Sector Público',
            tipo: 'LECTURA',
            orden: 1,
            esObligatoria: true,
            contenidoHtml: `
              <h3>IA en el Sector Público — Casos Reales</h3>
              <p>La Inteligencia Artificial ya está transformando la manera en que los gobiernos prestan servicios a la ciudadanía:</p>
              <h4>Atención Ciudadana:</h4>
              <ul>
                <li><strong>Chatbots de servicio:</strong> Responden preguntas frecuentes 24/7 sobre trámites, pagos y servicios.</li>
                <li><strong>Procesamiento de solicitudes:</strong> Clasifican y priorizan peticiones ciudadanas automáticamente.</li>
              </ul>
              <h4>Educación:</h4>
              <ul>
                <li><strong>Personalización del aprendizaje:</strong> Adaptan el contenido al ritmo y estilo de cada estudiante.</li>
                <li><strong>Generación de materiales:</strong> Crean ejercicios, resúmenes y evaluaciones personalizadas.</li>
              </ul>
              <h4>Administración:</h4>
              <ul>
                <li><strong>Análisis de datos:</strong> Identifican patrones para mejorar la toma de decisiones.</li>
                <li><strong>Automatización de reportes:</strong> Generan informes periódicos sin intervención humana.</li>
              </ul>
            `,
          },
          {
            id: 'mock-lec-005',
            titulo: 'Cuestionario Final — Módulo de IA',
            tipo: 'CUESTIONARIO',
            orden: 2,
            esObligatoria: true,
            calificacionMinima: 60,
            preguntas: [
              {
                id: 'mock-preg-001',
                texto: '¿Cuál es la regla más importante para redactar un prompt efectivo para IA generativa?',
                orden: 1,
                opciones: [
                  {
                    id: 'mock-opc-001a',
                    texto: 'Ser claro, específico, dar contexto y definir el rol que la IA debe adoptar.',
                    esCorrecta: true,
                  },
                  {
                    id: 'mock-opc-001b',
                    texto: 'Escribir solo palabras clave sin ningún contexto adicional.',
                    esCorrecta: false,
                  },
                  {
                    id: 'mock-opc-001c',
                    texto: 'Hacer las preguntas lo más largas y complejas posible.',
                    esCorrecta: false,
                  },
                  {
                    id: 'mock-opc-001d',
                    texto: 'Usar términos técnicos aunque no se entiendan para impresionar a la IA.',
                    esCorrecta: false,
                  },
                ],
              },
              {
                id: 'mock-preg-002',
                texto: '¿Qué significa IA "generativa"?',
                orden: 2,
                opciones: [
                  {
                    id: 'mock-opc-002a',
                    texto: 'Una IA capaz de crear contenido nuevo (texto, imágenes, código) a partir de instrucciones.',
                    esCorrecta: true,
                  },
                  {
                    id: 'mock-opc-002b',
                    texto: 'Una IA que únicamente clasifica información existente sin crear nada nuevo.',
                    esCorrecta: false,
                  },
                  {
                    id: 'mock-opc-002c',
                    texto: 'Un robot físico que realiza tareas domésticas.',
                    esCorrecta: false,
                  },
                  {
                    id: 'mock-opc-002d',
                    texto: 'Un sistema que solo funciona con conexión a bases de datos privadas.',
                    esCorrecta: false,
                  },
                ],
              },
              {
                id: 'mock-preg-003',
                texto: '¿Cuál de los siguientes es un ejemplo de IA en el sector público?',
                orden: 3,
                opciones: [
                  {
                    id: 'mock-opc-003a',
                    texto: 'Un chatbot que responde preguntas ciudadanas sobre trámites las 24 horas.',
                    esCorrecta: true,
                  },
                  {
                    id: 'mock-opc-003b',
                    texto: 'Un semáforo con temporizador tradicional.',
                    esCorrecta: false,
                  },
                  {
                    id: 'mock-opc-003c',
                    texto: 'Una impresora de documentos oficiales.',
                    esCorrecta: false,
                  },
                  {
                    id: 'mock-opc-003d',
                    texto: 'Un sistema de archivos físicos en papel.',
                    esCorrecta: false,
                  },
                ],
              },
            ],
          },
        ],
      },
    ],
    // Progreso simulado: primeras 2 lecciones completadas
    miProgreso: [
      {
        leccionId: 'mock-lec-001',
        completada: true,
        calificacion: null,
        tiempoVisto: 420,
      },
      {
        leccionId: 'mock-lec-002',
        completada: true,
        calificacion: null,
        tiempoVisto: null,
      },
    ],
  },
};

// Detalle genérico para cursos sin detalle específico definido
export function getMockCursoDetalle(id: string): any {
  // Si tiene detalle específico, devolverlo
  if (MOCK_CURSO_DETALLE[id]) {
    return MOCK_CURSO_DETALLE[id];
  }

  // Buscar el curso en el catálogo
  const cursoBase = MOCK_CURSOS.find((c) => c.id === id);
  if (!cursoBase) return null;

  const videoIntro = MOCK_VIDEO_INTROS[id] ?? null;

  // Generar un detalle genérico con un módulo y 2 lecciones
  return {
    ...cursoBase,
    videoIntro,
    miInscripcion: null,
    miProgreso: [],
    modulos: [
      {
        id: `${id}-mod-001`,
        titulo: 'Módulo 1 — Introducción',
        descripcion: 'Contenido introductorio del curso.',
        orden: 1,
        lecciones: [
          {
            id: `${id}-lec-001`,
            titulo: 'Bienvenida al curso',
            tipo: 'VIDEO',
            orden: 1,
            esObligatoria: true,
            recursoUrl: videoIntro,
            duracionSeg: 480,
          },
          {
            id: `${id}-lec-002`,
            titulo: 'Conceptos fundamentales',
            tipo: 'LECTURA',
            orden: 2,
            esObligatoria: true,
            contenidoHtml: `
              <h3>Bienvenido a ${cursoBase.nombre}</h3>
              <p>${cursoBase.descripcion}</p>
              <p>En este curso aprenderás paso a paso todo lo necesario para dominar este tema. El contenido está diseñado para ser accesible y práctico, con ejemplos reales aplicables a tu vida laboral y personal.</p>
              <h4>¿Qué aprenderás?</h4>
              <ul>
                ${(cursoBase.etiquetas || []).map((e: string) => `<li>${e}</li>`).join('')}
              </ul>
            `,
          },
        ],
      },
    ],
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// HELPERS — Respuestas simuladas para acciones del usuario
// ─────────────────────────────────────────────────────────────────────────────

/** Simula la respuesta de inscribirse a un curso */
export function mockInscripcionResponse(cursoId: string) {
  return {
    inscripcion: {
      id: `mock-insc-${cursoId}`,
      porcentaje: 0,
      completado: false,
      fechaInicio: new Date().toISOString(),
    },
    progreso: [],
  };
}

/** Simula la respuesta de registrar progreso en una lección */
export function mockProgresoResponse(cursoId: string, leccionId: string, cursoDetalle: any) {
  const progresoActual = cursoDetalle?.miProgreso ?? [];
  const nuevoProgreso = [
    ...progresoActual.filter((p: any) => p.leccionId !== leccionId),
    { leccionId, completada: true, calificacion: null, tiempoVisto: 300 },
  ];

  // Calcular porcentaje
  const totalLecciones = (cursoDetalle?.modulos ?? []).reduce(
    (acc: number, m: any) => acc + (m.lecciones?.length ?? 0),
    0
  );
  const completadas = nuevoProgreso.filter((p: any) => p.completada).length;
  const porcentaje = totalLecciones > 0 ? Math.round((completadas / totalLecciones) * 100) : 0;

  return {
    inscripcion: {
      ...(cursoDetalle?.miInscripcion ?? { id: `mock-insc-${cursoId}`, fechaInicio: new Date().toISOString() }),
      porcentaje,
      completado: porcentaje >= 100,
    },
    progreso: nuevoProgreso,
  };
}

/** Simula la evaluación de un cuestionario — califica en el front para el mock */
export function mockEvaluarCuestionario(
  leccion: any,
  respuestas: { preguntaId: string; opcionId: string }[],
  cursoDetalle: any,
  leccionId: string
) {
  if (!leccion || !leccion.preguntas) {
    return { calificacion: 0, aprobado: false, correctas: 0, total: 0, calificacionMinima: 60, inscripcion: null, progreso: [] };
  }

  const preguntas = leccion.preguntas;
  let correctas = 0;

  for (const resp of respuestas) {
    const pregunta = preguntas.find((p: any) => p.id === resp.preguntaId);
    if (pregunta) {
      const opcion = pregunta.opciones.find((o: any) => o.id === resp.opcionId);
      if (opcion?.esCorrecta) correctas++;
    }
  }

  const total = preguntas.length;
  const calificacion = total > 0 ? Math.round((correctas / total) * 100) : 0;
  const calificacionMinima = leccion.calificacionMinima ?? 60;
  const aprobado = calificacion >= calificacionMinima;

  const progresoActual = cursoDetalle?.miProgreso ?? [];
  const nuevoProgreso = [
    ...progresoActual.filter((p: any) => p.leccionId !== leccionId),
    { leccionId, completada: aprobado, calificacion, tiempoVisto: null },
  ];

  const totalLecciones = (cursoDetalle?.modulos ?? []).reduce(
    (acc: number, m: any) => acc + (m.lecciones?.length ?? 0),
    0
  );
  const completadas = nuevoProgreso.filter((p: any) => p.completada).length;
  const porcentaje = totalLecciones > 0 ? Math.round((completadas / totalLecciones) * 100) : 0;

  return {
    calificacion,
    aprobado,
    correctas,
    total,
    calificacionMinima,
    inscripcion: {
      ...(cursoDetalle?.miInscripcion ?? { id: `mock-insc-${cursoDetalle?.id ?? 'x'}`, fechaInicio: new Date().toISOString() }),
      porcentaje,
      completado: porcentaje >= 100,
    },
    progreso: nuevoProgreso,
  };
}

/**
 * Placeholders iniciales para Cursos, Juegos y Notebooks IA.
 * Hasta que el equipo SEP cargue contenido real desde el panel admin
 * (o se conecte el backend), estos seedean las páginas para que se
 * vean con contenido convincente desde el día 1.
 */
import { AINotebook, Course, Game } from '../models/special-sections.models';

export const COURSES: Course[] = [
  {
    id: 'c1',
    slug: 'fundamentos-ciudadania-digital',
    title: 'Fundamentos de Cursos Alfa Digital',
    shortDescription:
      'Curso introductorio sobre seguridad, privacidad y convivencia en internet — para todas las edades.',
    longDescription:
      'Un recorrido de 4 unidades por los fundamentos de moverse en internet con criterio: qué cuidar de tu identidad, cómo reconocer engaños, qué significa convivir en redes y cómo participar de manera positiva. Diseñado para llevarse en clase, en casa o autodidacta.',
    audience: 'cdj',
    level: 'basico',
    durationHours: 8,
    instructor: 'Equipo Pedagógico SEP Jalisco',
    syllabus: [
      { unit: 'U1 · Identidad y privacidad',     lessons: [
        { title: 'Qué es tu huella digital',           durationMin: 12 },
        { title: 'Configurar tus cuentas con cabeza',  durationMin: 18 },
        { title: 'Contraseñas que sí protegen',        durationMin: 9 },
      ]},
      { unit: 'U2 · Riesgos en línea',           lessons: [
        { title: 'Reconocer un fraude por mensaje',    durationMin: 15 },
        { title: 'Qué es el grooming y cómo evitarlo', durationMin: 12 },
        { title: 'Compartir o no compartir',           durationMin: 8 },
      ]},
      { unit: 'U3 · Convivencia digital',         lessons: [
        { title: 'Cómo lidiar con el conflicto online', durationMin: 14 },
        { title: 'Reportar en lugar de pelear',        durationMin: 10 },
      ]},
      { unit: 'U4 · Pensamiento crítico',         lessons: [
        { title: 'Verificar antes de compartir',       durationMin: 16 },
        { title: 'Sesgos algorítmicos',                durationMin: 18 },
      ]},
    ],
    materials: [
      { label: 'Guía del docente (PDF)',         url: '#', type: 'pdf' },
      { label: 'Cuaderno de actividades (PDF)',  url: '#', type: 'pdf' },
      { label: 'Presentación para sesión',       url: '#', type: 'pdf' },
    ],
    tags: ['seguridad', 'privacidad', 'criterio'],
    coverImageUrl: '/assets/img/curso-fundamentos.svg',
    certificate: true,
    language: 'es',
  },
  {
    id: 'c2',
    slug: 'taller-redes-secundaria',
    title: 'Taller de redes para secundaria',
    shortDescription:
      'Sesiones cortas para llevar al aula sobre vida en redes sociales: privacidad, convivencia y bienestar digital.',
    longDescription:
      'Diseñado para docentes de secundaria. Cada sesión incluye apertura, dinámica grupal, cierre reflexivo y materiales descargables.',
    audience: 'teachers',
    level: 'intermedio',
    durationHours: 6,
    instructor: 'Carolina R. · Docente invitada',
    syllabus: [
      { unit: 'Sesión 1 · Mi identidad en redes',  lessons: [{ title: 'Dinámica + reflexión', durationMin: 50 }]},
      { unit: 'Sesión 2 · Convivencia',             lessons: [{ title: 'Caso real + protocolo', durationMin: 50 }]},
      { unit: 'Sesión 3 · Bienestar y pantallas',  lessons: [{ title: 'Cierre + acuerdos', durationMin: 50 }]},
    ],
    materials: [
      { label: 'Planeación 3 sesiones (PDF)', url: '#', type: 'pdf' },
      { label: 'Carteles imprimibles',        url: '#', type: 'pdf' },
    ],
    tags: ['secundaria', 'redes', 'aula'],
    coverImageUrl: '/assets/img/curso-redes-sec.svg',
    certificate: true,
    language: 'es',
  },
  {
    id: 'c3',
    slug: 'alfabetizacion-mediatica-familias',
    title: 'Alfabetización mediática para familias',
    shortDescription:
      'Curso corto para mamás, papás y cuidadores: cómo acompañar la vida en línea de hijas e hijos.',
    audience: 'families',
    level: 'basico',
    durationHours: 4,
    instructor: 'Equipo Pedagógico SEP Jalisco',
    syllabus: [
      { unit: 'U1 · Pantallas en casa',  lessons: [{ title: 'Acuerdos sin pelear', durationMin: 25 }]},
      { unit: 'U2 · Riesgos por edad',   lessons: [{ title: 'Qué cuidar a cada edad', durationMin: 25 }]},
    ],
    materials: [
      { label: 'Guía de conversación',         url: '#', type: 'pdf' },
      { label: 'Tarjetas de acuerdos',         url: '#', type: 'pdf' },
    ],
    tags: ['familias', 'pantallas', 'acuerdos'],
    coverImageUrl: '/assets/img/curso-familias.svg',
    certificate: false,
    language: 'es',
  },
];

export const GAMES: Game[] = [
  {
    id: 'g1',
    slug: 'detective-de-fraudes',
    title: 'Detective de fraudes',
    description:
      'Identifica mensajes sospechosos antes de caer en la trampa. Cada nivel sube la dificultad y agrega nuevas señales para reconocer.',
    audience: 'kids',
    ageMin: 8, ageMax: 12,
    kind: 'quiz',
    externalUrl: 'https://example.com/games/detective',
    coverImageUrl: '/assets/img/juego-detective.svg',
    badges: ['Sin descarga', 'Multinivel', '5 min'],
    learningGoals: ['Reconocer phishing', 'Verificar antes de hacer click'],
    durationMinutes: 5,
    difficulty: 2,
  },
  {
    id: 'g2',
    slug: 'huella-digital-3d',
    title: 'Huella digital · simulador',
    description:
      'Toma decisiones en una semana de vida online y descubre qué huella vas dejando. ¿Quién te puede encontrar? ¿Qué sabe de ti?',
    audience: 'teens',
    ageMin: 12, ageMax: 17,
    kind: 'simulator',
    externalUrl: 'https://example.com/games/huella',
    coverImageUrl: '/assets/img/juego-huella.svg',
    badges: ['Decisiones reales', 'Resultado personal'],
    learningGoals: ['Entender el rastro digital', 'Pensar antes de publicar'],
    durationMinutes: 10,
    difficulty: 3,
  },
  {
    id: 'g3',
    slug: 'reto-familia-digital',
    title: 'Reto familia digital',
    description:
      'Juego de cartas familiar: situaciones cotidianas con pantallas y la familia decide juntos cómo responder. Genera buena conversación.',
    audience: 'families',
    ageMin: 6, ageMax: 99,
    kind: 'card_game',
    externalUrl: 'https://example.com/games/familia',
    coverImageUrl: '/assets/img/juego-familia.svg',
    badges: ['Para imprimir', 'Sin pantallas'],
    learningGoals: ['Conversar sin discutir', 'Acordar reglas claras'],
    durationMinutes: 25,
    difficulty: 1,
  },
];

export const NOTEBOOKS_IA: AINotebook[] = [
  {
    id: 'n1',
    slug: 'tutor-ciudadania-digital',
    title: 'Tutor de Cursos Alfa Digital',
    description:
      'Notebook entrenado con todos los recursos del portal. Pregúntale lo que quieras: qué hacer ante un caso, cómo explicar un tema en clase, dónde acudir. Responde en español, citando los recursos del sitio.',
    audience: 'cdj',
    kind: 'notebooklm',
    externalUrl: 'https://notebooklm.google.com/notebook/example',
    topics: ['todos los temas', 'asistencia general'],
    instructions:
      'Pregunta libremente. Funciona mejor si describes tu rol (docente, familia, joven) y la situación concreta.',
    coverImageUrl: '/assets/img/notebook-tutor.svg',
    language: 'es',
    featured: true,
  },
  {
    id: 'n2',
    slug: 'asesor-docente-aula',
    title: 'Asesor docente para el aula',
    description:
      'Gem de Gemini que ayuda a docentes a planear sesiones, generar dinámicas y adaptar materiales del portal a su nivel y grupo.',
    audience: 'teachers',
    kind: 'gemini_gem',
    externalUrl: 'https://gemini.google.com/gem/example',
    topics: ['planeación', 'dinámicas', 'evaluación'],
    instructions:
      'Empieza describiendo el grupo (nivel, número de alumnos, tiempo disponible) y el tema que quieres abordar.',
    coverImageUrl: '/assets/img/notebook-docente.svg',
    language: 'es',
    featured: false,
  },
  {
    id: 'n3',
    slug: 'qa-familias-pantallas',
    title: 'Q&A familias y pantallas',
    description:
      'Notebook con guías oficiales de la SEP, expertos en infancia y especialistas en bienestar digital. Resuelve dudas concretas sobre acuerdos, edades y riesgos.',
    audience: 'families',
    kind: 'notebooklm',
    externalUrl: 'https://notebooklm.google.com/notebook/example2',
    topics: ['pantallas en casa', 'edades', 'acuerdos'],
    instructions:
      'Pregunta como si hablaras con un asesor: "Mi hija de 10 años quiere TikTok, ¿qué hacemos?".',
    coverImageUrl: '/assets/img/notebook-familias.svg',
    language: 'es',
    featured: false,
  },
];

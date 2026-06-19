/**
 * Seed inicial — replica el contenido actual de site-content.ts del front.
 * Idempotente vía `upsert`. Se ejecuta con:  yarn db:seed
 */
import { PrismaClient } from '@prisma/client';
import { hashPassword } from '../src/lib/crypto';

const prisma = new PrismaClient();

async function main() {
  console.log('▶ Seeding Cursos Alfa Digital…');

  await prisma.siteBranding.upsert({
    where: { id: 1 },
    create: {
      id: 1,
      siteName: 'Cursos Alfa Digital',
      tagline:
        'Promovemos el uso ético y responsable de la tecnología a través de cursos digitales de calidad.',
      logoLine1: 'Cursos Alfa',
      logoLine2: 'Digital',
    },
    update: {},
  });

  await prisma.heroBlock.upsert({
    where: { id: 1 },
    create: {
      id: 1,
      eyebrow: 'Portal público de aprendizaje · Jalisco',
      titleLead: 'Hola, bienvenidas y bienvenidos a',
      titleHighlight: 'Cursos Alfa Digital',
      description:
        'Aprendemos, convivimos y participamos en entornos digitales de forma segura, responsable y respetuosa. Para niñas, niños, adolescentes, familias y docentes.',
      primaryCtaLabel: 'Explorar contenidos',
      primaryCtaHref: '#contenidos',
      secondaryCtaLabel: 'Entrar por perfil',
      secondaryCtaHref: '#perfiles',
      imageUrl: '/assets/img/hero-main.svg',
      imageAlt: 'Comunidad aprendiendo en entornos digitales',
    },
    update: {},
  });

  // === Pillars ===
  for (const p of [
    { id: 'aprender',   title: 'Aprender',   description: 'Desarrolla habilidades digitales para la vida.',    icon: 'school',   bgClass: 'bg-[#0D9488]', shadowClass: 'shadow-teal-100',   sortOrder: 1 },
    { id: 'convivir',   title: 'Convivir',   description: 'Construye relaciones positivas en línea.',           icon: 'groups',   bgClass: 'bg-[#7C3AED]', shadowClass: 'shadow-violet-100', sortOrder: 2 },
    { id: 'participar', title: 'Participar', description: 'Usa la tecnología para crear, expresar e informar.', icon: 'campaign', bgClass: 'bg-[#EA580C]', shadowClass: 'shadow-orange-100', sortOrder: 3 },
  ]) {
    await prisma.pillar.upsert({ where: { id: p.id }, create: p, update: p });
  }

  // === Audiences ===
  const audiences = [
    { slug: 'ninas-y-ninos', name: 'Niñas y niños', description: 'Jugar, descubrir y cuidarse en línea con calma.', audience: 'kids',     illoScene: 'play',    ageRange: '5 a 11 años',                imageUrl: '/Categorias/CIUDADANIA_NinasYNinos.png', accentClass: 'from-teal-400/0 via-teal-500/20 to-teal-600/40',    sortOrder: 1 },
    { slug: 'adolescentes',  name: 'Adolescentes',  description: 'Información directa para tu vida en redes.',     audience: 'teens',    illoScene: 'connect', ageRange: '12 a 17 años',               imageUrl: '/Categorias/CIUDADANIA_Adolescentes.png',  accentClass: 'from-violet-400/0 via-violet-500/20 to-violet-600/40', sortOrder: 2 },
    { slug: 'familias',      name: 'Familias',      description: 'Conversaciones y acuerdos que sí ayudan.',       audience: 'families', illoScene: 'connect', ageRange: 'Todas las edades',           imageUrl: '/Categorias/CIUDADANIA_Familia.png',      accentClass: 'from-orange-400/0 via-orange-500/20 to-orange-600/40', sortOrder: 3 },
    { slug: 'docentes',      name: 'Docentes',      description: 'Recursos listos para llevar al aula.',           audience: 'teachers', illoScene: 'study',   ageRange: 'Preescolar a preparatoria',  imageUrl: '/Categorias/CIUDADANIA_Maestros.png',      accentClass: 'from-emerald-400/0 via-emerald-500/20 to-emerald-600/40', sortOrder: 4 },
  ] as const;
  for (const a of audiences) {
    await prisma.audience.upsert({ where: { slug: a.slug }, create: a, update: a });
  }

  // Sub-niveles por audiencia (resumen — el panel admin podrá agregar más después)
  const subLevels = [
    { id: 'kids-pre',   audienceSlug: 'ninas-y-ninos', title: 'Preescolar',     subtitle: '3 a 5 años',  imageUrl: '/assets/img/sub-kids-pre.svg', imageId: 'sub-kids-pre', bgClass: 'from-teal-400 to-emerald-500', icon: 'child_care',   resourceCount: 12, sortOrder: 1 },
    { id: 'kids-pb',    audienceSlug: 'ninas-y-ninos', title: 'Primaria baja',  subtitle: '6 a 8 años',  imageUrl: '/assets/img/sub-kids-pb.svg',  imageId: 'sub-kids-pb',  bgClass: 'from-emerald-400 to-cyan-500', icon: 'auto_stories', resourceCount: 18, sortOrder: 2 },
    { id: 'kids-pa',    audienceSlug: 'ninas-y-ninos', title: 'Primaria alta',  subtitle: '9 a 11 años', imageUrl: '/assets/img/sub-kids-pa.svg',  imageId: 'sub-kids-pa',  bgClass: 'from-cyan-400 to-blue-500',    icon: 'auto_stories', resourceCount: 22, sortOrder: 3 },
    { id: 'teens-sec',  audienceSlug: 'adolescentes',  title: 'Secundaria',     subtitle: '12 a 14 años',imageUrl: '/assets/img/sub-teens-sec.svg', imageId: 'sub-teens-sec', bgClass: 'from-violet-500 to-fuchsia-500', icon: 'backpack', resourceCount: 15, sortOrder: 1 },
    { id: 'teens-prep', audienceSlug: 'adolescentes',  title: 'Preparatoria',   subtitle: '15 a 17 años',imageUrl: '/assets/img/sub-teens-prep.svg',imageId: 'sub-teens-prep',bgClass: 'from-fuchsia-500 to-pink-500', icon: 'school',    resourceCount: 17, sortOrder: 2 },
    { id: 'fam-05',     audienceSlug: 'familias',      title: '0 - 5 años',     subtitle: 'Primera infancia',          imageUrl: '/assets/img/sub-fam-05.svg',  imageId: 'sub-fam-05',  bgClass: 'from-amber-400 to-orange-500',  icon: 'child_care',         resourceCount: 9,  sortOrder: 1 },
    { id: 'fam-611',    audienceSlug: 'familias',      title: '6 - 11 años',    subtitle: 'Niñez',                     imageUrl: '/assets/img/sub-fam-611.svg', imageId: 'sub-fam-611', bgClass: 'from-orange-500 to-rose-500',   icon: 'family_restroom',    resourceCount: 11, sortOrder: 2 },
    { id: 'fam-1214',   audienceSlug: 'familias',      title: '12 - 14 años',   subtitle: 'Adolescencia temprana',     imageUrl: '/assets/img/sub-fam-1214.svg',imageId: 'sub-fam-1214',bgClass: 'from-rose-500 to-pink-600',     icon: 'forum',              resourceCount: 14, sortOrder: 3 },
    { id: 'fam-1522',   audienceSlug: 'familias',      title: '15 - 22 años',   subtitle: 'Adolescencia tardía y juventud', imageUrl: '/assets/img/sub-fam-1522.svg', imageId: 'sub-fam-1522', bgClass: 'from-pink-600 to-red-600', icon: 'volunteer_activism', resourceCount: 12, sortOrder: 4 },
    { id: 'doc-pre',    audienceSlug: 'docentes',      title: 'Preescolar',     subtitle: '3 a 5 años',  imageUrl: '/assets/img/sub-doc-pre.svg',  imageId: 'sub-doc-pre',  bgClass: 'from-emerald-500 to-teal-500', icon: 'child_friendly', resourceCount: 8,  sortOrder: 1 },
    { id: 'doc-pb',     audienceSlug: 'docentes',      title: 'Primaria baja',  subtitle: '6 a 8 años',  imageUrl: '/assets/img/sub-doc-pb.svg',   imageId: 'sub-doc-pb',   bgClass: 'from-teal-500 to-cyan-500',    icon: 'menu_book',     resourceCount: 14, sortOrder: 2 },
    { id: 'doc-pa',     audienceSlug: 'docentes',      title: 'Primaria alta',  subtitle: '9 a 11 años', imageUrl: '/assets/img/sub-doc-pa.svg',   imageId: 'sub-doc-pa',   bgClass: 'from-cyan-500 to-blue-500',    icon: 'edit_note',     resourceCount: 16, sortOrder: 3 },
    { id: 'doc-sec',    audienceSlug: 'docentes',      title: 'Secundaria',     subtitle: '12 a 14 años',imageUrl: '/assets/img/sub-doc-sec.svg',  imageId: 'sub-doc-sec',  bgClass: 'from-blue-500 to-indigo-500',  icon: 'science',       resourceCount: 13, sortOrder: 4 },
    { id: 'doc-prep',   audienceSlug: 'docentes',      title: 'Preparatoria',   subtitle: '15 a 17 años',imageUrl: '/assets/img/sub-doc-prep.svg', imageId: 'sub-doc-prep', bgClass: 'from-indigo-500 to-violet-500',icon: 'computer',      resourceCount: 11, sortOrder: 5 },
  ] as const;
  for (const s of subLevels) {
    await prisma.audienceSubLevel.upsert({ where: { id: s.id }, create: s, update: s });
  }

  // === Feature cards ===
  const featureCards = [
    { id: 'edutips',        title: 'Edutips',             description: 'Cápsulas breves para aprender, conversar y actuar mejor.',          icon: 'play_arrow', iconBgClass: 'bg-blue-600',   iconShadowClass: 'shadow-blue-200',   imageUrl: '/Portadas/Edutips_Portada.png',          destination: 'edutips',        audience: 'edutips',  illoScene: 'spark',   badge: 'Biblioteca',    sortOrder: 1,  sections: ['inicio'] },
    { id: 'casi',           title: 'El día que casi',     description: 'Serie animada con historias que evitaron un riesgo digital.',       icon: 'star',       iconBgClass: 'bg-amber-500',  iconShadowClass: 'shadow-amber-100',  imageUrl: '/Portadas/EDQCasi_Portada.png',          destination: 'series_casi',   audience: 'casi',     illoScene: 'play',    badge: 'Serie animada', sortOrder: 2,  sections: ['inicio'] },
    { id: 'ayuda',          title: 'Ayuda Digital',       description: 'Si recibiste un fraude, acoso o algo no está bien, no estás solo.', icon: 'shield',     iconBgClass: 'bg-rose-500',   iconShadowClass: 'shadow-rose-100',   imageUrl: '/assets/img/feature-ayuda.svg',          destination: 'ayuda',          audience: 'help',     illoScene: 'shield',  badge: 'Orientación',   sortOrder: 3,  sections: ['inicio'] },
    { id: 'familias-serie', title: 'Familias conectadas', description: 'Diálogos y guías en video para acompañar la vida digital de tus hijos.', icon: 'groups',     iconBgClass: 'bg-orange-500',  iconShadowClass: 'shadow-orange-100',  imageUrl: '/assets/img/series-cover-familias.svg',  destination: 'series_familias',audience: 'families', illoScene: 'connect', badge: 'Serie videos',  sortOrder: 4,  sections: [] },
    { id: 'cursos',         title: 'Cursos en línea',     description: 'Rutas estructuradas para educar en ciudadanía digital con validez.',icon: 'school',     iconBgClass: 'bg-emerald-600', iconShadowClass: 'shadow-emerald-100', imageUrl: '/assets/img/sub-kids-pa.svg',             destination: 'cursos',         audience: 'cdj',      illoScene: 'study',   badge: 'Formación',     sortOrder: 5,  sections: [] },
    { id: 'juegos',         title: 'Juegos interactivos', description: 'Retos interactivos y videojuegos educativos para aprender jugando.',icon: 'sports_esports', iconBgClass: 'bg-teal-500', iconShadowClass: 'shadow-teal-100',    imageUrl: '/assets/img/sub-kids-pb.svg',             destination: 'juegos',         audience: 'kids',     illoScene: 'play',    badge: 'Videojuego',    sortOrder: 6,  sections: [] },
    { id: 'recursos',       title: 'Biblioteca escolar',  description: 'Descarga infografías, checklists y guías para llevar al aula.',    icon: 'folder_open',iconBgClass: 'bg-indigo-600', iconShadowClass: 'shadow-indigo-100',  imageUrl: '/assets/img/sub-doc-sec.svg',            destination: 'recursos',       audience: 'teachers', illoScene: 'study',   badge: 'Materiales',    sortOrder: 7,  sections: [] },
    { id: 'kids-perfil',    title: 'Perfil Niños',        description: 'Material diseñado especialmente para niñas y niños de 6 a 11 años.',icon: 'face',       iconBgClass: 'bg-teal-600',   iconShadowClass: 'shadow-teal-100',    imageUrl: '/assets/img/category-ninas-y-ninos.svg', destination: 'ninas_y_ninos',  audience: 'kids',     illoScene: 'play',    badge: 'Perfil 5-11',   sortOrder: 8,  sections: [] },
    { id: 'teens-perfil',   title: 'Perfil Adolescentes', description: 'Todo lo que necesitas saber sobre privacidad, redes y ciberseguridad.',icon: 'smartphone', iconBgClass: 'bg-violet-600', iconShadowClass: 'shadow-violet-100',  imageUrl: '/assets/img/category-adolescentes.svg',  destination: 'adolescentes',   audience: 'teens',    illoScene: 'connect', badge: 'Perfil 12-17',  sortOrder: 9,  sections: [] },
    { id: 'familias-perfil',title: 'Perfil Familias',     description: 'Acompañamiento, mediación y acuerdos de pantallas en el hogar.',    icon: 'groups',     iconBgClass: 'bg-orange-600',  iconShadowClass: 'shadow-orange-100',  imageUrl: '/assets/img/category-familias.svg',      destination: 'familias',       audience: 'families', illoScene: 'connect', badge: 'Padres/Tutores',sortOrder: 10, sections: [] },
    { id: 'docentes-perfil',title: 'Perfil Docentes',     description: 'Recursos educativos y planeaciones para el desarrollo digital.',    icon: 'co_present', iconBgClass: 'bg-emerald-600', iconShadowClass: 'shadow-emerald-100', imageUrl: '/assets/img/category-docentes.svg',      destination: 'docentes',       audience: 'teachers', illoScene: 'study',   badge: 'Docentes',      sortOrder: 11, sections: [] },
    { id: 'notebooks-ia',   title: 'Notebooks IA',        description: 'Resuelve tus dudas en base a la documentación oficial con nuestra IA.',icon: 'psychology', iconBgClass: 'bg-fuchsia-600', iconShadowClass: 'shadow-fuchsia-100', imageUrl: '/assets/img/sub-teens-prep.svg',         destination: 'notebooks_ia',   audience: 'cdj',      illoScene: 'spark',   badge: 'Asistente IA',  sortOrder: 12, sections: [] },
  ] as const;
  for (const f of featureCards) {
    await prisma.featureCard.upsert({ where: { id: f.id }, create: f, update: f });
  }

  // === Banner CTA ===
  await prisma.banner.upsert({
    where: { id: 'cta-comunidad' },
    create: {
      id: 'cta-comunidad',
      title: 'La ciudadanía digital nos conecta y nos responsabiliza.',
      description: 'Cada acción en línea tiene impacto. Elige informarte, respetar y participar para construir una comunidad mejor.',
      imageUrl: '/assets/img/cta-banner.svg',
      ctaLabel: 'Conoce más',
      ctaHref: '#mas',
      audience: 'cdj',
      slot: 'home_secondary',
    },
    update: {},
  });

  // === Series + Videos ===
  const series = [
    { id: 'edutips',  slug: 'edutips',          title: 'Edutips',           tagline: 'Cápsulas para tu día a día digital',     description: 'Microvideos para aprender a moverte en internet con seguridad, criterio y respeto.', coverImageUrl: '/Portadas/Edutips_Portada.png', accentClass: 'from-blue-500 to-cyan-500',   iconBgClass: 'bg-blue-600',  icon: 'play_arrow', audience: 'edutips',  illoScene: 'spark',   sortOrder: 1 },
    { id: 'casi',     slug: 'el-dia-que-casi',  title: 'El día que casi',   tagline: 'Serie animada para niñas y niños',       description: 'Historias cortas donde personajes evitan riesgos digitales tomando buenas decisiones.', coverImageUrl: '/Portadas/EDQCasi_Portada.png',    accentClass: 'from-amber-400 to-orange-500', iconBgClass: 'bg-amber-500', icon: 'star',       audience: 'casi',     illoScene: 'play',    sortOrder: 2 },
    { id: 'familias', slug: 'familias-conectadas', title: 'Familias conectadas', tagline: 'Conversaciones en casa sobre lo digital', description: 'Guías y diálogos para acompañar a hijas e hijos en su vida en línea.',           coverImageUrl: '/assets/img/series-cover-familias.svg', accentClass: 'from-orange-400 to-rose-500',  iconBgClass: 'bg-orange-500', icon: 'groups',    audience: 'families', illoScene: 'connect', sortOrder: 3 },
  ] as const;
  for (const s of series) {
    await prisma.videoSeries.upsert({ where: { id: s.id }, create: s, update: s });
  }

  const videos = [
    { id: 'edu-1', seriesId: 'edutips',  title: 'Contraseñas que sí protegen',           description: 'Cómo crear y guardar contraseñas seguras sin enloquecer.',  youtubeUrl: 'https://www.youtube.com/watch?v=aircAruvnKk', durationLabel: '3:24', tags: ['seguridad','cuentas'],   sortOrder: 1 },
    { id: 'edu-2', seriesId: 'edutips',  title: 'Reconocer un fraude por mensaje',       description: 'Señales para detectar phishing y qué hacer si recibes uno.', youtubeUrl: 'https://www.youtube.com/watch?v=IHZwWFHWa-w', durationLabel: '4:10', tags: ['fraude','phishing'],     sortOrder: 2 },
    { id: 'edu-3', seriesId: 'edutips',  title: 'Tu huella digital, explicada',           description: 'Lo que dejas en internet y cómo cuidar tu reputación.',     youtubeUrl: 'https://www.youtube.com/watch?v=jNQXAC9IVRw', durationLabel: '5:02', tags: ['privacidad'],            sortOrder: 3 },
    { id: 'edu-4', seriesId: 'edutips',  title: 'Cómo verificar una noticia',             description: 'Tres pasos para no compartir información falsa.',           youtubeUrl: 'https://www.youtube.com/watch?v=ScMzIvxBSi4', durationLabel: '4:45', tags: ['fake news','criterio'],  sortOrder: 4 },
    { id: 'casi-1', seriesId: 'casi',    title: 'El día que casi le doy mis datos',       description: 'Una historia sobre proteger información personal.',          youtubeUrl: 'https://www.youtube.com/watch?v=2Vv-BfVoq4g', durationLabel: '2:30', tags: [],                        sortOrder: 1 },
    { id: 'casi-2', seriesId: 'casi',    title: 'El día que casi caigo en una trampa',    description: 'Cómo identificar enlaces sospechosos.',                     youtubeUrl: 'https://www.youtube.com/watch?v=L_jWHffIx5E', durationLabel: '2:50', tags: [],                        sortOrder: 2 },
    { id: 'casi-3', seriesId: 'casi',    title: 'El día que casi pierdo a un amigo',      description: 'Sobre el respeto y la convivencia digital.',                youtubeUrl: 'https://www.youtube.com/watch?v=fLexgOxsZu0', durationLabel: '3:10', tags: [],                        sortOrder: 3 },
    { id: 'fam-1',  seriesId: 'familias',title: 'Hablar de pantallas sin pelear',         description: 'Acuerdos familiares sobre tiempo de uso.',                  youtubeUrl: 'https://www.youtube.com/watch?v=hY7m5jjJ9mM', durationLabel: '6:15', tags: [],                        sortOrder: 1 },
    { id: 'fam-2',  seriesId: 'familias',title: 'Privacidad en redes para adolescentes',  description: 'Configuraciones recomendadas y por qué.',                   youtubeUrl: 'https://www.youtube.com/watch?v=kJQP7kiw5Fk', durationLabel: '5:48', tags: [],                        sortOrder: 2 },
  ];
  for (const v of videos) {
    await prisma.video.upsert({ where: { id: v.id }, create: v, update: v });
  }

  // === Help situations ===
  const situations = [
    { id: 's1', slug: 'ciberacoso',         title: 'Ciberacoso y violencia digital', description: 'Hostigamiento, amenazas o discurso de odio en línea.',        icon: 'gavel',           bgClass: 'bg-rose-500',     sortOrder: 1 },
    { id: 's2', slug: 'fraudes',            title: 'Fraudes y engaños en línea',     description: 'Mensajes sospechosos, sitios falsos o cobros indebidos.',     icon: 'credit_card_off', bgClass: 'bg-orange-500',   sortOrder: 2 },
    { id: 's3', slug: 'robo-identidad',     title: 'Robo de identidad',              description: 'Suplantación de cuentas o uso indebido de tus datos.',        icon: 'badge',           bgClass: 'bg-red-500',      sortOrder: 3 },
    { id: 's4', slug: 'difusion',           title: 'Difusión sin consentimiento',    description: 'Imágenes, videos o info compartidos sin tu permiso.',         icon: 'no_photography',  bgClass: 'bg-pink-600',     sortOrder: 4 },
    { id: 's5', slug: 'sexting-grooming',   title: 'Sexting y grooming',             description: 'Contacto inapropiado o presión para enviar contenido.',       icon: 'warning',         bgClass: 'bg-fuchsia-600',  sortOrder: 5 },
    { id: 's6', slug: 'contacto-danino',    title: 'Contacto dañino',                description: 'Personas que se acercan con malas intenciones.',              icon: 'person_off',      bgClass: 'bg-violet-600',   sortOrder: 6 },
  ];
  for (const s of situations) {
    await prisma.helpSituation.upsert({ where: { id: s.id }, create: s, update: s });
  }

  // === Help channels ===
  const channels = [
    { id: 'c1', title: 'Orientación y acompañamiento', description: 'Guía emocional y orientación inicial para ti y tu familia.', icon: 'support_agent',    bgClass: 'bg-teal-500',   contacts: [{ label: 'Línea de la Vida', phone: '800 911 2000' },  { label: 'SAPTEL', phone: '55 5259 8121' }],    sortOrder: 1 },
    { id: 'c2', title: 'Atención institucional',       description: 'Instituciones públicas que atienden el caso oficialmente.',  icon: 'account_balance',  bgClass: 'bg-blue-600',   contacts: [{ label: 'SIPINNA Jalisco', phone: '33 3030 4500' }, { label: 'CONDUSEF (fraudes)', phone: '55 5340 0999' }], sortOrder: 2 },
    { id: 'c3', title: 'Denuncia y seguimiento',       description: 'Para presentar denuncia formal y dar seguimiento legal.',    icon: 'shield_lock',      bgClass: 'bg-violet-600', contacts: [{ label: 'Policía Cibernética', phone: '088' },     { label: 'Fiscalía Jalisco', phone: '33 3837 6000' }],    sortOrder: 3 },
  ];
  for (const c of channels) {
    await prisma.helpChannel.upsert({ where: { id: c.id }, create: c, update: c });
  }

  // === Social + Footer ===
  for (const s of [
    { id: 'fb', brand: 'facebook', label: 'Facebook', href: '#', hoverClass: 'hover:bg-[#1877F2]', sortOrder: 1 },
    { id: 'yt', brand: 'youtube',  label: 'YouTube',  href: '#', hoverClass: 'hover:bg-[#FF0000]', sortOrder: 2 },
  ]) {
    await prisma.socialLink.upsert({ where: { id: s.id }, create: s, update: s });
  }

  const footerCols = [
    { id: 'recursos',     title: 'Recursos',     sortOrder: 1, links: [
      { label: 'Videos animados',    href: '/recursos' },
      { label: 'Audiocuentos',       href: '/recursos' },
      { label: 'Microlecciones',     href: '/recursos' },
      { label: 'Guías y checklist',  href: '/recursos' },
    ]},
    { id: 'aprender',     title: 'Para aprender', sortOrder: 2, links: [
      { label: 'Edutips',                href: '/edutips' },
      { label: 'El día que casi',        href: '/series/el-dia-que-casi' },
      { label: 'Rutas guiadas',          href: '/recursos' },
      { label: 'Tutoriales imprimibles', href: '/recursos' },
    ]},
    { id: 'institucional', title: 'Institucional', sortOrder: 3, links: [
      { label: 'Quiénes somos', href: '/quienes-somos' },
      { label: 'Ayuda Digital', href: '/ayuda' },
      { label: 'Aliados',       href: '/quienes-somos' },
      { label: 'Contacto',      href: '/quienes-somos' },
    ]},
  ];
  for (const col of footerCols) {
    // Upsert columna y reemplazar links (simple para el seed)
    await prisma.footerColumn.upsert({
      where: { id: col.id },
      create: {
        id: col.id, title: col.title, sortOrder: col.sortOrder,
        links: { create: col.links.map((l, idx) => ({ ...l, sortOrder: idx + 1 })) },
      },
      update: {
        title: col.title, sortOrder: col.sortOrder,
        links: {
          deleteMany: {},
          create: col.links.map((l, idx) => ({ ...l, sortOrder: idx + 1 })),
        },
      },
    });
  }

  // === Admin User (Alfa) ===
  const adminEmail = 'admin@cdj.jalisco.gob.mx';
  const hashedPassword = hashPassword('AlfaCDJ2026!');

  await prisma.adminUser.upsert({
    where: { email: adminEmail },
    update: { password: hashedPassword },
    create: {
      email: adminEmail,
      password: hashedPassword,
      name: 'Administrador Alfa',
    },
  });

  console.log('✓ Seed completado.');
}

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(async () => prisma.$disconnect());

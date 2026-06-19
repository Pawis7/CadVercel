export interface AudienceTopic {
  icon: string;
  title: string;
  description: string;
  bgClass: string;
}

export interface AudienceSubLevel {
  id: string;
  title: string;
  subtitle: string;
  imageUrl: string;
  imageId: string;
  bgClass: string;
  icon: string;
  resourceCount: number;
}

export interface AudiencePage {
  slug: string;
  title: string;
  eyebrow: string;
  tagline: string;
  description: string;
  heroImage: string;
  heroImageId: string;
  accentClass: string;
  pillBgClass: string;
  iconBgClass: string;
  icon: string;
  ageRange?: string;
  subLevels: AudienceSubLevel[];
  topics: AudienceTopic[];
  recommendedSeriesSlugs: string[];
}

export const AUDIENCE_PAGES: AudiencePage[] = [
  {
    slug: 'ninas-y-ninos',
    title: 'Niñas y niños',
    eyebrow: 'Para los más pequeños',
    tagline: 'Aprender jugando, con calma y compañía',
    description:
      'Cápsulas, audiocuentos y videos cortos para descubrir el mundo digital con seguridad y curiosidad.',
    heroImage:
      'https://images.unsplash.com/photo-1543269865-cbf427effbad?auto=format&fit=crop&q=80&w=1600',
    heroImageId: 'aud-kids-hero',
    accentClass: 'from-rose-500 via-rose-500 to-cyan-500',
    pillBgClass: 'bg-rose-500',
    iconBgClass: 'bg-rose-500',
    icon: 'face',
    ageRange: '5 a 11 años',
    subLevels: [
      { id: 'preescolar',     title: 'Preescolar',    subtitle: '3 a 5 años',  imageUrl: 'https://images.unsplash.com/photo-1588072432836-e10032774350?auto=format&fit=crop&q=80&w=900', imageId: 'sub-kids-pre', bgClass: 'from-rose-400 to-rose-500', icon: 'child_care', resourceCount: 12 },
      { id: 'primaria-baja',  title: 'Primaria baja', subtitle: '6 a 8 años',  imageUrl: 'https://images.unsplash.com/photo-1522661067900-ab829854a57f?auto=format&fit=crop&q=80&w=900', imageId: 'sub-kids-pb',  bgClass: 'from-rose-400 to-cyan-500', icon: 'auto_stories', resourceCount: 18 },
      { id: 'primaria-alta',  title: 'Primaria alta', subtitle: '9 a 11 años', imageUrl: 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&q=80&w=900', imageId: 'sub-kids-pa',  bgClass: 'from-cyan-400 to-blue-500',    icon: 'auto_stories', resourceCount: 22 },
    ],
    topics: [
      { icon: 'shield_person',  title: 'Cuidado en línea',     description: 'Saber qué compartir y qué no.',    bgClass: 'bg-rose-500' },
      { icon: 'sentiment_calm', title: 'Buen trato',            description: 'Tratar bonito y poner límites.',  bgClass: 'bg-rose-500' },
      { icon: 'palette',        title: 'Crear y descubrir',     description: 'Hacer arte digital y aprender.',  bgClass: 'bg-cyan-500' },
      { icon: 'schedule',       title: 'Tiempo en pantalla',    description: 'Equilibrio entre jugar y descansar.', bgClass: 'bg-sky-500' },
    ],
    recommendedSeriesSlugs: ['edutips', 'el-dia-que-casi'],
  },
  {
    slug: 'adolescentes',
    title: 'Adolescentes',
    eyebrow: 'Para ti que ya andas en redes',
    tagline: 'Información directa, sin sermones',
    description:
      'Privacidad, salud digital, redes sociales, ciberbullying y herramientas para ser creador, no solo consumidor.',
    heroImage:
      'https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?auto=format&fit=crop&q=80&w=1600',
    heroImageId: 'aud-teens-hero',
    accentClass: 'from-violet-500 via-fuchsia-500 to-pink-500',
    pillBgClass: 'bg-violet-500',
    iconBgClass: 'bg-violet-500',
    icon: 'forum',
    ageRange: '12 a 17 años',
    subLevels: [
      { id: 'secundaria',  title: 'Secundaria',  subtitle: '12 a 14 años', imageUrl: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&q=80&w=900', imageId: 'sub-teens-sec', bgClass: 'from-violet-500 to-fuchsia-500', icon: 'backpack', resourceCount: 15 },
      { id: 'preparatoria', title: 'Preparatoria', subtitle: '15 a 17 años', imageUrl: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&q=80&w=900', imageId: 'sub-teens-prep', bgClass: 'from-fuchsia-500 to-pink-500', icon: 'school', resourceCount: 17 },
    ],
    topics: [
      { icon: 'visibility_off', title: 'Privacidad real',         description: 'Configurar bien tus cuentas.',      bgClass: 'bg-violet-500' },
      { icon: 'forum',          title: 'Convivir en redes',       description: 'Cómo lidiar con el conflicto.',     bgClass: 'bg-fuchsia-500' },
      { icon: 'fact_check',     title: 'Detectar fake news',      description: 'Verificar antes de compartir.',     bgClass: 'bg-pink-500' },
      { icon: 'edit_note',      title: 'Crear contenido',         description: 'Pasar de consumir a producir.',     bgClass: 'bg-purple-500' },
    ],
    recommendedSeriesSlugs: ['edutips'],
  },
  {
    slug: 'familias',
    title: 'Familias',
    eyebrow: 'Para acompañar en casa',
    tagline: 'Conversaciones que sí ayudan',
    description:
      'Guías por edad, acuerdos familiares, y herramientas concretas para entender qué hacen y cómo apoyarles.',
    heroImage:
      'https://images.unsplash.com/photo-1511895426328-dc8714191300?auto=format&fit=crop&q=80&w=1600',
    heroImageId: 'aud-families-hero',
    accentClass: 'from-orange-500 via-rose-500 to-red-500',
    pillBgClass: 'bg-orange-500',
    iconBgClass: 'bg-orange-500',
    icon: 'groups',
    ageRange: 'Todas las edades',
    subLevels: [
      { id: 'fam-0-5',   title: '0 - 5 años',   subtitle: 'Primera infancia',           imageUrl: 'https://images.unsplash.com/photo-1531983412531-1f49a365ffed?auto=format&fit=crop&q=80&w=900', imageId: 'sub-fam-05',  bgClass: 'from-amber-400 to-orange-500',  icon: 'child_care',     resourceCount: 9 },
      { id: 'fam-6-11',  title: '6 - 11 años',  subtitle: 'Niñez',                      imageUrl: 'https://images.unsplash.com/photo-1543269865-cbf427effbad?auto=format&fit=crop&q=80&w=900', imageId: 'sub-fam-611', bgClass: 'from-orange-500 to-rose-500',   icon: 'family_restroom',resourceCount: 11 },
      { id: 'fam-12-14', title: '12 - 14 años', subtitle: 'Adolescencia temprana',      imageUrl: 'https://images.unsplash.com/photo-1571260899304-425eee4c7efc?auto=format&fit=crop&q=80&w=900', imageId: 'sub-fam-1214',bgClass: 'from-rose-500 to-pink-600',     icon: 'forum',          resourceCount: 14 },
      { id: 'fam-15-22', title: '15 - 22 años', subtitle: 'Adolescencia tardía y juventud', imageUrl: 'https://images.unsplash.com/photo-1529333166437-7750a6dd5a70?auto=format&fit=crop&q=80&w=900', imageId: 'sub-fam-1522',bgClass: 'from-pink-600 to-red-600',      icon: 'volunteer_activism', resourceCount: 12 },
    ],
    topics: [
      { icon: 'handshake',       title: 'Acuerdos en casa',     description: 'Reglas claras sin pelear.',         bgClass: 'bg-orange-500' },
      { icon: 'family_restroom', title: 'Conversar por edad',   description: 'Qué decir según los años.',         bgClass: 'bg-rose-500' },
      { icon: 'security',        title: 'Riesgos comunes',      description: 'Reconocer y prevenir.',             bgClass: 'bg-red-500' },
      { icon: 'volunteer_activism', title: 'Cuando algo pasa',  description: 'Dónde acudir si necesitas ayuda.',  bgClass: 'bg-amber-500' },
    ],
    recommendedSeriesSlugs: ['familias-conectadas', 'el-dia-que-casi'],
  },
  {
    slug: 'docentes',
    title: 'Docentes',
    eyebrow: 'Para llevar al aula',
    tagline: 'Recursos listos para clase',
    description:
      'Secuencias didácticas, proyectos por nivel y materiales descargables para integrar ciudadanía digital en cualquier asignatura.',
    heroImage:
      'https://images.unsplash.com/photo-1544717297-fa154ddad021?auto=format&fit=crop&q=80&w=1600',
    heroImageId: 'aud-teachers-hero',
    accentClass: 'from-rose-500 via-rose-500 to-blue-500',
    pillBgClass: 'bg-rose-500',
    iconBgClass: 'bg-rose-500',
    icon: 'school',
    ageRange: 'Preescolar a preparatoria',
    subLevels: [
      { id: 'doc-pre',  title: 'Preescolar',     subtitle: '3 a 5 años',   imageUrl: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&q=80&w=900', imageId: 'sub-doc-pre', bgClass: 'from-rose-500 to-rose-500', icon: 'child_friendly', resourceCount: 8 },
      { id: 'doc-pb',   title: 'Primaria baja',  subtitle: '6 a 8 años',   imageUrl: 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&q=80&w=900', imageId: 'sub-doc-pb',  bgClass: 'from-rose-500 to-cyan-500',    icon: 'menu_book',      resourceCount: 14 },
      { id: 'doc-pa',   title: 'Primaria alta',  subtitle: '9 a 11 años',  imageUrl: 'https://images.unsplash.com/photo-1581594693702-fbdc51b2763b?auto=format&fit=crop&q=80&w=900', imageId: 'sub-doc-pa',  bgClass: 'from-cyan-500 to-blue-500',    icon: 'edit_note',      resourceCount: 16 },
      { id: 'doc-sec',  title: 'Secundaria',     subtitle: '12 a 14 años', imageUrl: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&q=80&w=900', imageId: 'sub-doc-sec', bgClass: 'from-blue-500 to-indigo-500',  icon: 'science',        resourceCount: 13 },
      { id: 'doc-prep', title: 'Preparatoria',   subtitle: '15 a 17 años', imageUrl: 'https://images.unsplash.com/photo-1577896851231-70ef18881754?auto=format&fit=crop&q=80&w=900', imageId: 'sub-doc-prep',bgClass: 'from-indigo-500 to-violet-500',icon: 'computer',       resourceCount: 11 },
    ],
    topics: [
      { icon: 'menu_book',  title: 'Secuencias didácticas', description: 'Planeaciones por nivel.',           bgClass: 'bg-rose-500' },
      { icon: 'task_alt',   title: 'Proyectos integradores', description: 'Aprendizaje basado en retos.',     bgClass: 'bg-rose-500' },
      { icon: 'print',      title: 'Material imprimible',    description: 'PDFs listos para imprimir.',       bgClass: 'bg-blue-500' },
      { icon: 'auto_stories', title: 'Para tu formación',    description: 'Microcursos y lecturas.',          bgClass: 'bg-cyan-500' },
    ],
    recommendedSeriesSlugs: ['edutips'],
  },
];

export const RESOURCES = [
  { id: 'r1', title: 'Videos animados', icon: 'animation', bgClass: 'bg-pink-500',    description: 'Episodios cortos con personajes que enseñan.' },
  { id: 'r2', title: 'Audiocuentos',    icon: 'graphic_eq', bgClass: 'bg-violet-500',  description: 'Para escuchar en familia o de camino a la escuela.' },
  { id: 'r3', title: 'Microlecciones',  icon: 'menu_book',  bgClass: 'bg-blue-500',    description: 'Lecciones de 3 minutos sobre temas clave.' },
  { id: 'r4', title: 'Guías y checklist', icon: 'fact_check', bgClass: 'bg-rose-500', description: 'Pasos para aplicar lo aprendido.' },
  { id: 'r5', title: 'Secuencias didácticas', icon: 'route', bgClass: 'bg-rose-500',   description: 'Planeaciones para llevar al aula.' },
  { id: 'r6', title: 'Proyectos',       icon: 'extension',  bgClass: 'bg-orange-500',  description: 'Retos colaborativos por nivel.' },
  { id: 'r7', title: 'Tutoriales imprimibles', icon: 'print', bgClass: 'bg-amber-500', description: 'PDFs listos para imprimir y trabajar.' },
  { id: 'r8', title: 'Infografías',     icon: 'insert_chart', bgClass: 'bg-cyan-500',  description: 'Resúmenes visuales para compartir.' },
];

export const HELP_SITUATIONS = [
  { id: 's1', title: 'Ciberacoso y violencia digital', icon: 'gavel',          bgClass: 'bg-rose-500',   description: 'Hostigamiento, amenazas o discurso de odio en línea.' },
  { id: 's2', title: 'Fraudes y engaños en línea',     icon: 'credit_card_off', bgClass: 'bg-orange-500', description: 'Mensajes sospechosos, sitios falsos o cobros indebidos.' },
  { id: 's3', title: 'Robo de identidad',              icon: 'badge',           bgClass: 'bg-red-500',    description: 'Suplantación de cuentas o uso indebido de tus datos.' },
  { id: 's4', title: 'Difusión sin consentimiento',    icon: 'no_photography',  bgClass: 'bg-pink-600',   description: 'Imágenes, videos o info compartidos sin tu permiso.' },
  { id: 's5', title: 'Sexting y grooming',             icon: 'warning',         bgClass: 'bg-fuchsia-600', description: 'Contacto inapropiado o presión para enviar contenido.' },
  { id: 's6', title: 'Contacto dañino',                icon: 'person_off',      bgClass: 'bg-violet-600', description: 'Personas que se acercan con malas intenciones.' },
];

export const HELP_CHANNELS = [
  {
    id: 'c1',
    title: 'Orientación y acompañamiento',
    icon: 'support_agent',
    bgClass: 'bg-rose-500',
    description: 'Guía emocional y orientación inicial para ti y tu familia.',
    primaryAction: { label: 'Ver opciones', icon: 'arrow_forward' },
    items: [
      { label: 'Línea de la Vida',  phone: '800 911 2000' },
      { label: 'SAPTEL',            phone: '55 5259 8121' },
    ],
  },
  {
    id: 'c2',
    title: 'Atención institucional',
    icon: 'account_balance',
    bgClass: 'bg-blue-600',
    description: 'Instituciones públicas que atienden el caso oficialmente.',
    primaryAction: { label: 'Ver opciones', icon: 'arrow_forward' },
    items: [
      { label: 'SIPINNA Jalisco',         phone: '33 3030 4500' },
      { label: 'CONDUSEF (fraudes)',      phone: '55 5340 0999' },
    ],
  },
  {
    id: 'c3',
    title: 'Denuncia y seguimiento',
    icon: 'shield_lock',
    bgClass: 'bg-violet-600',
    description: 'Para presentar denuncia formal y dar seguimiento legal.',
    primaryAction: { label: 'Ver opciones', icon: 'arrow_forward' },
    items: [
      { label: 'Policía Cibernética',     phone: '088' },
      { label: 'Fiscalía Jalisco',        phone: '33 3837 6000' },
    ],
  },
];

export const ABOUT_TEAM = [
  { id: 't1', name: 'Equipo pedagógico',   role: 'Diseño curricular',     icon: 'school',   bgClass: 'bg-rose-500' },
  { id: 't2', name: 'Equipo de contenidos', role: 'Producción audiovisual', icon: 'movie',    bgClass: 'bg-pink-500' },
  { id: 't3', name: 'Equipo tecnológico',  role: 'Plataforma y datos',    icon: 'memory',   bgClass: 'bg-blue-500' },
  { id: 't4', name: 'Aliados institucionales', role: 'SEP, ONGs y academia', icon: 'handshake', bgClass: 'bg-orange-500' },
];

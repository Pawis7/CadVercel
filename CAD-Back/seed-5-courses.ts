import { PrismaClient, NivelCurso, EstadoCurso, TipoLeccion } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Iniciando creación de 5 cursos adicionales...');

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

  console.log(`👤 Usando autor: ${admin.firstName} ${admin.lastName} (${admin.email})\n`);

  const cursosData = [
    {
      nombre: 'Inteligencia Artificial Práctica para la Educación y Trabajo',
      descripcion: 'Descubre cómo utilizar herramientas de IA generativa para optimizar tus tareas diarias, crear contenido pedagógico y aumentar tu productividad sin conocimientos técnicos previos.',
      portada: 'https://images.unsplash.com/photo-1677442136019-21780efad99a?q=80&w=1200&auto=format&fit=crop',
      etiquetas: ['IA', 'educación', 'tecnología', 'productividad'],
      nivel: NivelCurso.PRINCIPIANTE,
      duracionEstimada: 60,
      modulos: [
        {
          titulo: 'Introducción a la Inteligencia Artificial',
          descripcion: 'Conceptos clave sobre IA generativa, prompts y casos de uso cotidianos.',
          orden: 1,
          lecciones: [
            {
              titulo: '¿Qué es la Inteligencia Artificial Generativa?',
              tipo: TipoLeccion.VIDEO,
              orden: 1,
              recursoUrl: 'https://www.youtube.com/watch?v=G2fqAlgmoPo',
              duracionSeg: 420,
            },
            {
              titulo: 'Guía: Buenas prácticas al diseñar Prompts',
              tipo: TipoLeccion.LECTURA,
              orden: 2,
              contenidoHtml: `
                <h3>El arte del Prompt Engineering</h3>
                <p>Para obtener los mejores resultados de una IA, la claridad de las instrucciones es crucial.</p>
                <ul>
                  <li><strong>Define el rol:</strong> Pídele a la IA que actúe como experto en el tema.</li>
                  <li><strong>Sé específico:</strong> Proporciona contexto, tono y formato deseado.</li>
                  <li><strong>Itera sin miedo:</strong> Ajusta tu orden si la primera respuesta no es exacta.</li>
                </ul>
              `,
            },
          ],
        },
        {
          titulo: 'Evaluación de Inteligencia Artificial',
          descripcion: 'Demuestra tu comprensión. Nota: Todas las respuestas correctas son la Opción A.',
          orden: 2,
          lecciones: [
            {
              titulo: 'Cuestionario Módulo IA',
              tipo: TipoLeccion.CUESTIONARIO,
              orden: 1,
              calificacionMinima: 60,
              preguntas: [
                {
                  texto: '¿Cuál es la regla de oro para redactar un prompt efectivo para IA generativa?',
                  orden: 1,
                  opciones: [
                    { texto: 'Opción A: Ser claro, específico, dar contexto y definir el rol que la IA debe adoptar.', esCorrecta: true },
                    { texto: 'Opción B: Escribir una sola palabra en mayúsculas y esperar magia.', esCorrecta: false },
                    { texto: 'Opción C: Copiar manuales enteros en código binario.', esCorrecta: false },
                    { texto: 'Opción D: Usar términos confusos y ambiguos para evaluar el modelo.', esCorrecta: false },
                  ],
                },
                {
                  texto: '¿Qué es una alucinación en el contexto de la Inteligencia Artificial?',
                  orden: 2,
                  opciones: [
                    { texto: 'Opción A: Cuando la IA genera información falsa o inventada presentándola como un hecho real.', esCorrecta: true },
                    { texto: 'Opción B: Cuando la pantalla del ordenador cambia de color automáticamente.', esCorrecta: false },
                    { texto: 'Opción C: Un virus informático que borra el disco duro.', esCorrecta: false },
                    { texto: 'Opción D: La capacidad de la computadora para soñar mientras está apagada.', esCorrecta: false },
                  ],
                },
                {
                  texto: '¿Cómo nos beneficia principalmente la IA en el ámbito laboral y educativo?',
                  orden: 3,
                  opciones: [
                    { texto: 'Opción A: Automatizando tareas repetitivas y asistiendo en la creación y análisis de contenido.', esCorrecta: true },
                    { texto: 'Opción B: Reemplazando por completo el pensamiento crítico humano.', esCorrecta: false },
                    { texto: 'Opción C: Aumentando el consumo eléctrico de la oficina sin beneficio real.', esCorrecta: false },
                    { texto: 'Opción D: Ninguna de las opciones anteriores.', esCorrecta: false },
                  ],
                },
              ],
            },
          ],
        },
      ],
    },
    {
      nombre: 'Ciberseguridad Ciudadana y Protección de Datos',
      descripcion: 'Aprende a proteger tus cuentas bancarias, redes sociales e identidad en internet frente a fraudes, phishing y robo de información.',
      portada: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?q=80&w=1200&auto=format&fit=crop',
      etiquetas: ['seguridad', 'internet', 'privacidad', 'protección'],
      nivel: NivelCurso.INTERMEDIO,
      duracionEstimada: 45,
      modulos: [
        {
          titulo: 'Fundamentos de Seguridad Digital',
          descripcion: 'Amenazas comunes y métodos inmediatos de blindaje digital.',
          orden: 1,
          lecciones: [
            {
              titulo: 'Identificando estafas digitales (Phishing)',
              tipo: TipoLeccion.VIDEO,
              orden: 1,
              recursoUrl: 'https://www.youtube.com/watch?v=inWWhr5buL8',
              duracionSeg: 350,
            },
            {
              titulo: 'Lectura: Contraseñas Robustas y 2FA',
              tipo: TipoLeccion.LECTURA,
              orden: 2,
              contenidoHtml: `
                <h3>El Doble Factor de Autenticación (2FA)</h3>
                <p>Una contraseña ya no es suficiente. Activar el 2FA mediante aplicaciones como Google Authenticator o Authy añade una capa impenetrable para los atacantes.</p>
                <p><strong>Regla vital:</strong> Nunca utilices la misma contraseña para tu correo electrónico principal y para tus cuentas bancarias o redes sociales.</p>
              `,
            },
          ],
        },
        {
          titulo: 'Evaluación de Ciberseguridad',
          descripcion: 'Pon a prueba tu escudo digital. Nota: Todas las respuestas correctas son la Opción A.',
          orden: 2,
          lecciones: [
            {
              titulo: 'Cuestionario de Blindaje Digital',
              tipo: TipoLeccion.CUESTIONARIO,
              orden: 1,
              calificacionMinima: 60,
              preguntas: [
                {
                  texto: '¿Qué acción debes tomar si recibes un correo urgente del "banco" pidiendo tu contraseña por un enlace?',
                  orden: 1,
                  opciones: [
                    { texto: 'Opción A: Ignorar el correo, no hacer clic en el enlace y contactar al banco por sus canales oficiales.', esCorrecta: true },
                    { texto: 'Opción B: Hacer clic inmediatamente y llenar todos los datos que piden.', esCorrecta: false },
                    { texto: 'Opción C: Responder el correo enviando una foto de tu tarjeta de crédito.', esCorrecta: false },
                    { texto: 'Opción D: Reenviar el correo a todos tus contactos para preguntar si es real.', esCorrecta: false },
                  ],
                },
                {
                  texto: '¿Qué es la autenticación de dos factores (2FA o MFA)?',
                  orden: 2,
                  opciones: [
                    { texto: 'Opción A: Un sistema de seguridad que pide una segunda verificación (ej. código en el móvil) además de la contraseña.', esCorrecta: true },
                    { texto: 'Opción B: Tener dos computadoras prendidas al mismo tiempo en casa.', esCorrecta: false },
                    { texto: 'Opción C: Escribir la contraseña dos veces seguidas muy rápido.', esCorrecta: false },
                    { texto: 'Opción D: Compartir tu clave con un familiar de confianza.', esCorrecta: false },
                  ],
                },
                {
                  texto: '¿Cuál es la característica de una contraseña realmente segura?',
                  orden: 3,
                  opciones: [
                    { texto: 'Opción A: Ser larga (más de 12 caracteres), combinar letras, números y símbolos, y ser única por cuenta.', esCorrecta: true },
                    { texto: 'Opción B: Usar "12345678" para no olvidarla jamás.', esCorrecta: false },
                    { texto: 'Opción C: Poner el nombre de tu mascota seguido del año de nacimiento.', esCorrecta: false },
                    { texto: 'Opción D: Anotarla en un post-it pegado en la pantalla de la oficina.', esCorrecta: false },
                  ],
                },
              ],
            },
          ],
        },
      ],
    },
    {
      nombre: 'Finanzas Personales para la Vida Diaria',
      descripcion: 'Toma el control del dinero, aprende a presupuestar eficientemente, salir de deudas y dar tus primeros pasos en el ahorro y la inversión saludable.',
      portada: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?q=80&w=1200&auto=format&fit=crop',
      etiquetas: ['finanzas', 'ahorro', 'economía', 'inversión'],
      nivel: NivelCurso.PRINCIPIANTE,
      duracionEstimada: 50,
      modulos: [
        {
          titulo: 'Presupuesto y Control de Gastos',
          descripcion: 'Aprende a diferenciar deseos de necesidades y domina la regla 50/30/20.',
          orden: 1,
          lecciones: [
            {
              titulo: 'La Regla de Oro del Presupuesto 50/30/20',
              tipo: TipoLeccion.VIDEO,
              orden: 1,
              recursoUrl: 'https://www.youtube.com/watch?v=KQoJ9L_h4aQ',
              duracionSeg: 300,
            },
            {
              titulo: 'Lectura: Los Gastos Hormiga que Devoran el Sueldo',
              tipo: TipoLeccion.LECTURA,
              orden: 2,
              contenidoHtml: `
                <h3>¿Qué son los gastos hormiga?</h3>
                <p>Son aquellas pequeñas compras diarias que parecen insignificantes (un café diario, suscripciones que no usas, comisiones de cajero) pero que sumadas a fin de mes representan hasta un 20% de tus ingresos.</p>
                <p>Registrar cada gasto en una aplicación o libreta es el primer paso para la libertad financiera.</p>
              `,
            },
          ],
        },
        {
          titulo: 'Evaluación Financiera',
          descripcion: 'Evalúa tu salud financiera. Nota: Todas las respuestas correctas son la Opción A.',
          orden: 2,
          lecciones: [
            {
              titulo: 'Cuestionario de Salud Financiera',
              tipo: TipoLeccion.CUESTIONARIO,
              orden: 1,
              calificacionMinima: 60,
              preguntas: [
                {
                  texto: '¿En qué consiste la regla de presupuesto 50/30/20?',
                  orden: 1,
                  opciones: [
                    { texto: 'Opción A: Destinar 50% a necesidades básicas, 30% a gustos/estilo de vida y 20% al ahorro e inversión.', esCorrecta: true },
                    { texto: 'Opción B: Gastar el 50% el primer fin de semana, 30% el segundo y pedir prestado 20%.', esCorrecta: false },
                    { texto: 'Opción C: Ahorrar el 50% pagando solo la mitad de la renta del hogar.', esCorrecta: false },
                    { texto: 'Opción D: Ninguna de las opciones es correcta.', esCorrecta: false },
                  ],
                },
                {
                  texto: '¿Qué es el fondo de emergencia ideal?',
                  orden: 2,
                  opciones: [
                    { texto: 'Opción A: Un ahorro disponible que cubre entre 3 y 6 meses de tus gastos fijos indispensables.', esCorrecta: true },
                    { texto: 'Opción B: Las monedas que quedan en el sillón de la sala.', esCorrecta: false },
                    { texto: 'Opción C: Una tarjeta de crédito topada al límite.', esCorrecta: false },
                    { texto: 'Opción D: Comprar billetes de lotería cada fin de mes.', esCorrecta: false },
                  ],
                },
                {
                  texto: '¿Cuál es la diferencia primordial entre ahorrar e invertir?',
                  orden: 3,
                  opciones: [
                    { texto: 'Opción A: Ahorrar es guardar el dinero de forma segura e invertir es ponerlo a trabajar para generar rendimientos y ganarle a la inflación.', esCorrecta: true },
                    { texto: 'Opción B: Ahorrar es en el banco e invertir es comprar ropa de marca.', esCorrecta: false },
                    { texto: 'Opción C: Son exactamente lo mismo sin ninguna distinción.', esCorrecta: false },
                    { texto: 'Opción D: Invertir significa gastarse todo el aguinaldo en una semana.', esCorrecta: false },
                  ],
                },
              ],
            },
          ],
        },
      ],
    },
    {
      nombre: 'Desarrollo Web Básico y Diseño Digital',
      descripcion: 'Entiende cómo funcionan las páginas web modernas, aprende la estructura de HTML y el estilo visual de CSS de una manera amigable y práctica.',
      portada: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?q=80&w=1200&auto=format&fit=crop',
      etiquetas: ['programación', 'web', 'HTML', 'CSS'],
      nivel: NivelCurso.INTERMEDIO,
      duracionEstimada: 90,
      modulos: [
        {
          titulo: 'Estructura y Estilo en la Web',
          descripcion: 'El esqueleto (HTML) y la ropa visual (CSS) de toda página moderna.',
          orden: 1,
          lecciones: [
            {
              titulo: '¿Cómo funciona Internet y las páginas web?',
              tipo: TipoLeccion.VIDEO,
              orden: 1,
              recursoUrl: 'https://www.youtube.com/watch?v=MDLn5-zSQQI',
              duracionSeg: 500,
            },
            {
              titulo: 'Lectura: Etiquetas HTML Fundamentales',
              tipo: TipoLeccion.LECTURA,
              orden: 2,
              contenidoHtml: `
                <h3>Las etiquetas principales</h3>
                <p>HTML utiliza etiquetas envueltas en corchetes angulares para estructurar el contenido:</p>
                <ul>
                  <li><code>&lt;h1&gt;</code>: Título principal de la página.</li>
                  <li><code>&lt;p&gt;</code>: Párrafos de texto.</li>
                  <li><code>&lt;a href="..."&gt;</code>: Enlaces o hipervínculos a otras páginas.</li>
                </ul>
              `,
            },
          ],
        },
        {
          titulo: 'Evaluación de Desarrollo Web',
          descripcion: 'Demuestra tus bases en web. Nota: Todas las respuestas correctas son la Opción A.',
          orden: 2,
          lecciones: [
            {
              titulo: 'Cuestionario HTML & CSS',
              tipo: TipoLeccion.CUESTIONARIO,
              orden: 1,
              calificacionMinima: 60,
              preguntas: [
                {
                  texto: '¿Cuál es la función principal del lenguaje HTML en el desarrollo web?',
                  orden: 1,
                  opciones: [
                    { texto: 'Opción A: Definir la estructura y el contenido semántico de una página web.', esCorrecta: true },
                    { texto: 'Opción B: Pintar colores y agregar animaciones en 3D en el servidor.', esCorrecta: false },
                    { texto: 'Opción C: Administrar la base de datos de usuarios en el backend.', esCorrecta: false },
                    { texto: 'Opción D: Reiniciar el módem cuando se va el internet.', esCorrecta: false },
                  ],
                },
                {
                  texto: '¿Qué rol juega CSS cuando creamos un sitio web?',
                  orden: 2,
                  opciones: [
                    { texto: 'Opción A: Controlar el diseño visual, los colores, tipografías y adaptación a celulares (responsive design).', esCorrecta: true },
                    { texto: 'Opción B: Conectar el cable de red a los servidores.', esCorrecta: false },
                    { texto: 'Opción C: Reemplazar por completo el sistema operativo del usuario.', esCorrecta: false },
                    { texto: 'Opción D: Crear virus informáticos ocultos en imágenes.', esCorrecta: false },
                  ],
                },
                {
                  texto: '¿Qué significa que un diseño web sea "Responsive"?',
                  orden: 3,
                  opciones: [
                    { texto: 'Opción A: Que la interfaz se adapta automáticamente de forma correcta a pantallas de celulares, tablets y computadoras.', esCorrecta: true },
                    { texto: 'Opción B: Que la página te saluda con un mensaje de voz al abrirla.', esCorrecta: false },
                    { texto: 'Opción C: Que carga en 10 minutos sin consumir luz eléctrica.', esCorrecta: false },
                    { texto: 'Opción D: Ninguna de las opciones anteriores.', esCorrecta: false },
                  ],
                },
              ],
            },
          ],
        },
      ],
    },
    {
      nombre: 'Habilidades de Comunicación Directiva y Oratoria',
      descripcion: 'Domina el arte de expresarte con claridad, persuadir a tus audiencias, hablar en público con seguridad y liderar juntas efectivas.',
      portada: 'https://images.unsplash.com/photo-1475721027785-f74eccf877e2?q=80&w=1200&auto=format&fit=crop',
      etiquetas: ['liderazgo', 'comunicación', 'soft-skills', 'oratoria'],
      nivel: NivelCurso.AVANZADO,
      duracionEstimada: 75,
      modulos: [
        {
          titulo: 'El Lenguaje Corporal y la Voz',
          descripcion: 'Cómo proyectar seguridad, empatía y convicción antes de decir una sola palabra.',
          orden: 1,
          lecciones: [
            {
              titulo: 'Técnicas de Modulación de Voz y Postura',
              tipo: TipoLeccion.VIDEO,
              orden: 1,
              recursoUrl: 'https://www.youtube.com/watch?v=eIho2S0ZahI',
              duracionSeg: 480,
            },
            {
              titulo: 'Lectura: Estructura de una Presentación de Impacto',
              tipo: TipoLeccion.LECTURA,
              orden: 2,
              contenidoHtml: `
                <h3>El gancho inicial</h3>
                <p>Los primeros 30 segundos de una presentación determinan la atención del público. Inicia siempre con:</p>
                <ul>
                  <li>Una estadística sorprendente o dato impactante.</li>
                  <li>Una pregunta retórica que invite a reflexionar.</li>
                  <li>Una breve historia personal que conecte emocionalmente con el tema.</li>
                </ul>
              `,
            },
          ],
        },
        {
          titulo: 'Evaluación de Comunicación',
          descripcion: 'Valida tu liderazgo comunicativo. Nota: Todas las respuestas correctas son la Opción A.',
          orden: 2,
          lecciones: [
            {
              titulo: 'Cuestionario de Oratoria y Liderazgo',
              tipo: TipoLeccion.CUESTIONARIO,
              orden: 1,
              calificacionMinima: 60,
              preguntas: [
                {
                  texto: '¿Qué porcentaje del impacto en un mensaje presencial proviene del lenguaje no verbal y el tono de voz?',
                  orden: 1,
                  opciones: [
                    { texto: 'Opción A: Más del 90% (la comunicación no verbal y vocal supera en impacto al contenido escrito puro).', esCorrecta: true },
                    { texto: 'Opción B: Exactamente el 0%, a la gente solo le importan las diapositivas con mucho texto.', esCorrecta: false },
                    { texto: 'Opción C: Menos del 5%, la postura no tiene ninguna relevancia comunicativa.', esCorrecta: false },
                    { texto: 'Opción D: Ninguna de las opciones.', esCorrecta: false },
                  ],
                },
                {
                  texto: '¿Cuál es la mejor manera de iniciar una conferencia o presentación importante?',
                  orden: 2,
                  opciones: [
                    { texto: 'Opción A: Con un gancho poderoso: una pregunta retórica, una estadística impactante o una breve historia de valor.', esCorrecta: true },
                    { texto: 'Opción B: Pidiendo disculpas por no haber preparado bien el material.', esCorrecta: false },
                    { texto: 'Opción C: Leyendo en voz baja y de espaldas un párrafo de 50 líneas.', esCorrecta: false },
                    { texto: 'Opción D: Quedándose en absoluto silencio durante los primeros 10 minutos.', esCorrecta: false },
                  ],
                },
                {
                  texto: '¿Qué es la escucha activa durante una reunión de equipo?',
                  orden: 3,
                  opciones: [
                    { texto: 'Opción A: Prestar atención plena para comprender la perspectiva del interlocutor, haciendo preguntas valiosas sin interrumpir.', esCorrecta: true },
                    { texto: 'Opción B: Fingir que escuchas mientras respondes mensajes en el celular.', esCorrecta: false },
                    { texto: 'Opción C: Interrumpir a la persona cada 5 segundos para imponer tu opinión.', esCorrecta: false },
                    { texto: 'Opción D: Grabar la reunión en audio e irse a almorzar.', esCorrecta: false },
                  ],
                },
              ],
            },
          ],
        },
      ],
    },
  ];

  for (const cData of cursosData) {
    const curso = await prisma.curso.create({
      data: {
        nombre: cData.nombre,
        descripcion: cData.descripcion,
        portada: cData.portada,
        etiquetas: cData.etiquetas,
        nivel: cData.nivel,
        estado: EstadoCurso.PUBLICADO,
        duracionEstimada: cData.duracionEstimada,
        autorId: admin.id,
      },
    });

    console.log(`📚 Curso creado: "${curso.nombre}" (ID: ${curso.id})`);

    for (const mod of cData.modulos) {
      const modulo = await prisma.modulo.create({
        data: {
          cursoId: curso.id,
          titulo: mod.titulo,
          descripcion: mod.descripcion,
          orden: mod.orden,
        },
      });

      for (const lec of mod.lecciones) {
        const l: any = lec;
        const leccion = await prisma.leccion.create({
          data: {
            moduloId: modulo.id,
            titulo: l.titulo,
            tipo: l.tipo,
            orden: l.orden,
            esObligatoria: true,
            recursoUrl: l.recursoUrl,
            duracionSeg: l.duracionSeg,
            contenidoHtml: l.contenidoHtml,
            calificacionMinima: l.calificacionMinima,
          },
        });

        if (l.tipo === TipoLeccion.CUESTIONARIO && l.preguntas) {
          for (const preg of l.preguntas) {
            const pregunta = await prisma.pregunta.create({
              data: {
                leccionId: leccion.id,
                texto: preg.texto,
                orden: preg.orden,
              },
            });

            if (preg.opciones) {
              await prisma.opcion.createMany({
                data: preg.opciones.map((op) => ({
                  preguntaId: pregunta.id,
                  texto: op.texto,
                  esCorrecta: op.esCorrecta,
                })),
              });
            }
          }
        }
      }
    }
  }

  console.log('\n✅ ¡Los 5 cursos han sido creados y publicados exitosamente en tu base de datos!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

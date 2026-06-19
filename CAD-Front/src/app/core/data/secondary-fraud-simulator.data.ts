export type SimulatorChoiceType = 'good' | 'warn' | 'bad';
export type SimulatorChatRole = 'system' | 'other' | 'me';

export interface SimulatorMetadata {
  project: string;
  productId: string;
  version: string;
  audience: string;
  subsegment: string;
  dimension: string;
  publicAxis: string;
  format: string;
  estimatedDuration: string;
}

export interface SimulatorStatRow {
  icon: string;
  title: string;
  subtitle: string;
}

export interface SimulatorCaseStats {
  headerTag: string;
  title: string;
  bigStat: {
    value: string;
    label: string;
  };
  rows: SimulatorStatRow[];
  source: string;
}

export interface SimulatorChatMessage {
  role: SimulatorChatRole;
  text: string;
  time?: string;
  tone?: 'alert';
}

export interface SimulatorChoice {
  title: string;
  safe: number;
  risk: number;
  type: SimulatorChoiceType;
  feedback: string;
}

export interface SimulatorStep {
  avatar: 'brand-app' | 'brand-shipping' | 'brand-gov' | 'me';
  name: string;
  verified: boolean;
  status: string;
  time: string;
  question: string;
  text: string;
  hint: string;
  chat: SimulatorChatMessage[];
  choices: SimulatorChoice[];
}

export interface SimulatorCase {
  id: number;
  name: string;
  description: string;
  difficulty: string;
  difficultyClass: 'd1' | 'd2' | 'd3';
  successText: string;
  failText: string;
  stats: SimulatorCaseStats;
  steps: SimulatorStep[];
}

export interface SecondaryFraudSimulatorData {
  metadata: SimulatorMetadata;
  cases: SimulatorCase[];
}

export const SECONDARY_FRAUD_SIMULATOR_DATA: SecondaryFraudSimulatorData = {
  metadata: {
    project: 'Cursos Alfa Digital Jalisco',
    productId: 'CDJ-154',
    version: 'v6_3casos',
    audience: 'Estudiantes',
    subsegment: 'Secundaria',
    dimension: 'D2',
    publicAxis: 'Privacidad y seguridad',
    format: 'Simulador ramificado de decisiones',
    estimatedDuration: '8 a 12 min',
  },
  cases: [
    {
      id: 1,
      name: 'La promoción inesperada',
      description: 'Un mensaje te ofrece algo demasiado bueno',
      difficulty: 'Fácil',
      difficultyClass: 'd1',
      successText: '¡Bien! Detectaste el patrón clásico del "premio sin haber participado".',
      failText: 'Caíste en el patrón clásico: prometen algo gratis y piden datos a cambio.',
      stats: {
        headerTag: 'Caso 1 · Promoción inesperada',
        title: '¿Qué tan común es este fraude?',
        bigStat: {
          value: '34%',
          label: 'de los mexicanos recibió mensajes sospechosos pidiendo datos',
        },
        rows: [
          {
            icon: '📱',
            title: '8 de cada 10 fraudes',
            subtitle: 'empiezan con un mensaje de "premio" o "promoción"',
          },
          {
            icon: '👥',
            title: 'Edad más afectada: 18-34 años',
            subtitle: 'Los jóvenes son el grupo principal en redes',
          },
          {
            icon: '🔗',
            title: 'Ligas falsas',
            subtitle: 'Suplantan marcas conocidas para robar contraseñas',
          },
        ],
        source: 'Fuente: The CIU · Análisis sobre Phishing en México 2025',
      },
      steps: [
        {
          avatar: 'brand-app',
          name: 'WhatzApp Plus',
          verified: true,
          status: 'mensaje oficial',
          time: '15:42',
          question: '¿Qué haces con el mensaje?',
          text: 'Recibes un WhatsApp de un número con check azul. Dice que ganaste por ser usuario "premium".',
          hint: 'WhatsApp NO regala dinero ni iPhones por usar la app. El check azul también puede ser una imagen falsa pegada en el avatar.',
          chat: [
            { role: 'system', text: 'Hoy · 15:42' },
            { role: 'other', text: '🎉 ¡FELICIDADES! Has sido seleccionado como usuario PREMIUM', time: '15:42' },
            { role: 'other', text: 'Por usar WhatsApp >5 años, ganaste un iPhone 16 Pro Max + $5,000 USD', time: '15:42' },
            { role: 'other', text: 'Solo confirma tu identidad aquí 👇', time: '15:43' },
            { role: 'other', text: 'https://whatsapp-premios2025.online/claim', time: '15:43', tone: 'alert' },
          ],
          choices: [
            {
              title: 'Borrar y bloquear el número',
              safe: 5,
              risk: 0,
              type: 'good',
              feedback: 'Excelente. La regla de oro: si no entraste a un sorteo, no hay premio. Bloquear es la respuesta correcta.',
            },
            {
              title: 'Entrar a la liga para reclamar el premio',
              safe: 0,
              risk: 5,
              type: 'bad',
              feedback: 'Cayó. WhatsApp jamás regala dinero. La liga termina pidiendo datos bancarios "para enviar el premio".',
            },
            {
              title: 'Reenviarlo a 5 amigos como pide otro mensaje',
              safe: 0,
              risk: 3,
              type: 'bad',
              feedback: 'Mala idea. Multiplicar el fraude pone en riesgo a tus amigos. Y nunca llegará premio.',
            },
          ],
        },
        {
          avatar: 'brand-app',
          name: '+57 312 8843201',
          verified: false,
          status: 'insistiendo',
          time: '15:48',
          question: '¿Qué haces ahora?',
          text: 'Vuelve a llegar otro mensaje del MISMO contacto, esta vez con tu nombre completo.',
          hint: 'Que sepa tu nombre no significa que sea oficial. Tu nombre puede sacarse de redes sociales públicas.',
          chat: [
            { role: 'other', text: 'Hola Diego, ¿no viste el mensaje? Solo quedan 2 hrs', time: '15:48', tone: 'alert' },
            { role: 'other', text: 'Eres el usuario #847 seleccionado de Jalisco', time: '15:48', tone: 'alert' },
            { role: 'other', text: 'Si no contestas, pasa al siguiente 😢', time: '15:49', tone: 'alert' },
          ],
          choices: [
            {
              title: 'Bloquear inmediatamente sin responder',
              safe: 5,
              risk: 0,
              type: 'good',
              feedback: 'Perfecto. No respondas para no validar tu número. Bloquea y reporta como spam en WhatsApp.',
            },
            {
              title: 'Responder solo "¿quién eres?"',
              safe: 1,
              risk: 3,
              type: 'warn',
              feedback: 'Mala señal: al responder ya saben que tu número está activo. Te van a meter en más listas de spam y fraude.',
            },
            {
              title: 'Tomar captura para enseñarle a alguien',
              safe: 4,
              risk: 0,
              type: 'good',
              feedback: 'Muy buena. La captura sirve si quieres reportar al 088 o avisar a tu familia. Después bloquea sin contestar.',
            },
          ],
        },
        {
          avatar: 'me',
          name: 'Tu cierre',
          verified: false,
          status: 'protegiendo a otros',
          time: '15:55',
          question: '¿Qué haces para proteger a más gente?',
          text: 'Bloqueaste el contacto. Ahora piensa en tus amigos que también pueden recibir este mensaje.',
          hint: 'Reportar es ciudadanía digital activa. Un reporte tuyo puede frenar miles de mensajes a otros.',
          chat: [
            { role: 'system', text: 'Bloqueaste el número 🚫' },
            { role: 'system', text: 'Pero el mismo grupo manda miles de mensajes diarios' },
          ],
          choices: [
            {
              title: 'Solo decirle a un amigo cercano',
              safe: 3,
              risk: 0,
              type: 'warn',
              feedback: 'Bien, pero es solo una persona. Un reporte oficial al 088 puede frenar a cientos. Tarda 2 minutos.',
            },
            {
              title: 'Reportar al 088 + WhatsApp + avisar al grupo familiar',
              safe: 5,
              risk: 0,
              type: 'good',
              feedback: '¡Eso es! 088 es Guardia Nacional. WhatsApp también permite reportar números. Y avisar a tu familia evita que tu mamá o abuela caigan.',
            },
            {
              title: 'No hacer nada más, ya bloqueaste',
              safe: 1,
              risk: 1,
              type: 'warn',
              feedback: 'Bloquear te protege a ti, pero el estafador sigue libre. Reportar al 088 toma poco y ayuda a muchos.',
            },
          ],
        },
      ],
    },
    {
      id: 2,
      name: 'El paquete pendiente',
      description: 'Un aviso te pide resolver un supuesto envío',
      difficulty: 'Medio',
      difficultyClass: 'd2',
      successText: '¡Bien! Reconociste el "cargo de cinco pesitos" como anzuelo para clonar tarjeta.',
      failText: 'Te enganchó la promesa de "solo cinco pesos". Es la trampa más usada en 2025 en México.',
      stats: {
        headerTag: 'Caso 2 · Paquete pendiente',
        title: 'El fraude de los "5 pesitos"',
        bigStat: {
          value: '$2,700',
          label: 'es el cargo promedio que aparece después del cobro mínimo',
        },
        rows: [
          {
            icon: '📦',
            title: 'Suplantan Estafeta, FedEx, DHL',
            subtitle: 'Diseños idénticos al sitio oficial',
          },
          {
            icon: '💳',
            title: 'Pides "5 pesos de envío"',
            subtitle: 'Y luego cobran cientos o miles',
          },
          {
            icon: '⚖️',
            title: 'Banco no reembolsa',
            subtitle: 'Marca la operación como "autorizada por ti"',
          },
        ],
        source: 'Fuente: El Sol de Sinaloa · CONDUSEF · Casos reportados 2025',
      },
      steps: [
        {
          avatar: 'brand-shipping',
          name: 'Estaf3ta MX',
          verified: true,
          status: 'sistema automático',
          time: '09:15',
          question: '¿Qué haces con el mensaje?',
          text: 'Te llega un SMS que parece de paquetería. Sí estás esperando un paquete que pediste hace 3 días.',
          hint: 'Las paqueterías reales nunca te cobran "ajustes" por SMS. El cobro va siempre a quien envió o al destinatario al recibir.',
          chat: [
            { role: 'system', text: 'SMS · 09:15' },
            { role: 'other', text: '📦 Estafeta: Su paquete EST-7783410MX está retenido', time: '09:15' },
            { role: 'other', text: 'Falta ajuste de envío de $5.00. Sin este pago será devuelto', time: '09:16', tone: 'alert' },
            { role: 'other', text: 'Paga aquí: https://estafeta-rastreo.com/pago', time: '09:16', tone: 'alert' },
          ],
          choices: [
            {
              title: 'Entrar a la liga para "ver el rastreo"',
              safe: 0,
              risk: 4,
              type: 'bad',
              feedback: 'Mala idea. Solo abrir la liga puede instalar código en tu cel o pedir login con tu cuenta de Google.',
            },
            {
              title: 'Ir al sitio oficial estafeta.com a rastrear con tu guía',
              safe: 5,
              risk: 0,
              type: 'good',
              feedback: 'Excelente. Si tienes guía, el sitio oficial te dirá la verdad. Si no aparece, era trampa.',
            },
            {
              title: 'Pagar los $5, total no es nada',
              safe: 0,
              risk: 5,
              type: 'bad',
              feedback: 'Cayó. El "ajuste de $5" es para clonar tu tarjeta. En segundos cobran cientos o miles más. Ningún paquete se "devuelve" por $5.',
            },
          ],
        },
        {
          avatar: 'brand-shipping',
          name: 'Estaf3ta MX',
          verified: false,
          status: 'siguiente intento',
          time: '10:22',
          question: '¿Qué haces?',
          text: 'Verificaste en estafeta.com. Tu paquete real va en camino y NO requiere pagos extra. Pero llega otro SMS más insistente.',
          hint: 'Cuando confirmas que algo es fraude, el siguiente mensaje del mismo origen es más fraude.',
          chat: [
            { role: 'other', text: '📦 ÚLTIMO AVISO: Su paquete será destruido en 6 hrs', time: '10:22', tone: 'alert' },
            { role: 'other', text: 'Para evitar pérdida, pague AHORA: https://estafeta-recover.online', time: '10:22', tone: 'alert' },
            { role: 'other', text: 'Si no paga, no podrá reclamar reembolso al vendedor', time: '10:23', tone: 'alert' },
          ],
          choices: [
            {
              title: 'Capturar evidencia, bloquear y reportar al 088',
              safe: 5,
              risk: 0,
              type: 'good',
              feedback: 'Perfecto. La evidencia ayuda a la Guardia Nacional a rastrear el grupo. Bloquear evita más mensajes.',
            },
            {
              title: 'Pagar para no perder el paquete real',
              safe: 0,
              risk: 5,
              type: 'bad',
              feedback: 'Trampa de duda. Tu paquete REAL ya viene en camino, lo confirmaste. Estos mensajes son de otro origen pretendiendo ser de Estafeta.',
            },
            {
              title: 'Bloquear y borrar todos los mensajes',
              safe: 4,
              risk: 1,
              type: 'warn',
              feedback: 'Bloqueas, pero pierdes la evidencia. Mejor toma captura antes para reportar.',
            },
          ],
        },
        {
          avatar: 'me',
          name: 'Tu cierre',
          verified: false,
          status: 'protección activa',
          time: '10:30',
          question: '¿Qué le dices a tu mamá que está esperando otro paquete?',
          text: 'Recuerdas que tu mamá pidió algo por internet. Le quieres avisar para que no caiga.',
          hint: 'La mejor forma de proteger a otros es darles una regla simple, no un susto.',
          chat: [
            { role: 'system', text: 'Tu mamá también espera un paquete 📦' },
            { role: 'system', text: '¿Cómo le explicas la regla?' },
          ],
          choices: [
            {
              title: 'Mostrarle solo el SMS para que vea',
              safe: 3,
              risk: 1,
              type: 'warn',
              feedback: 'Ayuda, pero sin la regla puede confundirse cuando reciba uno diferente. Dale el principio, no solo el ejemplo.',
            },
            {
              title: '"Nunca pagues por SMS o WhatsApp. Solo desde la app o sitio oficial."',
              safe: 5,
              risk: 0,
              type: 'good',
              feedback: 'Excelente. Una regla simple y memorable es más útil que asustarla. Las paqueterías reales solo cobran al inicio o al recibir.',
            },
            {
              title: 'Decirle "no abras nada que llegue"',
              safe: 1,
              risk: 1,
              type: 'warn',
              feedback: 'Demasiado vago. Necesita saber distinguir entre lo real (app oficial) y lo falso (SMS con liga).',
            },
          ],
        },
      ],
    },
    {
      id: 3,
      name: 'Actualización urgente',
      description: 'Te piden confirmar datos para no perder un apoyo',
      difficulty: 'Difícil',
      difficultyClass: 'd3',
      successText: '¡Bien! Detectaste la suplantación oficial sin caer en la presión.',
      failText: 'La presión por "perder la beca" te empujó a entregar datos. Es la trampa real más reportada en 2025.',
      stats: {
        headerTag: 'Caso 3 · Actualización urgente',
        title: 'Suplantación de apoyos: alerta',
        bigStat: {
          value: '12 instituciones',
          label: 'fueron suplantadas oficialmente solo en julio de 2025',
        },
        rows: [
          {
            icon: '🏛️',
            title: 'Becas Bienestar nunca usa WhatsApp',
            subtitle: 'Solo gob.mx/becasbenitojuarez',
          },
          {
            icon: '🎓',
            title: 'Estudiantes 12-18 años',
            subtitle: 'Son el blanco principal de este fraude',
          },
          {
            icon: '📋',
            title: 'CURP + INE + tarjeta',
            subtitle: '= robo de identidad y créditos a tu nombre',
          },
          {
            icon: '💰',
            title: '$8,750 pesos promedio',
            subtitle: 'es lo que pierde cada víctima',
          },
        ],
        source: 'Fuente: CONDUSEF · Coordinación Nacional de Becas Bienestar 2025',
      },
      steps: [
        {
          avatar: 'brand-gov',
          name: 'Becas Bienestar Oficial',
          verified: true,
          status: 'comunicado urgente',
          time: '08:30',
          question: '¿Qué haces con el mensaje?',
          text: 'Recibes un WhatsApp con escudo nacional. Tú SÍ tienes Beca Benito Juárez. Y el mensaje habla de cosas reales como "tu plantel" y "monto bimestral".',
          hint: 'Que mencione datos reales (plantel, monto) no significa que sea oficial. Esa información se filtra de bases de datos hackeadas.',
          chat: [
            { role: 'system', text: 'Hoy · 8:30 a.m.' },
            { role: 'other', text: 'GOBIERNO DE MÉXICO 🇲🇽', time: '8:30' },
            { role: 'other', text: 'Estimado(a) becario(a): Detectamos inconsistencia en tu plantel registrado', time: '8:30' },
            { role: 'other', text: 'Para mantener tu apoyo bimestral de $1,900 debes validar tus datos en 24 hrs', time: '8:31', tone: 'alert' },
            { role: 'other', text: 'Acceso oficial: https://gob-mx-becas.com/validar', time: '8:31', tone: 'alert' },
          ],
          choices: [
            {
              title: 'Preguntarle a tu maestro de tutoría primero',
              safe: 5,
              risk: 0,
              type: 'good',
              feedback: 'Excelente. Tu escuela tiene el contacto real con la Coordinación. Ningún maestro te dirá que es por WhatsApp.',
            },
            {
              title: 'Entrar al link, dice "gob-mx-becas.com"',
              safe: 0,
              risk: 5,
              type: 'bad',
              feedback: 'Trampa. El sitio OFICIAL es gob.mx (con punto, no guion). "gob-mx-becas.com" es totalmente falso aunque suene parecido.',
            },
            {
              title: 'Buscar en Google "becas Benito Juárez gob.mx" e ir tú',
              safe: 5,
              risk: 0,
              type: 'good',
              feedback: '¡Perfecto! Este es el filtro maestro. NUNCA uses ligas que llegan; busca tú el sitio oficial. El real no pide validar datos por WhatsApp.',
            },
          ],
        },
        {
          avatar: 'brand-gov',
          name: 'Becas Bienestar Oficial',
          verified: false,
          status: 'segundo intento',
          time: '13:45',
          question: '¿Qué haces?',
          text: 'Verificaste en gob.mx oficial. No hay tal "validación". Pero llega otro mensaje con el nombre de tu escuela real.',
          hint: 'Cuando un fraude usa información personal correcta, es porque ya tiene tus datos parciales. No te asustes: significa que necesitan más datos para completar el robo.',
          chat: [
            { role: 'other', text: 'Becario de Sec. 38 "Ramón López Velarde": último aviso', time: '13:45', tone: 'alert' },
            { role: 'other', text: 'Tu beca será cancelada hoy 6 pm si no validas', time: '13:45', tone: 'alert' },
            { role: 'other', text: 'Solo necesitamos: CURP, foto INE y los 16 dígitos de tu tarjeta para depósito', time: '13:46', tone: 'alert' },
          ],
          choices: [
            {
              title: 'Mandar la info, no quieres perder $1,900 al bimestre',
              safe: 0,
              risk: 5,
              type: 'bad',
              feedback: 'Cayó la trampa. CURP + INE + 16 dígitos = robo de identidad completo. Pueden vaciar tu tarjeta Y abrir créditos a tu nombre.',
            },
            {
              title: 'Reportar al 088 con captura y bloquear',
              safe: 5,
              risk: 0,
              type: 'good',
              feedback: '¡Excelente! El 088 (Guardia Nacional) tiene unidad cibernética. Cada reporte ayuda a desmantelar la red.',
            },
            {
              title: 'Capturar evidencia y bloquear sin responder',
              safe: 4,
              risk: 0,
              type: 'good',
              feedback: 'Bien. Sin respuesta no validan tu número. La captura sirve para denunciar.',
            },
          ],
        },
        {
          avatar: 'me',
          name: 'Conversación con tu mamá',
          verified: false,
          status: 'compartiendo el aprendizaje',
          time: '19:00',
          question: '¿Cómo le explicas la regla a tu mamá?',
          text: 'Tu mamá tampoco sabía. Te pregunta cómo distinguir un mensaje real del gobierno.',
          hint: 'La regla más simple: gobierno y banca real NUNCA usan WhatsApp para pedir datos. Punto.',
          chat: [
            { role: 'me', text: 'Mamá, hay un fraude muy común con becas falsas', time: '19:00' },
            { role: 'system', text: 'Tu mamá: "¿Y cómo sé si es real?"' },
          ],
          choices: [
            {
              title: '"Pregúntame cuando recibas algo así"',
              safe: 3,
              risk: 1,
              type: 'warn',
              feedback: 'Bien, pero no siempre estarás. Mejor enséñale la regla para que sea autónoma.',
            },
            {
              title: '"Si te llega por WhatsApp y pide datos, NO es del gobierno"',
              safe: 5,
              risk: 0,
              type: 'good',
              feedback: '¡Esa es! Es la regla más útil. Gobierno y banca usan SMS o app oficial, nunca WhatsApp para pedir datos sensibles.',
            },
            {
              title: '"Verifica en Google que el dominio termine en .gob.mx"',
              safe: 4,
              risk: 0,
              type: 'good',
              feedback: 'Buena, pero algo técnica. Combínala con "no des datos por WhatsApp aunque parezca oficial".',
            },
          ],
        },
      ],
    },
  ],
};

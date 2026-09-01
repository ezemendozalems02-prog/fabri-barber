// ------------------------------------------------------------------
// CONTENIDO EDITABLE — Sports Recovery
// Todo el contenido de ejemplo vive acá para que sea fácil de cambiar.
// No hay backend: los precios / datos son placeholders editables.
// ------------------------------------------------------------------

export const SITE = {
  name: 'Sports Recovery',
  tagline: 'Recuperación deportiva. Movimiento. Rendimiento.',
  // TODO: reemplazar por datos reales
  whatsapp: '5490000000000', // número en formato internacional sin +
  instagram: 'https://instagram.com/sportsrecovery',
  instagramHandle: '@sportsrecovery',
  address: 'Dirección a confirmar', // editable
  hours: 'Lun a Vie · 09:00–13:00 / 15:00–20:00', // editable
  email: 'hola@sportsrecovery.com', // editable
}

export const NAV_LINKS = [
  { label: 'Inicio', href: '#inicio' },
  { label: 'Nosotros', href: '#nosotros' },
  { label: 'Servicios', href: '#servicios' },
  { label: 'Recovery', href: '#recovery' },
  { label: 'FAQ', href: '#faq' },
  { label: 'Contacto', href: '#contacto' },
]

export type Service = {
  id: string
  index: string
  title: string
  description: string
  bullets: string[]
  image: string
  duration: string
  price: string // placeholder editable
}

export const SERVICES: Service[] = [
  {
    id: 'kinesiologia',
    index: '01',
    title: 'Kinesiología',
    description:
      'Evaluación y tratamiento orientado a recuperar el movimiento, reducir limitaciones y acompañar procesos de recuperación física.',
    bullets: [
      'Evaluación funcional',
      'Tratamiento personalizado',
      'Terapia manual',
      'Recuperación de lesiones',
      'Reeducación del movimiento',
      'Seguimiento',
    ],
    image: '/images/service-kinesiologia.png',
    duration: '50 min',
    price: 'Precio a confirmar',
  },
  {
    id: 'recovery',
    index: '02',
    title: 'Recovery Deportivo',
    description:
      'Sesiones orientadas a acelerar la recuperación después del entrenamiento, competencia o esfuerzo físico.',
    bullets: [
      'Recuperación post-entrenamiento',
      'Recuperación post-partido',
      'Descarga muscular',
      'Movilidad',
      'Preparación para volver a entrenar',
    ],
    image: '/images/service-recovery.png',
    duration: '45 min',
    price: 'Precio a confirmar',
  },
  {
    id: 'descarga',
    index: '03',
    title: 'Descarga Muscular',
    description:
      'Trabajo específico sobre la musculatura para disminuir tensión, mejorar movilidad y favorecer la recuperación.',
    bullets: ['Liberación muscular', 'Reducción de tensión', 'Mejora de movilidad'],
    image: '/images/service-recovery.png',
    duration: '40 min',
    price: 'Precio a confirmar',
  },
  {
    id: 'movilidad',
    index: '04',
    title: 'Movilidad',
    description:
      'Trabajo específico para mejorar rangos de movimiento, movilidad articular y calidad del movimiento.',
    bullets: ['Movilidad articular', 'Amplitud de movimiento', 'Calidad del movimiento'],
    image: '/images/service-movilidad.png',
    duration: '40 min',
    price: 'Precio a confirmar',
  },
  {
    id: 'prevencion',
    index: '05',
    title: 'Prevención',
    description:
      'Identificación de limitaciones y factores que pueden afectar el rendimiento o aumentar el riesgo de lesión.',
    bullets: ['Detección de limitaciones', 'Análisis de movimiento', 'Plan preventivo'],
    image: '/images/service-kinesiologia.png',
    duration: '50 min',
    price: 'Precio a confirmar',
  },
  {
    id: 'post-partido',
    index: '06',
    title: 'Post-Partido',
    description:
      'El partido termina. La recuperación recién empieza. Trabajo posterior al esfuerzo para volver mejor.',
    bullets: [
      'Movilidad',
      'Descarga',
      'Recuperación',
      'Revisión del estado muscular',
      'Preparación para el próximo entrenamiento',
    ],
    image: '/images/service-postpartido.png',
    duration: '45 min',
    price: 'Precio a confirmar',
  },
]

export type RecoveryOption = {
  id: string
  title: string
  duration: string
  description: string
  forWho: string
}

export const RECOVERY_MENU: RecoveryOption[] = [
  {
    id: 'post-partido',
    title: 'Post-Partido',
    duration: '45 min',
    description: 'Para después de competir.',
    forWho: 'Deportistas que acaban de jugar o competir.',
  },
  {
    id: 'post-entreno',
    title: 'Post-Entreno',
    duration: '40 min',
    description: 'Para recuperar después de una sesión intensa.',
    forWho: 'Personas que entrenan fuerte y buscan recuperar mejor.',
  },
  {
    id: 'descarga',
    title: 'Descarga',
    duration: '40 min',
    description: 'Para músculos cargados y tensión acumulada.',
    forWho: 'Cuerpos con tensión y sobrecarga muscular.',
  },
  {
    id: 'movilidad',
    title: 'Movilidad',
    duration: '40 min',
    description: 'Para mejorar movimiento y amplitud.',
    forWho: 'Quien busca moverse con más libertad y rango.',
  },
  {
    id: 'personalizada',
    title: 'Recuperación Personalizada',
    duration: 'A definir',
    description: 'Sesión adaptada al estado y objetivo de cada persona.',
    forWho: 'Adaptada a tu estado y objetivo específico.',
  },
]

export const FOR_WHO = [
  { label: 'Futbolistas', index: '01' },
  { label: 'Personas que entrenan', index: '02' },
  { label: 'Runners', index: '03' },
  { label: 'Deportistas', index: '04' },
  { label: 'Personas activas', index: '05' },
  { label: 'Buscan recuperar mejor', index: '06' },
]

export const METHOD = [
  {
    step: '01',
    title: 'Evaluamos',
    text: 'Entendemos tu estado actual, tus necesidades y tu objetivo.',
  },
  {
    step: '02',
    title: 'Identificamos',
    text: 'Detectamos las principales limitaciones o zonas que necesitan atención.',
  },
  {
    step: '03',
    title: 'Trabajamos',
    text: 'Aplicamos el abordaje adecuado para cada caso.',
  },
  {
    step: '04',
    title: 'Acompañamos',
    text: 'Seguimos tu evolución y adaptamos el trabajo según tus necesidades.',
  },
]

export const EXPERIENCE_STEPS = [
  'Llegás',
  'Evaluamos',
  'Trabajamos',
  'Recuperás',
  'Volvés a moverte',
]

export const INSTAGRAM_IMAGES = [
  '/images/ig-1.png',
  '/images/ig-2.png',
  '/images/ig-3.png',
  '/images/ig-4.png',
  '/images/service-movilidad.png',
  '/images/service-recovery.png',
]

// Testimonios de EJEMPLO — reemplazar por reales cuando el cliente los provea.
export const TESTIMONIALS = [
  {
    quote:
      'Volví a entrenar sin molestias y con la cabeza más tranquila. El seguimiento hace toda la diferencia.',
    name: 'Nombre de ejemplo',
    activity: 'Fútbol amateur',
  },
  {
    quote:
      'Después de cada partido paso por acá. Recupero mucho mejor y llego entero a la semana.',
    name: 'Nombre de ejemplo',
    activity: 'Running',
  },
  {
    quote:
      'Me ayudaron a entender mi cuerpo y a moverme mejor. Profesionalismo de principio a fin.',
    name: 'Nombre de ejemplo',
    activity: 'Crossfit',
  },
]

export const FAQS = [
  {
    q: '¿Necesito estar lesionado para hacer una sesión?',
    a: 'No necesariamente. Las sesiones también pueden estar orientadas a recuperación, movilidad, descarga y preparación.',
  },
  {
    q: '¿Cuánto dura una sesión?',
    a: 'La duración depende del servicio seleccionado.',
  },
  {
    q: '¿Tengo que reservar previamente?',
    a: 'Sí, recomendamos reservar previamente para asegurar disponibilidad.',
  },
  {
    q: '¿Qué tengo que llevar?',
    a: 'Ropa cómoda que permita trabajar correctamente sobre la zona a tratar.',
  },
  {
    q: '¿Puedo cancelar mi turno?',
    a: 'Sí, según la política de cancelación definida por Sports Recovery.',
  },
  {
    q: '¿Puedo reservar después de un partido?',
    a: 'Sí. El servicio Post-Partido está pensado específicamente para acompañar la recuperación después de competir.',
  },
  {
    q: '¿Trabajan con deportistas de cualquier nivel?',
    a: 'Sí. Adaptamos el trabajo a cada persona y su nivel.',
  },
  {
    q: '¿Dónde están ubicados?',
    a: 'Dirección a confirmar. Escribinos por WhatsApp para coordinar.',
  },
]

// Horarios de ejemplo para el flujo visual de reserva (sin backend)
export const SAMPLE_TIMES = ['09:00', '10:00', '11:30', '14:00', '15:30', '17:00', '18:30']

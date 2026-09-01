// ------------------------------------------------------------------
// CONTENIDO EDITABLE — FABRI BARBER
// Todo el contenido de la marca vive acá para que sea fácil de cambiar.
// Los precios de SERVICES son los reales provistos por el cliente.
// Los precios de PRODUCTS son de EJEMPLO y deben reemplazarse.
// WhatsApp, Instagram y dirección son PLACEHOLDERS hasta tener los datos reales.
// ------------------------------------------------------------------

export const SITE = {
  name: 'FABRI BARBER',
  tagline: 'Cortes, estilo y actitud.',
  // TODO: reemplazar por datos reales
  whatsapp: '5491100000000', // placeholder — número en formato internacional sin +
  whatsappDisplay: '+54 9 11 XXXX-XXXX',
  instagram: 'https://instagram.com/fabribarber',
  instagramHandle: '@fabribarber',
  address: 'Dirección a definir', // placeholder
  email: 'hola@fabribarber.com',
  hoursGeneral: 'Martes a Sábados · 10:00 a 19:00 hs',
  hoursBreak: '13:00 a 14:00 hs sin atención',
  hoursRadiofrecuencia: 'Martes a Viernes · 10:00 a 19:00 hs',
}

export const NAV_LINKS = [
  { label: 'Inicio', href: '#inicio' },
  { label: 'Servicios', href: '#servicios' },
  { label: 'Cortes', href: '#cortes' },
  { label: 'Productos', href: '#productos' },
  { label: 'Reservar turno', href: '#reservar' },
  { label: 'Preguntas frecuentes', href: '#faq' },
  { label: 'Contacto', href: '#contacto' },
]

export type Service = {
  id: string
  index: string
  title: string
  description: string
  price: number
  duration: number // minutos
  note?: string
}

// Precios reales provistos por el cliente.
export const SERVICES: Service[] = [
  {
    id: 'corte',
    index: '01',
    title: 'Corte',
    description:
      'Corte personalizado según tu estilo, tipo de cabello y forma del rostro. Incluye perfilado de cejas.',
    price: 14000,
    duration: 60,
    note: 'Incluye cejas',
  },
  {
    id: 'barba',
    index: '02',
    title: 'Barba',
    description: 'Perfilado y definición de barba para mantener un look prolijo y cuidado.',
    price: 4000,
    duration: 30,
  },
  {
    id: 'cejas',
    index: '03',
    title: 'Cejas',
    description: 'Perfilado de cejas para complementar tu corte y definir tu mirada.',
    price: 4000,
    duration: 30,
  },
  {
    id: 'claritos',
    index: '04',
    title: 'Claritos',
    description: 'Iluminación y coloración personalizada para darle dimensión y estilo a tu cabello.',
    price: 45000,
    duration: 120,
  },
  {
    id: 'global',
    index: '05',
    title: 'Global',
    description: 'Coloración global para un cambio de look completo y personalizado.',
    price: 55000,
    duration: 120,
  },
  {
    id: 'radiofrecuencia',
    index: '06',
    title: 'Radiofrecuencia',
    description: 'Tratamiento de radiofrecuencia orientado al cuidado facial masculino.',
    price: 15000,
    duration: 60,
    note: 'Martes a viernes',
  },
]

export type Haircut = {
  id: string
  title: string
  description: string
}

// Estilos de ejemplo dentro del servicio "Corte" — el cliente puede
// indicar cuál prefiere de forma opcional al reservar.
export const HAIRCUTS: Haircut[] = [
  { id: 'degrade', title: 'Degradé', description: 'Fade clásico y moderno adaptado a la forma de la cabeza.' },
  { id: 'low-fade', title: 'Low Fade', description: 'Degradé bajo para un estilo limpio y elegante.' },
  { id: 'mid-fade', title: 'Mid Fade', description: 'Un equilibrio entre clásico y moderno.' },
  { id: 'high-fade', title: 'High Fade', description: 'Degradé alto para un look más marcado.' },
  { id: 'taper', title: 'Taper', description: 'Transición sutil y prolija en laterales y nuca.' },
  { id: 'buzz-cut', title: 'Buzz Cut', description: 'Corte corto, práctico y definido.' },
  { id: 'textured-crop', title: 'Textured Crop', description: 'Corte moderno con textura y movimiento.' },
  { id: 'clasico', title: 'Corte Clásico', description: 'Una opción atemporal, prolija y adaptable.' },
]

export type Product = {
  id: string
  title: string
  description: string
  price: number // EJEMPLO — reemplazar por precio real
  icon: 'wax' | 'comb' | 'pomade' | 'oil' | 'shampoo' | 'brush'
}

// Productos y precios de EJEMPLO — reemplazar por el catálogo real.
export const PRODUCTS: Product[] = [
  {
    id: 'cera-matte',
    title: 'Cera Matte',
    description: 'Fijación media/alta con acabado mate.',
    price: 12000,
    icon: 'wax',
  },
  {
    id: 'peine-profesional',
    title: 'Peine Profesional',
    description: 'Peine profesional para peinar y definir tu estilo.',
    price: 8000,
    icon: 'comb',
  },
  {
    id: 'pomada-cabello',
    title: 'Pomada para Cabello',
    description: 'Fijación y brillo controlado para estilos clásicos y modernos.',
    price: 15000,
    icon: 'pomade',
  },
  {
    id: 'aceite-barba',
    title: 'Aceite para Barba',
    description: 'Aceite para hidratar y mantener la barba suave y prolija.',
    price: 13000,
    icon: 'oil',
  },
  {
    id: 'shampoo-masculino',
    title: 'Shampoo Masculino',
    description: 'Shampoo de uso diario para mantener el cabello limpio y saludable.',
    price: 11000,
    icon: 'shampoo',
  },
  {
    id: 'cepillo-barba',
    title: 'Cepillo para Barba',
    description: 'Para ordenar, peinar y mantener la barba en forma.',
    price: 9000,
    icon: 'brush',
  },
]

export const FAQS = [
  {
    q: '¿Cómo puedo reservar un turno?',
    a: 'Elegí el servicio, seleccioná una fecha y horario disponible y completá tus datos. Para confirmar el turno se solicita una seña del 30%.',
  },
  {
    q: '¿La seña es obligatoria?',
    a: 'Sí. El turno queda confirmado una vez acreditada la seña.',
  },
  {
    q: '¿Puedo cancelar mi turno?',
    a: 'Las condiciones de cancelación y devolución de la seña serán informadas al momento de reservar.',
  },
  {
    q: '¿Qué días atiende FABRI BARBER?',
    a: 'La barbería atiende de martes a sábados de 10:00 a 19:00 hs.',
  },
  {
    q: '¿Hay horarios en los que no se atiende?',
    a: 'Sí. De 13:00 a 14:00 hs no hay atención.',
  },
  {
    q: '¿Qué días se realiza radiofrecuencia?',
    a: 'Radiofrecuencia está disponible de martes a viernes de 10:00 a 19:00 hs, excepto de 13:00 a 14:00 hs.',
  },
  {
    q: '¿Qué medios de pago aceptan?',
    a: 'La seña se realiza online mediante Mercado Pago. El saldo restante se abona en el local.',
  },
  {
    q: '¿Puedo elegir qué corte quiero?',
    a: 'Sí. Al reservar un corte podés indicar el estilo que querés, por ejemplo degradé, taper, crop, buzz cut o corte clásico.',
  },
]

// Testimonios de EJEMPLO — reemplazar por reales cuando el cliente los provea.
export const TESTIMONIALS = [
  {
    quote: 'Cada vez que voy salgo con el corte que tenía en mente. Atención de primera y muy prolijos con los detalles.',
    name: 'Nombre de ejemplo',
    activity: 'Cliente habitual',
  },
  {
    quote: 'Reservé el turno desde el celular en dos minutos y me esperaban a horario. Se nota la organización.',
    name: 'Nombre de ejemplo',
    activity: 'Cliente habitual',
  },
  {
    quote: 'El perfilado de barba quedó impecable. Ahora es mi barbería de referencia.',
    name: 'Nombre de ejemplo',
    activity: 'Cliente habitual',
  },
]

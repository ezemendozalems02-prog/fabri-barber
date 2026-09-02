import { ComingSoon } from '@/components/admin/coming-soon'

export default function ConfiguracionPage() {
  return (
    <ComingSoon
      title="Configuración"
      description="Datos de la barbería, reservas, notificaciones y roles."
      fase="Fase 12"
      bullets={[
        'Nombre, logo, WhatsApp, Instagram, dirección y horarios',
        'Porcentaje de seña, anticipación mínima, política de cancelación',
        'Usuarios y permisos por rol (admin / barbero / recepción)',
      ]}
    />
  )
}

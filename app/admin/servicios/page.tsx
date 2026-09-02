import { ComingSoon } from '@/components/admin/coming-soon'

export default function ServiciosAdminPage() {
  return (
    <ComingSoon
      title="Servicios"
      description="Editá precios, duración y disponibilidad sin tocar código."
      fase="Fase 8"
      bullets={[
        'CRUD completo (nombre, descripción, precio, duración, imagen)',
        'Días y horario disponible por servicio',
        'Los cambios se reflejan en la web pública y en la reserva',
      ]}
    />
  )
}

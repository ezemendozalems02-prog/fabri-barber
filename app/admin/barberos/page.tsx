import { ComingSoon } from '@/components/admin/coming-soon'

export default function BarberosPage() {
  return (
    <ComingSoon
      title="Barberos"
      description="Equipo, horarios y comisiones."
      fase="Fase 7"
      bullets={[
        'CRUD de barberos (foto, especialidad, estado activo/inactivo)',
        'Configuración de comisión por barbero (% o monto fijo)',
        'Estadísticas individuales: turnos, ingresos, ticket promedio',
      ]}
    />
  )
}

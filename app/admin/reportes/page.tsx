import { ComingSoon } from '@/components/admin/coming-soon'

export default function ReportesPage() {
  return (
    <ComingSoon
      title="Reportes"
      description="Ingresos, turnos, servicios y rendimiento por barbero."
      fase="Fase 11"
      bullets={[
        'Filtros: hoy, ayer, últimos 7 días, este mes, personalizado',
        'Gráficos de ingresos, servicios más vendidos, cancelaciones',
        'Clientes nuevos vs. recurrentes, ranking de productos',
      ]}
    />
  )
}

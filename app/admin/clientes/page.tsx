import { ComingSoon } from '@/components/admin/coming-soon'

export default function ClientesPage() {
  return (
    <ComingSoon
      title="Clientes"
      description="Base de clientes con historial completo."
      fase="Fase 6"
      bullets={[
        'Listado con turnos, último turno y total gastado',
        'Ficha de cliente: historial de turnos, servicios y pagos',
        'Notas internas ("prefiere degradé bajo", "siempre pide barba")',
      ]}
    />
  )
}

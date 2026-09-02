import { ComingSoon } from '@/components/admin/coming-soon'

export default function PagosPage() {
  return (
    <ComingSoon
      title="Pagos"
      description="Estado de señas y preparación para Mercado Pago."
      fase="Fase 10"
      bullets={[
        'Señas cobradas hoy, pendientes y pagos rechazados',
        'ID de pago, fecha y estado por turno',
        'Arquitectura lista para Access Token, preferencias y webhook reales',
      ]}
    />
  )
}

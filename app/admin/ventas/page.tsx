import { ComingSoon } from '@/components/admin/coming-soon'

export default function VentasPage() {
  return (
    <ComingSoon
      title="Ventas"
      description="Ventas de servicios y productos, por día/semana/mes."
      fase="Fase 9"
      bullets={[
        'Ventas del día / semana / mes',
        'Separado por servicios vs. productos',
        'Desglose por método de pago (Mercado Pago, efectivo, transferencia)',
      ]}
    />
  )
}

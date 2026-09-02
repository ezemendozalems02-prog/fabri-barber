import { ComingSoon } from '@/components/admin/coming-soon'

export default function ProductosAdminPage() {
  return (
    <ComingSoon
      title="Productos"
      description="Catálogo, stock y precios."
      fase="Fase 9"
      bullets={[
        'CRUD completo, activar/desactivar, cambiar stock y precio',
        'Ventas y stock actual por producto',
        'Alertas de stock bajo',
      ]}
    />
  )
}

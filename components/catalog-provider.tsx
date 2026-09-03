'use client'

// ------------------------------------------------------------------
// Trae Servicios, Productos y Configuración desde Supabase una vez al
// cargar la app (tanto sitio público como panel admin) y los expone
// vía hooks. Arranca con los valores estáticos de lib/site-data.ts
// como fallback (evita pantallas vacías) y los reemplaza en cuanto
// responde Supabase — misma técnica que ya usa el resto del panel.
// ------------------------------------------------------------------

import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'
import { getConfiguracion } from '@/lib/actions/configuracion'
import { listProductosActivos } from '@/lib/actions/productos'
import { listServiciosActivos } from '@/lib/actions/servicios'
import { mapConfiguracion, mapProducto, mapServicio, type SiteConfig } from '@/lib/services/catalogo'
import { DEFAULT_DEPOSIT_PERCENT, MERCADOPAGO, PRODUCTS, SERVICES, SITE, type Product, type Service } from '@/lib/site-data'

const FALLBACK_CONFIG: SiteConfig = {
  ...SITE,
  depositPercent: DEFAULT_DEPOSIT_PERCENT,
  anticipacionMinimaHoras: 0,
  politicaCancelacion: '',
  mercadopago: MERCADOPAGO,
}

const ServicesContext = createContext<Service[]>(SERVICES)
const ProductsContext = createContext<Product[]>(PRODUCTS)
const SiteConfigContext = createContext<SiteConfig>(FALLBACK_CONFIG)

export function CatalogProvider({ children }: { children: ReactNode }) {
  const [services, setServices] = useState<Service[]>(SERVICES)
  const [products, setProducts] = useState<Product[]>(PRODUCTS)
  const [config, setConfig] = useState<SiteConfig>(FALLBACK_CONFIG)

  useEffect(() => {
    listServiciosActivos()
      .then((rows) => setServices(rows.map(mapServicio)))
      .catch(() => {})
    listProductosActivos()
      .then((rows) => setProducts(rows.map(mapProducto)))
      .catch(() => {})
    getConfiguracion()
      .then((row) => setConfig(mapConfiguracion(row, SITE.tagline)))
      .catch(() => {})
  }, [])

  return (
    <ServicesContext.Provider value={services}>
      <ProductsContext.Provider value={products}>
        <SiteConfigContext.Provider value={config}>{children}</SiteConfigContext.Provider>
      </ProductsContext.Provider>
    </ServicesContext.Provider>
  )
}

export function useServices() {
  return useContext(ServicesContext)
}

export function useProducts() {
  return useContext(ProductsContext)
}

export function useSiteConfig() {
  return useContext(SiteConfigContext)
}

import {
  BarChartIcon,
  CalendarClockIcon,
  CreditCardIcon,
  GridIcon,
  ListIcon,
  ScissorsIcon,
  SettingsIcon,
  ShoppingBagIcon,
  TrendingUpIcon,
  UserBadgeIcon,
  UsersIcon,
} from '@/components/icons'
import type { Rol } from './types'

export type AdminNavItem = {
  href: string
  label: string
  icon: typeof GridIcon
  roles: Rol[]
}

export const ADMIN_NAV: AdminNavItem[] = [
  { href: '/admin', label: 'Inicio', icon: GridIcon, roles: ['admin', 'barbero', 'recepcion'] },
  { href: '/admin/agenda', label: 'Agenda', icon: CalendarClockIcon, roles: ['admin', 'barbero', 'recepcion'] },
  { href: '/admin/turnos', label: 'Turnos', icon: ListIcon, roles: ['admin', 'barbero', 'recepcion'] },
  { href: '/admin/clientes', label: 'Clientes', icon: UsersIcon, roles: ['admin', 'barbero', 'recepcion'] },
  { href: '/admin/barberos', label: 'Barberos', icon: UserBadgeIcon, roles: ['admin'] },
  { href: '/admin/servicios', label: 'Servicios', icon: ScissorsIcon, roles: ['admin'] },
  { href: '/admin/productos', label: 'Productos', icon: ShoppingBagIcon, roles: ['admin'] },
  { href: '/admin/ventas', label: 'Ventas', icon: TrendingUpIcon, roles: ['admin', 'recepcion'] },
  { href: '/admin/pagos', label: 'Pagos', icon: CreditCardIcon, roles: ['admin', 'recepcion'] },
  { href: '/admin/reportes', label: 'Reportes', icon: BarChartIcon, roles: ['admin'] },
  { href: '/admin/configuracion', label: 'Configuración', icon: SettingsIcon, roles: ['admin'] },
]

export function navForRole(rol: Rol) {
  return ADMIN_NAV.filter((item) => item.roles.includes(rol))
}

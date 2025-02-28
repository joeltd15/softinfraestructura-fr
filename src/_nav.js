import CIcon from "@coreui/icons-react"
import {
  cilBell,
  cilCalculator,
  cilCalendar,
  cilChartPie,
  cilPlaylistAdd,
  cilSettings,
  cilShare,
  cilSpeedometer,
  cilUser,
  cilUserFollow,
  cilWc,
} from "@coreui/icons"
import { CNavGroup, CNavItem, CNavTitle } from "@coreui/react"
import { checkPermission } from "./authUtils"

const _nav = [
  {
    component: CNavTitle,
    name: "Indicadores de desempeño",
    permission: "Dashboard",
  },
  {
    component: CNavItem,
    name: "Dashboard",
    to: "/dashboard",
    icon: <CIcon icon={cilSpeedometer} customClassName="nav-icon" />,
    permission: "Dashboard",
  },
  {
    component: CNavTitle,
    name: "Configuración",
    permission: "Usuarios",
  },
  {
    component: CNavItem,
    name: "Roles",
    to: "/roles",
    icon: <CIcon icon={cilSettings} customClassName="nav-icon" />,
    permission: "Roles",
  },
  {
    component: CNavItem,
    name: "Usuarios",
    to: "/users",
    icon: <CIcon icon={cilWc} customClassName="nav-icon" />,
    permission: "Usuarios",
  },
  {
    component: CNavTitle,
    name: "Mantenimiento",
    permission: "Solicitudes",
  },
  {
    component: CNavItem,
    name: "Encargados",
    to: "/managers",
    icon: <CIcon icon={cilUser} customClassName="nav-icon" />,
    permission: "Encargados",
  },
  {
    component: CNavItem,
    name: "Solicitudes",
    to: "/application",
    icon: <CIcon icon={cilUserFollow} customClassName="nav-icon" />,
    permission: "Solicitudes",
  },
  {
    component: CNavItem,
    name: "Asignamientos",
    to: "/Asignamientos",
    icon: <CIcon icon={cilShare} customClassName="nav-icon" />,
    permission: "Asignamientos",
  },
  {
    component: CNavItem,
    name: "Seguimiento",
    to: "/Seguimiento",
    icon: <CIcon icon={cilPlaylistAdd} customClassName="nav-icon" />,
    permission: "Seguimiento",
  },
  {
    component: CNavTitle,
    name: "Reservas",
    permission: "Reservas",
  },
  {
    component: CNavItem,
    name: "Reservas",
    to: "/reservas",
    icon: <CIcon icon={cilCalendar} customClassName="nav-icon" />,
    permission: "Reservas",
  },
  {
    component: CNavItem,
    name: "Charts",
    to: "/charts",
    icon: <CIcon icon={cilChartPie} customClassName="nav-icon" />,
    permission: "view_charts",
  },
  {
    component: CNavGroup,
    name: "Notifications",
    icon: <CIcon icon={cilBell} customClassName="nav-icon" />,
    permission: "view_notifications",
    items: [
      {
        component: CNavItem,
        name: "Toasts",
        to: "/notifications/toasts",
      },
    ],
  },
  {
    component: CNavItem,
    name: "Widgets",
    to: "/widgets",
    icon: <CIcon icon={cilCalculator} customClassName="nav-icon" />,
    permission: "view_widgets",
    badge: {
      color: "info",
      text: "NEW",
    },
  },
]

// Función para filtrar los elementos de navegación basados en los permisos
const filterNavItems = (items) => {
  return items
    .filter((item) => {
      if (item.permission) {
        return checkPermission(item.permission)
      }
      if (item.items) {
        const filteredItems = filterNavItems(item.items)
        return filteredItems.length > 0
      }
      return true
    })
    .map((item) => {
      if (item.items) {
        return {
          ...item,
          items: filterNavItems(item.items),
        }
      }
      return item
    })
}

// Exporta los elementos de navegación filtrados
export default filterNavItems(_nav)


import React from 'react'
import CIcon from '@coreui/icons-react'
import {
  cilBell,
  cilCalculator,
  cilCalendar,
  cilChartPie,
  cilPlaylistAdd,
  cilSettings,
  cilShare,
  cilSpeedometer,
  cilStar,
  cilUser,
  cilUserFollow,
  cilWc,
} from '@coreui/icons'
import { CNavGroup, CNavItem, CNavTitle } from '@coreui/react'
import { checkPermission } from './authUtils'

const _nav = [
  {
    component: CNavItem,
    name: 'Dashboard',
    to: '/dashboard',
    icon: <CIcon icon={cilSpeedometer} customClassName="nav-icon" />,
  },
  {
    component: CNavTitle,
    name: 'MÓDULOS',
  },
  checkPermission('manage_roles') && {
    component: CNavItem,
    name: 'Roles',
    to: '/roles',
    icon: <CIcon icon={cilSettings} customClassName="nav-icon" />,
  },
  checkPermission('manage_users') && {
    component: CNavItem,
    name: 'Usuarios',
    to: '/users',
    icon: <CIcon icon={cilWc} customClassName="nav-icon" />,
  },
  checkPermission('manage_managers') && {
    component: CNavItem,
    name: 'Encargados',
    to: '/managers',
    icon: <CIcon icon={cilUser} customClassName="nav-icon" />,
  },
  checkPermission('manage_applications') && {
    component: CNavItem,
    name: 'Solicitudes',
    to: '/application',
    icon: <CIcon icon={cilUserFollow} customClassName="nav-icon" />,
  },
  checkPermission('manage_assignments') && {
    component: CNavItem,
    name: 'Asignamientos',
    to: '/assignments',
    icon: <CIcon icon={cilShare} customClassName="nav-icon" />,
  },
  checkPermission('manage_tracking') && {
    component: CNavItem,
    name: 'Seguimiento',
    to: '/tracking',
    icon: <CIcon icon={cilPlaylistAdd} customClassName="nav-icon" />,
  },
  checkPermission('manage_reservations') && {
    component: CNavItem,
    name: 'Reservas',
    to: '/reservations',
    icon: <CIcon icon={cilCalendar} customClassName="nav-icon" />,
  },
  checkPermission('view_charts') && {
    component: CNavItem,
    name: 'Charts',
    to: '/charts',
    icon: <CIcon icon={cilChartPie} customClassName="nav-icon" />,
  },
  checkPermission('view_notifications') && {
    component: CNavGroup,
    name: 'Notifications',
    icon: <CIcon icon={cilBell} customClassName="nav-icon" />,
    items: [
      {
        component: CNavItem,
        name: 'Toasts',
        to: '/notifications/toasts',
      },
    ],
  },
  checkPermission('view_widgets') && {
    component: CNavItem,
    name: 'Widgets',
    to: '/widgets',
    icon: <CIcon icon={cilCalculator} customClassName="nav-icon" />,
    badge: {
      color: 'info',
      text: 'NEW',
    },
  }
].filter(Boolean)

export default _nav
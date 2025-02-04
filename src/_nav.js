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


const _nav = [
  {
    component: CNavItem,
    name: 'Dashboard',
    to: '/dashboard',
    icon: <CIcon icon={cilSpeedometer} customClassName="nav-icon" />,
  },{
    component: CNavTitle,
    name: 'MÓDULOS',
  },
  {
    component: CNavItem,
    name: 'Roles',
    to: '/',
    icon: <CIcon icon={cilSettings} customClassName="nav-icon" />,
  },
  {
    component: CNavItem,
    name: 'Usuarios',
    to: '/',
    icon: <CIcon icon={cilWc} customClassName="nav-icon" />,
  },
  {
    component: CNavItem,
    name: 'Encargados',
    to: '/',
    icon: <CIcon icon={cilUser} customClassName="nav-icon" />,
  },
  {
    component: CNavItem,
    name: 'Solicitudes',
    to: '/application',
    icon: <CIcon icon={cilUserFollow} customClassName="nav-icon" />,
  },
  {
    component: CNavItem,
    name: 'Asignamientos',
    to: '/assignment',
    icon: <CIcon icon={cilShare} customClassName="nav-icon" />,
  },
  {
    component: CNavItem,
    name: 'Seguimiento',
    to: '/tracking',
    icon: <CIcon icon={cilPlaylistAdd} customClassName="nav-icon" />,
  },
  {
    component: CNavItem,
    name: 'Reservas',
    to: '/',
    icon: <CIcon icon={cilCalendar} customClassName="nav-icon" />,
  },
  {
    component: CNavTitle,
    name: 'Components',
  },
  {
    component: CNavItem,
    name: 'Charts',
    to: '/charts',
    icon: <CIcon icon={cilChartPie} customClassName="nav-icon" />,
  },
  {
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
  {
    component: CNavItem,
    name: 'Widgets',
    to: '/widgets',
    icon: <CIcon icon={cilCalculator} customClassName="nav-icon" />,
    badge: {
      color: 'info',
      text: 'NEW',
    },
  }
]

export default _nav
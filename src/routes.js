import { element } from 'prop-types'
import React from 'react'

const DashboardM = React.lazy(() => import('./views/dashboard/DashboardM'))
const DashboardR = React.lazy(() => import('./views/dashboard/DashboardR'))


const welcome = React.lazy(() => import('./views/pages/index'))

//modulos
const Application = React.lazy(() => import('./views/pages/application/application'))
const Tracking = React.lazy(() => import('./views/pages/tracking/tracking'))
const Assignment = React.lazy(() => import('./views/pages/asssignment/assignment'))
const User = React.lazy(() => import('./views/pages/user/user'))
const Responsible = React.lazy(() => import('./views/pages/responsible/responsible'))
const Role = React.lazy(() => import('./views/pages/role/role'))
const Reservation = React.lazy(() => import('./views/pages/reservation/reservation'))


const routes = [
  { path: '/', exact: true, name: 'Bienvenido', element: welcome },
  { path: '/dashboardM', name: 'Dashboard', element: DashboardM },
  { path: '/dashboardR', name: 'Dashboard', element: DashboardR },
  { path: '/application', name: 'Solicitudes', element: Application },
  { path: '/Seguimiento', name: 'Seguimientos', element: Tracking },
  { path: '/Asignamientos', name: 'Asignamientos', element: Assignment },
  { path: '/reservas', name: 'Reservaciones', element: Reservation },
  { path: '/users', name: 'Usuarios', element: User },
  { path: '/managers', name: 'Responsables', element: Responsible },
  { path: '/roles', name: 'Roles', element: Role },
]

export default routes
import React from 'react'

const Dashboard = React.lazy(() => import('./views/dashboard/Dashboard'))

const Charts = React.lazy(() => import('./views/charts/Charts'))


// Notifications
const Alerts = React.lazy(() => import('./views/notifications/alerts/Alerts'))
const Badges = React.lazy(() => import('./views/notifications/badges/Badges'))
const Modals = React.lazy(() => import('./views/notifications/modals/Modals'))
const Toasts = React.lazy(() => import('./views/notifications/toasts/Toasts'))

const Widgets = React.lazy(() => import('./views/widgets/Widgets'))

//modulos
const Application = React.lazy(() => import('./views/pages/application/application'))
const Tracking = React.lazy(() => import('./views/pages/tracking/tracking'))
const Assignment = React.lazy(() => import('./views/pages/asssignment/assignment'))
const User = React.lazy(() => import('./views/pages/user/user'))
const Responsible = React.lazy(() => import('./views/pages/responsible/responsible'))
const Role = React.lazy(() => import('./views/pages/role/role'))
const Reservation = React.lazy(() => import('./views/pages/reservation/reservation'))



const routes = [
  { path: '/', exact: true, name: 'Home' },
  { path: '/dashboard', name: 'Dashboard', element: Dashboard },
  { path: '/charts', name: 'Charts', element: Charts },
  { path: '/notifications', name: 'Notifications', element: Alerts, exact: true },
  { path: '/notifications/alerts', name: 'Alerts', element: Alerts },
  { path: '/notifications/badges', name: 'Badges', element: Badges },
  { path: '/notifications/modals', name: 'Modals', element: Modals },
  { path: '/notifications/toasts', name: 'Toasts', element: Toasts },
  { path: '/widgets', name: 'Widgets', element: Widgets },
  { path: '/application', name: 'Solicitudes', element: Application },
  { path: '/Seguimiento', name: 'Seguimientos', element: Tracking },
  { path: '/Asignamientos', name: 'Asignamientos', element: Assignment },
  { path: '/reservas', name: 'Reservaciones', element: Reservation },
  { path: '/users', name: 'Usuarios', element: User },
  { path: '/managers', name: 'Responsables', element: Responsible },
  { path: '/roles', name: 'Roles', element: Role },

]

export default routes

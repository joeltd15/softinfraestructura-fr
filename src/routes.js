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
  { path: '/Solicitudes', name: 'Application', element: Application },
  { path: '/Seguimiento', name: 'Tracking', element: Tracking },
  { path: '/Asignamientos', name: 'Assignment', element: Assignment },

]

export default routes

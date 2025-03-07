import React, { Suspense } from 'react'
import 'primereact/resources/themes/lara-light-blue/theme.css';  // Tema (puedes cambiarlo)
import 'primereact/resources/primereact.min.css'; // Estilos base de PrimeReact
import 'primeicons/primeicons.css'; // Iconos de PrimeReact
import { HashRouter, Route, Routes, Navigate } from 'react-router-dom'
import { ToastContainer } from 'react-toastify';
import { CSpinner } from '@coreui/react'
import './scss/style.scss'
import './app.css'
import ProtectedRoute from './components/ProtectedRoute'
import { AlertProvider } from './assets/functions/index';

// Containers
const DefaultLayout = React.lazy(() => import('./layout/DefaultLayout'))

// Pages
const Login = React.lazy(() => import('./views/pages/login/Login'))
const Register = React.lazy(() => import('./views/pages/register/Register'))
const Page404 = React.lazy(() => import('./views/pages/page404/Page404'));
const Page500 = React.lazy(() => import('./views/pages/page500/Page500'));
const SendEmail = React.lazy(() => import('./views/pages/forgotPassword/sendEmail'));
const ForgotPassword = React.lazy(() => import('./views/pages/forgotPassword/forgotPassword'));

const App = () => {
  return (
    <AlertProvider>
      <HashRouter>
        <ToastContainer />
        <Suspense
          fallback={
            <div className="pt-3 text-center">
              <CSpinner color="success" variant="grow" />
            </div>
          }
        >
          <Routes>
            <Route exact path="/login" element={<Login />} />
            <Route exact path="/register" element={<Register />} />
            <Route exact path="/404" element={<Page404 />} />
            <Route exact path="/500" element={<Page500 />} />
            <Route exact path="/sendEmail" element={<SendEmail />} />
            <Route exact path="/forgotPassword" element={<ForgotPassword />} />
            <Route element={<ProtectedRoute />}>
              <Route path="/*" element={<DefaultLayout />} />
            </Route>
            <Route path="*" element={<Navigate to="/404" replace />} />
          </Routes>
        </Suspense>
      </HashRouter>
    </AlertProvider>
  )
}

export default App
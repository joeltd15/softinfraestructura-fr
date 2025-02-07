import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import {
  CButton,
  CCard,
  CCardBody,
  CCardGroup,
  CCol,
  CContainer,
  CForm,
  CFormInput,
  CInputGroup,
  CInputGroupText,
  CRow,
} from '@coreui/react';
import CIcon from '@coreui/icons-react';
import { cilLockLocked, cilUser } from '@coreui/icons';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post('http://localhost:2025/api/auth/login', {
        email,
        password,
      });

      const { user, token } = response.data;

      if (!token || !user) {
        throw new Error('La respuesta del servidor no contiene token o información de usuario');
      }

      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));

      // Obtener los permisos del usuario
      const permissionsResponse = await axios.get(`http://localhost:2025/api/users/${user.id}/permissions`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const permissions = permissionsResponse.data;
      localStorage.setItem('permissions', JSON.stringify(permissions));

      toast.success('Inicio de sesión exitoso!', {
        position: 'top-right',
        autoClose: 3000,
      });

      setTimeout(() => {
        navigate('/dashboard');
      }, 3000);
    } catch (error) {
      console.error('Error completo:', error);

      let errorMessage = 'Error en el inicio de sesión. Verifica tus credenciales.';

      if (error.response) {
        console.error('Datos del error:', error.response.data);
        console.error('Estado del error:', error.response.status);
        errorMessage = error.response.data.message || errorMessage;
      } else if (error.request) {
        console.error('Error de red:', error.request);
        errorMessage = 'Error de conexión. Intenta de nuevo más tarde.';
      } else {
        console.error('Error:', error.message);
        errorMessage = 'Error inesperado. Intenta de nuevo.';
      }

      toast.error(errorMessage, {
        position: 'top-right',
        autoClose: 3000,
      });
    }
  };

  return (
    <div className="bg-body-tertiary min-vh-100 d-flex flex-row align-items-center">
      <CContainer>
        <CRow className="justify-content-center">
          <CCol md={8}>
            <CCardGroup>
              <CCard className="p-4">
                <CCardBody>
                  <CForm onSubmit={handleLogin}>
                    <h1>Login</h1>
                    <p className="text-body-secondary">Sign In to your account</p>
                    <CInputGroup className="mb-3">
                      <CInputGroupText>
                        <CIcon icon={cilUser} />
                      </CInputGroupText>
                      <CFormInput
                        type="email"
                        placeholder="Email"
                        autoComplete="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                      />
                    </CInputGroup>
                    <CInputGroup className="mb-4">
                      <CInputGroupText>
                        <CIcon icon={cilLockLocked} />
                      </CInputGroupText>
                      <CFormInput
                        type="password"
                        placeholder="Password"
                        autoComplete="current-password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                      />
                    </CInputGroup>
                    <CRow>
                      <CCol xs={6}>
                        <CButton type="submit" color="primary" className="px-4">
                          Login
                        </CButton>
                      </CCol>
                      <CCol xs={6} className="text-right">
                        <CButton color="link" className="px-0">
                          Forgot password?
                        </CButton>
                      </CCol>
                    </CRow>
                  </CForm>
                </CCardBody>
              </CCard>
              <CCard className="text-white bg-primary py-5" style={{ width: '44%' }}>
                <CCardBody className="text-center">
                  <div>
                    <h2>Sign up</h2>
                    <p>
                      Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod
                      tempor incididunt ut labore et dolore magna aliqua.
                    </p>
                    <Link to="/register">
                      <CButton color="primary" className="mt-3" active tabIndex={-1}>
                        Register Now!
                      </CButton>
                    </Link>
                  </div>
                </CCardBody>
              </CCard>
            </CCardGroup>
          </CCol>
        </CRow>
      </CContainer>
      <ToastContainer />
    </div>
  );
};

export default Login;
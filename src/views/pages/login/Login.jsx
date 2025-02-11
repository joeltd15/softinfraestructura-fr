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
    e.preventDefault()

    try {
      // 1. Login request
      const response = await axios.post("http://localhost:2025/api/auth/login", {
        email,
        password,
      })

      const { user, token } = response.data

      if (!token || !user) {
        throw new Error("La respuesta del servidor no contiene token o información de usuario")
      }

      console.log("User data:", user);

      // 2. Get role permissions
      const permissionsResponse = await axios.get(`http://localhost:2025/api/permissionRole?roleId=${user.roleId}`, {
        headers: { Authorization: `Bearer ${token}` },
      })

      console.log("Permissions response:", permissionsResponse.data);

      // 3. Filter permissions for the user's role
      const userRolePermissions = permissionsResponse.data.filter(
        (permission) => permission.roleId === user.roleId
      )

      console.log("Filtered user role permissions:", userRolePermissions);

      // 4. Get permission details
      const permissionIds = userRolePermissions.map((pr) => pr.permissionId)
      const permissionsDetailsResponse = await axios.get(`http://localhost:2025/api/permission`, {
        headers: { Authorization: `Bearer ${token}` },
      })

      console.log("Permissions details:", permissionsDetailsResponse.data);

      // 5. Filter and store only the permissions that belong to the user's role
      const userPermissions = permissionsDetailsResponse.data
        .filter((p) => permissionIds.includes(p.id))
        .map((p) => p.name)

      console.log("Filtered user permissions:", userPermissions);

      // Store everything in localStorage
      localStorage.setItem("token", token)
      localStorage.setItem("user", JSON.stringify(user))
      localStorage.setItem("permissions", JSON.stringify(userPermissions))

      toast.success("Inicio de sesión exitoso!", {
        position: "top-right",
        autoClose: 3000,
      })

      setTimeout(() => {
        navigate("/dashboard")
      }, 3000)
    } catch (error) {
      console.error("Error completo:", error)

      let errorMessage = "Error en el inicio de sesión. Verifica tus credenciales."

      if (error.response) {
        console.error("Datos del error:", error.response.data)
        console.error("Estado del error:", error.response.status)
        errorMessage = error.response.data.message || errorMessage
      } else if (error.request) {
        console.error("Error de red:", error.request)
        errorMessage = "Error de conexión. Intenta de nuevo más tarde."
      } else {
        console.error("Error:", error.message)
        errorMessage = "Error inesperado. Intenta de nuevo."
      }

      toast.error(errorMessage, {
        position: "top-right",
        autoClose: 3000,
      })
    }
  }


  return (
    <div className="bg-body-tertiary min-vh-100 d-flex flex-row align-items-center pattern">
      <CContainer>
        <CRow className="justify-content-center">
          <CCol md={8}>
            <CCardGroup>
              <CCard className="p-4">
                <CCardBody>
                  <CForm onSubmit={handleLogin}>
                    <h1>Login</h1>
                    <CInputGroup className="mb-3">
                      <CInputGroupText>
                        <CIcon icon={cilUser} />
                      </CInputGroupText>
                      <CFormInput
                        type="email"
                        placeholder="Correo"
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
                        placeholder="Contraseña"
                        autoComplete="current-password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                      />
                    </CInputGroup>
                    <CRow>
                      <CCol xs={6}>
                        <CButton type="submit" className="btn-green px-4">
                          Login
                        </CButton>
                      </CCol>
                      <CCol xs={6} className="text-right ">
                        <Link color="link" className="px-0">
                          Forgot password?
                        </Link>
                      </CCol>
                    </CRow>
                  </CForm>
                </CCardBody>
              </CCard>
              <CCard className="text-white bg-primary py-5" style={{ width: '44%' }}>
                <CCardBody className="text-center">
                  <div>
                    <h2>Registrame</h2>
                    <p>
                      Si eres un nuevo usuario, regístrate para acceder y gestionar tus solicitudes de mantenimiento.
                    </p>
                    <Link to="/register">
                      <CButton className="btn-green mt-3" active tabIndex={-1}>
                        Registrarme ahora!
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
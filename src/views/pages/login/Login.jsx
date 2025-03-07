import React, { useState, useEffect } from 'react';
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
import { Eye, EyeOff } from 'lucide-react';
import axios from 'axios';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useAlert } from '../../../assets/functions/index';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const { showAlert } = useAlert();

  useEffect(() => {
    return () => {
      toast.dismiss(); // Limpia todas las alertas Reservados al desmontar el componente
    };
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post("https://softinfraestructura-a6yl4j3yy-joeltuiran15-gmailcoms-projects.vercel.app/api/auth/login", {
        email,
        password,
      });

      const { user, token } = response.data;

      if (!token || !user) {
        throw new Error("La respuesta del servidor no contiene token o información de usuario");
      }

      console.log("User data:", user);

      const permissionsResponse = await axios.get(
        `https://softinfraestructura-a6yl4j3yy-joeltuiran15-gmailcoms-projects.vercel.app/api/permissionRole?roleId=${user.roleId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      console.log("Permissions response:", permissionsResponse.data);

      const userRolePermissions = permissionsResponse.data.filter(
        (permission) => permission.roleId === user.roleId
      );

      console.log("Filtered user role permissions:", userRolePermissions);

      const permissionIds = userRolePermissions.map((pr) => pr.permissionId);
      const permissionsDetailsResponse = await axios.get("https://softinfraestructura-a6yl4j3yy-joeltuiran15-gmailcoms-projects.vercel.app/api/permission", {
        headers: { Authorization: `Bearer ${token}` },
      });

      console.log("Permissions details:", permissionsDetailsResponse.data);

      const userPermissions = permissionsDetailsResponse.data
        .filter((p) => permissionIds.includes(p.id))
        .map((p) => p.name);

      console.log("Filtered user permissions:", userPermissions);

      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));
      localStorage.setItem("permissions", JSON.stringify(userPermissions));

      showAlert("Inicio de sesión exitoso!.", "success");

      setTimeout(() => {
        navigate(user.roleId === 1 ? "/dashboard" : "/");
      }, 3000);
    } catch (error) {
      console.error("Error completo:", error);

      let errorMessage = "Error en el inicio de sesión. Verifica tus credenciales.";

      if (error.response) {
        console.error("Datos del error:", error.response.data);
        console.error("Estado del error:", error.response.status);
        errorMessage = error.response.data.message || errorMessage;
      } else if (error.request) {
        console.error("Error de red:", error.request);
        errorMessage = "Error de conexión. Intenta de nuevo más tarde.";
      } else {
        console.error("Error:", error.message);
        errorMessage = "Error inesperado. Intenta de nuevo.";
      }

      showAlert(errorMessage, "error");
    }
  };


  return (
    <div className="bg-body-tertiary min-vh-100 d-flex flex-row align-items-center pattern">
      <CContainer className='d-flex flex-row align-items-center justify-content-center'>
        <CCard className="p-4 d-flex align-items-center">
          <CCardBody>
            <CForm onSubmit={handleLogin} className='p-4'>
              <h1 className='text-center mb-5'>Iniciar sesión</h1>
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
              <CInputGroup className="mb-4 position-relative">
                <CInputGroupText>
                  <CIcon icon={cilLockLocked} />
                </CInputGroupText>
                <CFormInput
                  type={showPassword ? "text" : "password"}
                  placeholder="Contraseña"
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <CButton
                  type="button"
                  className="border-0 bg-transparent position-absolute end-0 me-2"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </CButton>
              </CInputGroup>
              <div className='text-center d-block mb-2'>
                <CButton type="submit" className="btn-green px-4">
                  Ingresar
                </CButton>
              </div>
              <div className="d-flex mt-4">
                <div className="row w-100">
                  <div className="col-sm-8">
                    <CButton color="link" className="px-0" onClick={() => navigate('/sendEmail')}>
                      Recuperar Contraseña
                    </CButton>
                  </div>
                  <div className="col-sm-4">
                    <CButton color="link" className="px-0" onClick={() => navigate('/register')}>
                      Registrarme!
                    </CButton>
                  </div>
                </div>
              </div>
            </CForm>
          </CCardBody>
        </CCard>
      </CContainer>
    </div>
  );
};

export default Login;
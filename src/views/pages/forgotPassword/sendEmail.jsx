import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useAlert } from '../../../assets/functions/index';
import {
  CButton,
  CCard,
  CCardBody,
  CCol,
  CContainer,
  CForm,
  CFormInput,
  CInputGroup,
  CInputGroupText,
} from '@coreui/react';

const SendEmail = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const { showAlert } = useAlert();

  useEffect(() => {
    return () => {
      toast.dismiss(); // Limpia todas las alertas Reservados al desmontar el componente
    };
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email) {
      showAlert('Por favor, ingresa un correo.', 'error');
      return;
    }

    setLoading(true);

    try {
      // 1️⃣ Consultar la lista de usuarios
      const usersResponse = await axios.get('https://softinfraestructura-a6yl4j3yy-joeltuiran15-gmailcoms-projects.vercel.app/api/user');
      const users = usersResponse.data;

      // 2️⃣ Verificar si el correo existe en la base de datos
      const userExists = users.some(user => user.email === email);

      if (!userExists) {
        showAlert('El correo ingresado no está registrado.', 'error');
        setLoading(false);
        return;
      }

      // 3️⃣ Si existe, enviar la solicitud de recuperación de contraseña
      const response = await axios.post(
        'https://softinfraestructura-a6yl4j3yy-joeltuiran15-gmailcoms-projects.vercel.app/api/auth/forgot-password',
        { email },
        { headers: { 'Content-Type': 'application/json' } }
      );

      showAlert(response.data.message || 'Código enviado correctamente', 'success');

      // 4️⃣ Redirigir a la página de ingreso del código
      setTimeout(() => {
        window.location.href = 'http://localhost:3000/#/forgotPassword';
      }, 2000); // Espera 2 segundos para mostrar el mensaje antes de redirigir
    } catch (error) {
      showAlert(error.response?.data?.error || 'Error al enviar el código', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-body-tertiary min-vh-100 d-flex flex-row align-items-center pattern">
      <CContainer className="p-4 d-flex align-items-center justify-content-center">
        <CCol md={9} lg={7} xl={6} className="p-4 d-flex align-items-center justify-content-center">
          <CCard className="p-4 d-flex align-items-center">
            <CCardBody>
              <CForm onSubmit={handleSubmit}>
                <h2 className="pb-3 text-center">Recuperar contraseña</h2>
                <span className="text-form">Te enviaremos el código de verificación al correo.</span>
                <CInputGroup className="mb-3">
                  <CInputGroupText>@</CInputGroupText>
                  <CFormInput
                    type="email"
                    name="email"
                    placeholder="Correo"
                    autoComplete="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </CInputGroup>
                <div className="d-flex align-items-center justify-content-center">
                  <CButton color="success" className=".buttons-form" type="submit" disabled={loading}>
                    {loading ? 'Verificando...' : 'Enviar'}
                  </CButton>
                </div>
              </CForm>
            </CCardBody>
          </CCard>
        </CCol>
      </CContainer>
    </div>
  );
};

export default SendEmail;
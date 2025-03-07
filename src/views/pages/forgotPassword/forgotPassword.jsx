import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
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

const ResetPassword = () => {
  const [email, setEmail] = useState('');
  const [resetCode, setResetCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { showAlert } = useAlert();

  useEffect(() => {
    return () => {
      toast.dismiss(); // Limpia todas las alertas Reservados al desmontar el componente
    };
  }, []);

  const handleResetPassword = async (e) => {

    e.preventDefault();

    if (!email || !resetCode || !newPassword) {
      showAlert('Por favor, completa todos los campos.', 'error');
      return;
    }

    setLoading(true);
    try {
      const { data } = await axios.post(
        'https://softinfraestructura-a6yl4j3yy-joeltuiran15-gmailcoms-projects.vercel.app/api/auth/reset-password',
        { email, resetCode, newPassword },
        { headers: { 'Content-Type': 'application/json' } }
      );

      if (data.success) {
        showAlert(data.message || 'Contraseña restablecida con éxito', 'success');
        setEmail('');
        setResetCode('');
        setNewPassword('');

        // Redirigir al login después de 2 segundos
        setTimeout(() => {
          navigate('/login');
        }, 2000);
      } else {
        showAlert(data.error || 'Código incorrecto, verifica e intenta nuevamente', 'error');
      }
    } catch (error) {
      showAlert(error.response?.data?.error || 'Error al restablecer la contraseña', 'error');
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
              <CForm onSubmit={handleResetPassword}>
                <h2 className="pb-3 text-center">Restablecer contraseña</h2>
                <span className="text-form">Ingresa tu correo, el código recibido y tu nueva contraseña.</span>

                <CInputGroup className="mb-3">
                  <CInputGroupText>@</CInputGroupText>
                  <CFormInput
                    type="email"
                    placeholder="Correo"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </CInputGroup>

                <CInputGroup className="mb-3">
                  <CInputGroupText>#</CInputGroupText>
                  <CFormInput
                    type="text"
                    placeholder="Código de verificación"
                    value={resetCode}
                    onChange={(e) => setResetCode(e.target.value)}
                    required
                  />
                </CInputGroup>

                <CInputGroup className="mb-3">
                  <CInputGroupText>*</CInputGroupText>
                  <CFormInput
                    type="password"
                    placeholder="Nueva contraseña"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                  />
                </CInputGroup>

                <div className="d-flex align-items-center justify-content-center">
                  <CButton color="success" type="submit" disabled={loading}>
                    {loading ? 'Restableciendo...' : 'Confirmar'}
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

export default ResetPassword;
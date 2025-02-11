import React, { useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom'
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Col, Row } from 'react-bootstrap';
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
  CRow,
} from '@coreui/react';
import CIcon from '@coreui/icons-react';
import { cilLockLocked, cilUser } from '@coreui/icons';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    if (formData.password !== formData.confirmPassword) {
      toast.error('Las contraseñas no coinciden');
      return;
    }
  
    const dataToSend = {
      name: formData.name.trim(),
      email: formData.email.trim(),
      password: formData.password.trim(),
      phone: formData.phone.trim(),
      roleId: 3
    };
  
    try {
      await axios.post('http://localhost:2025/api/auth/register', dataToSend);
      toast.success('Registro exitoso');
  
      // Limpiar formulario
      setFormData({ name: '', email: '', password: '', confirmPassword: '', phone: '' });
  
      // Redirigir al login después de un pequeño retraso para mostrar la alerta
      setTimeout(() => {
        window.location.href = 'http://localhost:3000/#/login';
      }, 1500);
    } catch (error) {
      console.log("Error en la solicitud:", error.response?.data);
      toast.error(error.response?.data?.message || 'Error en el registro');
    }
  };
  

  return (
    <div className="bg-body-tertiary min-vh-100 d-flex flex-row align-items-center pattern">
      <CContainer className="p-4 d-flex align-items-center justify-content-center">
        <CCol md={9} lg={7} xl={6} className="p-4 d-flex align-items-center justify-content-center">
          <CCard className="mx-4" >
            <CCardBody >
              <CForm onSubmit={handleSubmit}>
                <h2 className='pb-4 text-center'>Registro</h2>
                <Row>
                  <Col sm={6}>
                    <CInputGroup className="mb-3">
                      <CInputGroupText>
                        <CIcon icon={cilUser} />
                      </CInputGroupText>
                      <CFormInput name="name" placeholder="Nombre" autoComplete="username" value={formData.name} onChange={handleChange} required />
                    </CInputGroup>
                  </Col>
                  <Col sm={6}>
                    <CInputGroup className="mb-3">
                      <CInputGroupText>📞</CInputGroupText>
                      <CFormInput type="tel" name="phone" placeholder="Telefono" autoComplete="tel" value={formData.phone} onChange={handleChange} required />
                    </CInputGroup>
                  </Col>
                </Row>
                <CInputGroup className="mb-3">
                  <CInputGroupText>@</CInputGroupText>
                  <CFormInput type="email" name="email" placeholder="Correo" autoComplete="email" value={formData.email} onChange={handleChange} required />
                </CInputGroup>
                <CInputGroup className="mb-3">
                  <CInputGroupText>
                    <CIcon icon={cilLockLocked} />
                  </CInputGroupText>
                  <CFormInput type="password" name="password" placeholder="Contraseña" autoComplete="new-password" value={formData.password} onChange={handleChange} required />
                </CInputGroup>
                <CInputGroup className="mb-3">
                  <CInputGroupText>
                    <CIcon icon={cilLockLocked} />
                  </CInputGroupText>
                  <CFormInput type="password" name="confirmPassword" placeholder="Confirme su contraseña" autoComplete="new-password" value={formData.confirmPassword} onChange={handleChange} required />
                </CInputGroup>
                <div className="d-flex align-items-center justify-content-center">
                  <CButton color="success" className='.buttons-form' type="submit">Registrarme</CButton>
                </div>
                <div className="d-flex align-items-center justify-content-center p-3">
                  <Link to="/login">
                      ¿Ya tienes cuentas? Ingresar
                  </Link>
                </div>
              </CForm>
            </CCardBody>
          </CCard>
        </CCol>
      </CContainer>
    </div>
  );
};

export default Register;

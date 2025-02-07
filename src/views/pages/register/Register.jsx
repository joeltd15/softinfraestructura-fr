import React, { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
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

    // Validación de contraseña en frontend
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
      const response = await axios.post('http://localhost:2025/api/auth/register', dataToSend);
      toast.success('Registro exitoso');
      setFormData({ name: '', email: '', password: '', confirmPassword: '', phone: '' });
    } catch (error) {
      console.log("Error en la solicitud:", error.response?.data); // Para depuración
      toast.error(error.response?.data?.message || 'Error en el registro');
    }
  };

  return (
    <div className="bg-body-tertiary min-vh-100 d-flex flex-row align-items-center">
      <CContainer>
        <CRow className="justify-content-center">
          <CCol md={9} lg={7} xl={6}>
            <CCard className="mx-4">
              <CCardBody className="p-4">
                <CForm onSubmit={handleSubmit}>
                  <h1>Register</h1>
                  <p className="text-body-secondary">Create your account</p>
                  <CInputGroup className="mb-3">
                    <CInputGroupText>
                      <CIcon icon={cilUser} />
                    </CInputGroupText>
                    <CFormInput name="name" placeholder="Username" autoComplete="username" value={formData.name} onChange={handleChange} required />
                  </CInputGroup>
                  <CInputGroup className="mb-3">
                    <CInputGroupText>@</CInputGroupText>
                    <CFormInput type="email" name="email" placeholder="Email" autoComplete="email" value={formData.email} onChange={handleChange} required />
                  </CInputGroup>
                  <CInputGroup className="mb-3">
                    <CInputGroupText>
                      <CIcon icon={cilLockLocked} />
                    </CInputGroupText>
                    <CFormInput type="password" name="password" placeholder="Password" autoComplete="new-password" value={formData.password} onChange={handleChange} required />
                  </CInputGroup>
                  <CInputGroup className="mb-3">
                    <CInputGroupText>
                      <CIcon icon={cilLockLocked} />
                    </CInputGroupText>
                    <CFormInput type="password" name="confirmPassword" placeholder="Repeat password" autoComplete="new-password" value={formData.confirmPassword} onChange={handleChange} required />
                  </CInputGroup>
                  <CInputGroup className="mb-3">
                    <CInputGroupText>📞</CInputGroupText>
                    <CFormInput type="tel" name="phone" placeholder="Phone" autoComplete="tel" value={formData.phone} onChange={handleChange} required />
                  </CInputGroup>
                  <div className="d-grid">
                    <CButton color="success" type="submit">Create Account</CButton>
                  </div>
                </CForm>
              </CCardBody>
            </CCard>
          </CCol>
        </CRow>
      </CContainer>
    </div>
  );
};

export default Register;

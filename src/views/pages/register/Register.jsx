import React, { useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Col, Row, Button } from 'react-bootstrap';
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
import CIcon from '@coreui/icons-react';
import { cilLockLocked, cilUser } from '@coreui/icons';
import { Eye, EyeOff } from 'lucide-react';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const { showAlert } = useAlert();
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  useEffect(() => {
    return () => {
      toast.dismiss(); // Limpia todas las alertas Reservados al desmontar el componente
    };
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      showAlert('Las contraseñas no coinciden.', 'error');
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
      showAlert('Registro exitoso.', 'success');
      setFormData({ name: '', email: '', password: '', confirmPassword: '', phone: '' });

      setTimeout(() => {
        window.location.href = 'http://localhost:3000/#/login';
      }, 1500);
    } catch (error) {
      console.log("Error en la solicitud:", error.response?.data);
      showAlert(error.response?.data?.message || 'Error en el registro', 'error');
    }
  };

  return (
    <div className="bg-body-tertiary min-vh-100 d-flex flex-row align-items-center pattern">
      <CContainer className="p-4 d-flex align-items-center justify-content-center">
        <CCol md={9} lg={7} xl={6} className="p-4 d-flex align-items-center justify-content-center">
          <CCard className="mx-4">
            <CCardBody>
              <CForm onSubmit={handleSubmit}>
                <h2 className='pb-4 text-center'>Registro</h2>
                <Row>
                  <Col sm={6}>
                    <CInputGroup className="mb-3">
                      <CInputGroupText>
                        <CIcon icon={cilUser} />
                      </CInputGroupText>
                      <CFormInput name="name" placeholder="Nombre" value={formData.name} onChange={handleChange} required />
                    </CInputGroup>
                  </Col>
                  <Col sm={6}>
                    <CInputGroup className="mb-3">
                      <CInputGroupText>📞</CInputGroupText>
                      <CFormInput type="tel" name="phone" placeholder="Teléfono" value={formData.phone} onChange={handleChange} required />
                    </CInputGroup>
                  </Col>
                </Row>
                <CInputGroup className="mb-3">
                  <CInputGroupText>@</CInputGroupText>
                  <CFormInput type="email" name="email" placeholder="Correo" value={formData.email} onChange={handleChange} required />
                </CInputGroup>
                <CInputGroup className="mb-3 position-relative">
                  <CInputGroupText>
                    <CIcon icon={cilLockLocked} />
                  </CInputGroupText>
                  <CFormInput type={showPassword ? "text" : "password"} name="password" placeholder="Contraseña" value={formData.password} onChange={handleChange} required />
                  <Button variant="link" onClick={() => setShowPassword(!showPassword)} className="position-absolute end-0 top-50 translate-middle-y">
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </Button>
                </CInputGroup>
                <CInputGroup className="mb-3 position-relative">
                  <CInputGroupText>
                    <CIcon icon={cilLockLocked} />
                  </CInputGroupText>
                  <CFormInput type={showConfirmPassword ? "text" : "password"} name="confirmPassword" placeholder="Confirmar Contraseña" value={formData.confirmPassword} onChange={handleChange} required />
                  <Button variant="link" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="position-absolute end-0 top-50 translate-middle-y">
                    {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </Button>
                </CInputGroup>
                <CButton type="submit" color="green" className="w-100">Registrar</CButton>
              </CForm>
              <div className='text-center mt-3'>
                <Link to="/login">¿Ya tienes una cuenta? Inicia sesión</Link>
              </div>
            </CCardBody>
          </CCard>
        </CCol>
      </CContainer>
    </div>
  );
};

export default Register;
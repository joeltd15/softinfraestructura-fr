import React, { useState } from 'react';
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

const SendEmail = () => {
  return (
    <div className="bg-body-tertiary min-vh-100 d-flex flex-row align-items-center pattern">
      <CContainer className="p-4 d-flex align-items-center justify-content-center">
        <CCol md={9} lg={7} xl={6} className="p-4 d-flex align-items-center justify-content-center">
          <CCard className="mx-4" >
            <CCardBody >
              <CForm>
                <h2 className='pb-3 text-center'>Recuperar contraseña</h2>
                <span className='text-form'>Te enviaremos el codigo de verificación al correo...</span>
                <CInputGroup className="mb-3">
                  <CInputGroupText>@</CInputGroupText>
                  <CFormInput type="email" name="email" placeholder="Correo" autoComplete="email"  required />
                </CInputGroup>
                <div className="d-flex align-items-center justify-content-center">
                  <CButton color="success" className='.buttons-form' type="submit">Enviar</CButton>
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

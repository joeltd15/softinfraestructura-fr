import { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { Col, Row } from 'react-bootstrap';

function ShowModal({ show, handleClose, application = null }) {
  return (
    <>
      <Modal
        show={show}
        onHide={handleClose}
        backdrop="static"
        keyboard={false}
      >
        <Modal.Header closeButton>
          <Modal.Title>Detalles de la solicitud</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {/* Acceder a cada campo individualmente */}
          {application && (
            <div>
              <div className='d-flex align-items-center justify-content-center row'>
                <div className='col-sm-4'>
                  <p><strong>Fecha:</strong> {new Date(application.reportDate).toISOString().split('T')[0]}</p>
                </div>
                <div className='col-sm-4'>
                  <p><strong>Dependencia:</strong> {application.dependence}</p>
                </div>
              </div>
              <div className='d-flex align-items-center justify-content-center row'>
                <div className="col-sm-4"><p><strong>Lugar:</strong> {application.location}</p></div>
                <div className="col-sm-4"><p><strong>Usuario:</strong> {application.userId}</p></div>
              </div>
              <div className='d-flex align-items-center justify-content-center row'>
                <div className="col-sm-4"><p><strong>Tipo de reporte:</strong> {application.reportType}</p></div>
                <div className="col-sm-4"><p><strong>Estado:</strong> {application.status}</p></div>
              </div>
              <p className='text-center'><strong>Detalles:</strong> {application.news}</p>
              <p className='text-center'><strong>Evidencia:</strong></p>
              <div className='d-flex align-items-center justify-content-center'>
                <img src={application.photographicEvidence && application.photographicEvidence.trim() !== "" ? `http://localhost:2025/uploads/${application.photographicEvidence}` : "/noImage.png"} width={'200px'} height={'200px'} alt="" />
              </div>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default ShowModal;

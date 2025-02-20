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
          {application && (
            <div className="container">
              {/* Primera fila */}
              <Row className="mb-2">
                <Col sm={6}><p><strong>Fecha:</strong> {new Date(application.reportDate).toISOString().split('T')[0]}</p></Col>
                <Col sm={6}><p><strong>Dependencia:</strong> {application.dependence}</p></Col>
              </Row>

              {/* Segunda fila */}
              <Row className="mb-2">
                <Col sm={6}><p><strong>Lugar:</strong> {application.location}</p></Col>
                <Col sm={6}><p><strong>Usuario:</strong> {application.userId}</p></Col>
              </Row>

              {/* Tercera fila */}
              <Row className="mb-2">
                <Col sm={6}><p><strong>Tipo de reporte:</strong> {application.reportType}</p></Col>
                <Col sm={6}><p><strong>Estado:</strong> {application.status}</p></Col>
              </Row>

              {/* Cuarta fila: Detalles y Responsable del Espacio */}
              <Row className="mb-2">
                <Col sm={6}><p><strong>Detalles:</strong> {application.news}</p></Col>
                <Col sm={6}><p><strong>Responsable del Espacio:</strong> {application.responsibleForSpace || "No asignado"}</p></Col>
              </Row>

              {/* Evidencia */}
              <p className="text-center"><strong>Evidencia:</strong></p>
              <div className="d-flex justify-content-center">
                <img 
                  src={application.photographicEvidence && application.photographicEvidence.trim() !== "" 
                    ? `http://localhost:2025/uploads/${application.photographicEvidence}` 
                    : "/noImage.png"} 
                  width={'200px'} 
                  height={'200px'} 
                  alt="Evidencia"
                />
              </div>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button className="buttons-form Button-next" onClick={handleClose}>
            Salir
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default ShowModal;

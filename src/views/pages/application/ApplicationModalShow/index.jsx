import { useState } from 'react';
import Button from 'react-bootstrap/Button';
import {Modal, Col, Row} from 'react-bootstrap/Modal';

function ShowModal({ show, handleClose, application }) {
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
          <div>
            <p><strong>Fecha:</strong> {application.reportDate}</p>
            <p><strong>Dependencia:</strong> {application.dependence}</p>
            <p><strong>Lugar:</strong> {application.location}</p>
            <p><strong>Novedades:</strong> {application.news}</p>
            <p><strong>Tipo de reporte:</strong> {application.reportType}</p>
            <p><strong>Estado:</strong> {application.status}</p>
            <p><strong>Usuario:</strong> {application.dependence}</p>
            <p><strong>Evidencia:</strong> {application.photographicEvidence}</p>
            {/* Agrega más campos según sea necesario */}
          </div>
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

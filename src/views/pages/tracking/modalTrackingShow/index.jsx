import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import { Col, Row } from "react-bootstrap";

const ModalTrackingView = ({ show, handleClose, tracking }) => {
  return (
    <Modal show={show} onHide={handleClose} backdrop="static" keyboard={false}>
      <Modal.Header closeButton>
        <Modal.Title>Detalles del Seguimiento</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {tracking && (
          <div>
            <div className='d-flex align-items-center justify-content-center row'>
            <div className='col-sm-4'>
                  <p><strong>Fecha:</strong> {tracking.dateService}</p>
                </div>
                <div className='col-sm-4'>
                  <p><strong>Materiales:</strong> {tracking.buildingMaterials}</p>
                </div>
            </div>
            <div className='d-flex align-items-center justify-content-center row'>
              <div className="col-sm-4"><p><strong>Observaciones:</strong> {tracking.observations }</p></div>
              <div className="col-sm-4"><p><strong>Acciones:</strong> {tracking.actionsTaken }</p></div>
            </div>
            <p className='text-center'><strong>Asignamiento:</strong> {tracking.id}</p>
            <p className='text-center'><strong>Evidencia Fotográfica:</strong></p>
            <div className='d-flex align-items-center justify-content-center'>
              <img 
                src={tracking.photographicEvidence ? `http://localhost:2025/uploads/${tracking.photographicEvidence}` : "/noImage.png"} 
                width={'170px'} 
                height={'170px'} 
                alt="Evidencia" 
              />
            </div>
          </div>
        )}
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>Cerrar</Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ModalTrackingView;
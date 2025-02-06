import Modal from "react-bootstrap/Modal";
import Form from "react-bootstrap/Form";
import { Col, Row } from "react-bootstrap";

const ModalTrackingView = ({ show, handleClose, tracking }) => {
  if (!tracking) return null; // Evita errores si tracking es null al abrir el modal

  return (
    <Modal show={show} onHide={handleClose} backdrop="static">
      <Modal.Header closeButton>
        <Modal.Title>Ver Seguimiento</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Row className="mb-3">
            <Col sm={6}>
              <Form.Group>
                <Form.Label>Materiales de Construcción</Form.Label>
                <Form.Control type="text" value={tracking.buildingMaterials || "N/A"} readOnly />
              </Form.Group>
            </Col>
            <Col sm={6}>
              <Form.Group>
                <Form.Label>Fecha de Servicio</Form.Label>
                <Form.Control type="date" value={tracking.dateService || "N/A"} readOnly />
              </Form.Group>
            </Col>
          </Row>

          <Row className="mb-3">
            <Col sm={6}>
              <Form.Group>
                <Form.Label>Observaciones</Form.Label>
                <Form.Control as="textarea" rows={3} value={tracking.observations || "N/A"} readOnly />
              </Form.Group>
            </Col>
            <Col sm={6}>
              <Form.Group>
                <Form.Label>Acciones Tomadas</Form.Label>
                <Form.Control as="textarea" rows={3} value={tracking.actionsTaken || "N/A"} readOnly />
              </Form.Group>
            </Col>
          </Row>

          <Row className="mb-3">
            <Col sm={6}>
              <Form.Group>
                <Form.Label>Evidencia Fotográfica</Form.Label>
                {tracking.photographicEvidence ? (
                  <img
                    src={`http://localhost:2025/uploads/${tracking.photographicEvidence}`}
                    alt="Evidencia Fotográfica"
                    width="80"
                  />
                ) : (
                  <p>No disponible</p>
                )}
              </Form.Group>
            </Col>
            <Col sm={6}>
              <Form.Group>
                <Form.Label>Asignación</Form.Label>
                <p>{tracking.assignmentId || "No asignado"}</p>
              </Form.Group>
            </Col>
          </Row>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <button className="btn btn-secondary" onClick={handleClose}>Cerrar</button>
      </Modal.Footer>
    </Modal>
  );
};

export default ModalTrackingView;

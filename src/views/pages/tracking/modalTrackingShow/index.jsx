import { useState, useEffect } from "react";
import axios from "axios";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Modal from "react-bootstrap/Modal";
import { Col, Row } from "react-bootstrap";

const CustomModalView = ({ show, handleClose, tracking }) => {
  const [observations, setObservations] = useState(tracking?.observations || "");
  const [buildingMaterials, setBuildingMaterials] = useState(tracking?.buildingMaterials || "");
  const [dateService, setDateService] = useState(tracking?.dateService || "");
  const [actionsTaken, setActionsTaken] = useState(tracking?.actionsTaken || "");
  const [photographicEvidence, setPhotographicEvidence] = useState(tracking?.photographicEvidence || null);
  const [status, setStatus] = useState(tracking?.status || "En proceso");
  const [assignmentId, setAssignmentId] = useState(tracking?.assignmentId || "");
  const [assignments, setAssignments] = useState([]);

  useEffect(() => {
    axios.get("http://localhost:2025/api/assignment")
      .then((response) => {
        setAssignments(response.data);
      })
      .catch(error => {
        console.error("Error al obtener asignaciones:", error);
      });
  }, []);

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
                <Form.Control
                  type="text"
                  value={buildingMaterials}
                  readOnly
                />
              </Form.Group>
            </Col>
            <Col sm={6}>
              <Form.Group>
                <Form.Label>Fecha de Servicio</Form.Label>
                <Form.Control
                  type="date"
                  value={dateService}
                  readOnly
                />
              </Form.Group>
            </Col>
          </Row>

          <Row className="mb-3">
            <Col sm={6}>
              <Form.Group>
                <Form.Label>Observaciones</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  value={observations}
                  readOnly
                />
              </Form.Group>
            </Col>
            <Col sm={6}>
              <Form.Group>
                <Form.Label>Acciones Tomadas</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  value={actionsTaken}
                  readOnly
                />
              </Form.Group>
            </Col>
          </Row>

          <Row className="mb-3">
            <Col sm={6}>
              <Form.Group>
                <Form.Label>Evidencia Fotográfica</Form.Label>
                {photographicEvidence && (
                  <img
                    src={`http://localhost:2025/uploads/${photographicEvidence}`}
                    alt="Evidencia Fotográfica"
                    width="100"
                  />
                )}
              </Form.Group>
            </Col>
            <Col sm={6}>
              <Form.Group>
                <Form.Label>Asignación</Form.Label>
                <Form.Control
                  as="select"
                  value={assignmentId}
                  readOnly
                >
                  {assignments.map((assign) => (
                    <option key={assign.id} value={assign.id}>
                      {assign.id}
                    </option>
                  ))}
                </Form.Control>
              </Form.Group>
            </Col>
          </Row>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button className="buttons-form Button-next" onClick={handleClose}>
          Cerrar
        </Button>
      </Modal.Footer>
    </Modal>
  );
};
export default CustomModalView;

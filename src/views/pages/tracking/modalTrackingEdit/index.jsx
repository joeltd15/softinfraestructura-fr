import { useState, useEffect } from "react";
import { Modal, Button, Form, Row, Col } from "react-bootstrap";
import axios from "axios";

const ModalTrackingEdit = ({ show, handleClose, tracking, handleUpdate }) => {
  const [editedTracking, setEditedTracking] = useState({
    observations: "",
    buildingMaterials: "",
    dateService: new Date().toISOString().split("T")[0], // Fecha automática
    actionsTaken: "",
    status: "",
    assignmentId: "",
    photographicEvidence: "",
  });

  const [assignments, setAssignments] = useState([]);

  useEffect(() => {
    axios
      .get("http://localhost:2025/api/assignment")
      .then((response) => {
        setAssignments(response.data);
      })
      .catch((error) => {
        console.error("Error cargando asignaciones:", error);
      });
  }, []);

  useEffect(() => {
    if (tracking) {
      setEditedTracking((prev) => ({
        ...prev,
        id: tracking.id,
        observations: tracking.observations,
        buildingMaterials: tracking.buildingMaterials,
        actionsTaken: tracking.actionsTaken,
        status: tracking.status,
        assignmentId: tracking.assignmentId,
        photographicEvidence: tracking.photographicEvidence || "",
      }));
    }
  }, [tracking]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditedTracking((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    setEditedTracking((prev) => ({ ...prev, photographicEvidence: e.target.files[0] }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData();
    for (const key in editedTracking) {
      if (key === "photographicEvidence" && editedTracking[key] instanceof File) {
        formData.append(key, editedTracking[key]);
      } else {
        formData.append(key, editedTracking[key]);
      }
    }
    handleUpdate(formData);
  };

  return (
    <Modal show={show} onHide={handleClose} backdrop="static">
      <Modal.Header closeButton>
        <Modal.Title>Editar Seguimiento</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmit}>
          <Row className="mb-3">
            <Col sm={6}>
              <Form.Group>
                <Form.Label className="required">Materiales de Construcción</Form.Label>
                <Form.Control
                  type="text"
                  name="buildingMaterials"
                  value={editedTracking.buildingMaterials}
                  onChange={handleChange}
                />
              </Form.Group>
            </Col>
            <Col sm={6}>
              <Form.Group>
                <Form.Label className="required">Asignación</Form.Label>
                <Form.Select name="assignmentId" value={editedTracking.assignmentId} disabled>
                  <option value="">Seleccione una asignación</option>
                  {assignments.map((assignment) => (
                    <option key={assignment.id} value={assignment.id}>
                      {`${assignment.id}`}
                    </option>
                  ))}
                </Form.Select>

              </Form.Group>
            </Col>
          </Row>

          <Row className="mb-3">
            <Col sm={12}>
              <Form.Group>
                <Form.Label className="required">Observaciones</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  name="observations"
                  value={editedTracking.observations}
                  onChange={handleChange}
                />
              </Form.Group>
            </Col>
            <Col sm={12}>
              <Form.Group>
                <Form.Label className="required">Acciones Tomadas</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  name="actionsTaken"
                  value={editedTracking.actionsTaken}
                  onChange={handleChange}
                />
              </Form.Group>
            </Col>
          </Row>

          <Row className="mb-3">
            <Col sm={6}>
              <Form.Group>
                <Form.Label>Evidencia Fotográfica</Form.Label>
                <Form.Control type="file" name="photographicEvidence" onChange={handleFileChange} />
              </Form.Group>
            </Col>
            <Col sm={6}>
              <Form.Group>
                <Form.Label className="required">Estado</Form.Label>
                <Form.Select name="status" value={editedTracking.status} onChange={handleChange}>
                  <option value="">Seleccione un estado</option>
                  <option value="Completado">Completado</option>
                  <option value="Cancelado">Cancelado</option>
                  <option value="En espera por falta de material">En espera por falta de material</option>
                </Form.Select>
              </Form.Group>
            </Col>
          </Row>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button className="buttons-form Button-next" onClick={handleClose}>
          Salir
        </Button>
        <Button className="buttons-form Button-save" type="submit" onClick={handleSubmit}>
          Guardar
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ModalTrackingEdit;

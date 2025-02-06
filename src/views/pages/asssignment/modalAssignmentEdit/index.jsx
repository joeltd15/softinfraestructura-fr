import { useState, useEffect } from "react";
import { Modal, Button, Form, Row, Col } from "react-bootstrap";
import axios from "axios";

const ModalAssignmentEdit = ({ show, handleClose, assignment, handleUpdate }) => {
  const [editedAssignment, setEditedAssignment] = useState({
    id: "",
    applicationId: "",
    responsibleId: "",
    assignmentDate: new Date().toISOString().split("T")[0], // Fecha automática
  });

  const [applications, setApplications] = useState([]);
  const [responsibles, setResponsibles] = useState([]);

  useEffect(() => {
    if (assignment) {
      setEditedAssignment({
        id: assignment.id,
        applicationId: assignment.applicationId,
        responsibleId: assignment.responsibleId,
        assignmentDate: new Date().toISOString().split("T")[0], // Se actualiza automáticamente al editar
      });
    }
  }, [assignment]);

  useEffect(() => {
    axios.get("http://localhost:2025/api/application")
      .then((response) => setApplications(response.data))
      .catch((error) => console.error("Error loading applications:", error));

    axios.get("http://localhost:2025/api/responsible")
      .then((response) => setResponsibles(response.data))
      .catch((error) => console.error("Error loading responsibles:", error));
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditedAssignment((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    handleUpdate(editedAssignment);
  };

  return (
    <Modal show={show} onHide={handleClose} backdrop="static">
      <Modal.Header closeButton>
        <Modal.Title>Editar Asignación</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmit}>
          <Row className="mb-3">
            <Col sm={12}>
              <Form.Group>
                <Form.Label className="required">Solicitud</Form.Label>
                <Form.Select 
                  name="applicationId" 
                  value={editedAssignment.applicationId} 
                  onChange={handleChange}
                >
                  <option value="">Seleccione una solicitud</option>
                  {applications.map((app) => (
                    <option key={app.id} value={app.id}>
                      {`${app.id}`}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>
            </Col>
          </Row>

          <Row className="mb-3">
            <Col sm={12}>
              <Form.Group>
                <Form.Label className="required">Responsable</Form.Label>
                <Form.Select 
                  name="responsibleId" 
                  value={editedAssignment.responsibleId} 
                  onChange={handleChange}
                >
                  <option value="">Seleccione un responsable</option>
                  {responsibles.map((resp) => (
                    <option key={resp.id} value={resp.id}>
                      {`${resp.id}`} 
                    </option>
                  ))}
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
          Guardar Cambios
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ModalAssignmentEdit;

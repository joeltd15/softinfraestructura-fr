import { useState, useEffect } from "react";
import axios from "axios";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Modal from "react-bootstrap/Modal";
import { Col, Row } from "react-bootstrap";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const ModalAssignment = ({ show, handleClose, onAssignmentCreated }) => {
  const [assignmentDate, setAssignmentDate] = useState("");
  const [applicationId, setApplicationId] = useState("");
  const [responsibleId, setResponsibleId] = useState("");
  const [applications, setApplications] = useState([]);
  const [responsibles, setResponsibles] = useState([]);

  useEffect(() => {
    axios.get("http://localhost:2025/api/application")
      .then(response => setApplications(response.data))
      .catch(error => console.error("Error al obtener solicitudes:", error));

    axios.get("http://localhost:2025/api/responsible")
      .then(response => setResponsibles(response.data))
      .catch(error => console.error("Error al obtener responsables:", error));
  }, []);

  const handleSubmit = async () => {
    if (!assignmentDate || !applicationId || !responsibleId) {
      toast.warning("Todos los campos son obligatorios.");
      return;
    }
  
    const assignmentData = { assignmentDate, applicationId, responsibleId };
  
    try {
      const response = await axios.post("http://localhost:2025/api/assignment", assignmentData);
  
      toast.success("Asignación registrada correctamente");
    
      await onAssignmentCreated();
      
      handleClose();
    } catch (error) {
      console.error("Error al registrar la asignación:", error);
      toast.error("Error al registrar la asignación");
    }
  };
  

  return (
    <Modal show={show} onHide={handleClose} backdrop="static">
      <Modal.Header closeButton>
        <Modal.Title>Registrar Asignación</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Row className="mb-3">
            <Col sm={6}>
              <Form.Group>
                <Form.Label className="required">Fecha de Asignación</Form.Label>
                <Form.Control
                  type="date"
                  value={assignmentDate}
                  onChange={(e) => setAssignmentDate(e.target.value)}
                />
              </Form.Group>
            </Col>
            <Col sm={6}>
              <Form.Group>
                <Form.Label className="required">Solicitud</Form.Label>
                <Form.Select
                  value={applicationId}
                  onChange={(e) => setApplicationId(e.target.value)}
                >
                  <option value="">Seleccione una solicitud</option>
                  {applications.map(app => (
                    <option key={app.id} value={app.id}>{app.id}</option>
                  ))}
                </Form.Select>
              </Form.Group>
            </Col>
          </Row>

          <Row className="mb-3">
            <Col sm={6}>
              <Form.Group>
                <Form.Label className="required">Responsable</Form.Label>
                <Form.Select
                  value={responsibleId}
                  onChange={(e) => setResponsibleId(e.target.value)}
                >
                  <option value="">Seleccione un responsable</option>
                  {responsibles.map(resp => (
                    <option key={resp.id} value={resp.id}>{resp.id}</option>
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
        <Button className="buttons-form Button-save" onClick={handleSubmit}>
          Guardar
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ModalAssignment;
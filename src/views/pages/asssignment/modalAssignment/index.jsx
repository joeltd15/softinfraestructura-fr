import { useState, useEffect } from "react";
import axios from "axios";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Modal from "react-bootstrap/Modal";

const CustomModal = ({ show, handleClose }) => {
  const [assignmentDate, setAssignmentDate] = useState("");
  const [applicationId, setApplicationId] = useState("");
  const [responsibleId, setResponsibleId] = useState("");
  const [applications, setApplications] = useState([]);
  const [responsibles, setResponsibles] = useState([]);

  useEffect(() => {
    axios.get("http://localhost:2025/api/application").then((response) => {
      setApplications(response.data);
    });
    axios.get("http://localhost:2025/api/responsible").then((response) => {
      setResponsibles(response.data);
    });
  }, []);

  const handleSubmit = () => {
    const data = { assignmentDate, applicationId, responsibleId };
    console.log("Datos enviados:", data);
    handleClose();
  };

  return (
    <Modal show={show} onHide={handleClose} backdrop="static">
      <Modal.Header closeButton>
        <Modal.Title>Registrar Asignamiento</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group className="mb-3">
            <Form.Label className="required">Fecha de asignamiento</Form.Label>
            <Form.Control
              type="date"
              value={assignmentDate}
              onChange={(e) => setAssignmentDate(e.target.value)}
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label className="required">Solicitud</Form.Label>
            <Form.Select
              value={applicationId}
              onChange={(e) => setApplicationId(e.target.value)}
            >
              <option value="">Seleccione una solicitud</option>
              {applications.map((app) => (
                <option key={app.id} value={app.id}>
                  {app.id}
                </option>
              ))}
            </Form.Select>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label className="required">Responsable</Form.Label>
            <Form.Select
              value={responsibleId}
              onChange={(e) => setResponsibleId(e.target.value)}
            >
              <option value="">Seleccione un responsable</option>
              {responsibles.map((resp) => (
                <option key={resp.id} value={resp.id}>
                  {resp.typeResponsability}
                </option>
              ))}
            </Form.Select>
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button  className="buttons-form Button-next" onClick={handleClose}>
          Salir
        </Button>
        <Button className="buttons-form Button-save" onClick={handleSubmit}>
          Guardar
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default CustomModal;
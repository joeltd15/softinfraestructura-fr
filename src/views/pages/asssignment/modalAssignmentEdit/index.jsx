import { useState, useEffect } from "react";
import { Modal, Button, Form, Row, Col } from "react-bootstrap";
import axios from "axios";
import Select from 'react-select';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const ModalAssignmentEdit = ({ show, handleClose, assignment, handleUpdate }) => {
  const [editedAssignment, setEditedAssignment] = useState({
    id: "",
    applicationId: "",
    responsibleId: "",
    assignmentDate: new Date().toISOString().split("T")[0],
  });

  const [applications, setApplications] = useState([]);
  const [responsibles, setResponsibles] = useState([]);
  const [users, setUsers] = useState([]);

  useEffect(() => {
    if (assignment) {
      setEditedAssignment({
        id: assignment.id,
        applicationId: assignment.applicationId,
        responsibleId: assignment.responsibleId,
        assignmentDate: new Date().toISOString().split("T")[0],
      });
    }
  }, [assignment]);

  useEffect(() => {
    axios.get("http://localhost:2025/api/application")
      .then(response => setApplications(response.data))
      .catch(error => console.error("Error al obtener solicitudes:", error));

    axios.get("http://localhost:2025/api/responsible")
      .then(response => setResponsibles(response.data))
      .catch(error => console.error("Error al obtener responsables:", error));

    axios.get("http://localhost:2025/api/user")
      .then(response => setUsers(response.data))
      .catch(error => console.error("Error al obtener usuarios:", error));
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditedAssignment((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    handleUpdate(editedAssignment);
  };

  const options = applications.map(app => ({
    value: app.id,
    label: `${app.location} | Fecha: ${new Date(app.reportDate).toISOString().split('T')[0]} | Codigo: ${app.id} | Tipo: ${app.reportType}`,
  }));

  const userName = (userId) => {
    const user = users.find(user => user.id === userId);
    return user ? user.name : 'Desconocido';
  };

  const responsibleName = (responsibleId) => {
    if (!users.length) return "Cargando...";
    const responsible = responsibles.find(resp => resp.id === responsibleId);
    return responsible ? userName(responsible.userId) : "Desconocido";
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
                <Select
                  value={options.find(option => option.value === editedAssignment.applicationId)}
                  options={options}
                  isDisabled
                />
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
                  {responsibles.map(resp => (
                    <option key={resp.id} value={resp.id}>{responsibleName(resp.id)}</option>
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
          Guardar
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ModalAssignmentEdit;

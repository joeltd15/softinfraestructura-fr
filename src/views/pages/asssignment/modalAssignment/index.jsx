import { useState, useEffect } from "react";
import axios from "axios";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Modal from "react-bootstrap/Modal";
import { Col, Row } from 'react-bootstrap';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Select from 'react-select';

const ModalAssignment = ({ show, handleClose, onAssignmentCreated, assignmentApplication = null }) => {
  const urlUsers = 'http://localhost:2025/api/user';
  const [applicationId, setApplicationId] = useState("");
  const [responsibleId, setResponsibleId] = useState("");
  const [applications, setApplications] = useState([]);
  const [responsibles, setResponsibles] = useState([]);
  const [Users, setUsers] = useState([]);

  useEffect(() => {
    setApplicationId(assignmentApplication || "");
  }, [assignmentApplication]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [appRes, respRes, userRes] = await Promise.all([
          axios.get("http://localhost:2025/api/application"),
          axios.get("http://localhost:2025/api/responsible"),
          axios.get(urlUsers)
        ]);
  
        setApplications(appRes.data);
        setUsers(userRes.data);
  
        // Agrupar solicitudes por responsable
        const solicitudesPorResponsable = {};
        appRes.data.forEach(app => {
          if (app.status === "Asignada") {
            solicitudesPorResponsable[app.userId] = (solicitudesPorResponsable[app.userId] || 0) + 1;
          }
        });
  
        // Filtrar responsables con menos de 3 solicitudes en espera
        const filteredResponsibles = respRes.data.filter(resp => {
          return (solicitudesPorResponsable[resp.userId] || 0) < 3;
        });
  
        setResponsibles(filteredResponsibles);
      } catch (error) {
        console.error("Error al obtener datos:", error);
      }
    };
  
    fetchData();
  }, []);
  

  const getUsers = async () => {
    const response = await axios.get(urlUsers);
    setUsers(response.data);
  };

  const userName = (userId) => {
    const user = Users.find(user => user.id === userId);
    return user ? user.name : 'Desconocido';
  };

  const responsibleName = (responsibleId) => {
    if (!Users.length) return "Cargando..."; // Si Users aún no tiene datos, mostrar mensaje temporal
  
    const responsible = responsibles.find(resp => resp.id === responsibleId);
    return responsible ? userName(responsible.userId) : "Desconocido";
  };

  const handleSubmit = async () => {
    if (!applicationId || !responsibleId) {
      toast.warning("Todos los campos son obligatorios.");
      return;
    }

    const assignmentDate = new Date().toISOString().split("T")[0]; // Fecha automática
    const assignmentData = { assignmentDate, applicationId, responsibleId };

    try {
      await axios.post("http://localhost:2025/api/assignment", assignmentData);
      toast.success("Asignación registrada correctamente");
      await onAssignmentCreated();
      handleClose();
    } catch (error) {
      console.error("Error al registrar la asignación:", error);
      toast.error("Error al registrar la asignación");
    }
  };

  const options = applications.map(app => ({
    value: app.id,
    label: `${app.location} | Fecha: ${new Date(app.reportDate).toISOString().split('T')[0]} | Codigo: ${app.id} | Tipo: ${userName(app.reportType)}`,
  }));

  return (
    <Modal show={show} onHide={handleClose} backdrop="static">
      <Modal.Header closeButton>
        <Modal.Title>Registrar Asignación</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Row className="mb-3">
            <Col sm={12}>
              <Form.Group>
                <Form.Label className="required">Responsable</Form.Label>
                <Form.Select
                  value={responsibleId}
                  onChange={(e) => setResponsibleId(e.target.value)}
                >
                  <option value="">Seleccione un responsable</option>
                  {responsibles.map(resp => (
                    <option key={resp.id} value={resp.id}>{responsibleName(resp.id)}</option>
                  ))}
                </Form.Select>
              </Form.Group>
            </Col>
          </Row>
          <Form.Group>
            <Form.Label className="required">Solicitud</Form.Label>
            <Select
              value={options.find(option => option.value === applicationId)}
              onChange={(selectedOption) => setApplicationId(selectedOption.value)}
              options={options}
              placeholder="Seleccione una solicitud"
              isSearchable
              isDisabled
            />
          </Form.Group>
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
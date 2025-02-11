import { useState, useEffect } from "react";
import axios from "axios";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Modal from "react-bootstrap/Modal";
import { Col, Row } from "react-bootstrap";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const CustomModal = ({ show, handleClose, onSolicitudCreated, selectedAssignmentId }) => {
  const [observations, setObservations] = useState("");
  const [buildingMaterials, setBuildingMaterials] = useState("");
  const [actionsTaken, setActionsTaken] = useState("");
  const [photographicEvidence, setPhotographicEvidence] = useState(null);
  const [status, setStatus] = useState("Completado");
  const [assignmentId, setAssignmentId] = useState("");
  const [assignments, setAssignments] = useState([]);

  useEffect(() => {
    if (selectedAssignmentId) {
      setAssignmentId(selectedAssignmentId);
    }
  }, [selectedAssignmentId]);

  const handleFileChange = (e) => {
    setPhotographicEvidence(e.target.files[0]);
  };

  useEffect(() => {
    const fetchAssignments = async () => {
      try {
        const response = await axios.get("http://localhost:2025/api/assignment");
        setAssignments(response.data);
      } catch (error) {
        console.error("Error al obtener asignaciones:", error);
      }
    };
    if (show) {
      fetchAssignments();
    }
  }, [show]);
  
  const handleSubmit = async () => {
    const today = new Date().toISOString().split("T")[0];
  
    const formData = new FormData();
    formData.append("observations", observations);
    formData.append("buildingMaterials", buildingMaterials);
    formData.append("actionsTaken", actionsTaken);
    if (photographicEvidence) {
      formData.append("photographicEvidence", photographicEvidence);
    }
    formData.append("status", status);
    formData.append("assignmentId", assignmentId);
    formData.append("dateService", today);
  
    const registerRequest = axios.post("http://localhost:2025/api/tracking", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  
    toast.promise(registerRequest, {
      pending: "Registrando seguimiento...",
      success: "Seguimiento registrado correctamente",
      error: "Error al registrar el seguimiento",
    });
  
    try {
      const response = await registerRequest;
      console.log("Seguimiento registrado:", response.data);
      onSolicitudCreated();
      setTimeout(() => handleClose(), 500);
    } catch (error) {
      console.error("Error al registrar seguimiento:", error);
    }
  };

  return (
    <Modal show={show} onHide={handleClose} backdrop="static">
      <Modal.Header closeButton>
        <Modal.Title>Registrar Seguimiento</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          {/* Primera fila: Materiales de Construcción y Asignación */}
          <Row className="mb-3">
            <Col sm={6}>
              <Form.Group>
                <Form.Label className="required">Materiales de Construcción</Form.Label>
                <Form.Control
                  type="text"
                  value={buildingMaterials}
                  onChange={(e) => setBuildingMaterials(e.target.value)}
                />
              </Form.Group>
            </Col>
            <Col sm={6}>
              <Form.Group>
                <Form.Label className="required">Asignación</Form.Label>
                <Form.Select
                  value={assignmentId}
                  onChange={(e) => setAssignmentId(e.target.value)}
                  disabled>
                  <option value="">Seleccione una asignación</option>
                  {assignments.map((assign) => (
                    <option key={assign.id} value={assign.id}>
                      {assign.id}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>
            </Col>
          </Row>

          {/* Segunda fila: Observaciones y Acciones Tomadas (Ocupan toda la fila) */}
          <Row className="mb-3">
            <Col sm={12}>
              <Form.Group>
                <Form.Label className="required">Observaciones</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  value={observations}
                  onChange={(e) => setObservations(e.target.value)}
                />
              </Form.Group>
            </Col>
          </Row>

          <Row className="mb-3">
            <Col sm={12}>
              <Form.Group>
                <Form.Label className="required">Acciones Tomadas</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  value={actionsTaken}
                  onChange={(e) => setActionsTaken(e.target.value)}
                />
              </Form.Group>
            </Col>
          </Row>

          {/* Última fila: Evidencia Fotográfica */}
          <Row className="mb-3">
            <Col sm={12}>
              <Form.Group>
                <Form.Label>Evidencia Fotográfica</Form.Label>
                <Form.Control
                  type="file"
                  onChange={handleFileChange}
                  accept="image/*"
                />
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

export default CustomModal;

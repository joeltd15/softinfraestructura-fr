import { useState, useEffect } from "react";
import axios from "axios";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Modal from "react-bootstrap/Modal";
import { Col, Row } from "react-bootstrap";
import { useAlert } from '../../../../assets/functions/index';
import { toast } from "react-toastify";

const CustomModal = ({ show, handleClose, onSolicitudCreated, selectedAssignmentId }) => {
  const [observations, setObservations] = useState("");
  const [buildingMaterials, setBuildingMaterials] = useState("");
  const [actionsTaken, setActionsTaken] = useState("");
  const [photographicEvidence, setPhotographicEvidence] = useState(null);
  const [status, setStatus] = useState("Realizado");
  const [assignmentId, setAssignmentId] = useState("");
  const [assignments, setAssignments] = useState([]);
  const [errors, setErrors] = useState({});
  const { showAlert } = useAlert();

  useEffect(() => {
    return () => {
      toast.dismiss();
    };
  }, []);

  useEffect(() => {
    if (selectedAssignmentId) {
      setAssignmentId(selectedAssignmentId);
    }
  }, [selectedAssignmentId]);

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

  const validateFields = () => {
    const newErrors = {};
    if (!buildingMaterials.trim()) newErrors.buildingMaterials = "Este campo es obligatorio";
    if (!observations.trim()) newErrors.observations = "Este campo es obligatorio";
    if (!actionsTaken.trim()) newErrors.actionsTaken = "Este campo es obligatorio";
    if (!assignmentId) newErrors.assignmentId = "Debe seleccionar una asignación";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateFields()) {
      showAlert("Por favor, completa todos los campos obligatorios.", 'error');
      return;
    }

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

    try {
      await axios.post("http://localhost:2025/api/tracking", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      showAlert("Seguimiento registrado correctamente.", 'success');
      onSolicitudCreated();
      setTimeout(() => handleClose(), 500);
    } catch (error) {
      console.error("Error al registrar seguimiento:", error);
      showAlert("Error al registrar el seguimiento.", 'error');
    }
  };

  return (
    <Modal show={show} onHide={handleClose} backdrop="static">
      <Modal.Header closeButton>
        <Modal.Title>Registrar Seguimiento</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Row className="mb-3">
            <Col sm={6}>
              <Form.Group>
                <Form.Label className="required">Materiales de Construcción</Form.Label>
                <Form.Control
                  type="text"
                  value={buildingMaterials}
                  onChange={(e) => {
                    setBuildingMaterials(e.target.value);
                    setErrors((prev) => ({ ...prev, buildingMaterials: "" }));
                  }}
                  isInvalid={!!errors.buildingMaterials}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.buildingMaterials}
                </Form.Control.Feedback>
              </Form.Group>
            </Col>
            <Col sm={6}>
              <Form.Group>
                <Form.Label className="required">Asignación</Form.Label>
                <Form.Select
                  value={assignmentId}
                  onChange={(e) => {
                    setAssignmentId(e.target.value);
                    setErrors((prev) => ({ ...prev, assignmentId: "" }));
                  }}
                  isInvalid={!!errors.assignmentId}
                  disabled
                >
                  <option value="">Seleccione una asignación</option>
                  {assignments.map((assign) => (
                    <option key={assign.id} value={assign.id}>
                      {assign.id}
                    </option>
                  ))}
                </Form.Select>
                <Form.Control.Feedback type="invalid">
                  {errors.assignmentId}
                </Form.Control.Feedback>
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
                  value={observations}
                  onChange={(e) => {
                    setObservations(e.target.value);
                    setErrors((prev) => ({ ...prev, observations: "" }));
                  }}
                  isInvalid={!!errors.observations}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.observations}
                </Form.Control.Feedback>
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

import { useState, useEffect } from "react";
import axios from "axios";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Modal from "react-bootstrap/Modal";
import { Col, Row } from "react-bootstrap";

const CustomModal = ({ show, handleClose, Title }) => {
  const [observations, setObservations] = useState("");
  const [buildingMaterials, setBuildingMaterials] = useState("");
  const [dateService, setDateService] = useState("");
  const [actionsTaken, setActionsTaken] = useState("");
  const [photographicEvidence, setPhotographicEvidence] = useState(null);
  const [status, setStatus] = useState("En proceso");
  const [assignmentId, setAssignmentId] = useState("");
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

  const handleFileChange = (e) => {
    setPhotographicEvidence(e.target.files[0]); // Guardamos el archivo seleccionado
  };

  const handleSubmit = async () => {
    const formData = new FormData();
    formData.append("observations", observations);
    formData.append("buildingMaterials", buildingMaterials);
    formData.append("dateService", dateService);
    formData.append("actionsTaken", actionsTaken);
    if (photographicEvidence) {
      formData.append("photographicEvidence", photographicEvidence);
    }
    formData.append("status", status);
    formData.append("assignmentId", assignmentId);

    try {
      const response = await axios.post("http://localhost:2025/api/tracking", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      console.log("Seguimiento registrado:", response.data);
      handleClose(); // Cierra la modal tras el éxito
    } catch (error) {
      console.error("Error al registrar seguimiento:", error);
    }
  };

  return (
    <Modal show={show} onHide={handleClose} backdrop="static">
      <Modal.Header closeButton>
        <Modal.Title>{Title} seguimiento</Modal.Title>
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
                  onChange={(e) => setBuildingMaterials(e.target.value)}
                />
              </Form.Group>
            </Col>
            <Col sm={6}>
              <Form.Group>
                <Form.Label className="required">Fecha de Servicio</Form.Label>
                <Form.Control
                  type="date"
                  value={dateService}
                  onChange={(e) => setDateService(e.target.value)}
                />
              </Form.Group>
            </Col>
          </Row>

          <Row className="mb-3">
            <Col sm={6}>
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
            <Col sm={6}>
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

          <Row className="mb-3">
            <Col sm={6}>
              <Form.Group>
                <Form.Label>Evidencia Fotográfica</Form.Label>
                <Form.Control
                  type="file"
                  onChange={handleFileChange}
                  accept="image/*"
                />
              </Form.Group>
            </Col>
            <Col sm={6}>
              <Form.Group>
                <Form.Label className="required">Asignación</Form.Label>
                <Form.Select
                  value={assignmentId}
                  onChange={(e) => setAssignmentId(e.target.value)}
                >
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
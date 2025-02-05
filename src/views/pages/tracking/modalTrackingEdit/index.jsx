import { useState, useEffect } from "react";
import { Modal, Button, Form, Row, Col } from "react-bootstrap";

const ModalTrackingEdit = ({ show, handleClose, tracking, handleUpdate }) => {
  const [editedTracking, setEditedTracking] = useState({
    observations: "",
    buildingMaterials: "",
    dateService: "",
    actionsTaken: "",
    status: "",
    assignmentId: "",
    photographicEvidence: "",
  });

  useEffect(() => {
    if (tracking) {
      setEditedTracking({
        id: tracking.id,
        observations: tracking.observations,
        buildingMaterials: tracking.buildingMaterials,
        dateService: tracking.dateService,
        actionsTaken: tracking.actionsTaken,
        status: tracking.status,
        assignmentId: tracking.assignmentId,
        photographicEvidence: tracking.photographicEvidence || "",
      });
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
                <Form.Control type="text" name="buildingMaterials" value={editedTracking.buildingMaterials}
                  onChange={handleChange}
                />
              </Form.Group>
            </Col>
            <Col sm={6}>
              <Form.Group>
                <Form.Label className="required">Fecha de Servicio</Form.Label>
                <Form.Control
                  type="date"
                  name="dateService"
                  value={editedTracking.dateService}
                  onChange={handleChange}
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
                  name="observations"
                  value={editedTracking.observations}
                  onChange={handleChange}
                />
              </Form.Group>
            </Col>
            <Col sm={6}>
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
                  <option value="completado">Completado</option>
                  <option value="cancelado">Cancelado</option>
                  <option value="en proceso">En proceso</option>
                </Form.Select>
              </Form.Group>
            </Col>
          </Row>

          <Row className="mb-3">
            <Col sm={12}>
              <Form.Group>
                <Form.Label className="required">Asignación</Form.Label>
                <Form.Control type="text" name="assignmentId" value={editedTracking.assignmentId} onChange={handleChange} />
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

export default ModalTrackingEdit;
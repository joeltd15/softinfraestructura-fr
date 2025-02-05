import { useState, useEffect } from "react"
import { Modal, Button, Form } from "react-bootstrap"

const ModalTrackingEdit = ({ show, handleClose, tracking, handleUpdate }) => {
  const [editedTracking, setEditedTracking] = useState({
    observations: "",
    buildingMaterials: "",
    dateService: "",
    actionsTaken: "",
    status: "",
    assignmentId: "",
  })

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
      })
    }
  }, [tracking])

  const handleChange = (e) => {
    const { name, value } = e.target
    setEditedTracking((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    handleUpdate(editedTracking)
  }

  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Editar Tracking</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Label>Observaciones</Form.Label>
            <Form.Control type="text" name="observations" value={editedTracking.observations} onChange={handleChange} />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Materiales</Form.Label>
            <Form.Control
              type="text"
              name="buildingMaterials"
              value={editedTracking.buildingMaterials}
              onChange={handleChange}
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Fecha del Servicio</Form.Label>
            <Form.Control type="date" name="dateService" value={editedTracking.dateService} onChange={handleChange} />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Acciones Tomadas</Form.Label>
            <Form.Control
              as="textarea"
              name="actionsTaken"
              value={editedTracking.actionsTaken}
              onChange={handleChange}
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Estado</Form.Label>
            <Form.Control type="text" name="status" value={editedTracking.status} onChange={handleChange} />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Asignación</Form.Label>
            <Form.Control type="text" name="assignmentId" value={editedTracking.assignmentId} onChange={handleChange} />
          </Form.Group>
          <Button variant="primary" type="submit">
            Guardar Cambios
          </Button>
        </Form>
      </Modal.Body>
    </Modal>
  )
}

export default ModalTrackingEdit
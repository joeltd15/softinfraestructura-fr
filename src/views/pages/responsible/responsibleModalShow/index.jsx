import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import { Col, Row } from "react-bootstrap";

function ShowResponsibleModal({ show, handleClose, responsible = null, users = [] }) {
  // Buscar el usuario correspondiente al `userId`
  const user = users.find(user => user.id === responsible?.userId);

  return (
    <Modal show={show} onHide={handleClose} backdrop="static" keyboard={false}>
      <Modal.Header closeButton>
        <Modal.Title>Detalles del Responsable</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {responsible && (
          <div>
            <Row className="mb-2">
              <Col sm={6}>
                <p><strong>Id:</strong> {responsible.id}</p>
              </Col>
              <Col sm={6}>
                <p><strong>Tipo de Responsabilidad:</strong> {responsible.Responsibilities?.map(res => res.name).join(", ") || "Sin responsabilidades"}</p>
              </Col>
            </Row>
            <Row className="mb-2">
              <Col sm={6}>
                <p><strong>Usuario:</strong> {user ? user.name : "Desconocido"}</p>
              </Col>
            </Row>
          </div>
        )}
      </Modal.Body>
      <Modal.Footer>
        <Button className="buttons-form Button-next" onClick={handleClose}>
          Cerrar
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default ShowResponsibleModal;
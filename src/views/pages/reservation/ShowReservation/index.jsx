import { useState, useEffect } from 'react';
import axios from 'axios';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { Col, Row } from 'react-bootstrap';
import { toast } from 'react-toastify';

function ShowModal({ show, onClose, reservationId }) {
  const [scenery, setScenery] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [activity, setActivity] = useState("");
  const [estatus, setStatus] = useState("");

  useEffect(() => {
    if (reservationId) {
      axios.get(`http://localhost:2025/api/reservation/${reservationId}`)
        .then(response => {
          const { scenery, startTime, finishTime, activity, estatus } = response.data;
          setScenery(scenery);
          setStartTime(startTime);
          setEndTime(finishTime);
          setActivity(activity);
          setStatus(estatus);
        })
        .catch(error => {
          console.error("Error al obtener la reserva:", error);
          toast.error("Error al cargar los datos de la reserva.");
        });
    }
  }, [reservationId]);

  return (
    <Modal show={show} onHide={onClose} backdrop="static" keyboard={false}>
      <Modal.Header closeButton>
        <Modal.Title>Detalles de la reserva</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {scenery && (
          <div className="container">
            <Row className="mb-2">
              <Col sm={6}><p><strong>Fecha:</strong> {scenery}</p></Col>
              <Col sm={6}><p><strong>Dependencia:</strong> {estatus}</p></Col>
            </Row>
            <Row className="mb-2">
              <Col sm={6}><p><strong>Lugar:</strong> {startTime}</p></Col>
              <Col sm={6}><p><strong>Usuario:</strong> {endTime}</p></Col>
            </Row>
            <Row className="mb-2">
              <Col sm={12}><p><strong>Detalles:</strong> {activity}</p></Col>
            </Row>
          </div>
        )}
      </Modal.Body>
      <Modal.Footer>
        <Button className="buttons-form Button-next" onClick={onClose}>
          Salir
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default ShowModal;

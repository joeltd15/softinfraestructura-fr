import React, { useState, useEffect } from "react";
import axios from "axios";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Modal from "react-bootstrap/Modal";
import { Col, Row } from "react-bootstrap";
import CustomTimeSelector from "../TimeSelector/index";
import { toast } from "react-toastify";

const EditReservationModal = ({ show, reservationId, onClose }) => {
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

  const handleSubmit = async () => {
    if (!scenery || !startTime || !endTime || !activity) {
      toast.error("Todos los campos son obligatorios.");
      return;
    }

    const requestData = {
      scenery,
      startTime: `${startTime}:00`,
      finishTime: `${endTime}:00`,
      activity,
      estatus
    };

    try {
      await axios.put(`http://localhost:2025/api/reservation/${reservationId}`, requestData);
      toast.success("Reserva actualizada correctamente.");
      onClose();
    } catch (error) {
      console.error("Error al actualizar la reserva:", error);
      toast.error("Error al actualizar la reserva.");
    }
  };

  return (
    <Modal show={show} onHide={onClose} backdrop="static">
      <Modal.Header closeButton>
        <Modal.Title>Editar Reserva</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group className="mb-3" as={Row}>
            <Col sm="6">
              <Form.Label className="required">Escenario</Form.Label>
              <Form.Select value={scenery} onChange={(e) => setScenery(e.target.value)}>
                <option value="">Seleccione un escenario</option>
                <option value="AuditorioA">Auditorio torre norte</option>
                <option value="AuditorioB">Auditorio Carlos castro</option>
                <option value="Cancha">Cancha de grama</option>
                <option value="Plazoleta">Plazoleta central</option>
              </Form.Select>
            </Col>
            <Col sm="6">
              <Form.Label className="required">Estado</Form.Label>
              <Form.Select value={estatus} onChange={(e) => setStatus(e.target.value)}>
                <option value="">Seleccione un estado</option>
                <option value="Pendiente">Pendiente</option>
                <option value="Cancelado">Cancelado</option>
                <option value="Realizado">Realizado</option>
              </Form.Select>
            </Col>
          </Form.Group>
          <Form.Group className="mb-3" as={Row}>
            <Col sm="6">
              <Form.Label className="required">Hora de inicio</Form.Label>
              <CustomTimeSelector value={startTime} onChange={setStartTime} name="startTime" />
            </Col>
            <Col sm="6">
              <Form.Label className="required">Hora de final</Form.Label>
              <CustomTimeSelector value={endTime} onChange={setEndTime} name="endTime" />
            </Col>
          </Form.Group>
          <Form.Group className="mb-3 p-3" as={Row}>
            <Form.Label className="required">Actividad</Form.Label>
            <Form.Control
              as="textarea"
              rows={2}
              placeholder="Describa las actividades a realizar en el espacio"
              value={activity}
              onChange={(e) => setActivity(e.target.value)}
            />
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button className="buttons-form Button-next" onClick={onClose}>Salir</Button>
        <Button className="buttons-form Button-save" onClick={handleSubmit}>Guardar</Button>
      </Modal.Footer>
    </Modal>
  );
};

export default EditReservationModal;

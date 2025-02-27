import React, { useEffect, useState } from "react";
import axios from "axios";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Modal from "react-bootstrap/Modal";
import { Col, Row } from "react-bootstrap";
import CustomTimeSelector from "../TimeSelector/index";
import { toast } from "react-toastify";
import { useAlert } from '../../../../assets/functions/index';


const ReservationModal = ({ show, selectedDate, onClose, getReservations }) => {
  const [scenery, setScenery] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [activity, setActivity] = useState("");
  const [errors, setErrors] = useState({});
  const { showAlert } = useAlert();

  const user = JSON.parse(localStorage.getItem("user"));

  const validateField = (field, value) => {
    setErrors((prevErrors) => ({
      ...prevErrors,
      [field]: !value ? "Este campo es obligatorio." : "",
    }));
  };

  const validateTimeOrder = () => {
    if (startTime && endTime && startTime >= endTime) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        endTime: "La hora final debe ser mayor que la hora de inicio.",
      }));
      return false;
    }
    setErrors((prevErrors) => ({
      ...prevErrors,
      endTime: "",
    }));
    return true;
  };

  const handleSubmit = async () => {
    if (!scenery || !startTime || !endTime || !activity) {
      setErrors({
        scenery: !scenery ? "Este campo es obligatorio." : "",
        startTime: !startTime ? "Este campo es obligatorio." : "",
        endTime: !endTime ? "Este campo es obligatorio." : "",
        activity: !activity ? "Este campo es obligatorio." : "",
      });
      showAlert("Todos los campos son obligatorios.", 'error');
      return;
    }

    if (!validateTimeOrder()) {
      showAlert("La hora final debe ser mayor que la hora de inicio.", 'error');
      return;
    }

    const requestData = {
      scenery,
      date: selectedDate,
      startTime: `${startTime}:00`,
      finishTime: `${endTime}:00`,
      activity,
      estatus: "Reservado",
      userId: user?.id,
    };

    try {
      await axios.post("http://localhost:2025/api/reservation", requestData);
      toast.success('Registrado correctamente!', {
        position: "top-right",
        autoClose: 4000,
      })
      getReservations();
      onClose();
    } catch (error) {
      console.error("Error al registrar la reserva:", error);
      toast.error('Error al registrar', {
        position: "top-right",
        autoClose: 5000,
      });
    }
  };

  return (
    <Modal show={show} onHide={onClose} backdrop="static">
      <Modal.Header closeButton>
        <Modal.Title>Registrar Reserva</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group className="mb-3" as={Row}>
            <Col sm="12">
              <Form.Label className="required">Escenario</Form.Label>
              <Form.Select
                value={scenery}
                onChange={(e) => {
                  setScenery(e.target.value);
                  validateField("scenery", e.target.value);
                }}
                isInvalid={!!errors.scenery}
              >
                <option value="">Seleccione un escenario</option>
                <option value="AuditorioA">Auditorio torre norte</option>
                <option value="AuditorioB">Auditorio Carlos Castro</option>
                <option value="Cancha">Cancha de grama</option>
                <option value="Plazoleta">Plazoleta central</option>
              </Form.Select>
              {errors.scenery && <Form.Text className="text-danger">{errors.scenery}</Form.Text>}
            </Col>
          </Form.Group>

          <Form.Group className="mb-3" as={Row}>
            <Col sm="6">
              <Form.Label className="required">Hora de inicio</Form.Label>
              <CustomTimeSelector
                value={startTime}
                onChange={(value) => {
                  setStartTime(value);
                  validateField("startTime", value);
                  validateTimeOrder();
                }}
                name="startTime"
              />
              {errors.startTime && <Form.Text className="text-danger">{errors.startTime}</Form.Text>}
            </Col>
            <Col sm="6">
              <Form.Label className="required">Hora de final</Form.Label>
              <CustomTimeSelector
                value={endTime}
                onChange={(value) => {
                  setEndTime(value);
                  validateField("endTime", value);
                  validateTimeOrder();
                }}
                name="endTime"
              />
              {errors.endTime && <Form.Text className="text-danger">{errors.endTime}</Form.Text>}
            </Col>
          </Form.Group>

          <Form.Group className="mb-3" as={Row}>
            <Form.Label className="required">Actividad</Form.Label>
            <Form.Control
              as="textarea"
              rows={2}
              placeholder="Describa las actividades a realizar en el espacio"
              value={activity}
              onChange={(e) => {
                setActivity(e.target.value);
                validateField("activity", e.target.value);
              }}
              isInvalid={!!errors.activity}
            />
            {errors.activity && <Form.Text className="text-danger">{errors.activity}</Form.Text>}
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

export default ReservationModal;
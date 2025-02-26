import React, { useState, useEffect } from "react";
import axios from "axios";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Modal from "react-bootstrap/Modal";
import { Col, Row } from "react-bootstrap";
import CustomTimeSelector from "../TimeSelector/index";
import { toast } from "react-toastify";
import { AiOutlineExclamationCircle } from "react-icons/ai";
import { useAlert } from '../../../../assets/functions/index';


const EditReservationModal = ({ show, reservationId, onClose }) => {
  const [scenery, setScenery] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [activity, setActivity] = useState("");
  const [estatus, setStatus] = useState("");
  const [errors, setErrors] = useState({});
  const { showAlert } = useAlert();

  useEffect(() => {
    return () => {
      toast.dismiss(); // Limpia todas las alertas pendientes al desmontar el componente
    };
  }, []);

  useEffect(() => {
    if (reservationId) {
      axios
        .get(`http://localhost:2025/api/reservation/${reservationId}`)
        .then((response) => {
          const { scenery, startTime, finishTime, activity, estatus } =
            response.data;
          setScenery(scenery);
          setStartTime(startTime);
          setEndTime(finishTime);
          setActivity(activity);
          setStatus(estatus);
        })
        .catch((error) => {
          console.error("Error al obtener la reserva:", error);
          showAlert("Error al cargar los datos de la reserva.", 'error');
        });
    }
  }, [reservationId]);

  const validateField = (name, value) => {
    let newErrors = { ...errors };

    switch (name) {
      case "scenery":
        newErrors.scenery = value ? "" : "El escenario es obligatorio.";
        break;
      case "startTime":
        newErrors.startTime = value ? "" : "La hora de inicio es obligatoria.";
        if (endTime && value >= endTime) {
          newErrors.endTime = "La hora de finalización debe ser mayor.";
        } else {
          newErrors.endTime = "";
        }
        break;
      case "endTime":
        newErrors.endTime = value ? "" : "La hora de finalización es obligatoria.";
        if (startTime && value <= startTime) {
          newErrors.endTime = "La hora de finalización debe ser mayor.";
        } else {
          newErrors.endTime = "";
        }
        break;
      case "activity":
        newErrors.activity = value ? "" : "La actividad es obligatoria.";
        break;
      case "estatus":
        newErrors.estatus = value ? "" : "El estado es obligatorio.";
        break;
      default:
        break;
    }

    setErrors(newErrors);
  };

  const handleSubmit = async () => {
    if (Object.values(errors).some((error) => error !== "")) return;

    const requestData = {
      scenery,
      startTime: `${startTime}:00`,
      finishTime: `${endTime}:00`,
      activity,
      estatus,
    };

    try {
      await axios.put(
        `http://localhost:2025/api/reservation/${reservationId}`,
        requestData
      );
      showAlert("Reserva actualizada correctamente.", 'success');
      onClose();
    } catch (error) {
      console.error("Error al actualizar la reserva:", error);
      showAlert("Error al actualizar la reserva.", 'error');
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
                <option value="AuditorioB">Auditorio Carlos castro</option>
                <option value="Cancha">Cancha de grama</option>
                <option value="Plazoleta">Plazoleta central</option>
              </Form.Select>
              {errors.scenery && (
                <div className="text-danger">
                  <AiOutlineExclamationCircle /> {errors.scenery}
                </div>
              )}
            </Col>
            <Col sm="6">
              <Form.Label className="required">Estado</Form.Label>
              <Form.Select
                value={estatus}
                onChange={(e) => {
                  setStatus(e.target.value);
                  validateField("estatus", e.target.value);
                }}
                isInvalid={!!errors.estatus}
              >
                <option value="">Seleccione un estado</option>
                <option value="Pendiente">Pendiente</option>
                <option value="Cancelado">Cancelado</option>
                <option value="Realizado">Realizado</option>
              </Form.Select>
              {errors.estatus && (
                <div className="text-danger">
                  <AiOutlineExclamationCircle /> {errors.estatus}
                </div>
              )}
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
                }}
              />
              {errors.startTime && (
                <div className="text-danger">
                  <AiOutlineExclamationCircle /> {errors.startTime}
                </div>
              )}
            </Col>
            <Col sm="6">
              <Form.Label className="required">Hora de final</Form.Label>
              <CustomTimeSelector
                value={endTime}
                onChange={(value) => {
                  setEndTime(value);
                  validateField("endTime", value);
                }}
              />
              {errors.endTime && (
                <div className="text-danger">
                  <AiOutlineExclamationCircle /> {errors.endTime}
                </div>
              )}
            </Col>
          </Form.Group>
          <Form.Group className="mb-3 p-3" as={Row}>
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
            {errors.activity && (
              <div className="text-danger">
                <AiOutlineExclamationCircle /> {errors.activity}
              </div>
            )}
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button className="buttons-form Button-next" onClick={onClose}>
          Salir
        </Button>
        <Button className="buttons-form Button-save" onClick={handleSubmit}>
          Guardar
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default EditReservationModal;
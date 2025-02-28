"use client"

import { useState, useEffect } from "react"
import axios from "axios"
import Button from "react-bootstrap/Button"
import Modal from "react-bootstrap/Modal"
import { Col, Row } from "react-bootstrap"
import { toast } from "react-toastify"
import { useAlert } from "../../../../assets/functions/index"

function ShowModal({ show, onClose, reservationId }) {
  const [scenery, setScenery] = useState("")
  const [startTime, setStartTime] = useState("")
  const [endTime, setEndTime] = useState("")
  const [activity, setActivity] = useState("")
  const [estatus, setStatus] = useState("")
  const { showAlert } = useAlert()

  useEffect(() => {
    return () => {
      toast.dismiss() // Limpia todas las alertas Reservados al desmontar el componente
    }
  }, [])

  useEffect(() => {
    if (reservationId) {
      axios
        .get(`http://localhost:2025/api/reservation/${reservationId}`)
        .then((response) => {
          const { scenery, startTime, finishTime, activity, estatus } = response.data
          setScenery(scenery)
          setStartTime(startTime)
          setEndTime(finishTime)
          setActivity(activity)
          setStatus(estatus)
        })
        .catch((error) => {
          console.error("Error al obtener la reserva:", error)
          showAlert("Error al cargar los datos de la reserva.", "error")
        })
    }
  }, [reservationId, showAlert])

  // Función para formatear la hora en formato AM/PM
  const formatTimeToAMPM = (timeString) => {
    if (!timeString) return ""

    // Si la hora ya incluye fecha, extraemos solo la parte de la hora
    let time = timeString
    if (timeString.includes("T")) {
      time = timeString.split("T")[1]
    }

    try {
      // Crear una fecha con la hora actual para poder formatearla
      const [hours, minutes] = time.split(":")
      const date = new Date()
      date.setHours(Number.parseInt(hours, 10))
      date.setMinutes(Number.parseInt(minutes, 10))

      // Formatear a AM/PM
      return date.toLocaleTimeString("es-ES", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      })
    } catch (error) {
      console.error("Error al formatear la hora:", error)
      return timeString // Devolver la hora original si hay error
    }
  }

  return (
    <Modal show={show} onHide={onClose} backdrop="static" keyboard={false}>
      <Modal.Header closeButton>
        <Modal.Title>Detalles de la reserva</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {scenery && (
          <div className="container">
            <Row className="mb-2">
              <Col sm={6}>
                <p>
                  <strong>Escenario:</strong> {scenery}
                </p>
              </Col>
              <Col sm={6}>
                <p>
                  <strong>Estado de la reserva:</strong> {estatus}
                </p>
              </Col>
            </Row>
            <Row className="mb-2">
              <Col sm={6}>
                <p>
                  <strong>Hora inicio:</strong> {formatTimeToAMPM(startTime)}
                </p>
              </Col>
              <Col sm={6}>
                <p>
                  <strong>Hora final:</strong> {formatTimeToAMPM(endTime)}
                </p>
              </Col>
            </Row>
            <Row className="mb-2">
              <Col sm={12}>
                <p>
                  <strong>Detalles:</strong> {activity}
                </p>
              </Col>
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
  )
}

export default ShowModal


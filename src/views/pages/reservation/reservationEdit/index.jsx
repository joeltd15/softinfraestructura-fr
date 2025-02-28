"use client"

import { useState, useEffect, useCallback } from "react"
import axios from "axios"
import Button from "react-bootstrap/Button"
import Form from "react-bootstrap/Form"
import Modal from "react-bootstrap/Modal"
import { Col, Row } from "react-bootstrap"
import CustomTimeSelector from "../TimeSelector/index"
import { toast } from "react-toastify"
import { AiOutlineExclamationCircle } from "react-icons/ai"
import { useAlert } from "../../../../assets/functions/index"

const EditReservationModal = ({ show, reservationId, onClose, getReservations }) => {
  const [scenery, setScenery] = useState("")
  const [selectedDate, setSelectedDate] = useState("")
  const [startTime, setStartTime] = useState("")
  const [endTime, setEndTime] = useState("")
  const [activity, setActivity] = useState("")
  const [estatus, setStatus] = useState("")
  const [errors, setErrors] = useState({})
  const [availableStartTimes, setAvailableStartTimes] = useState([])
  const [availableEndTimes, setAvailableEndTimes] = useState([])
  const [existingReservations, setExistingReservations] = useState([])
  const [isFullyBooked, setIsFullyBooked] = useState(false)
  const [originalReservation, setOriginalReservation] = useState(null)
  const { showAlert } = useAlert()

  useEffect(() => {
    return () => {
      toast.dismiss() // Limpia todas las alertas al desmontar el componente
    }
  }, [])

  useEffect(() => {
    if (reservationId) {
      axios
        .get(`http://localhost:2025/api/reservation/${reservationId}`)
        .then((response) => {
          const reservation = response.data
          setScenery(reservation.scenery)
          setStartTime(reservation.startTime)
          setEndTime(reservation.finishTime)
          setActivity(reservation.activity)
          setStatus(reservation.estatus)
          setSelectedDate(reservation.date)
          setOriginalReservation(reservation)
        })
        .catch((error) => {
          console.error("Error al obtener la reserva:", error)
          showAlert("Error al cargar los datos de la reserva.", "error")
        })
    }
  }, [reservationId, showAlert])

  useEffect(() => {
    if (scenery && selectedDate && originalReservation) {
      console.log("Fetching availability for:", { scenery, selectedDate })
      fetchAvailability()
    }
  }, [scenery, selectedDate, originalReservation])

  const fetchAvailability = async () => {
    try {
      const response = await axios.post(`http://localhost:2025/api/reservation/availability`, {
        scenery,
        date: selectedDate,
      })

      console.log("Respuesta del servidor:", response.data)

      let reservationsData = []
      if (Array.isArray(response.data)) {
        reservationsData = response.data
      } else if (response.data && response.data.data) {
        reservationsData = response.data.data
      } else {
        throw new Error("Formato de respuesta inesperado: " + JSON.stringify(response.data))
      }

      // Filtrar la reserva actual para no bloquear sus propios horarios
      const filteredReservations = reservationsData.filter((res) => res.id !== Number.parseInt(reservationId))

      updateAvailableTimes(filteredReservations)
      setExistingReservations(filteredReservations)
    } catch (error) {
      console.error("Error al obtener disponibilidad:", error)
      let errorMessage = "Error al verificar disponibilidad. "
      if (error.response) {
        errorMessage += `Error ${error.response.status}: ${error.response.data.message || JSON.stringify(error.response.data)}`
      } else if (error.request) {
        errorMessage += "No se recibió respuesta del servidor."
      } else {
        errorMessage += error.message
      }
      showAlert(errorMessage, "error")

      setAvailableStartTimes([])
      setAvailableEndTimes([])
      setExistingReservations([])
    }
  }

  const generateTimeSlots = useCallback(() => {
    const slots = []
    for (let hour = 8; hour <= 17; hour++) {
      for (let minute = 0; minute <= 30; minute += 30) {
        slots.push(`${hour.toString().padStart(2, "0")}:${minute.toString().padStart(2, "0")}:00`)
      }
    }
    return slots
  }, [])

  const updateAvailableTimes = (reservations) => {
    console.log("Updating available times with:", reservations)
    const timeSlots = generateTimeSlots()

    if (reservations.length === 0) {
      // Si no hay reservas, todos los horarios están disponibles
      setAvailableStartTimes(timeSlots)
      setIsFullyBooked(false)
      return
    }

    const occupiedTimeRanges = reservations.map((reservation) => ({
      start: reservation.startTime,
      end: reservation.finishTime,
    }))

    const available = timeSlots.filter((time) => {
      return !occupiedTimeRanges.some((range) => {
        return time >= range.start && time < range.end
      })
    })

    // Verificar si el espacio está completamente reservado
    if (available.length === 0) {
      showAlert("Este espacio está completamente reservado para la fecha seleccionada.", "warning")
      setAvailableStartTimes([])
      setIsFullyBooked(true)
      return
    }

    setIsFullyBooked(false)
    setAvailableStartTimes(available)

    // Si ya tenemos un tiempo de inicio, actualizar los tiempos de fin disponibles
    if (startTime) {
      updateAvailableEndTimes()
    }
  }

  const updateAvailableEndTimes = useCallback(() => {
    if (!startTime) return

    const timeSlots = generateTimeSlots()
    const startIndex = timeSlots.indexOf(startTime)
    if (startIndex === -1) return

    // Obtener todos los slots de tiempo después de la hora de inicio
    const potentialEndTimes = timeSlots.slice(startIndex + 1)

    // Encontrar la próxima reserva después de nuestra hora de inicio
    let nextReservationStartTime = null
    existingReservations.forEach((reservation) => {
      if (reservation.startTime > startTime) {
        if (nextReservationStartTime === null || reservation.startTime < nextReservationStartTime) {
          nextReservationStartTime = reservation.startTime
        }
      }
    })

    // Si hay una próxima reserva, incluir su hora de inicio como una opción válida para la hora final
    let available = []
    if (nextReservationStartTime) {
      available = potentialEndTimes.filter((time) => time <= nextReservationStartTime)
    } else {
      // Si no hay próximas reservas, todas las horas posteriores son válidas
      available = potentialEndTimes
    }

    setAvailableEndTimes(available)
  }, [startTime, generateTimeSlots, existingReservations])

  useEffect(() => {
    if (startTime) {
      updateAvailableEndTimes()
    }
  }, [startTime, updateAvailableEndTimes])

  const validateField = (name, value) => {
    const newErrors = { ...errors }

    switch (name) {
      case "scenery":
        newErrors.scenery = value ? "" : "El escenario es obligatorio."
        break
      case "startTime":
        newErrors.startTime = value ? "" : "La hora de inicio es obligatoria."
        if (endTime && value >= endTime) {
          newErrors.endTime = "La hora de finalización debe ser mayor."
        } else {
          newErrors.endTime = ""
        }
        break
      case "endTime":
        newErrors.endTime = value ? "" : "La hora de finalización es obligatoria."
        if (startTime && value <= startTime) {
          newErrors.endTime = "La hora de finalización debe ser mayor."
        } else {
          newErrors.endTime = ""
        }
        break
      case "activity":
        newErrors.activity = value ? "" : "La actividad es obligatoria."
        break
      case "estatus":
        newErrors.estatus = value ? "" : "El estado es obligatorio."
        break
      default:
        break
    }

    setErrors(newErrors)
  }

  const validateTimeOrder = () => {
    if (startTime && endTime && startTime >= endTime) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        endTime: "La hora final debe ser mayor que la hora de inicio.",
      }))
      return false
    }
    setErrors((prevErrors) => ({
      ...prevErrors,
      endTime: "",
    }))
    return true
  }

  const handleSubmit = async () => {
    // Validar todos los campos
    if (!scenery || !startTime || !endTime || !activity) {
      setErrors({
        scenery: !scenery ? "Este campo es obligatorio." : "",
        startTime: !startTime ? "Este campo es obligatorio." : "",
        endTime: !endTime ? "Este campo es obligatorio." : "",
        activity: !activity ? "Este campo es obligatorio." : "",
      })
      showAlert("Todos los campos son obligatorios.", "error")
      return
    }

    if (!validateTimeOrder()) {
      showAlert("La hora final debe ser mayor que la hora de inicio.", "error")
      return
    }

    const requestData = {
      scenery,
      date: selectedDate,
      startTime,
      finishTime: endTime,
      activity,
      estatus,
    }

    try {
      // Verificación final de disponibilidad
      const availabilityCheck = await axios.post(`http://localhost:2025/api/reservation/availability`, {
        scenery,
        date: selectedDate,
      })

      let existingReservations = []
      if (Array.isArray(availabilityCheck.data)) {
        existingReservations = availabilityCheck.data
      } else if (availabilityCheck.data && Array.isArray(availabilityCheck.data.data)) {
        existingReservations = availabilityCheck.data.data
      }

      // Filtrar la reserva actual para no bloquear sus propios horarios
      const filteredReservations = existingReservations.filter((res) => res.id !== Number.parseInt(reservationId))

      const isTimeSlotAvailable = !filteredReservations.some((reservation) => {
        const reservationStart = new Date(`${selectedDate}T${reservation.startTime}`)
        const reservationEnd = new Date(`${selectedDate}T${reservation.finishTime}`)
        const newReservationStart = new Date(`${selectedDate}T${startTime}`)
        const newReservationEnd = new Date(`${selectedDate}T${endTime}`)

        return (
          (newReservationStart >= reservationStart && newReservationStart < reservationEnd) ||
          (newReservationEnd > reservationStart && newReservationEnd <= reservationEnd) ||
          (newReservationStart <= reservationStart && newReservationEnd >= reservationEnd)
        )
      })

      if (!isTimeSlotAvailable) {
        showAlert("El horario seleccionado ya está ocupado. Por favor, seleccione otro horario.", "error")
        fetchAvailability()
        return
      }

      // Si está disponible, proceder con la actualización
      await axios.put(`http://localhost:2025/api/reservation/${reservationId}`, requestData)

      toast.success("Reserva actualizada correctamente!", {
        position: "top-right",
        autoClose: 4000,
      })

      if (typeof getReservations === "function") {
        getReservations()
      }

      onClose()
    } catch (error) {
      console.error("Error al actualizar la reserva:", error)
      showAlert(`Error al actualizar la reserva: ${error.response?.data?.message || error.message}`, "error")
    }
  }

  return (
    <Modal show={show} onHide={onClose} backdrop="static">
      <Modal.Header closeButton>
        <Modal.Title>Editar Reserva</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group className="p-2 mb-2" as={Row}>
            <Form.Label className="required">Escenario</Form.Label>
            <Form.Select
              value={scenery}
              onChange={(e) => {
                setScenery(e.target.value)
                validateField("scenery", e.target.value)
              }}
              isInvalid={!!errors.scenery}
              disabled
            >
              <option value="">Seleccione un escenario</option>
              <option value="Auditorio torre norte">Auditorio torre norte</option>
              <option value="Auditorio carlos castro">Auditorio Carlos castro</option>
              <option value="Cancha de grama">Cancha de grama</option>
              <option value="Plazoleta central">Plazoleta central</option>
            </Form.Select>
            {errors.scenery && (
              <div className="text-danger">
                <AiOutlineExclamationCircle /> {errors.scenery}
              </div>
            )}
          </Form.Group>

          {isFullyBooked && scenery && (
            <div className="alert alert-warning">
              Este espacio está completamente reservado para la fecha seleccionada.
            </div>
          )}

          {!isFullyBooked && (
            <Form.Group className="mb-3" as={Row}>
              <Col sm="6">
                <Form.Label className="required">Hora de inicio</Form.Label>
                <CustomTimeSelector
                  value={startTime}
                  onChange={(value) => {
                    setStartTime(value)
                    validateField("startTime", value)
                    validateTimeOrder()
                  }}
                  name="startTime"
                  availableTimes={availableStartTimes}
                  isFullyBooked={isFullyBooked}
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
                    setEndTime(value)
                    validateField("endTime", value)
                    validateTimeOrder()
                  }}
                  name="endTime"
                  availableTimes={availableEndTimes}
                  isFullyBooked={isFullyBooked}
                />
                {errors.endTime && (
                  <div className="text-danger">
                    <AiOutlineExclamationCircle /> {errors.endTime}
                  </div>
                )}
              </Col>
            </Form.Group>
          )}

          <Form.Group className="mb-3 p-3" as={Row}>
            <Form.Label className="required">Actividad</Form.Label>
            <Form.Control
              as="textarea"
              rows={2}
              placeholder="Describa las actividades a realizar en el espacio"
              value={activity}
              onChange={(e) => {
                setActivity(e.target.value)
                validateField("activity", e.target.value)
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
        {!isFullyBooked && (
          <Button className="buttons-form Button-save" onClick={handleSubmit}>
            Guardar
          </Button>
        )}
      </Modal.Footer>
    </Modal>
  )
}

export default EditReservationModal


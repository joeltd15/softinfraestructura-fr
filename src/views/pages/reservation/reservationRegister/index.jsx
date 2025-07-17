import { useEffect, useState, useCallback } from "react"
import axios from "axios"
import Button from "react-bootstrap/Button"
import Form from "react-bootstrap/Form"
import Modal from "react-bootstrap/Modal"
import { Col, Row } from "react-bootstrap"
import CustomTimeSelector from "../TimeSelector/index"
import { toast } from "react-toastify"
import { useAlert } from "../../../../assets/functions/index"

const ReservationModal = ({ show, selectedDate, onClose, getReservations }) => {
  const [scenery, setScenery] = useState("")
  const [startTime, setStartTime] = useState("")
  const [endTime, setEndTime] = useState("")
  const [activity, setActivity] = useState("")
  const [errors, setErrors] = useState({})
  const [availableStartTimes, setAvailableStartTimes] = useState([])
  const [availableEndTimes, setAvailableEndTimes] = useState([])
  const [existingReservations, setExistingReservations] = useState([])
  const [isFullyBooked, setIsFullyBooked] = useState(false)
  const { showAlert } = useAlert()

  const token = localStorage.getItem("token");

  const headers = {
    Authorization: `Bearer ${token}`,
  }

  const user = JSON.parse(localStorage.getItem("user"))

  useEffect(() => {
    if (scenery && selectedDate) {
      console.log("Fetching availability for:", { scenery, selectedDate })
      fetchAvailability()
    }
  }, [scenery, selectedDate])

  const fetchAvailability = async () => {
    try {
      const response = await axios.post(`https://softinfraestructura-gray.vercel.app/api/reservation/availability`, {
        scenery,
        date: selectedDate,
      },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      )

      console.log("Respuesta del servidor:", response.data)

      // Verificar si la respuesta es un array (aunque esté vacío)
      if (Array.isArray(response.data)) {
        updateAvailableTimes(response.data)
        setExistingReservations(response.data)
      } else if (response.data && response.data.data) {
        updateAvailableTimes(response.data.data)
        setExistingReservations(response.data.data)
      } else {
        throw new Error("Formato de respuesta inesperado: " + JSON.stringify(response.data))
      }
    } catch (error) {
      console.error("Error al obtener disponibilidad:", error)
      let errorMessage = "Error al verificar disponibilidad. "
      if (error.response) {
        errorMessage += `Error ${error.response.status}: ${error.response.data.message || JSON.stringify(error.response.data)}`
        console.error("Respuesta del servidor:", error.response.data)
      } else if (error.request) {
        errorMessage += "No se recibió respuesta del servidor."
      } else {
        errorMessage += error.message
      }
      showAlert(errorMessage, "error")

      setAvailableStartTimes([])
      setAvailableEndTimes([])
      setExistingReservations([])
      setStartTime("")
      setEndTime("")
    }
  }

  const updateAvailableTimes = (reservations) => {
    console.log("Updating available times with:", reservations)
    const timeSlots = generateTimeSlots()

    if (reservations.length === 0) {
      // Si no hay reservas, todos los horarios están disponibles
      setAvailableStartTimes(timeSlots)
      setStartTime("")
      setEndTime("")
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
      setStartTime("")
      setEndTime("")
      setIsFullyBooked(true)
      return
    }

    setIsFullyBooked(false)
    setAvailableStartTimes(available)
    setStartTime("")
    setEndTime("")
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

  const updateAvailableEndTimes = useCallback(() => {
    if (!startTime) return

    const timeSlots = generateTimeSlots()
    const startIndex = timeSlots.indexOf(startTime)
    if (startIndex === -1) return

    const potentialEndTimes = timeSlots.slice(startIndex + 1)

    let nextReservationStartTime = null
    existingReservations.forEach((reservation) => {
      if (reservation.startTime > startTime) {
        if (nextReservationStartTime === null || reservation.startTime < nextReservationStartTime) {
          nextReservationStartTime = reservation.startTime
        }
      }
    })

    let available = []
    if (nextReservationStartTime) {
      available = potentialEndTimes.filter((time) => time <= nextReservationStartTime)
    } else {
      available = potentialEndTimes
    }

    setAvailableEndTimes(available)
    setEndTime("")
  }, [startTime, generateTimeSlots, existingReservations])

  useEffect(() => {
    if (startTime) {
      updateAvailableEndTimes()
    }
  }, [startTime, updateAvailableEndTimes])

  const validateField = (field, value) => {
    setErrors((prevErrors) => ({
      ...prevErrors,
      [field]: !value ? "Este campo es obligatorio." : "",
    }))
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
    const user = JSON.parse(localStorage.getItem("user"))
    console.log("Submitting reservation:", { scenery, selectedDate, startTime, endTime, activity })
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
      estatus: "Pendiente",
      userId: user?.id || 1,
    }

    console.log("Usuario ID utilizado para la reserva:", user?.id || 1)

    try {
      // Verificación final de disponibilidad
      const availabilityCheck = await axios.post(`https://softinfraestructura-gray.vercel.app/api/reservation/availability`, {
        scenery,
        date: selectedDate,
      },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })

      console.log("Respuesta de verificación de disponibilidad:", availabilityCheck.data)

      // Verificar si hay conflictos con otras reservas
      let existingReservations = []
      if (Array.isArray(availabilityCheck.data)) {
        existingReservations = availabilityCheck.data
      } else if (availabilityCheck.data && Array.isArray(availabilityCheck.data.data)) {
        existingReservations = availabilityCheck.data.data
      }

      const isTimeSlotAvailable = !existingReservations.some((reservation) => {
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

      console.log("¿El horario está disponible?", isTimeSlotAvailable)

      if (!isTimeSlotAvailable) {
        showAlert("El horario seleccionado ya está ocupado. Por favor, seleccione otro horario.", "error")
        fetchAvailability()
        return
      }

      console.log("Enviando datos de reserva:", requestData)
      console.log("Datos de reserva a enviar:", requestData)
      const response = await axios.post("https://softinfraestructura-gray.vercel.app/api/reservation", requestData, {headers})
      console.log("Reserva registrada:", response.data)

      toast.success("Reserva registrada correctamente!", {
        position: "top-right",
        autoClose: 4000,
      })
      getReservations()
      onClose()
    } catch (error) {
      console.error("Error al registrar la reserva:", error)
      if (error.response) {
        console.error("Datos de la respuesta de error:", error.response.data)
        console.error("Estado HTTP:", error.response.status)
        console.error("Cabeceras:", error.response.headers)
      } else if (error.request) {
        console.error("No se recibió respuesta del servidor:", error.request)
      } else {
        console.error("Error al configurar la solicitud:", error.message)
      }
      showAlert(`Error al registrar la reserva: ${error.response?.data?.message || error.message}`, "error")
    }
  }

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
                  setScenery(e.target.value)
                  validateField("scenery", e.target.value)
                }}
                isInvalid={!!errors.scenery}
              >
                <option value="">Seleccione un escenario</option>
                <option value="Auditorio torre norte">Auditorio torre norte</option>
                <option value="Auditorio carlos castro">Auditorio Carlos Castro</option>
                <option value="Cancha de grama">Cancha de grama</option>
                <option value="Plazoleta central">Plazoleta central</option>
              </Form.Select>
              {errors.scenery && <Form.Text className="text-danger">{errors.scenery}</Form.Text>}
            </Col>
          </Form.Group>

          {isFullyBooked && scenery && (
            <div className="alert alert-warning">
              Este espacio está completamente reservado para la fecha seleccionada.
            </div>
          )}

          {!isFullyBooked && (
            <>
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
                  {errors.startTime && <Form.Text className="text-danger">{errors.startTime}</Form.Text>}
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
                  {errors.endTime && <Form.Text className="text-danger">{errors.endTime}</Form.Text>}
                </Col>
              </Form.Group>

              <Form.Group className="p-2" as={Row}>
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
                {errors.activity && <Form.Text className="text-danger">{errors.activity}</Form.Text>}
              </Form.Group>
            </>
          )}
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

export default ReservationModal
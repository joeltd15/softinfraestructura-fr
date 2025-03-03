"use client"

import { useEffect, useState } from "react"
import Button from "react-bootstrap/Button"
import Form from "react-bootstrap/Form"
import Modal from "react-bootstrap/Modal"
import { Col, Row } from "react-bootstrap"
import axios from "axios"
import { toast } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import { useAlert } from "../../../../assets/functions/index"

const CustomModal = ({ show, handleClose, onSolicitudCreated }) => {
  const urlUsers = "http://localhost:2025/api/user"
  const url = "http://localhost:2025/api/application"
  const [Users, setUsers] = useState([])
  const [Dependence, setDependence] = useState("")
  const [Place, setPlace] = useState("")
  const [News, setNews] = useState("")
  const [photographicEvidence, setPhotographicEvidence] = useState(null)
  const [TypeReport, setTypeReport] = useState("")
  const [status, setStatus] = useState("En espera")
  const [IdUser, setIdUser] = useState("")
  const [ResponsibleForSpace, setResponsibleForSpace] = useState("")
  const { showAlert } = useAlert()
  const [errors, setErrors] = useState({}) // Estado para errores
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    getUsers()
  }, [])

  useEffect(() => {
    return () => {
      toast.dismiss() // Limpia todas las alertas Reservados al desmontar el componente
    }
  }, [])

  const getUsers = async () => {
    const response = await axios.get(urlUsers)
    setUsers(response.data)
  }

  const handleFileChange = (e) => {
    setPhotographicEvidence(e.target.files[0])
  }

  const validateFields = () => {
    const newErrors = {}
    if (!Dependence.trim()) newErrors.Dependence = "Este campo es obligatorio."
    if (!Place.trim()) newErrors.Place = "Este campo es obligatorio."
    if (!News.trim()) newErrors.News = "Este campo es obligatorio."
    if (!TypeReport.trim()) newErrors.TypeReport = "Debe seleccionar un tipo de solicitud."
    if (!ResponsibleForSpace.trim()) newErrors.ResponsibleForSpace = "Este campo es obligatorio."

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async () => {
    if (!validateFields()) return
    setIsSubmitting(true)

    const today = new Date().toISOString().split("T")[0]
    const user = JSON.parse(localStorage.getItem("user"))
    if (!user || !user.id) {
      showAlert("No se pudo obtener la información del usuario.", "error")
      setIsSubmitting(false)
      return
    }

    // Crear la promesa para el toast
    toast.promise(submitFormData(user, today), {
      pending: "Registrando solicitud...",
      success: "Solicitud registrada correctamente",
      error: "Error al registrar la solicitud",
    })
  }

  const submitFormData = async (user, today) => {
    try {
      // 1. Verificar cuántas solicitudes tiene el usuario en estado "Asignada"
      const response = await axios.get(`${url}?userId=${user.id}&status=Asignada`)
      const assignedRequests = response.data.length

      // 2. Determinar el estado de la nueva solicitud
      const newStatus = assignedRequests >= 3 ? "En espera" : "Asignada"

      // 3. Registrar la solicitud con el estado correspondiente
      const formData = new FormData()
      formData.append("reportDate", today)
      formData.append("dependence", Dependence)
      formData.append("location", Place)
      formData.append("news", News)
      if (photographicEvidence) {
        formData.append("photographicEvidence", photographicEvidence)
      }
      formData.append("reportType", TypeReport)
      formData.append("responsibleForSpace", ResponsibleForSpace)
      formData.append("userId", user.id)
      formData.append("status", newStatus) // Se envía el estado determinado

      const result = await axios.post(url, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      })

      onSolicitudCreated()
      handleClose()
      return result 
    } catch (error) {
      console.error("Error al registrar solicitud:", error)
      setIsSubmitting(false)
      throw error 
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Modal show={show} onHide={handleClose} backdrop="static">
      <Modal.Header closeButton>
        <Modal.Title>Registrar Solicitud</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group className="mb-3" as={Row} controlId="formReportDate">
            <Col sm="6">
              <Form.Label className="required">Centro/dependencia</Form.Label>
              <Form.Select
                value={Dependence}
                onChange={(e) => {
                  setDependence(e.target.value)
                  setErrors({ ...errors, Dependence: "" })
                }}
                isInvalid={!!errors.Dependence}
              >
                <option value="">Seleccione una opción</option>
                <option value="Centro de Servicios de salud">Centro de Servicios de salud</option>
                <option value="Centro de comercio">Centro de comercio</option>
                <option value="Centro de servicios">Centro de servicios</option>
                <option value="Despacho Regional">Despacho Regional</option>
              </Form.Select>
              <Form.Control.Feedback type="invalid">{errors.Dependence}</Form.Control.Feedback>
            </Col>
            <Col sm="6">
              <Form.Label className="required">Lugar</Form.Label>
              <Form.Control
                type="text"
                value={Place}
                onChange={(e) => {
                  setPlace(e.target.value)
                  setErrors({ ...errors, Place: "" })
                }}
                isInvalid={!!errors.Place}
                placeholder="Ingrese el lugar"
              />
              <Form.Control.Feedback type="invalid">{errors.Place}</Form.Control.Feedback>
            </Col>
          </Form.Group>
          <Form.Group className="mb-3 p-3" as={Row} controlId="formDependence">
            <Form.Label className="required">Detalles</Form.Label>
            <Form.Control
              as="textarea"
              rows={2}
              value={News}
              onChange={(e) => {
                setNews(e.target.value)
                setErrors({ ...errors, News: "" })
              }}
              isInvalid={!!errors.News}
              placeholder="Describa los detalles del reporte"
            />
            <Form.Control.Feedback type="invalid">{errors.News}</Form.Control.Feedback>
          </Form.Group>
          <Form.Group className="mb-3" as={Row} controlId="formTypeAndResponsible">
            <Col sm="6">
              <Form.Label className="required">Tipo de solicitud</Form.Label>
              <Form.Select
                value={TypeReport}
                onChange={(e) => {
                  setTypeReport(e.target.value)
                  setErrors({ ...errors, TypeReport: "" })
                }}
                isInvalid={!!errors.TypeReport}
              >
                <option value="">Seleccione un tipo</option>
                <option value="Electricidad">Electricidad</option>
                <option value="Albañilería">Albañilería</option>
                <option value="Plomería">Plomería</option>
                <option value="Aires Acondicionados">Aires Acondicionados</option>
                <option value="Jardinería">Jardinería</option>
                <option value="Obra civil">Obra civil</option>
                <option value="Puertas y cerraduras">Puertas y cerraduras</option>
                <option value="Mobiliario">Mobiliario</option>
                <option value="Sistemas y redes">Sistemas y redes</option>
              </Form.Select>
              <Form.Control.Feedback type="invalid">{errors.TypeReport}</Form.Control.Feedback>
            </Col>
            <Col sm="6">
              <Form.Label className="required">Responsable del Espacio</Form.Label>
              <Form.Control
                type="text"
                value={ResponsibleForSpace}
                onChange={(e) => {
                  setResponsibleForSpace(e.target.value)
                  setErrors({ ...errors, ResponsibleForSpace: "" })
                }}
                isInvalid={!!errors.ResponsibleForSpace}
                placeholder="Responsable del espacio"
              />
              <Form.Control.Feedback type="invalid">{errors.ResponsibleForSpace}</Form.Control.Feedback>
            </Col>
          </Form.Group>
          <Form.Group className="mb-3 p-2" as={Row} controlId="forType">
            <Form.Label>Evidencia</Form.Label>
            <Form.Control type="file" onChange={handleFileChange} accept="image/*" />
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button className="buttons-form Button-next" onClick={handleClose} disabled={isSubmitting}>
          Salir
        </Button>
        <Button className="buttons-form Button-save" onClick={handleSubmit} disabled={isSubmitting}>
          {isSubmitting ? "Guardando..." : "Guardar"}
        </Button>
      </Modal.Footer>
    </Modal>
  )
}

export default CustomModal
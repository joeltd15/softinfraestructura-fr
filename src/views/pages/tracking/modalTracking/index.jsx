import { useState, useEffect } from "react"
import axios from "axios"
import Button from "react-bootstrap/Button"
import Form from "react-bootstrap/Form"
import Modal from "react-bootstrap/Modal"
import { Col, Row, Image } from "react-bootstrap"
import { useAlert } from "../../../../assets/functions/index"
import { toast } from "react-toastify"

const CustomModal = ({ show, handleClose, onSolicitudCreated, selectedAssignmentId, getAssignment = null }) => {
  const [observations, setObservations] = useState("")
  const [buildingMaterials, setBuildingMaterials] = useState("")
  const [actionsTaken, setActionsTaken] = useState("")
  const [photographicEvidence, setPhotographicEvidence] = useState(null)
  const [previewImage, setPreviewImage] = useState(null)
  const [status, setStatus] = useState("Realizado")
  const [assignmentId, setAssignmentId] = useState("")
  const [assignments, setAssignments] = useState([])
  const [errors, setErrors] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { showAlert } = useAlert()
  const CLOUDINARY_CLOUD_NAME = "dvzjinfzq"
  const CLOUDINARY_UPLOAD_PRESET = "ml_default"

  useEffect(() => {
    return () => {
      toast.dismiss()
      // Clean up preview URL if it exists
      if (previewImage) {
        URL.revokeObjectURL(previewImage)
      }
    }
  }, [previewImage])

  useEffect(() => {
    if (selectedAssignmentId) {
      setAssignmentId(selectedAssignmentId)
    }
  }, [selectedAssignmentId])

  const token = localStorage.getItem("token")

  const headers = {
    Authorization: `Bearer ${token}`,
  }

  useEffect(() => {
    const fetchAssignments = async () => {
      try {
        const response = await axios.get("https://softinfraestructura-gray.vercel.app/api/assignment", { headers })
        setAssignments(response.data)
      } catch (error) {
        console.error("Error al obtener asignaciones:", error)
      }
    }
    if (show) {
      fetchAssignments()
    }
  }, [show])

  const handleFileChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      setPhotographicEvidence(file)
      // Create URL for preview
      const fileUrl = URL.createObjectURL(file)
      setPreviewImage(fileUrl)
    }
  }

  const removeImage = () => {
    setPhotographicEvidence(null)
    if (previewImage) {
      URL.revokeObjectURL(previewImage)
      setPreviewImage(null)
    }
  }

  const uploadToCloudinary = async (file) => {
    if (!file) return null

    try {
      // Create FormData to send the file
      const formData = new FormData()
      formData.append("file", file)
      formData.append("upload_preset", CLOUDINARY_UPLOAD_PRESET)

      const response = await axios.post(
        `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        },
      )

      // If the request is successful, return the secure URL
      return response.data.secure_url
    } catch (error) {
      console.error("Error al subir imagen a Cloudinary:", error)
      // Show error details if available
      if (error.response) {
        console.error("Respuesta del servidor:", error.response.data)
        console.error("Estado HTTP:", error.response.status)
      }
      return null
    }
  }

  const validateFields = () => {
    const newErrors = {}
    if (!buildingMaterials.trim()) newErrors.buildingMaterials = "Este campo es obligatorio"
    if (!observations.trim()) newErrors.observations = "Este campo es obligatorio"
    if (!actionsTaken.trim()) newErrors.actionsTaken = "Este campo es obligatorio"
    if (!assignmentId) newErrors.assignmentId = "Debe seleccionar una asignación"
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async () => {
    if (!validateFields()) {
      showAlert("Todos los campos son obligatorios.", "error")
      return
    }

    setIsSubmitting(true)
    const today = new Date().toISOString().split("T")[0]

    // Create the promise for toast
    toast.promise(submitFormData(today), {
      pending: "Registrando seguimiento...",
      success: "Seguimiento registrado correctamente",
      error: {
        render({ data }) {
          // When the error is related to the image, show a more specific message
          if (data && data.message && data.message.includes("Cloudinary")) {
            return "Error al subir la imagen. El seguimiento se registrará sin evidencia fotográfica."
          }
          return "Error al registrar el seguimiento"
        },
      },
    })
  }

  const submitFormData = async (today) => {
    try {
      const formData = new FormData()
      formData.append("observations", observations)
      formData.append("buildingMaterials", buildingMaterials)
      formData.append("actionsTaken", actionsTaken)
      formData.append("status", status)
      formData.append("assignmentId", assignmentId)
      formData.append("dateService", today)

      // Upload image to Cloudinary if it exists
      if (photographicEvidence) {
        try {
          const cloudinaryUrl = await uploadToCloudinary(photographicEvidence)
          if (cloudinaryUrl) {
            // If uploaded successfully, use the URL
            formData.append("photographicEvidence", cloudinaryUrl)
          } else {
            // If Cloudinary upload failed but we have a file, send it directly
            formData.append("photographicEvidence", photographicEvidence)
          }
        } catch (imageError) {
          console.error("Error al subir imagen:", imageError)
        }
      }

      // Send the request to the server
      const result = await axios.post(
        "https://softinfraestructura-gray.vercel.app/api/tracking",
        formData,
        { headers },
        {
          headers: { "Content-Type": "multipart/form-data" },
        },
      )

      if (getAssignment) {
        getAssignment()
      }

      if (onSolicitudCreated) {
        onSolicitudCreated()
      }

      handleClose()
      return result
    } catch (error) {
      console.error("Error al registrar seguimiento:", error)
      setIsSubmitting(false)
      throw error
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Modal show={show} onHide={handleClose} backdrop="static">
      <Modal.Header closeButton>
        <Modal.Title>Registrar Seguimiento</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Row className="mb-3">
            <Col sm={6}>
              <Form.Group>
                <Form.Label className="required">Materiales utilizados</Form.Label>
                <Form.Control
                  type="text"
                  value={buildingMaterials}
                  onChange={(e) => {
                    setBuildingMaterials(e.target.value)
                    setErrors((prev) => ({ ...prev, buildingMaterials: "" }))
                  }}
                  isInvalid={!!errors.buildingMaterials}
                />
                <Form.Control.Feedback type="invalid">{errors.buildingMaterials}</Form.Control.Feedback>
              </Form.Group>
            </Col>
            <Col sm={6}>
              <Form.Group>
                <Form.Label className="required">Asignación</Form.Label>
                <Form.Select
                  value={assignmentId}
                  onChange={(e) => {
                    setAssignmentId(e.target.value)
                    setErrors((prev) => ({ ...prev, assignmentId: "" }))
                  }}
                  isInvalid={!!errors.assignmentId}
                  disabled
                >
                  <option value="">Seleccione una asignación</option>
                  {assignments.map((assign) => (
                    <option key={assign.id} value={assign.id}>
                      {assign.id}
                    </option>
                  ))}
                </Form.Select>
                <Form.Control.Feedback type="invalid">{errors.assignmentId}</Form.Control.Feedback>
              </Form.Group>
            </Col>
          </Row>

          <Row className="mb-3">
            <Col sm={12}>
              <Form.Group>
                <Form.Label className="required">Observaciones</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  value={observations}
                  onChange={(e) => {
                    setObservations(e.target.value)
                    setErrors((prev) => ({ ...prev, observations: "" }))
                  }}
                  isInvalid={!!errors.observations}
                />
                <Form.Control.Feedback type="invalid">{errors.observations}</Form.Control.Feedback>
              </Form.Group>
            </Col>
          </Row>

          <Row className="mb-3">
            <Col sm={12}>
              <Form.Group>
                <Form.Label className="required">Acciones Tomadas</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  value={actionsTaken}
                  onChange={(e) => {
                    setActionsTaken(e.target.value)
                    setErrors((prev) => ({ ...prev, actionsTaken: "" }))
                  }}
                  isInvalid={!!errors.actionsTaken}
                />
                <Form.Control.Feedback type="invalid">{errors.actionsTaken}</Form.Control.Feedback>
              </Form.Group>
            </Col>
          </Row>

          <Row className="mb-3">
            <Col sm={12}>
              <Form.Group>
                <Form.Label className="required">Estado</Form.Label>
                <Form.Select value={status} onChange={(e) => setStatus(e.target.value)}>
                  <option value="Realizado">Realizado</option>
                  <option value="Cancelado">Cancelado</option>
                  <option value="En espera por falta de material">En espera por falta de material</option>
                </Form.Select>
              </Form.Group>
            </Col>
          </Row>

          <Row className="mb-3">
            <Col sm={12}>
              <Form.Group>
                <Form.Label>Evidencia Fotográfica</Form.Label>
                <Form.Control type="file" onChange={handleFileChange} accept="image/*" />
                {previewImage && (
                  <div className="mt-3 text-center">
                    <Image src={previewImage || "/placeholder.svg"} alt="Vista previa" thumbnail width={200} />
      
                  </div>
                )}
              </Form.Group>
            </Col>
          </Row>
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
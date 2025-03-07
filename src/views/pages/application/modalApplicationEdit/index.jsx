import { useEffect, useState, useCallback } from "react"
import Button from "react-bootstrap/Button"
import Form from "react-bootstrap/Form"
import Modal from "react-bootstrap/Modal"
import { Col, Row, Image } from "react-bootstrap"
import axios from "axios"
import { useAlert } from "../../../../assets/functions/index"

const Realizado = ({ show, handleClose, application, handleUpdate }) => {
  const [editedApplication, setEditedApplication] = useState({
    reportDate: new Date().toISOString().split("T")[0],
    dependence: "",
    location: "",
    news: "",
    reportType: "",
    status: "",
    userId: "",
    photographicEvidence: "",
    responsibleForSpace: "",
  })
  const { showAlert } = useAlert()
  const [errors, setErrors] = useState({})
  const [Users, setUsers] = useState([])
  const [previewImage, setPreviewImage] = useState(null)
  const urlUsers = "https://softinfraestructura-a6yl4j3yy-joeltuiran15-gmailcoms-projects.vercel.app/api/user"
  const CLOUDINARY_CLOUD_NAME = "dvzjinfzq"
  const CLOUDINARY_UPLOAD_PRESET = "ml_default" // Asegúrate de que este preset exista en tu cuenta de Cloudinary

  useEffect(() => {
    getUsers()
  }, [])

  // Función para construir la URL de Cloudinary correctamente
  const getImageUrl = useCallback((path) => {
    if (!path || path.trim() === "") return null

    // Si ya es una URL completa, usarla directamente
    if (path.startsWith("http://") || path.startsWith("https://")) {
      // Corregir URLs duplicadas si existen
      if (path.includes("https://res.cloudinary.com") && path.includes("https://res.cloudinary.com", 10)) {
        return path.replace(
          /https:\/\/res\.cloudinary\.com\/[^/]+\/image\/upload\/https:\/\/res\.cloudinary\.com\/[^/]+\/image\/upload\//,
          `https://res.cloudinary.com/${CLOUDINARY_CLOUD_NAME}/image/upload/`,
        )
      }
      return path
    }

    // Si es una ruta relativa de Cloudinary, construir la URL completa
    return `https://res.cloudinary.com/${CLOUDINARY_CLOUD_NAME}/image/upload/${path}`
  }, [])

  useEffect(() => {
    // Limpiar URL de previsualización al desmontar
    return () => {
      if (previewImage && !previewImage.startsWith("http")) {
        URL.revokeObjectURL(previewImage)
      }
    }
  }, [previewImage])

  const getUsers = async () => {
    const response = await axios.get(urlUsers)
    setUsers(response.data)
  }

  useEffect(() => {
    if (application) {
      setEditedApplication((prev) => ({
        ...prev,
        id: application.id || "",
        reportDate: application.reportDate ? new Date(application.reportDate).toISOString().split("T")[0] : "",
        dependence: application.dependence || "",
        location: application.location || "",
        news: application.news || "",
        reportType: application.reportType || "",
        status: application.status || "",
        userId: application.userId || "",
        photographicEvidence: application.photographicEvidence || "",
        responsibleForSpace: application.responsibleForSpace || "",
      }))

      // Establecer la vista previa de la imagen si existe
      if (application.photographicEvidence) {
        setPreviewImage(getImageUrl(application.photographicEvidence))
      } else {
        setPreviewImage(null)
      }
    }
  }, [application, getImageUrl])

  const handleChange = (e) => {
    const { name, value } = e.target
    setEditedApplication((prev) => ({ ...prev, [name]: value }))
    setErrors((prev) => ({ ...prev, [name]: "" })) // Eliminar error al corregir
  }

  const handleFileChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      setEditedApplication((prev) => ({ ...prev, photographicEvidence: file }))

      // Crear URL para previsualización
      const fileUrl = URL.createObjectURL(file)
      setPreviewImage(fileUrl)
    }
  }

  const removeImage = () => {
    setEditedApplication((prev) => ({ ...prev, photographicEvidence: "" }))
    if (previewImage && !previewImage.startsWith("http")) {
      URL.revokeObjectURL(previewImage)
    }
    setPreviewImage(null)
  }

  // Método para subir imágenes a Cloudinary
  const uploadToCloudinary = async (file) => {
    if (!file) return null

    try {
      // Crear un FormData para enviar el archivo
      const formData = new FormData()
      formData.append("file", file)
      formData.append("upload_preset", CLOUDINARY_UPLOAD_PRESET)

      // Usar axios para la petición
      const response = await axios.post(
        `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        },
      )

      // Si la petición es exitosa, devolver la URL segura
      return response.data.secure_url
    } catch (error) {
      console.error("Error al subir imagen a Cloudinary:", error)
      // Mostrar detalles del error si están disponibles
      if (error.response) {
        console.error("Respuesta del servidor:", error.response.data)
        console.error("Estado HTTP:", error.response.status)
      }
      return null
    }
  }

  const validateForm = () => {
    const newErrors = {}

    if (!editedApplication.dependence.trim()) {
      newErrors.dependence = "La dependencia es obligatoria"
    }
    if (!editedApplication.location.trim()) {
      newErrors.location = "El lugar es obligatorio"
    }
    if (!editedApplication.news.trim()) {
      newErrors.news = "Los detalles son obligatorios"
    }
    if (!editedApplication.status.trim()) {
      newErrors.status = "El estado es obligatorio"
    }
    if (!editedApplication.reportType.trim()) {
      newErrors.reportType = "El tipo de solicitud es obligatorio"
    }
    if (!editedApplication.responsibleForSpace.trim()) {
      newErrors.responsibleForSpace = "El responsable del espacio es obligatorio"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!validateForm()) return

    // Crear FormData para la solicitud
    const formData = new FormData()

    // Si hay un archivo nuevo, subirlo a Cloudinary primero
    if (editedApplication.photographicEvidence instanceof File) {
      try {
        const cloudinaryUrl = await uploadToCloudinary(editedApplication.photographicEvidence)
        if (cloudinaryUrl) {
          // Si se subió correctamente, usar la URL
          formData.append("photographicEvidence", cloudinaryUrl)
        } else {
          // Si falló la subida a Cloudinary pero tenemos un archivo, enviarlo directamente
          formData.append("photographicEvidence", editedApplication.photographicEvidence)
        }
      } catch (error) {
      }
    } else if (editedApplication.photographicEvidence) {
      // Si ya es una URL o string, pasarla como está
      formData.append("photographicEvidence", editedApplication.photographicEvidence)
    }

    // Añadir el resto de campos al FormData
    for (const key in editedApplication) {
      if (key !== "photographicEvidence") {
        formData.append(key, editedApplication[key])
      }
    }

    // Enviar el formulario
    handleUpdate(formData)
    showAlert("Solicitud modificada correctamente", "success")
  }

  return (
    <Modal show={show} onHide={handleClose} backdrop="static">
      <Modal.Header closeButton>
        <Modal.Title>Editar Solicitud</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3" as={Row} controlId="formReportDate">
            <Col sm="6">
              <Form.Label className="required">Centro/dependencia</Form.Label>
              <Form.Select
                name="dependence"
                value={editedApplication.dependence}
                onChange={handleChange}
                isInvalid={!!errors.dependence}
              >
                <option value="">Seleccione una opción</option>
                <option value="Centro de Servicios de salud">Centro de Servicios de salud</option>
                <option value="Centro de comercio">Centro de comercio</option>
                <option value="Centro de servicios">Centro de servicios</option>
                <option value="Despacho Regional">Despacho Regional</option>
              </Form.Select>

              <Form.Control.Feedback type="invalid">{errors.dependence}</Form.Control.Feedback>
            </Col>
            <Col sm="6">
              <Form.Label className="required">Lugar</Form.Label>
              <Form.Control
                type="text"
                name="location"
                value={editedApplication.location}
                onChange={handleChange}
                placeholder="Ingrese el lugar"
                isInvalid={!!errors.location}
              />
              <Form.Control.Feedback type="invalid">{errors.location}</Form.Control.Feedback>
            </Col>
          </Form.Group>

          <Form.Group className="p-2" as={Row} controlId="formDependence">
            <Form.Label className="required">Detalles</Form.Label>
            <Form.Control
              as="textarea"
              name="news"
              rows={2}
              value={editedApplication.news}
              onChange={handleChange}
              placeholder="Describa los detalles del reporte"
              isInvalid={!!errors.news}
            />
            <Form.Control.Feedback type="invalid">{errors.news}</Form.Control.Feedback>
          </Form.Group>

          <Form.Group className="mb-3" as={Row} controlId="formLocation">
            <Col sm="6">
              <Form.Label className="required">Estado</Form.Label>
              <Form.Select
                value={editedApplication.status}
                onChange={handleChange}
                name="status"
                isInvalid={!!errors.status}
              >
                <option>Asignada</option>
                <option>Realizado</option>
                <option>En espera por falta de material</option>
              </Form.Select>
              <Form.Control.Feedback type="invalid">{errors.status}</Form.Control.Feedback>
            </Col>
            <Col sm="6">
              <Form.Label className="required">Tipo de solicitud</Form.Label>
              <Form.Select
                value={editedApplication.reportType}
                name="reportType"
                disabled
                isInvalid={!!errors.reportType}
              >
                <option>Seleccione un tipo</option>
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
              <Form.Control.Feedback type="invalid">{errors.reportType}</Form.Control.Feedback>
            </Col>
          </Form.Group>

          <Form.Group className="p-2" as={Row} controlId="formResponsibleForSpace">
            <Form.Label className="required">Responsable del Espacio</Form.Label>
            <Form.Control
              type="text"
              name="responsibleForSpace"
              value={editedApplication.responsibleForSpace}
              onChange={handleChange}
              placeholder="Ingrese el responsable del espacio"
              readOnly
              isInvalid={!!errors.responsibleForSpace}
            />
            <Form.Control.Feedback type="invalid">{errors.responsibleForSpace}</Form.Control.Feedback>
          </Form.Group>

          <Form.Group className="mb-3 p-2" as={Row} controlId="forType">
            <Form.Label>Evidencia</Form.Label>
            <Form.Control type="file" name="photographicEvidence" onChange={handleFileChange} accept="image/*" />
            {previewImage && (
              <div className="mt-3 text-center">
                <Image
                  src={previewImage || "/placeholder.svg"}
                  alt="Vista previa"
                  thumbnail
                  style={{ maxWidth: "200px" }}
                  onError={(e) => {
                    e.target.onerror = null
                    e.target.src = "/noImage.png"
                  }}
                />
              </div>
            )}
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button className="buttons-form Button-next" onClick={handleClose}>
          Salir
        </Button>
        <Button className="buttons-form Button-save" type="submit" onClick={handleSubmit}>
          Guardar
        </Button>
      </Modal.Footer>
    </Modal>
  )
}

export default Realizado
"use client"

import { useState, useEffect, useCallback } from "react"
import { Modal, Button, Form, Row, Col, Image } from "react-bootstrap"
import axios from "axios"
import { useAlert } from "../../../../assets/functions/index"
import { toast } from "react-toastify"

const ModalTrackingEdit = ({ show, handleClose, tracking, handleUpdate }) => {
    const { showAlert } = useAlert()
    const [editedTracking, setEditedTracking] = useState({
        observations: "",
        buildingMaterials: "",
        dateService: new Date().toISOString().split("T")[0],
        actionsTaken: "",
        status: "",
        assignmentId: "",
        photographicEvidence: "",
    })

    const [assignments, setAssignments] = useState([])
    const [errors, setErrors] = useState({})
    const [previewImage, setPreviewImage] = useState(null)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [showLargePreview, setShowLargePreview] = useState(false)
    const CLOUDINARY_CLOUD_NAME = "dvzjinfzq"
    const CLOUDINARY_UPLOAD_PRESET = "ml_default"

    const token = localStorage.getItem("token")

    const headers = {
        Authorization: `Bearer ${token}`,
    }

    // Function to correctly build Cloudinary URL
    const getImageUrl = useCallback((path) => {
        if (!path || path.trim() === "") return null

        // If it's already a complete URL, use it directly
        if (path.startsWith("http://") || path.startsWith("https://")) {
            // Fix duplicated URLs if they exist
            if (path.includes("https://res.cloudinary.com") && path.includes("https://res.cloudinary.com", 10)) {
                return path.replace(
                    /https:\/\/res\.cloudinary\.com\/[^/]+\/image\/upload\/https:\/\/res\.cloudinary\.com\/[^/]+\/image\/upload\//,
                    `https://res.cloudinary.com/${CLOUDINARY_CLOUD_NAME}/image/upload/`,
                )
            }
            return path
        }

        // If it's a relative Cloudinary path, build the complete URL
        return `https://res.cloudinary.com/${CLOUDINARY_CLOUD_NAME}/image/upload/${path}`
    }, [])

    useEffect(() => {
        // Clean up preview URL when unmounting
        return () => {
            if (previewImage && !previewImage.startsWith("http")) {
                URL.revokeObjectURL(previewImage)
            }
            toast.dismiss()
        }
    }, [previewImage])

    useEffect(() => {
        axios
            .get("https://softinfraestructura-86fdvmh2g-ingdanielbs-projects.vercel.app/api/assignment", { headers })
            .then((response) => {
                setAssignments(response.data)
            })
            .catch((error) => {
                console.error("Error cargando asignaciones:", error)
                showAlert("Error cargando asignaciones", "error")
            })
    }, [])

    useEffect(() => {
        if (tracking) {
            setEditedTracking((prev) => ({
                ...prev,
                id: tracking.id,
                observations: tracking.observations,
                buildingMaterials: tracking.buildingMaterials,
                actionsTaken: tracking.actionsTaken,
                status: tracking.status,
                assignmentId: tracking.assignmentId,
                photographicEvidence: tracking.photographicEvidence || "",
            }))

            // Set image preview if it exists
            if (tracking.photographicEvidence) {
                setPreviewImage(getImageUrl(tracking.photographicEvidence))
            } else {
                setPreviewImage(null)
            }
        }
    }, [tracking, getImageUrl])

    const validate = () => {
        const newErrors = {}
        if (!editedTracking.buildingMaterials.trim()) {
            newErrors.buildingMaterials = "Los materiales de construcción son obligatorios."
        }
        if (!editedTracking.assignmentId) {
            newErrors.assignmentId = "Debe seleccionar una asignación."
        }
        if (!editedTracking.observations.trim()) {
            newErrors.observations = "Las observaciones son obligatorias."
        }
        if (!editedTracking.actionsTaken.trim()) {
            newErrors.actionsTaken = "Debe especificar las acciones tomadas."
        }
        if (!editedTracking.status) {
            newErrors.status = "Debe seleccionar un estado."
        }

        setErrors(newErrors)

        if (Object.keys(newErrors).length > 0) {
            showAlert("Por favor corrige los errores antes de continuar.", "warning")
        }

        return Object.keys(newErrors).length === 0
    }

    const handleChange = (e) => {
        const { name, value } = e.target
        setEditedTracking((prev) => ({ ...prev, [name]: value }))

        if (errors[name]) {
            setErrors((prev) => ({ ...prev, [name]: "" })) // Limpiar error si el usuario corrige
        }
    }

    const handleFileChange = (e) => {
        const file = e.target.files[0]
        if (file) {
            setEditedTracking((prev) => ({ ...prev, photographicEvidence: file }))

            // Create URL for preview
            const fileUrl = URL.createObjectURL(file)
            setPreviewImage(fileUrl)
        }
    }

    const removeImage = () => {
        setEditedTracking((prev) => ({ ...prev, photographicEvidence: "" }))
        if (previewImage && !previewImage.startsWith("http")) {
            URL.revokeObjectURL(previewImage)
        }
        setPreviewImage(null)
    }

    // Method to upload images to Cloudinary
    const uploadToCloudinary = async (file) => {
        if (!file) return null

        try {
            // Create FormData to send the file
            const formData = new FormData()
            formData.append("file", file)
            formData.append("upload_preset", CLOUDINARY_UPLOAD_PRESET)

            // Use axios for the request
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

    const handleSubmit = async (e) => {
        e.preventDefault()
        if (!validate()) return // Stop submission if there are errors

        setIsSubmitting(true)

        try {
            // Create FormData for the request
            const formData = new FormData()

            // If there's a new file, upload it to Cloudinary first
            if (editedTracking.photographicEvidence instanceof File) {
                try {
                    const cloudinaryUrl = await uploadToCloudinary(editedTracking.photographicEvidence)
                    if (cloudinaryUrl) {
                        // If uploaded successfully, use the URL
                        formData.append("photographicEvidence", cloudinaryUrl)
                    } else {
                        // If Cloudinary upload failed but we have a file, send it directly
                        formData.append("photographicEvidence", editedTracking.photographicEvidence)
                    }
                } catch (imageError) {
                    console.error("Error uploading image:", imageError)
                }
            } else if (editedTracking.photographicEvidence) {
                // If it's already a URL or string, pass it as is
                formData.append("photographicEvidence", editedTracking.photographicEvidence)
            }

            // Add the rest of the fields to FormData
            for (const key in editedTracking) {
                if (key !== "photographicEvidence") {
                    formData.append(key, editedTracking[key])
                }
            }

            // Send the form
            await handleUpdate(formData)
            showAlert("Seguimiento actualizado correctamente", "success")
            handleClose()
        } catch (error) {
            console.error("Error updating tracking:", error)
            showAlert("Error al actualizar el seguimiento", "error")
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <>
            <Modal show={show} onHide={handleClose} backdrop="static">
                <Modal.Header closeButton>
                    <Modal.Title>Editar Seguimiento</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form onSubmit={handleSubmit}>
                        <Row className="mb-3">
                            <Col sm={6}>
                                <Form.Group>
                                    <Form.Label className="required">Materiales de Construcción</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="buildingMaterials"
                                        value={editedTracking.buildingMaterials}
                                        onChange={handleChange}
                                        isInvalid={!!errors.buildingMaterials}
                                    />
                                    <Form.Control.Feedback type="invalid">{errors.buildingMaterials}</Form.Control.Feedback>
                                </Form.Group>
                            </Col>
                            <Col sm={6}>
                                <Form.Group>
                                    <Form.Label className="required">Asignación</Form.Label>
                                    <Form.Select
                                        name="assignmentId"
                                        value={editedTracking.assignmentId}
                                        disabled
                                        isInvalid={!!errors.assignmentId}
                                    >
                                        <option value="">Seleccione una asignación</option>
                                        {assignments.map((assignment) => (
                                            <option key={assignment.id} value={assignment.id}>
                                                {`${assignment.id}`}
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
                                        name="observations"
                                        value={editedTracking.observations}
                                        onChange={handleChange}
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
                                        name="actionsTaken"
                                        value={editedTracking.actionsTaken}
                                        onChange={handleChange}
                                        isInvalid={!!errors.actionsTaken}
                                    />
                                    <Form.Control.Feedback type="invalid">{errors.actionsTaken}</Form.Control.Feedback>
                                </Form.Group>
                            </Col>
                        </Row>

                        <Row className="mb-3">
                            <Col sm={6}>
                                <Form.Group>
                                    <Form.Label className="required">Estado</Form.Label>
                                    <Form.Select
                                        name="status"
                                        value={editedTracking.status}
                                        onChange={handleChange}
                                        isInvalid={!!errors.status}
                                    >
                                        <option value="">Seleccione un estado</option>
                                        <option value="Realizado">Realizado</option>
                                        <option value="Cancelado">Cancelado</option>
                                        <option value="En espera por falta de material">En espera por falta de material</option>
                                    </Form.Select>
                                    <Form.Control.Feedback type="invalid">{errors.status}</Form.Control.Feedback>
                                </Form.Group>
                            </Col>
                            <Col sm={6}>
                                <Form.Group>
                                    <Form.Label>Evidencia Fotográfica</Form.Label>
                                    <Form.Control type="file" name="photographicEvidence" onChange={handleFileChange} accept="image/*" />
                                </Form.Group>
                            </Col>
                        </Row>

                        {previewImage && (
                            <Row className="mb-3">
                                <Col sm={12} className="text-center">
                                    <div className="position-relative d-inline-block">
                                        <Image
                                            src={previewImage || "/placeholder.svg"}
                                            alt="Vista previa"
                                            thumbnail
                                            style={{ maxWidth: "200px", cursor: "pointer" }}
                                            onClick={() => setShowLargePreview(true)}
                                            onError={(e) => {
                                                e.target.onerror = null
                                                e.target.src = "/noImage.png"
                                            }}
                                        />

                                    </div>
                                </Col>
                            </Row>
                        )}
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button className="buttons-form Button-next" onClick={handleClose} disabled={isSubmitting}>
                        Salir
                    </Button>
                    <Button className="buttons-form Button-save" type="submit" onClick={handleSubmit} disabled={isSubmitting}>
                        {isSubmitting ? "Guardando..." : "Guardar"}
                    </Button>
                </Modal.Footer>
            </Modal>
            <Modal show={showLargePreview} onHide={() => setShowLargePreview(false)} centered size="lg">
                <Modal.Header closeButton>
                </Modal.Header>
            </Modal>
        </>
    )
}

export default ModalTrackingEdit
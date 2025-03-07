import Modal from "react-bootstrap/Modal"
import Button from "react-bootstrap/Button"
import { useState } from "react"
import { Image } from "react-bootstrap"

const ModalTrackingView = ({ show, handleClose, tracking }) => {
  const CLOUDINARY_CLOUD_NAME = "dvzjinfzq"
  const [showLargePreview, setShowLargePreview] = useState(false)

  const getImageUrl = (path) => {
    if (!path || path.trim() === "") return "/noImage.png"

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
  }

  return (
    <>
      <Modal show={show} onHide={handleClose} backdrop="static" keyboard={false}>
        <Modal.Header closeButton>
          <Modal.Title>Detalles del Seguimiento</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {tracking ? (
            <div>
              <div className="d-flex align-items-center justify-content-center row">
                <div className="col-sm-6">
                  <p>
                    <strong>Fecha:</strong> {tracking.dateService}
                  </p>
                </div>
                <div className="col-sm-6">
                  <p>
                    <strong>Materiales:</strong> {tracking.buildingMaterials}
                  </p>
                </div>
              </div>
              <div className="d-flex align-items-center justify-content-center row">
                <div className="col-sm-6">
                  <p>
                    <strong>Observaciones:</strong> {tracking.observations}
                  </p>
                </div>
                <div className="col-sm-6">
                  <p>
                    <strong>Acciones:</strong> {tracking.actionsTaken}
                  </p>
                </div>
              </div>
              <div className="d-flex align-items-center justify-content-center row">
                <div className="col-sm-6">
                  <p>
                    <strong>Asignamiento:</strong> {tracking.assignmentId}
                  </p>
                </div>
                <div className="col-sm-6">
                  <p>
                    <strong>Estado:</strong> {tracking.status}
                  </p>
                </div>
              </div>
              <p className="text-center mt-3 mb-2">
                <strong>Evidencia Fotográfica:</strong>
              </p>
              <div className="d-flex flex-column align-items-center justify-content-center">
                <img
                  src={getImageUrl(tracking.photographicEvidence) || "/placeholder.svg"}
                  style={{
                    width: "200px",
                    height: "200px",
                    objectFit: "cover",
                    cursor: "pointer",
                    borderRadius: "4px",
                    boxShadow: "0 2px 5px rgba(0,0,0,0.2)",
                  }}
                  alt="Evidencia"
                  onClick={() => setShowLargePreview(true)}
                  onError={(e) => {
                    e.target.onerror = null
                    e.target.src = "/noImage.png"
                  }}
                />
              
              </div>
            </div>
          ) : (
            <p>No hay datos de seguimiento disponibles.</p>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button className="buttons-form Button-next" onClick={handleClose}>
            Cerrar
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  )
}

export default ModalTrackingView
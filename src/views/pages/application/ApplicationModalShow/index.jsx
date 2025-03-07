import Button from "react-bootstrap/Button"
import Modal from "react-bootstrap/Modal"
import { Col, Row } from "react-bootstrap"

function ShowModal({ show, handleClose, application = null, userName }) {
  const CLOUDINARY_CLOUD_NAME = "dvzjinfzq"

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
          <Modal.Title>Detalles de la solicitud</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {application && (
            <div className="container">
              {/* Primera fila */}
              <Row className="mb-2">
                <Col sm={6}>
                  <p>
                    <strong>Fecha:</strong> {new Date(application.reportDate).toISOString().split("T")[0]}
                  </p>
                </Col>
                <Col sm={6}>
                  <p>
                    <strong>Dependencia:</strong> {application.dependence}
                  </p>
                </Col>
              </Row>

              {/* Segunda fila */}
              <Row className="mb-2">
                <Col sm={6}>
                  <p>
                    <strong>Lugar:</strong> {application.location}
                  </p>
                </Col>
                <Col sm={6}>
                  <p>
                    <strong>Usuario:</strong> {userName || "Desconocido"}
                  </p>
                </Col>
              </Row>

              {/* Tercera fila */}
              <Row className="mb-2">
                <Col sm={6}>
                  <p>
                    <strong>Tipo de reporte:</strong> {application.reportType}
                  </p>
                </Col>
                <Col sm={6}>
                  <p>
                    <strong>Estado:</strong> {application.status}
                  </p>
                </Col>
              </Row>

              {/* Cuarta fila: Detalles y Responsable del Espacio */}
              <Row className="mb-2">
                <Col sm={6}>
                  <p>
                    <strong>Detalles:</strong> {application.news}
                  </p>
                </Col>
                <Col sm={6}>
                  <p>
                    <strong>Responsable del Espacio:</strong> {application.responsibleForSpace || "No asignado"}
                  </p>
                </Col>
              </Row>

              {/* Evidencia */}
              <p className="text-center">
                <strong>Evidencia:</strong>
              </p>
              <div className="d-flex justify-content-center">
                <img
                  src={getImageUrl(application.photographicEvidence) || "/noImage.png"}
                  alt="Evidencia fotográfica"
                  style={{ Width: "200px", height: "200px" }}
                  onError={(e) => {
                    e.target.onerror = null
                    e.target.src = "/noImage.png"
                  }}
                />
              </div>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button className="buttons-form Button-next" onClick={handleClose}>
            Salir
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  )
}

export default ShowModal
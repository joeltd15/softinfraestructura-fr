import { useState, useEffect, useCallback } from "react"
import Button from "react-bootstrap/Button"
import Form from "react-bootstrap/Form"
import Modal from "react-bootstrap/Modal"
import { Col, Row } from "react-bootstrap"
import axios from "axios"
import { toast } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"

const EditRoleModal = ({ show, handleClose, onRoleUpdated, role }) => {
  const [roleName, setRoleName] = useState("")
  const [permissions, setPermissions] = useState([])
  const [selectedPermissions, setSelectedPermissions] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  const fetchPermissions = useCallback(async () => {
    try {
      const response = await axios.get("http://localhost:2025/api/permission")
      setPermissions(response.data)
    } catch (error) {
      console.error("Error al obtener permisos:", error)
      toast.error("Error al obtener permisos.")
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    if (show) {
      setIsLoading(true)
      fetchPermissions()
    }
  }, [show, fetchPermissions])

  useEffect(() => {
    if (role && role.id) {
      setRoleName(role.name || "")
      if (Array.isArray(role.permissions)) {
        setSelectedPermissions(role.permissions)
        console.log("Permisos cargados en el estado:", role.permissions)
      } else {
        setSelectedPermissions([])
      }
    } else {
      setRoleName("")
      setSelectedPermissions([])
    }
  }, [role])

  const handlePermissionChange = (permissionId) => {
    setSelectedPermissions((prev) => {
      const newPermissions = prev.includes(permissionId)
        ? prev.filter((id) => id !== permissionId)
        : [...prev, permissionId]
      console.log("Permisos actualizados:", newPermissions)
      return newPermissions
    })
  }

  const handleSubmit = async () => {
    if (!roleName.trim()) {
      toast.error("El nombre del rol es obligatorio.")
      return
    }

    if (!role || !role.id) {
      toast.error("Error: No se pudo identificar el rol.")
      return
    }

    const requestData = {
      name: roleName,
      permissions: selectedPermissions,
    }

    try {
      await axios.put(`http://localhost:2025/api/role/${role.id}`, requestData)
      toast.success("Rol actualizado correctamente.")
      onRoleUpdated()
      handleClose()
    } catch (error) {
      console.error("Error al actualizar el rol:", error)
      toast.error("Error al actualizar el rol.")
    }
  }

  console.log("Renderizando con selectedPermissions:", selectedPermissions)

  return (
    <Modal show={show} onHide={handleClose} backdrop="static">
      <Modal.Header closeButton>
        <Modal.Title>Editar Rol</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {isLoading ? (
          <div>Cargando...</div>
        ) : (
          <Form>
            <Form.Group className="mb-3">
              <Form.Label className="required">Nombre del Rol</Form.Label>
              <Form.Control
                type="text"
                value={roleName}
                onChange={(e) => setRoleName(e.target.value)}
                placeholder="Ingrese el nombre del rol"
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Permisos</Form.Label>
              <Row>
                {permissions.map((permission) => (
                  <Col key={permission.id} sm={6}>
                    <Form.Check
                      type="checkbox"
                      label={permission.name}
                      checked={selectedPermissions.includes(permission.id)}
                      onChange={() => handlePermissionChange(permission.id)}
                      id={`permission-${permission.id}`}
                    />
                  </Col>
                ))}
              </Row>
            </Form.Group>
          </Form>
        )}
      </Modal.Body>
      <Modal.Footer>
        <Button className="buttons-form Button-next" onClick={handleClose}>
          Cancelar
        </Button>
        <Button className="buttons-form Button-save" onClick={handleSubmit}>
          Guardar
        </Button>
      </Modal.Footer>
    </Modal>
  )
}

export default EditRoleModal
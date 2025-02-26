import { useEffect, useState } from "react"
import { Modal, Button, Form, Row, Col, InputGroup } from "react-bootstrap"
import { FaExclamationCircle } from "react-icons/fa"
import axios from "axios"
import "react-toastify/dist/ReactToastify.css"
import { useAlert } from '../../../../assets/functions/index';


const UserEditModal = ({ show, handleClose, getUsers, user }) => {
  const [roles, setRoles] = useState([])
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    status: "",
    roleId: "",
  })
  const [errors, setErrors] = useState({})
  const { showAlert } = useAlert();


  useEffect(() => {
    axios
      .get("http://localhost:2025/api/role")
      .then((response) => setRoles(response.data))
      .catch((error) => console.error("Error al obtener roles:", error))
  }, [])


  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || "",
        email: user.email || "",
        phone: user.phone || "",
        status: user.status || "",
        roleId: user.roleId ? String(user.roleId) : "",
      })
    }
  }, [user])
  

  const validateField = (name, value) => {
    let error = "";
  
    if (!value.trim()) {
      error = "Este campo es obligatorio";
    } else {
      if (name === "name" && !/^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$/.test(value)) {
        error = "El nombre solo puede contener letras y espacios";
      }
      if (name === "email" && !/^\S+@\S+\.\S+$/.test(value)) {
        error = "Ingrese un correo válido";
      }
      if (name === "phone" && !/^\d{10}$/.test(value)) {
        error = "Ingrese un número de 10 dígitos";
      }
    }
  
    return error;
  };
  
  

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData({ ...formData, [name]: value })
  
    // Validación en tiempo real
    setErrors((prevErrors) => ({
      ...prevErrors,
      [name]: validateField(name, value),
    }))
  }
  
  

  const handleSubmit = async () => {
    const newErrors = {}
    Object.keys(formData).forEach((key) => {
      const error = validateField(key, formData[key])
      if (error) newErrors[key] = error
    })
  
    setErrors(newErrors)
  
    if (Object.keys(newErrors).length > 0) {
      showAlert("Por favor, corrija los errores antes de guardar", 'error');
      return
    }
  
    try {
      await axios.put(`http://localhost:2025/api/user/${user.id}`, formData)
      showAlert("Usuario actualizado correctamente", 'success');
      handleClose()
      getUsers()
    } catch (error) {
      console.error("Error al actualizar usuario:", error)
      showAlert(error.response?.data?.message || "Error al actualizar usuario", 'error');
    }
  }
  

  return (
    <Modal show={show} onHide={handleClose} backdrop="static">
      <Modal.Header closeButton>
        <Modal.Title>Editar Usuario</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Row className="mb-3">
            <Col sm="6">
              <Form.Group>
                <Form.Label className="required">Nombre</Form.Label>
                <InputGroup>
                  <Form.Control
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    isInvalid={!!errors.name}
                  />
                  {errors.name && (
                    <InputGroup.Text className="text-danger">
                      <FaExclamationCircle />
                    </InputGroup.Text>
                  )}
                  <Form.Control.Feedback type="invalid">{errors.name}</Form.Control.Feedback>
                </InputGroup>
              </Form.Group>
            </Col>
            <Col sm="6">
              <Form.Group>
                <Form.Label className="required">Teléfono</Form.Label>
                <InputGroup>
                  <Form.Control
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    isInvalid={!!errors.phone}
                  />
                  {errors.phone && (
                    <InputGroup.Text className="text-danger">
                      <FaExclamationCircle />
                    </InputGroup.Text>
                  )}
                  <Form.Control.Feedback type="invalid">{errors.phone}</Form.Control.Feedback>
                </InputGroup>
              </Form.Group>
            </Col>
          </Row>
          <Form.Group className="mb-3">
            <Form.Label className="required">Email</Form.Label>
            <InputGroup>
              <Form.Control
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                isInvalid={!!errors.email}
              />
              {errors.email && (
                <InputGroup.Text className="text-danger">
                  <FaExclamationCircle />
                </InputGroup.Text>
              )}
              <Form.Control.Feedback type="invalid">{errors.email}</Form.Control.Feedback>
            </InputGroup>
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label className="required">Estado</Form.Label>
            <Form.Select
              name="status"
              value={formData.status}
              onChange={handleChange}
              isInvalid={!!errors.status}
            >
              <option value="">Seleccione un estado</option>
              <option value="Activo">Activo</option>
              <option value="Inactivo">Inactivo</option>
            </Form.Select>
            <Form.Control.Feedback type="invalid">{errors.status}</Form.Control.Feedback>
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label className="required">Rol</Form.Label>
            <Form.Select
              name="roleId"
              value={formData.roleId}
              onChange={handleChange}
              isInvalid={!!errors.roleId}
            >
              <option value="">Seleccione un rol</option>
              {roles.map((role) => (
                <option key={role.id} value={role.id}>
                  {role.name}
                </option>
              ))}
            </Form.Select>
            <Form.Control.Feedback type="invalid">{errors.roleId}</Form.Control.Feedback>
          </Form.Group>
        </Form>
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

export default UserEditModal
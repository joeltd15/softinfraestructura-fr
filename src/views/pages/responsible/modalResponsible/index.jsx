import { useEffect, useState } from "react";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Modal from "react-bootstrap/Modal";
import { Col, Row } from "react-bootstrap";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const RESPONSABILITY_TYPES = [
  "Electricidad",
  "Albañilería",
  "Plomería",
  "Aires Acondicionados",
  "Jardinería",
  "Obra civil",
  "Puertas y cerraduras",
  "Mobiliario",
  "Sistemas y redes",
];

const RegisterResponsibleModal = ({ show, handleClose, onResponsibleCreated }) => {
  const [users, setUsers] = useState([]);
  const [userId, setUserId] = useState("");
  const [responsibilities, setResponsibilities] = useState([]);
  const [errors, setErrors] = useState({}); // Estado para los errores

  useEffect(() => {
    getUsers();
  }, []);

  const getUsers = async () => {
    try {
      const response = await axios.get("http://localhost:2025/api/user");
      setUsers(response.data);
    } catch (error) {
      console.error("Error al obtener los usuarios:", error);
    }
  };

  const validateForm = () => {
    let newErrors = {};
    if (!userId) newErrors.userId = "Debe seleccionar un usuario.";
    if (responsibilities.length === 0) newErrors.responsibilities = "Debe seleccionar al menos una responsabilidad.";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0; // Retorna true si no hay errores
  };

  const handleCheckboxChange = (type) => {
    setResponsibilities((prev) =>
      prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type]
    );
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      toast.error("Todos los campos son obligatorios.");
      return;
    }

    const requestData = { userId, responsibilities };

    try {
      await axios.post("http://localhost:2025/api/responsible", requestData);
      toast.success("Responsable registrado correctamente.");
      onResponsibleCreated();
      handleClose();
    } catch (error) {
      console.error("Error al registrar el responsable:", error);
      toast.error("Error al registrar el responsable.");
    }
  };

  return (
    <Modal show={show} onHide={handleClose} backdrop="static">
      <Modal.Header closeButton>
        <Modal.Title>Registrar Responsable</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group className="mb-3" as={Row}>
            <Col sm="12">
              <Form.Label className="required">Usuario</Form.Label>
              <Form.Select
                value={userId}
                onChange={(e) => {
                  setUserId(e.target.value);
                  setErrors((prev) => ({ ...prev, userId: "" })); // Limpia el error si el usuario cambia
                }}
                isInvalid={!!errors.userId}
              >
                <option value="">Seleccione un usuario</option>
                {users.map((user) => (
                  <option key={user.id} value={user.id}>
                    {user.name}
                  </option>
                ))}
              </Form.Select>
              <Form.Control.Feedback type="invalid">{errors.userId}</Form.Control.Feedback>
            </Col>
          </Form.Group>
          <Form.Group className="mb-3" as={Row}>
            <Col sm="12">
              <Form.Label className="required">Tipos de Responsabilidad</Form.Label>
              {RESPONSABILITY_TYPES.map((type, index) => (
                <Form.Check
                  key={index}
                  type="checkbox"
                  label={type}
                  checked={responsibilities.includes(type)}
                  onChange={() => {
                    handleCheckboxChange(type);
                    setErrors((prev) => ({ ...prev, responsibilities: "" })); // Limpia el error si selecciona algo
                  }}
                  isInvalid={!!errors.responsibilities}
                />
              ))}
              {errors.responsibilities && <div className="text-danger">{errors.responsibilities}</div>}
            </Col>
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button className="buttons-form Button-next" onClick={handleClose}>
          Salir
        </Button>
        <Button className="buttons-form Button-save" onClick={handleSubmit}>
          Guardar
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default RegisterResponsibleModal;
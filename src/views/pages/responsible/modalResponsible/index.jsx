import { useEffect, useState } from "react";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Modal from "react-bootstrap/Modal";
import { Col, Row } from "react-bootstrap";
import axios from "axios";
import { toast } from "react-toastify";
import { useAlert } from '../../../../assets/functions/index';

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
  const [errors, setErrors] = useState({});
  const { showAlert } = useAlert();

  useEffect(() => {
    return () => {
      toast.dismiss();
    };
  }, []);

  useEffect(() => {
    getUsers();
  }, []);

  const getUsers = async () => {
    try {
      // Obtener todos los usuarios
      const response = await axios.get("http://localhost:2025/api/user");
      const allUsers = response.data;
  
      // Filtrar solo los usuarios con rolId 2 (Encargados)
      const encargados = allUsers.filter(user => user.roleId === 2);
  
      // Obtener los usuarios ya registrados como responsables
      const responsibleResponse = await axios.get("http://localhost:2025/api/responsible");
      const registeredResponsibles = responsibleResponse.data.map(responsible => responsible.userId);
  
      // Filtrar los usuarios que no estén ya registrados como responsables
      const availableUsers = encargados.filter(user => !registeredResponsibles.includes(user.id));
  
      setUsers(availableUsers);
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
      showAlert("Todos los campos son obligatorios.", "error");
      return;
    }
  
    try {
      // Verificar si el usuario ya está registrado en responsables
      const responsibleResponse = await axios.get("http://localhost:2025/api/responsible");
      const registeredResponsibles = responsibleResponse.data.map(responsible => responsible.userId);
  
      if (registeredResponsibles.includes(parseInt(userId))) {
        showAlert("Este usuario ya está registrado como responsable.", "error");
        return;
      }
  
      const requestData = { userId, responsibilities };
      await axios.post("http://localhost:2025/api/responsible", requestData);
      showAlert("Responsable registrado correctamente.", "success");
      onResponsibleCreated();
      handleClose();
    } catch (error) {
      console.error("Error al registrar el responsable:", error);
      showAlert("Error al registrar el responsable.", "error");
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
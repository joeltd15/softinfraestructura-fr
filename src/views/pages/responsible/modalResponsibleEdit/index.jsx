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
    "Sistemas y redes"
];

const EditResponsibleModal = ({ show, handleClose, onResponsibleUpdated, responsible }) => {
    const [users, setUsers] = useState([]);
    const [userId, setUserId] = useState("");
    const [responsibilities, setResponsibilities] = useState([]);
    const [errors, setErrors] = useState({ userId: false, responsibilities: false });

    useEffect(() => {
        getUsers();
    }, []);

    useEffect(() => {
        if (responsible) {
            setUserId(responsible.userId);
            setResponsibilities(responsible.Responsibilities?.map(r => r.name) || []);
        }
    }, [responsible]);

    const getUsers = async () => {
        try {
            const response = await axios.get("http://localhost:2025/api/user");
            setUsers(response.data);
        } catch (error) {
            console.error("Error al obtener los usuarios:", error);
        }
    };

    const handleUserChange = (e) => {
        const value = e.target.value;
        setUserId(value);
        setErrors((prev) => ({ ...prev, userId: !value }));
    };

    const handleCheckboxChange = (type) => {
        const updatedResponsibilities = responsibilities.includes(type)
            ? responsibilities.filter((t) => t !== type)
            : [...responsibilities, type];

        setResponsibilities(updatedResponsibilities);
        setErrors((prev) => ({ ...prev, responsibilities: updatedResponsibilities.length === 0 }));
    };

    const validateForm = () => {
        const newErrors = {
            userId: !userId,
            responsibilities: responsibilities.length === 0,
        };
        setErrors(newErrors);
        return !newErrors.userId && !newErrors.responsibilities;
    };

    const handleSubmit = async () => {
        if (!validateForm()) {
            toast.error("Todos los campos son obligatorios.");
            return;
        }

        const requestData = { userId, responsibilities };

        try {
            const response = await axios.put(`http://localhost:2025/api/responsible/${responsible.id}`, requestData);
            toast.success("Responsable actualizado correctamente.");
            onResponsibleUpdated(response.data);
            handleClose();
        } catch (error) {
            console.error("Error al actualizar el responsable:", error);
            toast.error("Error al actualizar el responsable.");
        }
    };

    return (
        <Modal show={show} onHide={handleClose} backdrop="static">
            <Modal.Header closeButton>
                <Modal.Title>Editar Responsable</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form>
                    {/* Campo Usuario */}
                    <Form.Group className="mb-3" as={Row}>
                        <Col sm="12">
                            <Form.Label className="required">Usuario</Form.Label>
                            <Form.Select
                                value={userId}
                                onChange={handleUserChange}
                                onBlur={() => setErrors((prev) => ({ ...prev, userId: !userId }))}
                                isInvalid={errors.userId}
                            >
                                <option value="">Seleccione un usuario</option>
                                {users.map(user => (
                                    <option key={user.id} value={user.id}>{user.name}</option>
                                ))}
                            </Form.Select>
                            {errors.userId && <Form.Control.Feedback type="invalid">Debe seleccionar un usuario.</Form.Control.Feedback>}
                        </Col>
                    </Form.Group>

                    {/* Tipos de Responsabilidad */}
                    <Form.Group className="mb-3" as={Row}>
                        <Col sm="12">
                            <Form.Label className="required">Tipos de Responsabilidad</Form.Label>
                            {RESPONSABILITY_TYPES.map((type, index) => (
                                <Form.Check
                                    key={index}
                                    type="checkbox"
                                    label={type}
                                    checked={responsibilities.includes(type)}
                                    onChange={() => handleCheckboxChange(type)}
                                />
                            ))}
                            {errors.responsibilities && (
                                <div className="text-danger">Debe seleccionar al menos un tipo de responsabilidad.</div>
                            )}
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

export default EditResponsibleModal;
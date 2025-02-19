import { useEffect, useState } from "react";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Modal from "react-bootstrap/Modal";
import { Col, Row } from 'react-bootstrap';
import axios from "axios";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

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

    useEffect(() => {
        getUsers();
    }, []);

    useEffect(() => {
        if (responsible) {
            setUserId(responsible.userId);
            // Asegurar que se obtiene correctamente la lista de responsabilidades
            const selectedResponsibilities = responsible.Responsibilities?.map(r => r.name) || [];
            setResponsibilities(selectedResponsibilities);
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

    const handleCheckboxChange = (type) => {
        setResponsibilities((prev) =>
            prev.includes(type)
                ? prev.filter((t) => t !== type)  // Remueve si ya está seleccionado
                : [...prev, type]  // Agrega si no está seleccionado
        );
    };

    const handleSubmit = async () => {
        if (!userId || responsibilities.length === 0) {
            toast.error("Todos los campos son obligatorios.");
            return;
        }

        const requestData = {
            userId,
            responsibilities, // Ahora enviamos un array de strings directamente
        };

        try {
            const response = await axios.put(`http://localhost:2025/api/responsible/${responsible.id}`, requestData);
            toast.success("Responsable actualizado correctamente.");
            onResponsibleUpdated(response.data); // Pasamos el responsable actualizado
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
                    <Form.Group className="mb-3" as={Row}>
                        <Col sm="12">
                            <Form.Label className="required">Usuario</Form.Label>
                            <Form.Select value={userId} onChange={(e) => setUserId(e.target.value)}>
                                <option value="">Seleccione un usuario</option>
                                {users.map(user => (
                                    <option key={user.id} value={user.id}>{user.name}</option>
                                ))}
                            </Form.Select>
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
                                    checked={responsibilities.includes(type)} // Ahora sí los compara correctamente
                                    onChange={() => handleCheckboxChange(type)}
                                />

                            ))}
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
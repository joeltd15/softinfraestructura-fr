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
    const [typeResponsability, setTypeResponsability] = useState("");

    useEffect(() => {
        getUsers();
        if (responsible) {
            setUserId(responsible.userId);
            setTypeResponsability(responsible.typeResponsability);
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

    const handleSubmit = async () => {
        if (!userId || !typeResponsability) {
            toast.error("Todos los campos son obligatorios.");
            return;
        }

        const requestData = {
            userId,
            typeResponsability,
        };

        try {
            await axios.put(`http://localhost:2025/api/responsible/${responsible.id}`, requestData);
            toast.success("Responsable actualizado correctamente.");
            onResponsibleUpdated();
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
                            <Form.Label className="required">Tipo de Responsabilidad</Form.Label>
                            <Form.Select value={typeResponsability} onChange={(e) => setTypeResponsability(e.target.value)}>
                                <option value="">Seleccione un tipo</option>
                                {RESPONSABILITY_TYPES.map((type, index) => (
                                    <option key={index} value={type}>{type}</option>
                                ))}
                            </Form.Select>
                        </Col>
                    </Form.Group>
                </Form>
            </Modal.Body>
            <Modal.Footer>
                <Button className="buttons-form Button-next" onClick={handleClose}>
                    Salir
                </Button>
                <Button className="buttons-form Button-save" onClick={handleSubmit}>
                    Guardar Cambios
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default EditResponsibleModal;

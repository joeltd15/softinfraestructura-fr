import { useState } from "react";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Modal from "react-bootstrap/Modal";
import { Col, Row } from 'react-bootstrap';
import axios from "axios";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const RegisterRoleModal = ({ show, handleClose, onRoleCreated }) => {
    const [roleName, setRoleName] = useState("");

    const handleSubmit = async () => {
        if (!roleName.trim()) {
            toast.error("El nombre del rol es obligatorio.");
            return;
        }

        const requestData = { name: roleName };

        try {
            await axios.post("http://localhost:2025/api/roles", requestData);
            toast.success("Rol registrado correctamente.");
            onRoleCreated();
            handleClose();
        } catch (error) {
            console.error("Error al registrar el rol:", error);
            toast.error("Error al registrar el rol.");
        }
    };

    return (
        <Modal show={show} onHide={handleClose} backdrop="static">
            <Modal.Header closeButton>
                <Modal.Title>Registrar Rol</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form>
                    <Form.Group className="mb-3" as={Row}>
                        <Col sm="12">
                            <Form.Label className="required">Nombre del Rol</Form.Label>
                            <Form.Control
                                type="text"
                                value={roleName}
                                onChange={(e) => setRoleName(e.target.value)}
                                placeholder="Ingrese el nombre del rol"
                            />
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

export default RegisterRoleModal;
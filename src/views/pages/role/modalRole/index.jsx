import { useState, useEffect } from "react";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Modal from "react-bootstrap/Modal";
import { Col, Row } from 'react-bootstrap';
import axios from "axios";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const RegisterRoleModal = ({ show, handleClose, onRoleCreated }) => {
    const [roleName, setRoleName] = useState("");
    const [permissions, setPermissions] = useState([]);
    const [selectedPermissions, setSelectedPermissions] = useState([]);

    useEffect(() => {
        const fetchPermissions = async () => {
            try {
                const response = await axios.get("http://localhost:2025/api/permission");
                setPermissions(response.data);
            } catch (error) {
                console.error("Error al obtener permisos:", error);
                toast.error("Error al obtener permisos.");
            }
        };

        if (show) {
            fetchPermissions();
        }
    }, [show]);

    const handlePermissionChange = (permissionId) => {
        setSelectedPermissions(prev =>
            prev.includes(permissionId)
                ? prev.filter(id => id !== permissionId)
                : [...prev, permissionId]
        );
    };

    const handleSubmit = async () => {
        if (!roleName.trim()) {
            toast.error("El nombre del rol es obligatorio.");
            return;
        }

        const requestData = {
            name: roleName,
            permissions: selectedPermissions
        };

        try {
            await axios.post("http://localhost:2025/api/role", requestData);  // Ruta corregida
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
                            {permissions.map(permission => (
                                <Col key={permission.id} sm={6}>
                                    <Form.Check
                                        type="checkbox"
                                        label={permission.name}
                                        value={permission.id}
                                        checked={selectedPermissions.includes(permission.id)}
                                        onChange={() => handlePermissionChange(permission.id)}
                                    />
                                </Col>
                            ))}
                        </Row>
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
import { useState, useEffect } from "react";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Modal from "react-bootstrap/Modal";
import { Col, Row } from "react-bootstrap";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const EditRoleModal = ({ show, handleClose, onRoleUpdated, role }) => {
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
            
            // Solo actualizar si `role` tiene datos
            if (role && role.id) {
                setRoleName(role.name || "");
                setSelectedPermissions(role.permissions ? role.permissions.map(p => p.id) : []);
            } else {
                setRoleName("");
                setSelectedPermissions([]);
            }
        }
    }, [show, role]);

    const handlePermissionChange = (permissionId) => {
        setSelectedPermissions((prev) =>
            prev.includes(permissionId)
                ? prev.filter((id) => id !== permissionId)
                : [...prev, permissionId]
        );
    };

    const handleSubmit = async () => {
        if (!roleName.trim()) {
            toast.error("El nombre del rol es obligatorio.");
            return;
        }

        if (!role || !role.id) {
            toast.error("Error: No se pudo identificar el rol.");
            return;
        }

        const requestData = {
            name: roleName,
            permissions: selectedPermissions
        };

        try {
            await axios.put(`http://localhost:2025/api/role/${role.id}`, requestData);
            toast.success("Rol actualizado correctamente.");
            onRoleUpdated();
            handleClose();
        } catch (error) {
            console.error("Error al actualizar el rol:", error);
            toast.error("Error al actualizar el rol.");
        }
    };

    return (
        <Modal show={show} onHide={handleClose} backdrop="static">
            <Modal.Header closeButton>
                <Modal.Title>Editar Rol</Modal.Title>
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
                            {permissions.map((permission) => (
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
                    Cancelar
                </Button>
                <Button className="buttons-form Button-save" onClick={handleSubmit}>
                    Guardar
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default EditRoleModal;
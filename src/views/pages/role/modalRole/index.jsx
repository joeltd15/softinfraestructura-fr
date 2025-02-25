import { useState, useEffect } from "react";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Modal from "react-bootstrap/Modal";
import { Col, Row } from 'react-bootstrap';
import axios from "axios";
import { useAlert } from '../../../../assets/functions/index';

const RegisterRoleModal = ({ show, handleClose, onRoleCreated }) => {
    const [roleName, setRoleName] = useState("");
    const [permissions, setPermissions] = useState([]);
    const [selectedPermissions, setSelectedPermissions] = useState([]);
    const [errors, setErrors] = useState({});
    const { showAlert } = useAlert();

    useEffect(() => {
        const fetchPermissions = async () => {
            try {
                const response = await axios.get("http://localhost:2025/api/permission");
                setPermissions(response.data);
            } catch (error) {
                console.error("Error al obtener permisos:", error);
                showAlert("Error al obtener permisos.", "error");
            }
        };

        if (show) {
            fetchPermissions();
            setErrors({});
            setRoleName("");
            setSelectedPermissions([]);
        }
    }, [show]);

    const handleRoleChange = (e) => {
        const value = e.target.value;
        setRoleName(value);

        // Validación en tiempo real
        if (!value.trim()) {
            setErrors(prev => ({ ...prev, roleName: "El nombre del rol es obligatorio." }));
        } else if (/\d/.test(value)) {
            setErrors(prev => ({ ...prev, roleName: "El nombre del rol no puede contener números." }));
        } else {
            setErrors(prev => ({ ...prev, roleName: null }));
        }
    };

    const handlePermissionChange = (permissionId) => {
        setSelectedPermissions(prev => {
            const newPermissions = prev.includes(permissionId)
                ? prev.filter(id => id !== permissionId)
                : [...prev, permissionId];

            if (newPermissions.length > 0) {
                setErrors(prev => ({ ...prev, selectedPermissions: null }));
            }

            return newPermissions;
        });
    };

    const validateForm = () => {
        let newErrors = {};

        if (!roleName.trim()) {
            newErrors.roleName = "El nombre del rol es obligatorio.";
        } else if (/\d/.test(roleName)) {
            newErrors.roleName = "El nombre del rol no puede contener números.";
        }

        if (selectedPermissions.length === 0) {
            newErrors.selectedPermissions = "Debe seleccionar al menos un permiso.";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async () => {
        if (!validateForm()) return;

        const requestData = {
            name: roleName,
            permissions: selectedPermissions
        };

        try {
            await axios.post("http://localhost:2025/api/role", requestData);
            showAlert("Rol registrado correctamente.", "success");
            onRoleCreated();
            handleClose();
        } catch (error) {
            console.error("Error al registrar el rol:", error);
            showAlert("Error al registrar el rol.", "error");
        }
    };

    return (
        <Modal show={show} onHide={handleClose} backdrop="static">
            <Modal.Header closeButton>
                <Modal.Title>Registrar Rol</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form>
                    {/* Campo Nombre del Rol */}
                    <Form.Group className="mb-3">
                        <Form.Label className="required">Nombre del Rol</Form.Label>
                        <Form.Control
                            type="text"
                            value={roleName}
                            onChange={handleRoleChange}
                            placeholder="Ingrese el nombre del rol"
                            isInvalid={!!errors.roleName}
                        />
                        <Form.Control.Feedback type="invalid">
                            {errors.roleName}
                        </Form.Control.Feedback>
                    </Form.Group>

                    {/* Campo Permisos */}
                    <Form.Group className="mb-3">
                        <Form.Label className="required">Permisos</Form.Label>
                        <Row className={errors.selectedPermissions ? "border border-danger rounded p-2" : ""}>
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
                        {errors.selectedPermissions && (
                            <div className="text-danger mt-1">{errors.selectedPermissions}</div>
                        )}
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
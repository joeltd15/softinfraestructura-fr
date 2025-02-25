import { useState, useEffect } from "react";
import { Modal, Button, Form, Row, Col } from "react-bootstrap";
import axios from "axios";
import { useAlert } from '../../../../assets/functions/index';

const ModalTrackingEdit = ({ show, handleClose, tracking, handleUpdate }) => {
    const { showAlert } = useAlert();
    const [editedTracking, setEditedTracking] = useState({
        observations: "",
        buildingMaterials: "",
        dateService: new Date().toISOString().split("T")[0], // Fecha automática
        actionsTaken: "",
        status: "",
        assignmentId: "",
        photographicEvidence: "",
    });

    const [assignments, setAssignments] = useState([]);
    const [errors, setErrors] = useState({}); // Estado para errores de validación

    useEffect(() => {
        axios
            .get("http://localhost:2025/api/assignment")
            .then((response) => {
                setAssignments(response.data);
            })
            .catch((error) => {
                console.error("Error cargando asignaciones:", error);
                showAlert("Error cargando asignaciones", "error");
            });
    }, []);

    useEffect(() => {
        if (tracking) {
            setEditedTracking((prev) => ({
                ...prev,
                id: tracking.id,
                observations: tracking.observations,
                buildingMaterials: tracking.buildingMaterials,
                actionsTaken: tracking.actionsTaken,
                status: tracking.status,
                assignmentId: tracking.assignmentId,
                photographicEvidence: tracking.photographicEvidence || "",
            }));
        }
    }, [tracking]);

    const validate = () => {
        let newErrors = {};
        if (!editedTracking.buildingMaterials.trim()) {
            newErrors.buildingMaterials = "Los materiales de construcción son obligatorios.";
        }
        if (!editedTracking.assignmentId) {
            newErrors.assignmentId = "Debe seleccionar una asignación.";
        }
        if (!editedTracking.observations.trim()) {
            newErrors.observations = "Las observaciones son obligatorias.";
        }
        if (!editedTracking.actionsTaken.trim()) {
            newErrors.actionsTaken = "Debe especificar las acciones tomadas.";
        }
        if (!editedTracking.status) {
            newErrors.status = "Debe seleccionar un estado.";
        }

        setErrors(newErrors);

        if (Object.keys(newErrors).length > 0) {
            showAlert("Por favor corrige los errores antes de continuar.", "warning");
        }

        return Object.keys(newErrors).length === 0;
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setEditedTracking((prev) => ({ ...prev, [name]: value }));

        if (errors[name]) {
            setErrors((prev) => ({ ...prev, [name]: "" })); // Limpiar error si el usuario corrige
        }
    };

    const handleFileChange = (e) => {
        setEditedTracking((prev) => ({ ...prev, photographicEvidence: e.target.files[0] }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!validate()) return; // Detiene el envío si hay errores

        const formData = new FormData();
        for (const key in editedTracking) {
            if (key === "photographicEvidence" && editedTracking[key] instanceof File) {
                formData.append(key, editedTracking[key]);
            } else {
                formData.append(key, editedTracking[key]);
            }
        }

        handleUpdate(formData);
        showAlert("Seguimiento actualizado correctamente", "success");
        handleClose();
    };

    return (
        <Modal show={show} onHide={handleClose} backdrop="static">
            <Modal.Header closeButton>
                <Modal.Title>Editar Seguimiento</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form onSubmit={handleSubmit}>
                    <Row className="mb-3">
                        <Col sm={6}>
                            <Form.Group>
                                <Form.Label className="required">Materiales de Construcción</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="buildingMaterials"
                                    value={editedTracking.buildingMaterials}
                                    onChange={handleChange}
                                    isInvalid={!!errors.buildingMaterials}
                                />
                                <Form.Control.Feedback type="invalid">{errors.buildingMaterials}</Form.Control.Feedback>
                            </Form.Group>
                        </Col>
                        <Col sm={6}>
                            <Form.Group>
                                <Form.Label className="required">Asignación</Form.Label>
                                <Form.Select
                                    name="assignmentId"
                                    value={editedTracking.assignmentId}
                                    disabled
                                    isInvalid={!!errors.assignmentId}
                                >
                                    <option value="">Seleccione una asignación</option>
                                    {assignments.map((assignment) => (
                                        <option key={assignment.id} value={assignment.id}>
                                            {`${assignment.id}`}
                                        </option>
                                    ))}
                                </Form.Select>
                                <Form.Control.Feedback type="invalid">{errors.assignmentId}</Form.Control.Feedback>
                            </Form.Group>
                        </Col>
                    </Row>

                    <Row className="mb-3">
                        <Col sm={12}>
                            <Form.Group>
                                <Form.Label className="required">Observaciones</Form.Label>
                                <Form.Control
                                    as="textarea"
                                    rows={3}
                                    name="observations"
                                    value={editedTracking.observations}
                                    onChange={handleChange}
                                    isInvalid={!!errors.observations}
                                />
                                <Form.Control.Feedback type="invalid">{errors.observations}</Form.Control.Feedback>
                            </Form.Group>
                        </Col>
                        <Col sm={12}>
                            <Form.Group>
                                <Form.Label className="required">Acciones Tomadas</Form.Label>
                                <Form.Control
                                    as="textarea"
                                    rows={3}
                                    name="actionsTaken"
                                    value={editedTracking.actionsTaken}
                                    onChange={handleChange}
                                    isInvalid={!!errors.actionsTaken}
                                />
                                <Form.Control.Feedback type="invalid">{errors.actionsTaken}</Form.Control.Feedback>
                            </Form.Group>
                        </Col>
                    </Row>

                    <Row className="mb-3">
                        <Col sm={6}>
                            <Form.Group>
                                <Form.Label>Evidencia Fotográfica</Form.Label>
                                <Form.Control type="file" name="photographicEvidence" onChange={handleFileChange} />
                            </Form.Group>
                        </Col>
                        <Col sm={6}>
                            <Form.Group>
                                <Form.Label className="required">Estado</Form.Label>
                                <Form.Select
                                    name="status"
                                    value={editedTracking.status}
                                    onChange={handleChange}
                                    isInvalid={!!errors.status}
                                >
                                    <option value="">Seleccione un estado</option>
                                    <option value="Realizado">Realizado</option>
                                    <option value="Cancelado">Cancelado</option>
                                    <option value="En espera por falta de material">En espera por falta de material</option>
                                </Form.Select>
                                <Form.Control.Feedback type="invalid">{errors.status}</Form.Control.Feedback>
                            </Form.Group>
                        </Col>
                    </Row>
                </Form>
            </Modal.Body>
            <Modal.Footer>
                <Button className="buttons-form Button-next" onClick={handleClose}>
                    Salir
                </Button>
                <Button className="buttons-form Button-save" type="submit" onClick={handleSubmit}>
                    Guardar
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default ModalTrackingEdit;
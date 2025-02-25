import { useEffect, useState } from "react";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Modal from "react-bootstrap/Modal";
import { Col, Row } from 'react-bootstrap';
import axios from "axios";
import { useAlert } from '../../../../assets/functions/index';


const CustomModal = ({ show, handleClose, application, handleUpdate }) => {
    const [editedApplication, setEditedApplication] = useState({
        reportDate: new Date().toISOString().split("T")[0],
        dependence: "",
        location: "",
        news: "",
        reportType: "",
        status: "",
        userId: "",
        photographicEvidence: "",
        responsibleForSpace: "",
    });
    const { showAlert } = useAlert();
    const [errors, setErrors] = useState({});
    const [Users, setUsers] = useState([]);

    useEffect(() => {
        getUsers();
    }, []);

    useEffect(() => {
        return () => {
            toast.dismiss(); // Limpia todas las alertas pendientes al desmontar el componente
        };
    }, []);

    const getUsers = async () => {
        const response = await axios.get(urlUsers);
        setUsers(response.data);
    };

    useEffect(() => {
        if (application) {
            setEditedApplication(prev => ({
                ...prev,
                id: application.id || "",
                reportDate: application.reportDate || "",
                dependence: application.dependence || "",
                location: application.location || "",
                news: application.news || "",
                reportType: application.reportType || "",
                status: application.status || "",
                userId: application.userId || "",
                photographicEvidence: application.photographicEvidence || "",
                responsibleForSpace: application.responsibleForSpace || "",
            }));
        }
    }, [application]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setEditedApplication((prev) => ({ ...prev, [name]: value }));
        setErrors((prev) => ({ ...prev, [name]: "" })); // Eliminar error al corregir
    };

    const handleFileChange = (e) => {
        setEditedApplication((prev) => ({ ...prev, photographicEvidence: e.target.files[0] }));
    };

    const validateForm = () => {
        let newErrors = {};

        if (!editedApplication.dependence.trim()) {
            newErrors.dependence = "La dependencia es obligatoria";
        }
        if (!editedApplication.location.trim()) {
            newErrors.location = "El lugar es obligatorio";
        }
        if (!editedApplication.news.trim()) {
            newErrors.news = "Los detalles son obligatorios";
        }
        if (!editedApplication.status.trim()) {
            newErrors.status = "El estado es obligatorio";
        }
        if (!editedApplication.reportType.trim()) {
            newErrors.reportType = "El tipo de solicitud es obligatorio";
        }
        if (!editedApplication.responsibleForSpace.trim()) {
            newErrors.responsibleForSpace = "El responsable del espacio es obligatorio";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!validateForm()) return;

        const formData = new FormData();
        for (const key in editedApplication) {
            if (key === "photographicEvidence" && editedApplication[key] instanceof File) {
                formData.append(key, editedApplication[key]);
            } else {
                formData.append(key, editedApplication[key]);
            }
        }
        handleUpdate(formData);
        showAlert("Solicitud modificada correctamente", 'success');
    };

    return (
        <Modal show={show} onHide={handleClose} backdrop="static">
            <Modal.Header closeButton>
                <Modal.Title>Editar Solicitud</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form onSubmit={handleSubmit}>
                    <Form.Group className="mb-3" as={Row} controlId="formReportDate">
                        <Col sm="6">
                            <Form.Label className="required">Centro/dependencia</Form.Label>
                            <Form.Control
                                type="text"
                                name="dependence"
                                value={editedApplication.dependence}
                                onChange={handleChange}
                                placeholder="Ingrese la dependencia"
                                isInvalid={!!errors.dependence}
                            />
                            <Form.Control.Feedback type="invalid">
                                {errors.dependence}
                            </Form.Control.Feedback>
                        </Col>
                        <Col sm="6">
                            <Form.Label className="required">Lugar</Form.Label>
                            <Form.Control
                                type="text"
                                name="location"
                                value={editedApplication.location}
                                onChange={handleChange}
                                placeholder="Ingrese el lugar"
                                isInvalid={!!errors.location}
                            />
                            <Form.Control.Feedback type="invalid">
                                {errors.location}
                            </Form.Control.Feedback>
                        </Col>
                    </Form.Group>

                    <Form.Group className="p-2" as={Row} controlId="formDependence">
                        <Form.Label className="required">Detalles</Form.Label>
                        <Form.Control
                            as="textarea"
                            name="news"
                            rows={2}
                            value={editedApplication.news}
                            onChange={handleChange}
                            placeholder="Describa los detalles del reporte"
                            isInvalid={!!errors.news}
                        />
                        <Form.Control.Feedback type="invalid">
                            {errors.news}
                        </Form.Control.Feedback>
                    </Form.Group>

                    <Form.Group className="mb-3" as={Row} controlId="formLocation">
                        <Col sm="6">
                            <Form.Label className='required'>Estado</Form.Label>
                            <Form.Select
                                value={editedApplication.status}
                                onChange={handleChange}
                                name="status"
                                isInvalid={!!errors.status}
                            >
                                <option hidden="">...</option>
                                <option>Asignada</option>
                                <option>Realizado</option>
                                <option>En espera por falta de material</option>
                            </Form.Select>
                            <Form.Control.Feedback type="invalid">
                                {errors.status}
                            </Form.Control.Feedback>
                        </Col>
                        <Col sm="6">
                            <Form.Label className='required'>Tipo de solicitud</Form.Label>
                            <Form.Select
                                value={editedApplication.reportType}
                                name="reportType"
                                disabled
                                isInvalid={!!errors.reportType}
                            >
                                <option>Seleccione un tipo</option>
                                <option value="Electricidad">Electricidad</option>
                                <option value="Albañilería">Albañilería</option>
                                <option value="Plomería">Plomería</option>
                                <option value="Aires Acondicionados">Aires Acondicionados</option>
                                <option value="Jardinería">Jardinería</option>
                                <option value="Obra civil">Obra civil</option>
                                <option value="Puertas y cerraduras">Puertas y cerraduras</option>
                                <option value="Mobiliario">Mobiliario</option>
                                <option value="Sistemas y redes">Sistemas y redes</option>
                            </Form.Select>
                            <Form.Control.Feedback type="invalid">
                                {errors.reportType}
                            </Form.Control.Feedback>
                        </Col>
                    </Form.Group>

                    <Form.Group className="p-2" as={Row} controlId="formResponsibleForSpace">
                        <Form.Label className='required'>Responsable del Espacio</Form.Label>
                        <Form.Control
                            type="text"
                            name="responsibleForSpace"
                            value={editedApplication.responsibleForSpace}
                            onChange={handleChange}
                            placeholder="Ingrese el responsable del espacio"
                            readOnly
                            isInvalid={!!errors.responsibleForSpace}
                        />
                        <Form.Control.Feedback type="invalid">
                            {errors.responsibleForSpace}
                        </Form.Control.Feedback>
                    </Form.Group>

                    <Form.Group className="mb-3 p-2" as={Row} controlId="forType">
                        <Form.Label>Evidencia</Form.Label>
                        <Form.Control
                            type="file"
                            name="photographicEvidence"
                            onChange={handleFileChange}
                        />
                    </Form.Group>
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

export default CustomModal;
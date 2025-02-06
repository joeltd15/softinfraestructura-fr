import { useEffect, useState } from "react";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Modal from "react-bootstrap/Modal";
import { Col, Row } from 'react-bootstrap';
import axios from "axios";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const CustomModal = ({ show, handleClose, application, handleUpdate }) => {
    const [editedApplication, setEditedApplication] = useState({
        reportDate: "",
        dependence: "",
        location: "",
        news: "",
        reportType: "",
        status: "",
        userId: "",
        photographicEvidence: "",
    });
    const [Users, setUsers] = useState([]);

    useEffect(() => {
        getUsers();
    }, [])

    const getUsers = async () => {
        const response = await axios.get(urlUsers);
        setUsers(response.data);
    }

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
            }));
        }
    }, [application]);
    

    const handleChange = (e) => {
        const { name, value } = e.target;
        setEditedApplication((prev) => ({ ...prev, [name]: value }));
    };

    const handleFileChange = (e) => {
        setEditedApplication((prev) => ({ ...prev, photographicEvidence: e.target.files[0] }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const formData = new FormData();
        for (const key in editedApplication) {
            if (key === "photographicEvidence" && editedApplication[key] instanceof File) {
                formData.append(key, editedApplication[key]);
            } else {
                formData.append(key, editedApplication[key]);
            }
        }
        handleUpdate(formData);
    };

    return (
        <Modal show={show} onHide={handleClose} backdrop="static">
            <Modal.Header closeButton>
                <Modal.Title>Registrar Solicitud</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form onSubmit={handleSubmit}>
                    <Form.Group className="mb-3" as={Row} controlId="formReportDate">
                        <Col sm="6">
                            <Form.Label className="required">Fecha</Form.Label>
                            <Form.Control type="date" name="reportDate" value={editedApplication.reportDate} onChange={handleChange} />
                        </Col>
                        <Col sm="6">
                            <Form.Label className="required">Centro/dependencia</Form.Label>
                            <Form.Control
                                type="text"
                                name="dependence"
                                value={editedApplication.dependence}
                                onChange={handleChange}
                                placeholder="Ingrese la dependencia" />
                        </Col>
                    </Form.Group>
                    <Form.Group className="mb-3" as={Row} controlId="formDependence">
                        <Col sm="6">
                            <Form.Label className="required">Lugar</Form.Label>
                            <Form.Control
                                type="text"
                                name="location"
                                value={editedApplication.location}
                                onChange={handleChange}
                                placeholder="Ingrese el lugar" />
                        </Col>
                        <Col sm="6">
                            <Form.Label className="required">Novedades</Form.Label>
                            <Form.Control
                                as="textarea"
                                name="news"
                                rows={2}
                                value={editedApplication.news}
                                onChange={handleChange}
                                placeholder="Describa las novedades" />
                        </Col>
                    </Form.Group>
                    <Form.Group className="mb-3" as={Row} controlId="formLocation">
                        <Col sm="6">
                            <Form.Label className='required'>Usuario</Form.Label>
                            <Form.Select value={editedApplication.userId}
                                onChange={handleChange}
                                name="userId">
                                <option hidden="">...</option>
                                {
                                    Users.map((user) => (
                                        <option key={user.id} value={user.id}>{user.id}</option>
                                    ))
                                }
                            </Form.Select>
                        </Col>
                        <Col sm="6">
                            <Form.Label className='required'>Tipo de solicitud</Form.Label>
                            <Form.Select
                                value={editedApplication.reportType}
                                onChange={handleChange}
                                name="reportType">
                                <option>Seleccione un tipo</option>
                                <option value="Electrico">Electricidad</option>
                                <option value="Mobiliario">Mobiliario</option>
                                <option value="Plomeria">Plomeria</option>
                                <option value="Redes">Redes</option>
                                <option value="Acabados">Acabados</option>
                            </Form.Select>
                        </Col>
                    </Form.Group>
                    <Form.Group className="mb-3 p-2" as={Row} controlId="forType">
                        <Form.Label>Evidencia</Form.Label>
                        <Form.Control
                            type="file"
                            name="photographicEvidence"
                            onChange={handleFileChange} />

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

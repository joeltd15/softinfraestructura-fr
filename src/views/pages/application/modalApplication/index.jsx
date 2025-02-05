import { useEffect, useState } from "react";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Modal from "react-bootstrap/Modal";
import { Col, Row } from 'react-bootstrap';
import axios from "axios";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const CustomModal = ({ show, handleClose, onSolicitudCreated }) => {
    const urlUsers = 'http://localhost:2025/api/user';
    const url = 'http://localhost:2025/api/application';
    const [Users, setUsers] = useState([]);
    const [Date, setDate] = useState("");
    const [Dependence, setDependence] = useState("");
    const [Place, setPlace] = useState("");
    const [News, setNews] = useState("");
    const [photographicEvidence, setPhotographicEvidence] = useState(null);
    const [TypeReport, setTypeReport] = useState("");
    const [status, setStatus] = useState("En espera");
    const [IdUser, setIdUser] = useState("");

    useEffect(() => {
        getUsers();
    }, [])

    const getUsers = async () => {
        const response = await axios.get(urlUsers);
        setUsers(response.data);
    }

    const handleFileChange = (e) => {
        setPhotographicEvidence(e.target.files[0]); // Guardá el archivo seleccionado
    };

    const handleSubmit = async () => {
        const formData = new FormData();
        formData.append("reportDate", Date);
        formData.append("dependence", Dependence);
        formData.append("location", Place);
        formData.append("news", News);
        if (photographicEvidence) {
            formData.append("photographicEvidence", photographicEvidence);
        }
        formData.append("reportType", TypeReport);
        formData.append("status", status);
        formData.append("userId", IdUser);
    
        const registerRequest = axios.post(url, formData, {
            headers: { "Content-Type": "multipart/form-data" },
        });
    
        toast.promise(registerRequest, {
            pending: "Registrando solicitud...",
            success: "Solicitud registrada correctamente",
            error: "Error al registrar la solicitud",
        });
    
        try {
            const response = await registerRequest;
            console.log("Solicitud registrada:", response.data);
            onSolicitudCreated();
            handleClose();
        } catch (error) {
            console.error("Error al registrar seguimiento:", error);
        }
    };

    return (
        <Modal show={show} onHide={handleClose} backdrop="static">
            <Modal.Header closeButton>
                <Modal.Title>Registrar Solicitud</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form>
                    <Form.Group className="mb-3" as={Row} controlId="formReportDate">
                        <Col sm="6">
                            <Form.Label className="required">Fecha</Form.Label>
                            <Form.Control type="date" value={Date} onChange={(e) => setDate(e.target.value)} />
                        </Col>
                        <Col sm="6">
                            <Form.Label className="required">Centro/dependencia</Form.Label>
                            <Form.Control
                                type="text"
                                value={Dependence}
                                onChange={(e) => setDependence(e.target.value)}
                                placeholder="Ingrese la dependencia" />
                        </Col>
                    </Form.Group>
                    <Form.Group className="mb-3" as={Row} controlId="formDependence">
                        <Col sm="6">
                            <Form.Label className="required">Lugar</Form.Label>
                            <Form.Control
                                type="text"
                                value={Place}
                                onChange={(e) => setPlace(e.target.value)}
                                placeholder="Ingrese el lugar" />
                        </Col>
                        <Col sm="6">
                            <Form.Label className="required">Novedades</Form.Label>
                            <Form.Control
                                as="textarea"
                                rows={2}
                                value={News}
                                onChange={(e) => setNews(e.target.value)}
                                placeholder="Describa las novedades" />
                        </Col>
                    </Form.Group>
                    <Form.Group className="mb-3" as={Row} controlId="formLocation">
                        <Col sm="6">
                            <Form.Label className='required'>Usuario</Form.Label>
                            <Form.Select value={IdUser}
                                onChange={(e) => setIdUser(e.target.value)}>
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
                                value={TypeReport}
                                onChange={(e) => setTypeReport(e.target.value)}>
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
                            onChange={handleFileChange}
                            accept="image/*" />

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

export default CustomModal;

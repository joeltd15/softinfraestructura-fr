import { useEffect, useState } from "react";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Modal from "react-bootstrap/Modal";
import { Col, Row } from 'react-bootstrap';
import axios from "axios";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useAlert } from '../../../../assets/functions/index';

const CustomModal = ({ show, handleClose, onSolicitudCreated }) => {
    const urlUsers = 'http://localhost:2025/api/user';
    const url = 'http://localhost:2025/api/application';
    const [Users, setUsers] = useState([]);
    const [Dependence, setDependence] = useState("");
    const [Place, setPlace] = useState("");
    const [News, setNews] = useState("");
    const [photographicEvidence, setPhotographicEvidence] = useState(null);
    const [TypeReport, setTypeReport] = useState("");
    const [status, setStatus] = useState("En espera");
    const [IdUser, setIdUser] = useState("");
    const [ResponsibleForSpace, setResponsibleForSpace] = useState("");
    const { showAlert } = useAlert();
    const [errors, setErrors] = useState({}); // Estado para errores

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

    const handleFileChange = (e) => {
        setPhotographicEvidence(e.target.files[0]);
    };

    const validateFields = () => {
        let newErrors = {};
        if (!Dependence.trim()) newErrors.Dependence = "Este campo es obligatorio.";
        if (!Place.trim()) newErrors.Place = "Este campo es obligatorio.";
        if (!News.trim()) newErrors.News = "Este campo es obligatorio.";
        if (!TypeReport.trim()) newErrors.TypeReport = "Debe seleccionar un tipo de solicitud.";
        if (!ResponsibleForSpace.trim()) newErrors.ResponsibleForSpace = "Este campo es obligatorio.";

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async () => {
        if (!validateFields()) return;

        const today = new Date().toISOString().split("T")[0];
        const user = JSON.parse(localStorage.getItem("user"));
        if (!user || !user.id) {
            showAlert('No se pudo obtener la información del usuario.', 'error');
            return;
        }

        try {
            const { data: applications } = await axios.get(url);
            const assignedCount = applications.filter(
                (app) => app.reportType === TypeReport && app.status === "Asignada"
            ).length;

            const newStatus = assignedCount >= 3 ? "En espera" : "Asignada";

            if (newStatus === "En espera") {
                showAlert(`Ya hay 3 solicitudes asignadas para ${TypeReport}. Se guardará como "En espera".`, 'warning');
            }

            const formData = new FormData();
            formData.append("reportDate", today);
            formData.append("dependence", Dependence);
            formData.append("location", Place);
            formData.append("news", News);
            if (photographicEvidence) {
                formData.append("photographicEvidence", photographicEvidence);
            }
            formData.append("reportType", TypeReport);
            formData.append("responsibleForSpace", ResponsibleForSpace);
            formData.append("status", newStatus);
            formData.append("userId", user.id);

            const registerRequest = axios.post(url, formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });

            toast.promise(registerRequest, {
                pending: "Registrando solicitud...",
                success: `Solicitud registrada correctamente con estado: ${newStatus}`,
                error: "Error al registrar la solicitud",
            });

            await registerRequest;
            onSolicitudCreated();
            handleClose();
        } catch (error) {
            console.error("Error al registrar solicitud:", error);
            showAlert("Error al registrar la solicitud", 'error');
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
                            <Form.Label className="required">Centro/dependencia</Form.Label>
                            <Form.Control
                                type="text"
                                value={Dependence}
                                onChange={(e) => {
                                    setDependence(e.target.value);
                                    setErrors({ ...errors, Dependence: "" });
                                }}
                                isInvalid={!!errors.Dependence}
                                placeholder="Ingrese la dependencia"
                            />
                            <Form.Control.Feedback type="invalid">{errors.Dependence}</Form.Control.Feedback>
                        </Col>
                        <Col sm="6">
                            <Form.Label className="required">Lugar</Form.Label>
                            <Form.Control
                                type="text"
                                value={Place}
                                onChange={(e) => {
                                    setPlace(e.target.value);
                                    setErrors({ ...errors, Place: "" });
                                }}
                                isInvalid={!!errors.Place}
                                placeholder="Ingrese el lugar"
                            />
                            <Form.Control.Feedback type="invalid">{errors.Place}</Form.Control.Feedback>
                        </Col>
                    </Form.Group>
                    <Form.Group className="mb-3 p-3" as={Row} controlId="formDependence">
                        <Form.Label className="required">Detalles</Form.Label>
                        <Form.Control
                            as="textarea"
                            rows={2}
                            value={News}
                            onChange={(e) => {
                                setNews(e.target.value);
                                setErrors({ ...errors, News: "" });
                            }}
                            isInvalid={!!errors.News}
                            placeholder="Describa los detalles del reporte"
                        />
                        <Form.Control.Feedback type="invalid">{errors.News}</Form.Control.Feedback>
                    </Form.Group>
                    <Form.Group className="mb-3" as={Row} controlId="formTypeAndResponsible">
                        <Col sm="6">
                            <Form.Label className="required">Tipo de solicitud</Form.Label>
                            <Form.Select
                                value={TypeReport}
                                onChange={(e) => {
                                    setTypeReport(e.target.value);
                                    setErrors({ ...errors, TypeReport: "" });
                                }}
                                isInvalid={!!errors.TypeReport}
                            >
                                <option value="">Seleccione un tipo</option>
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
                            <Form.Control.Feedback type="invalid">{errors.TypeReport}</Form.Control.Feedback>
                        </Col>
                        <Col sm="6">
                            <Form.Label className="required">Responsable del Espacio</Form.Label>
                            <Form.Control
                                type="text"
                                value={ResponsibleForSpace}
                                onChange={(e) => {
                                    setResponsibleForSpace(e.target.value);
                                    setErrors({ ...errors, ResponsibleForSpace: "" });
                                }}
                                isInvalid={!!errors.ResponsibleForSpace}
                                placeholder="Responsable del espacio"
                            />
                            <Form.Control.Feedback type="invalid">{errors.ResponsibleForSpace}</Form.Control.Feedback>
                        </Col>
                    </Form.Group>
                    <Form.Group className="mb-3 p-2" as={Row} controlId="forType">
                        <Form.Label>Evidencia</Form.Label>
                        <Form.Control type="file" onChange={handleFileChange} accept="image/*" />
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
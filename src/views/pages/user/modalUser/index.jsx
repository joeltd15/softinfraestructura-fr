import { useEffect, useState } from "react"
import { Modal, Button, Form, Row, Col } from "react-bootstrap"
import axios from "axios"
import { Eye, EyeOff } from "lucide-react"
import { useAlert } from '../../../../assets/functions/index';
import { toast } from "react-toastify";


const ModalRegistro = ({ show, handleClose, getUsers }) => {
    const [roles, setRoles] = useState([])
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
        phone: "",
        roleId: "",
    })

    const [errors, setErrors] = useState({})
    const [showPassword, setShowPassword] = useState(false)
    const [showConfirmPassword, setShowConfirmPassword] = useState(false)
    const { showAlert } = useAlert();

    useEffect(() => {
        return () => {
            toast.dismiss();
        };
    }, []);

    const token = localStorage.getItem("token");

    const headers = {
        Authorization: `Bearer ${token}`,
    }

    useEffect(() => {
        axios
            .get("http://localhost:2025/api/role", {headers})
            .then((response) => setRoles(response.data))
            .catch((error) => console.error("Error al obtener roles:", error))
    }, [])

    const validateField = (name, value) => {
        let error = ""

        switch (name) {
            case "name":
                if (!value.trim()) error = "El nombre es obligatorio"
                else if (/\d/.test(value)) error = "El nombre no debe contener números"
                break
            case "email":
                if (!value.trim()) error = "El email es obligatorio"
                else if (!/^[\w.-]+@[a-zA-Z\d.-]+\.[a-zA-Z]{2,}$/.test(value))
                    error = "Formato de email inválido"
                break
            case "password":
                if (!value.trim()) error = "La contraseña es obligatoria"
                break
            case "confirmPassword":
                if (!value.trim()) error = "Debe confirmar la contraseña"
                else if (value !== formData.password) error = "Las contraseñas no coinciden"
                break
            case "phone":
                if (!value.trim()) error = "El teléfono es obligatorio"
                else if (!/^\d{10}$/.test(value)) error = "El teléfono debe tener 10 dígitos numéricos"
                break
            case "roleId":
                if (!value) error = "Debe seleccionar un rol"
                break
            default:
                break
        }

        setErrors((prevErrors) => ({ ...prevErrors, [name]: error }))
    }

    const handleChange = (e) => {
        const { name, value } = e.target
        setFormData({ ...formData, [name]: value })
        validateField(name, value)
    }

    const handleSubmit = async () => {
        const newErrors = {}
        Object.keys(formData).forEach((key) => validateField(key, formData[key]))

        if (Object.values(errors).some((error) => error)) return

        try {
            await axios.post("http://localhost:2025/api/auth/register", formData)
            showAlert("Usuario registrado correctamente", 'success');


            setFormData({
                name: "",
                email: "",
                password: "",
                confirmPassword: "",
                phone: "",
                roleId: "",
            })
            setErrors({})
            getUsers()
            handleClose()
        } catch (error) {
            console.error("Error al registrar usuario:", error)
            showAlert(error.response?.data?.message || "Error al registrar usuario", 'error');
        }
    }

    return (
        <Modal show={show} onHide={handleClose} backdrop="static">
            <Modal.Header closeButton>
                <Modal.Title>Registrar Usuario</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form>
                    <Row className="mb-3">
                        <Col sm="6">
                            <Form.Group controlId="formName">
                                <Form.Label className="required">Nombre</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    placeholder="Ingrese el nombre"
                                    className={errors.name ? "is-invalid" : ""}
                                />
                                <div className="invalid-feedback">{errors.name}</div>
                            </Form.Group>
                        </Col>
                        <Col sm="6">
                            <Form.Group controlId="formPhone">
                                <Form.Label className="required">Teléfono</Form.Label>
                                <Form.Control
                                    type="tel"
                                    name="phone"
                                    value={formData.phone}
                                    onChange={handleChange}
                                    placeholder="Ingrese el teléfono"
                                    className={errors.phone ? "is-invalid" : ""}
                                />
                                <div className="invalid-feedback">{errors.phone}</div>
                            </Form.Group>
                        </Col>
                    </Row>

                    <Form.Group className="mb-3" controlId="formEmail">
                        <Form.Label className="required">Email</Form.Label>
                        <Form.Control
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="Ingrese el email"
                            className={errors.email ? "is-invalid" : ""}
                        />
                        <div className="invalid-feedback">{errors.email}</div>
                    </Form.Group>

                    <Row className="mb-3">
                        <Col sm="6">
                            <Form.Group controlId="formPassword">
                                <Form.Label className="required">Contraseña</Form.Label>
                                <div className="position-relative">
                                    <Form.Control
                                        type={showPassword ? "text" : "password"}
                                        name="password"
                                        value={formData.password}
                                        onChange={handleChange}
                                        placeholder="Ingrese la contraseña"
                                        className={errors.password ? "border-danger" : ""}
                                    />
                                    <Button
                                        variant="link"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="position-absolute end-0 top-50 translate-middle-y me-2"
                                    >
                                        {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                    </Button>
                                </div>
                                {errors.password && <div className="text-danger mt-1">{errors.password}</div>}
                            </Form.Group>
                        </Col>
                        <Col sm="6">
                            <Form.Group controlId="formConfirmPassword">
                                <Form.Label className="required">Confirmar Contraseña</Form.Label>
                                <div className="position-relative">
                                    <Form.Control
                                        type={showConfirmPassword ? "text" : "password"}
                                        name="confirmPassword"
                                        value={formData.confirmPassword}
                                        onChange={handleChange}
                                        placeholder="Confirme la contraseña"
                                        className={errors.confirmPassword ? "border-danger" : ""}
                                    />
                                    <Button
                                        variant="link"
                                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                        className="position-absolute end-0 top-50 translate-middle-y"
                                    >
                                        {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                    </Button>
                                </div>
                                {errors.confirmPassword && <div className="text-danger mt-1">{errors.confirmPassword}</div>}
                            </Form.Group>
                        </Col>
                    </Row>

                    <Form.Group className="mb-3" controlId="formRole">
                        <Form.Label className="required">Rol</Form.Label>
                        <Form.Select
                            name="roleId"
                            value={formData.roleId}
                            onChange={handleChange}
                            className={errors.roleId ? "is-invalid" : ""}
                        >
                            <option value="">Seleccione un rol</option>
                            {roles.map((role) => (
                                <option key={role.id} value={role.id}>
                                    {role.name}
                                </option>
                            ))}
                        </Form.Select>
                        <div className="invalid-feedback">{errors.roleId}</div>
                    </Form.Group>
                </Form>
            </Modal.Body>
            <Modal.Footer>
                <Button className="buttons-form Button-next" onClick={handleClose}>Cancelar</Button>
                <Button className="buttons-form Button-save" onClick={handleSubmit}>Registrar</Button>
            </Modal.Footer>
        </Modal>
    )
}

export default ModalRegistro
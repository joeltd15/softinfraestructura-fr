import { useEffect, useState } from "react"
import { Modal, Button, Form, Row, Col } from "react-bootstrap"
import axios from "axios"
import { toast } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import { Eye, EyeOff } from "lucide-react"


const ModalRegistro = ({ show, handleClose }) => {
    const [roles, setRoles] = useState([])
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
        phone: "",
        roleId: "",
    })
    const [showPassword, setShowPassword] = useState(false)
    const [showConfirmPassword, setShowConfirmPassword] = useState(false)

    useEffect(() => {
        axios
            .get("http://localhost:2025/api/role")
            .then((response) => setRoles(response.data))
            .catch((error) => console.error("Error al obtener roles:", error))
    }, [])

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value })
    }

    const handleSubmit = async () => {
        if (formData.password !== formData.confirmPassword) {
            toast.error("Las contraseñas no coinciden")
            return
        }

        if (!formData.name || !formData.email || !formData.password || !formData.roleId || !formData.phone) {
            toast.error("Todos los campos son obligatorios")
            return
        }

        const dataToSend = {
            name: formData.name.trim(),
            email: formData.email.trim(),
            password: formData.password.trim(),
            phone: formData.phone.trim(),
            roleId: formData.roleId,
        }

        try {
            await axios.post("http://localhost:2025/api/auth/register", dataToSend)
            toast.success("Usuario registrado correctamente")

            setFormData({
                name: "",
                email: "",
                password: "",
                confirmPassword: "",
                phone: "",
                roleId: "",
            })

            handleClose()
        } catch (error) {
            console.error("Error al registrar usuario:", error)
            toast.error(error.response?.data?.message || "Error al registrar usuario")
        }
    }

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword)
    }

    const toggleConfirmPasswordVisibility = () => {
        setShowConfirmPassword(!showConfirmPassword)
    }

    return (
        <Modal show={show} onHide={handleClose} backdrop="static">
            <Modal.Header closeButton>
                <Modal.Title>Registrar Usuario</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form>
                    <Form.Group className="mb-3" as={Row} controlId="formName">
                        <Col sm="6">
                            <Form.Label className="required">Nombre</Form.Label>
                            <Form.Control
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                placeholder="Ingrese el nombre"
                            />
                        </Col>
                        <Col sm="6">
                            <Form.Label className="required">Teléfono</Form.Label>
                            <Form.Control
                                type="tel"
                                name="phone"
                                value={formData.phone}
                                onChange={handleChange}
                                placeholder="Ingrese el teléfono"
                            />
                        </Col>
                    </Form.Group>

                    <Form.Group className="mb-3 p-3" as={Row} controlId="formEmail">
                        <Form.Label className="required">Email</Form.Label>
                        <Form.Control
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="Ingrese el email"
                        />
                    </Form.Group>

                    <Form.Group className="mb-3" as={Row} controlId="formPassword">
                        <Col sm="6">
                            <Form.Label className="required">Contraseña</Form.Label>
                            <div className="position-relative">
                                <Form.Control
                                    type={showPassword ? "text" : "password"}
                                    name="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    placeholder="Ingrese la contraseña"
                                />
                                <Button
                                    variant="link"
                                    onClick={togglePasswordVisibility}
                                    className="position-absolute end-0 top-50 translate-middle-y"
                                >
                                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                </Button>
                            </div>
                        </Col>
                        <Col sm="6">
                            <Form.Label className="required">Confirmar Contraseña</Form.Label>
                            <div className="position-relative">
                                <Form.Control
                                    type={showConfirmPassword ? "text" : "password"}
                                    name="confirmPassword"
                                    value={formData.confirmPassword}
                                    onChange={handleChange}
                                    placeholder="Confirme la contraseña"
                                />
                                <Button
                                    variant="link"
                                    onClick={toggleConfirmPasswordVisibility}
                                    className="position-absolute end-0 top-50 translate-middle-y"
                                >
                                    {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                </Button>
                            </div>
                        </Col>
                    </Form.Group>

                    <Form.Group className="mb-3" as={Row} controlId="formRole">
                        <Form.Label className="required">Rol</Form.Label>
                        <Form.Select
                            name="roleId"
                            value={formData.roleId}
                            onChange={handleChange}
                        >
                            <option value="">Seleccione un rol</option>
                            {roles.map((role) => (
                                <option key={role.id} value={role.id}>
                                    {role.name}
                                </option>
                            ))}
                        </Form.Select>
                    </Form.Group>

                </Form>
            </Modal.Body>
            <Modal.Footer>
                <Button className="buttons-form Button-next" onClick={handleClose}>
                    Cancelar
                </Button>
                <Button className="buttons-form Button-save" onClick={handleSubmit}>
                    Registrar
                </Button>
            </Modal.Footer>
        </Modal>
    )
}

export default ModalRegistro;
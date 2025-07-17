import { useState, useEffect } from "react";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Modal from "react-bootstrap/Modal";
import { toast } from "react-toastify";
import axios from "axios";
import { useAlert } from '../../../assets/functions/index';
import { Eye, EyeOff } from "lucide-react";

const UpdatedPasswordModal = ({ show, handleClose, token }) => {
    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [loading, setLoading] = useState(false);

    // Estados para mostrar/ocultar contraseñas
    const [showPassword, setShowPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const { showAlert } = useAlert();

    useEffect(() => {
        return () => {
            toast.dismiss(); // Limpia todas las alertas al desmontar el componente
        };
    }, []);

    const resetForm = () => {
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
        setShowPassword(false);
        setShowNewPassword(false);
        setShowConfirmPassword(false);
    };

    const handleCloseModal = () => {
        resetForm();
        handleClose();
    };

    const handleSubmit = async () => {
        if (!currentPassword || !newPassword || !confirmPassword) {
            showAlert('Todos los campos son obligatorios.', 'error');
            return;
        }

        if (newPassword !== confirmPassword) {
            showAlert('Las contraseñas no coinciden.', 'error');
            return;
        }

        setLoading(true);

        try {
            const response = await axios.post(
                "https://softinfraestructura-gray.vercel.app/api/auth/change-password",
                {
                    currentPassword,
                    newPassword,
                    confirmPassword,
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            showAlert(response.data.message || "Contraseña actualizada con éxito", 'success');
            resetForm();
            handleClose();
        } catch (error) {
            showAlert(error.response?.data?.message || "Error al cambiar la contraseña", 'error');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal show={show} onHide={handleClose} backdrop="static">
            <Modal.Header closeButton>
                <Modal.Title>Cambiar contraseña</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form>
                    {/* Contraseña actual */}
                    <Form.Group className="mb-3">
                        <Form.Label className="required">Contraseña actual</Form.Label>
                        <div className="input-container">
                            <Form.Control
                                type={showPassword ? "text" : "password"}
                                value={currentPassword}
                                onChange={(e) => setCurrentPassword(e.target.value)}
                                placeholder="Ingresa tu contraseña actual"
                            />
                            <Button
                                variant="link"
                                onClick={() => setShowPassword(!showPassword)}
                                className="eye-button"
                            >
                                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                            </Button>
                        </div>
                    </Form.Group>

                    {/* Nueva contraseña */}
                    <Form.Group className="mb-3">
                        <Form.Label className="required">Nueva contraseña</Form.Label>
                        <div className="input-container">
                            <Form.Control
                                type={showNewPassword ? "text" : "password"}
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                placeholder="Ingresa la nueva contraseña"
                            />
                            <Button
                                variant="link"
                                onClick={() => setShowNewPassword(!showNewPassword)}
                                className="eye-button"
                            >
                                {showNewPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                            </Button>
                        </div>
                    </Form.Group>

                    {/* Confirmar nueva contraseña */}
                    <Form.Group className="mb-3">
                        <Form.Label className="required">Confirmar nueva contraseña</Form.Label>
                        <div className="input-container">
                            <Form.Control
                                type={showConfirmPassword ? "text" : "password"}
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                placeholder="Confirma la nueva contraseña"
                            />
                            <Button
                                variant="link"
                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                className="eye-button"
                            >
                                {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                            </Button>
                        </div>
                    </Form.Group>
                </Form>
            </Modal.Body>
            <Modal.Footer>
                <Button className="buttons-form Button-next" onClick={handleCloseModal} disabled={loading}>
                    Salir
                </Button>
                <Button className="buttons-form Button-save" onClick={handleSubmit} disabled={loading}>
                    {loading ? "Guardando..." : "Guardar"}
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default UpdatedPasswordModal;

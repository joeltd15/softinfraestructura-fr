import { useState, useEffect, useCallback } from "react";
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
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const fetchPermissions = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await axios.get("http://localhost:2025/api/permission");
      setPermissions(response.data);
    } catch (error) {
      console.error("❌ Error al obtener permisos:", error);
      toast.error("Error al obtener permisos.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (show) {
      fetchPermissions();
      setErrors({}); // Reiniciar errores al abrir modal
      setRoleName(role?.name || ""); // Cargar datos del rol
      setSelectedPermissions(role?.Permissions?.map(p => p.id) || []);
    }
  }, [show, fetchPermissions, role]);

  const handlePermissionChange = (permissionId) => {
    setSelectedPermissions((prev) =>
      prev.includes(permissionId)
        ? prev.filter((id) => id !== permissionId)
        : [...prev, permissionId]
    );
    
    if (selectedPermissions.length > 0) {
      setErrors(prev => ({ ...prev, selectedPermissions: "" }));
    }
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

    try {
      await axios.put(`http://localhost:2025/api/role/${role.id}`, {
        name: roleName,
        permissions: selectedPermissions,
      });
      toast.success("Rol actualizado correctamente.");
      onRoleUpdated();
      handleClose();
    } catch (error) {
      console.error("❌ Error al actualizar el rol:", error);
      toast.error("Error al actualizar el rol.");
    }
  };

  return (
    <Modal show={show} onHide={handleClose} backdrop="static">
      <Modal.Header closeButton>
        <Modal.Title>Editar Rol</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {isLoading ? (
          <div>Cargando...</div>
        ) : (
          <Form>
            <Form.Group className="mb-3">
              <Form.Label className="required">Nombre del Rol</Form.Label>
              <Form.Control
                type="text"
                value={roleName}
                onChange={(e) => {
                  setRoleName(e.target.value);
                  if (e.target.value.trim() && !/\d/.test(e.target.value)) {
                    setErrors(prev => ({ ...prev, roleName: "" }));
                  }
                }}
                placeholder="Ingrese el nombre del rol"
                isInvalid={!!errors.roleName}
              />
              <Form.Control.Feedback type="invalid">
                {errors.roleName}
              </Form.Control.Feedback>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label className="required">Permisos</Form.Label>
              <Row className={errors.selectedPermissions ? "border border-danger rounded p-2" : ""}>
                {permissions.map((permission) => (
                  <Col key={permission.id} sm={6}>
                    <Form.Check
                      type="checkbox"
                      label={permission.name}
                      checked={selectedPermissions.includes(permission.id)}
                      onChange={() => handlePermissionChange(permission.id)}
                      id={`permission-${permission.id}`}
                    />
                  </Col>
                ))}
              </Row>
              {errors.selectedPermissions && (
                <div className="text-danger mt-1">{errors.selectedPermissions}</div>
              )}
            </Form.Group>
          </Form>
        )}
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
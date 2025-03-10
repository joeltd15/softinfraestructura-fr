import { useState, useEffect } from "react"
import axios from "axios"
import { Link } from "react-router-dom"
import { toast } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import { Col, Row, Button } from "react-bootstrap"
import { useAlert } from "../../../assets/functions/index"
import { useNavigate } from 'react-router-dom';
import {
  CButton,
  CCard,
  CCardBody,
  CCol,
  CContainer,
  CForm,
  CFormInput,
  CInputGroup,
  CInputGroupText,
} from "@coreui/react"
import CIcon from "@coreui/icons-react"
import { cilLockLocked, cilUser } from "@coreui/icons"
import { Eye, EyeOff } from "lucide-react"

const Register = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone: "",
  })

  const [errors, setErrors] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone: "",
  })

  const [touched, setTouched] = useState({
    name: false,
    email: false,
    password: false,
    confirmPassword: false,
    phone: false,
  })

  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const { showAlert } = useAlert()
  const navigate = useNavigate();
  

  // Validation patterns
  const patterns = {
    name: /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]{3,50}$/,
    email: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
    password: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
    phone: /^\d{10}$/,
  }

  const errorMessages = {
    name: "El nombre debe tener entre 3 y 50 caracteres y no contener caracteres especiales",
    email: "Ingrese un correo electrónico válido",
    password:
      "La contraseña debe tener al menos 8 caracteres, una mayúscula, una minúscula, un número y un carácter especial",
    confirmPassword: "Las contraseñas no coinciden",
    phone: "El teléfono debe tener 10 dígitos",
  }

  const validateField = (name, value) => {
    let error = ""

    switch (name) {
      case "name":
        error = !patterns.name.test(value) ? errorMessages.name : ""
        break
      case "email":
        error = !patterns.email.test(value) ? errorMessages.email : ""
        break
      case "password":
        error = !patterns.password.test(value) ? errorMessages.password : ""
        break
      case "confirmPassword":
        error = value !== formData.password ? errorMessages.confirmPassword : ""
        break
      case "phone":
        error = !patterns.phone.test(value) ? errorMessages.phone : ""
        break
      default:
        break
    }

    return error
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData({ ...formData, [name]: value })

    if (touched[name]) {
      const error = validateField(name, value)
      setErrors({ ...errors, [name]: error })

      // Special case for confirmPassword when password changes
      if (name === "password" && touched.confirmPassword) {
        const confirmError = formData.confirmPassword !== value ? errorMessages.confirmPassword : ""
        setErrors((prev) => ({ ...prev, confirmPassword: confirmError }))
      }
    }
  }

  const handleBlur = (e) => {
    const { name, value } = e.target
    setTouched({ ...touched, [name]: true })
    const error = validateField(name, value)
    setErrors({ ...errors, [name]: error })
  }

  const validateForm = () => {
    const newErrors = {}
    let isValid = true

    // Validate all fields
    Object.keys(formData).forEach((key) => {
      const error = validateField(key, formData[key])
      newErrors[key] = error
      if (error) isValid = false
    })

    setErrors(newErrors)
    setTouched({
      name: true,
      email: true,
      password: true,
      confirmPassword: true,
      phone: true,
    })

    return isValid
  }

  useEffect(() => {
    return () => {
      toast.dismiss() // Limpia todas las alertas al desmontar el componente
    }
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!validateForm()) {
      showAlert("Por favor, corrija los errores en el formulario.", "error")
      return
    }

    const dataToSend = {
      name: formData.name.trim(),
      email: formData.email.trim(),
      password: formData.password.trim(),
      phone: formData.phone.trim(),
      roleId: 3,
    }

    try {
      await axios.post("http://localhost:2025/api/auth/register", dataToSend)
      showAlert("Registro exitoso.", "success")
      setFormData({ name: "", email: "", password: "", confirmPassword: "", phone: "" })
      setErrors({ name: "", email: "", password: "", confirmPassword: "", phone: "" })
      setTouched({ name: false, email: false, password: false, confirmPassword: false, phone: false })

      setTimeout(() => {
        navigate('/login')
      }, 4500)
    } catch (error) {
      console.log("Error en la solicitud:", error.response?.data)

      // Verificar si el error es por correo, contraseña o teléfono ya registrados
      const errorMessage = error.response?.data?.message || ""

      if (
        errorMessage.toLowerCase().includes("correo") ||
        errorMessage.toLowerCase().includes("email") ||
        errorMessage.toLowerCase().includes("ya existe") ||
        errorMessage.toLowerCase().includes("ya registrado")
      ) {
        showAlert("Este correo electrónico ya está registrado en el sistema.", "error")
        setErrors((prev) => ({ ...prev, email: "Este correo ya está registrado" }))
      } else if (errorMessage.toLowerCase().includes("contraseña") || errorMessage.toLowerCase().includes("password")) {
        showAlert("Esta contraseña no puede ser utilizada. Por favor, elija otra.", "error")
        setErrors((prev) => ({ ...prev, password: "Esta contraseña no puede ser utilizada" }))
      } else if (
        errorMessage.toLowerCase().includes("teléfono") ||
        errorMessage.toLowerCase().includes("telefono") ||
        errorMessage.toLowerCase().includes("phone") ||
        errorMessage.toLowerCase().includes("número") ||
        errorMessage.toLowerCase().includes("numero")
      ) {
        showAlert("Este número telefónico ya está registrado en el sistema.", "error")
        setErrors((prev) => ({ ...prev, phone: "Este número telefónico ya está registrado" }))
      } else {
        // Handle specific backend validation errors
        if (error.response?.data?.errors) {
          const backendErrors = error.response.data.errors
          const newErrors = { ...errors }

          if (backendErrors.email) newErrors.email = backendErrors.email
          if (backendErrors.name) newErrors.name = backendErrors.name
          if (backendErrors.phone) newErrors.phone = backendErrors.phone
          if (backendErrors.password) newErrors.password = backendErrors.password

          setErrors(newErrors)
        }

        showAlert(error.response?.data?.message || "Error en el registro", "error")
      }
    }
  }

  return (
    <div className="bg-body-tertiary min-vh-100 d-flex flex-row align-items-center pattern">
      <CContainer className="p-4 d-flex align-items-center justify-content-center">
        <CCol md={9} lg={7} xl={6} className="p-4 d-flex align-items-center justify-content-center">
          <CCard className="p-4 d-flex align-items-center">
            <CCardBody>
              <CForm onSubmit={handleSubmit}>
                <h2 className="pb-4 text-center">Registro</h2>
                <Row>
                  <Col sm={6}>
                    <CInputGroup className="mb-3">
                      <CInputGroupText>
                        <CIcon icon={cilUser} />
                      </CInputGroupText>
                      <CFormInput
                        name="name"
                        placeholder="Nombre"
                        value={formData.name}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        invalid={touched.name && !!errors.name}
                        required
                      />
                    </CInputGroup>
                    {touched.name && errors.name && <div className="text-danger small mb-3">{errors.name}</div>}
                  </Col>
                  <Col sm={6}>
                    <CInputGroup className="mb-3">
                      <CInputGroupText>📞</CInputGroupText>
                      <CFormInput
                        type="tel"
                        name="phone"
                        placeholder="Teléfono"
                        value={formData.phone}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        invalid={touched.phone && !!errors.phone}
                        required
                      />
                    </CInputGroup>
                    {touched.phone && errors.phone && <div className="text-danger small mb-3">{errors.phone}</div>}
                  </Col>
                </Row>
                <CInputGroup className="mb-3">
                  <CInputGroupText>@</CInputGroupText>
                  <CFormInput
                    type="email"
                    name="email"
                    placeholder="Correo"
                    value={formData.email}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    invalid={touched.email && !!errors.email}
                    required
                  />
                </CInputGroup>
                {touched.email && errors.email && <div className="text-danger small mb-3">{errors.email}</div>}
                <CInputGroup className="mb-3 position-relative">
                  <CInputGroupText>
                    <CIcon icon={cilLockLocked} />
                  </CInputGroupText>
                  <CFormInput
                    type={showPassword ? "text" : "password"}
                    name="password"
                    placeholder="Contraseña"
                    value={formData.password}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    invalid={touched.password && !!errors.password}
                    required
                  />
                  <Button
                    variant="link"
                    onClick={() => setShowPassword(!showPassword)}
                    className="position-absolute end-0 top-50 translate-middle-y"
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </Button>
                </CInputGroup>
                {touched.password && errors.password && <div className="text-danger small mb-3">{errors.password}</div>}
                <CInputGroup className="mb-3 position-relative">
                  <CInputGroupText>
                    <CIcon icon={cilLockLocked} />
                  </CInputGroupText>
                  <CFormInput
                    type={showConfirmPassword ? "text" : "password"}
                    name="confirmPassword"
                    placeholder="Confirmar Contraseña"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    invalid={touched.confirmPassword && !!errors.confirmPassword}
                    required
                  />
                  <Button
                    variant="link"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="position-absolute end-0 top-50 translate-middle-y"
                  >
                    {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </Button>
                </CInputGroup>
                {touched.confirmPassword && errors.confirmPassword && (
                  <div className="text-danger small mb-3">{errors.confirmPassword}</div>
                )}
                <CButton type="submit" color="green" className="w-100">
                  Registrar
                </CButton>
              </CForm>
              <div className="text-center mt-4">
                <Link to="/login">¿Ya tienes una cuenta? Inicia sesión</Link>
              </div>
            </CCardBody>
          </CCard>
        </CCol>
      </CContainer>
    </div>
  )
}

export default Register


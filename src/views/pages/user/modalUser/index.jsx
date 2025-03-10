"use client"

import { useEffect, useState } from "react"
import { Modal, Button, Form, Row, Col } from "react-bootstrap"
import axios from "axios"
import { Eye, EyeOff } from "lucide-react"
import { useAlert } from "../../../../assets/functions/index"
import { toast } from "react-toastify"

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
  const { showAlert } = useAlert()
  const [isCheckingEmail, setIsCheckingEmail] = useState(false)
  const [isCheckingPhone, setIsCheckingPhone] = useState(false)
  const [debugInfo, setDebugInfo] = useState("") // Para mostrar info de depuración

  useEffect(() => {
    return () => {
      toast.dismiss()
    }
  }, [])

  const token = localStorage.getItem("token")

  const headers = {
    Authorization: `Bearer ${token}`,
  }

  useEffect(() => {
    axios
      .get("https://softinfraestructura-86fdvmh2g-ingdanielbs-projects.vercel.app/api/role", { headers })
      .then((response) => setRoles(response.data))
      .catch((error) => console.error("Error al obtener roles:", error))
  }, [])

  // Función para verificar si el email ya existe (sin debounce para simplificar)
  const checkEmailExists = async (email) => {
    if (!email || !/^[\w.-]+@[a-zA-Z\d.-]+\.[a-zA-Z]{2,}$/.test(email)) return

    setIsCheckingEmail(true)
    setDebugInfo(`Verificando email: ${email}`)

    try {
      // Primera opción - llamar a la API check-email
      const response = await axios.post("https://softinfraestructura-86fdvmh2g-ingdanielbs-projects.vercel.app/api/user/check-email", { email }, { headers })

      console.log("Respuesta de check-email:", response.data)
      setDebugInfo((prev) => `${prev}\nRespuesta check-email: ${JSON.stringify(response.data)}`)

      // Intentar diferentes formatos de respuesta
      let exists = false

      if (response.data.data && response.data.data.exists !== undefined) {
        exists = response.data.data.exists
      } else if (response.data.exists !== undefined) {
        exists = response.data.exists
      } else {
        // Segunda opción - intentar obtener usuarios por email
        try {
          const findResponse = await axios.get(`https://softinfraestructura-86fdvmh2g-ingdanielbs-projects.vercel.app/api/user/by-email/${email}`, { headers })
          exists = !!findResponse.data.data // Si devuelve datos, existe
          console.log("Respuesta de by-email:", findResponse.data)
          setDebugInfo((prev) => `${prev}\nRespuesta by-email: ${JSON.stringify(findResponse.data)}`)
        } catch (findError) {
          console.error("Error al buscar por email:", findError)
        }
      }

      if (exists) {
        setErrors((prev) => ({ ...prev, email: "Este correo ya está registrado" }))
        setDebugInfo((prev) => `${prev}\nEmail ya registrado: ${email}`)
      } else {
        // Limpiar el error si no existe
        setErrors((prev) => {
          const newErrors = { ...prev }
          delete newErrors.email
          return newErrors
        })
        setDebugInfo((prev) => `${prev}\nEmail disponible: ${email}`)
      }
    } catch (error) {
      console.error("Error al verificar email:", error)
      setDebugInfo((prev) => `${prev}\nError al verificar email: ${error.message}`)

      // Intentar método alternativo si falla la API principal
      try {
        // Intentar verificar con la API de registro
        const testData = {
          ...formData,
          email,
          name: formData.name || "Test",
          password: "TestPassword123",
          phone: formData.phone || "1234567890",
          roleId: formData.roleId || "1",
        }

        await axios.post("https://softinfraestructura-86fdvmh2g-ingdanielbs-projects.vercel.app/api/auth/register", testData)
        // Si llega aquí, el email es válido (no existe)
        setErrors((prev) => {
          const newErrors = { ...prev }
          delete newErrors.email
          return newErrors
        })
      } catch (regError) {
        // Analizar el mensaje de error
        const errorMsg = regError.response?.data?.message || ""
        console.log("Error en registro test:", errorMsg)

        if (errorMsg.toLowerCase().includes("email") || errorMsg.toLowerCase().includes("correo")) {
          setErrors((prev) => ({ ...prev, email: "Este correo ya está registrado" }))
          setDebugInfo((prev) => `${prev}\nEmail detectado como existente por error: ${email}`)
        }
      }
    } finally {
      setIsCheckingEmail(false)
    }
  }

  // Función para verificar si el teléfono ya existe
  const checkPhoneExists = async (phone) => {
    if (!phone || !/^\d{10}$/.test(phone)) return

    setIsCheckingPhone(true)
    setDebugInfo(`Verificando teléfono: ${phone}`)

    try {
      // Primera opción - llamar a la API check-phone
      const response = await axios.post("https://softinfraestructura-86fdvmh2g-ingdanielbs-projects.vercel.app/api/user/check-phone", { phone }, { headers })

      console.log("Respuesta de check-phone:", response.data)
      setDebugInfo((prev) => `${prev}\nRespuesta check-phone: ${JSON.stringify(response.data)}`)

      // Intentar diferentes formatos de respuesta
      let exists = false

      if (response.data.data && response.data.data.exists !== undefined) {
        exists = response.data.data.exists
      } else if (response.data.exists !== undefined) {
        exists = response.data.exists
      } else {
        // Segunda opción - intentar obtener usuarios por teléfono
        try {
          const findResponse = await axios.get(`https://softinfraestructura-86fdvmh2g-ingdanielbs-projects.vercel.app/api/user/by-phone/${phone}`, { headers })
          exists = !!findResponse.data.data // Si devuelve datos, existe
          console.log("Respuesta de by-phone:", findResponse.data)
          setDebugInfo((prev) => `${prev}\nRespuesta by-phone: ${JSON.stringify(findResponse.data)}`)
        } catch (findError) {
          console.error("Error al buscar por teléfono:", findError)
        }
      }

      if (exists) {
        setErrors((prev) => ({ ...prev, phone: "Este teléfono ya está registrado" }))
        setDebugInfo((prev) => `${prev}\nTeléfono ya registrado: ${phone}`)
      } else {
        // Limpiar el error si no existe
        setErrors((prev) => {
          const newErrors = { ...prev }
          delete newErrors.phone
          return newErrors
        })
        setDebugInfo((prev) => `${prev}\nTeléfono disponible: ${phone}`)
      }
    } catch (error) {
      console.error("Error al verificar teléfono:", error)
      setDebugInfo((prev) => `${prev}\nError al verificar teléfono: ${error.message}`)

      // Intentar método alternativo si falla la API principal
      try {
        // Intentar verificar con la API de registro
        const testData = {
          ...formData,
          phone,
          name: formData.name || "Test",
          email: formData.email || "test@example.com",
          password: "TestPassword123",
          roleId: formData.roleId || "1",
        }

        await axios.post("https://softinfraestructura-86fdvmh2g-ingdanielbs-projects.vercel.app/api/auth/register", testData)
        // Si llega aquí, el teléfono es válido (no existe)
        setErrors((prev) => {
          const newErrors = { ...prev }
          delete newErrors.phone
          return newErrors
        })
      } catch (regError) {
        // Analizar el mensaje de error
        const errorMsg = regError.response?.data?.message || ""
        console.log("Error en registro test:", errorMsg)

        if (
          errorMsg.toLowerCase().includes("phone") ||
          errorMsg.toLowerCase().includes("teléfono") ||
          errorMsg.toLowerCase().includes("telefono")
        ) {
          setErrors((prev) => ({ ...prev, phone: "Este teléfono ya está registrado" }))
          setDebugInfo((prev) => `${prev}\nTeléfono detectado como existente por error: ${phone}`)
        }
      }
    } finally {
      setIsCheckingPhone(false)
    }
  }

  const validateField = (name, value) => {
    let error = ""

    switch (name) {
      case "name":
        if (!value.trim()) error = "El nombre es obligatorio"
        else if (/\d/.test(value)) error = "El nombre no debe contener números"
        break
      case "email":
        if (!value.trim()) error = "El email es obligatorio"
        else if (!/^[\w.-]+@[a-zA-Z\d.-]+\.[a-zA-Z]{2,}$/.test(value)) error = "Formato de email inválido"
        else {
          // Solo verificamos si el formato es válido
          setErrors((prev) => {
            const newErrors = { ...prev }
            delete newErrors.email // Eliminamos cualquier error previo
            return newErrors
          })

          // Verificar si el email ya existe
          checkEmailExists(value)
          return // No actualizar errores todavía, esperar la respuesta de la API
        }
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
        else {
          // Solo verificamos si el formato es válido
          setErrors((prev) => {
            const newErrors = { ...prev }
            delete newErrors.phone // Eliminamos cualquier error previo
            return newErrors
          })

          // Verificar si el teléfono ya existe
          checkPhoneExists(value)
          return // No actualizar errores todavía, esperar la respuesta de la API
        }
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
    // Validar todos los campos primero
    let hasErrors = false
    const newErrors = {}

    Object.entries(formData).forEach(([key, value]) => {
      let error = ""

      switch (key) {
        case "name":
          if (!value.trim()) error = "El nombre es obligatorio"
          else if (/\d/.test(value)) error = "El nombre no debe contener números"
          break
        case "email":
          if (!value.trim()) error = "El email es obligatorio"
          else if (!/^[\w.-]+@[a-zA-Z\d.-]+\.[a-zA-Z]{2,}$/.test(value)) error = "Formato de email inválido"
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
      }

      if (error) {
        hasErrors = true
        newErrors[key] = error
      }
    })

    // Actualizamos los errores de validación básica
    setErrors((prevErrors) => ({ ...prevErrors, ...newErrors }))

    // Si hay errores de validación básica, no continuamos
    if (hasErrors) return

    // Verificamos si hay errores de duplicados (que podrían haber sido detectados en tiempo real)
    if (errors.email || errors.phone) {
      showAlert("Por favor corrige los errores antes de continuar", "error")
      return
    }

    // Verificar si el email o teléfono ya existe antes de enviar
    setDebugInfo("Verificación final antes de enviar el formulario")

    try {
      // Verificar email
      const emailExists = await checkExistingEmail()
      if (emailExists) {
        setErrors((prev) => ({ ...prev, email: "Este correo ya está registrado" }))
        showAlert("Este correo ya está registrado", "error")
        return
      }

      // Verificar teléfono
      const phoneExists = await checkExistingPhone()
      if (phoneExists) {
        setErrors((prev) => ({ ...prev, phone: "Este teléfono ya está registrado" }))
        showAlert("Este teléfono ya está registrado", "error")
        return
      }

      // Si llegamos aquí, tanto el email como el teléfono son únicos
      setDebugInfo((prev) => `${prev}\nEnviando formulario de registro...`)

      const response = await axios.post("https://softinfraestructura-86fdvmh2g-ingdanielbs-projects.vercel.app/api/auth/register", formData)
      console.log("Respuesta del registro:", response.data)
      setDebugInfo((prev) => `${prev}\nRespuesta del registro: ${JSON.stringify(response.data)}`)

      showAlert("Usuario registrado correctamente", "success")

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
      setDebugInfo((prev) => `${prev}\nError al registrar: ${error.message}`)

      const errorMsg = error.response?.data?.message || "Error al registrar usuario"

      // Intentar detectar el tipo de error
      if (errorMsg.toLowerCase().includes("email") || errorMsg.toLowerCase().includes("correo")) {
        setErrors((prev) => ({ ...prev, email: "Este correo ya está registrado" }))
        showAlert("Este correo ya está registrado", "error")
      } else if (
        errorMsg.toLowerCase().includes("phone") ||
        errorMsg.toLowerCase().includes("teléfono") ||
        errorMsg.toLowerCase().includes("telefono")
      ) {
        setErrors((prev) => ({ ...prev, phone: "Este teléfono ya está registrado" }))
        showAlert("Este teléfono ya está registrado", "error")
      } else {
        showAlert(errorMsg, "error")
      }
    }
  }

  // Funciones auxiliares para verificación final
  const checkExistingEmail = async () => {
    try {
      // Método 1: Endpoint específico
      try {
        const response = await axios.post(
          "https://softinfraestructura-86fdvmh2g-ingdanielbs-projects.vercel.app/api/user/check-email",
          { email: formData.email },
          { headers },
        )

        // Verificar diferentes estructuras de respuesta
        if (response.data.data && response.data.data.exists !== undefined) {
          return response.data.data.exists
        } else if (response.data.exists !== undefined) {
          return response.data.exists
        }
      } catch (e) {
        console.error("Error en check-email:", e)
      }

      // Método 2: Buscar por email
      try {
        const response = await axios.get(`https://softinfraestructura-86fdvmh2g-ingdanielbs-projects.vercel.app/api/user/by-email/${formData.email}`, { headers })
        return !!response.data.data
      } catch (e) {
        if (e.response && e.response.status === 404) {
          return false // No existe
        }
        console.error("Error en by-email:", e)
      }

      // Método 3: Verificar directamente con el repositorio
      // Esta es una opción si puedes añadir un endpoint temporal para desarrollo

      return false // Si llegamos aquí, asumimos que no existe
    } catch (error) {
      console.error("Error verificando email existente:", error)
      return false
    }
  }

  const checkExistingPhone = async () => {
    try {
      // Método 1: Endpoint específico
      try {
        const response = await axios.post(
          "https://softinfraestructura-86fdvmh2g-ingdanielbs-projects.vercel.app/api/user/check-phone",
          { phone: formData.phone },
          { headers },
        )

        // Verificar diferentes estructuras de respuesta
        if (response.data.data && response.data.data.exists !== undefined) {
          return response.data.data.exists
        } else if (response.data.exists !== undefined) {
          return response.data.exists
        }
      } catch (e) {
        console.error("Error en check-phone:", e)
      }

      // Método 2: Buscar por teléfono
      try {
        const response = await axios.get(`https://softinfraestructura-86fdvmh2g-ingdanielbs-projects.vercel.app/api/user/by-phone/${formData.phone}`, { headers })
        return !!response.data.data
      } catch (e) {
        if (e.response && e.response.status === 404) {
          return false // No existe
        }
        console.error("Error en by-phone:", e)
      }

      return false // Si llegamos aquí, asumimos que no existe
    } catch (error) {
      console.error("Error verificando teléfono existente:", error)
      return false
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
                {isCheckingPhone && <div className="text-info mt-1">Verificando teléfono...</div>}
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
            {isCheckingEmail && <div className="text-info mt-1">Verificando email...</div>}
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

export default ModalRegistro


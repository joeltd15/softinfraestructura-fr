"use client"

import { useState, useEffect } from "react"
import axios from "axios"
import Button from "react-bootstrap/Button"
import Form from "react-bootstrap/Form"
import Modal from "react-bootstrap/Modal"
import { toast } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import Select from "react-select"
import { useAlert } from "../../../../assets/functions/index"

const ModalAssignment = ({ show, handleClose, onAssignmentCreated, assignmentApplication = null }) => {
  const urlUsers = "https://softinfraestructura-gray.vercel.app/api/user"
  const [applicationId, setApplicationId] = useState("")
  const [responsibleId, setResponsibleId] = useState("")
  const [applications, setApplications] = useState([])
  const [responsibles, setResponsibles] = useState([])
  const [Users, setUsers] = useState([])
  const { showAlert } = useAlert()

  useEffect(() => {
    setApplicationId(assignmentApplication || "")
  }, [assignmentApplication])

  useEffect(() => {
    return () => {
      toast.dismiss()
    }
  }, [])

  const token = localStorage.getItem("token");

  const headers = {
    Authorization: `Bearer ${token}`,
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [appRes, respRes, userRes, assignRes] = await Promise.all([
          axios.get("https://softinfraestructura-gray.vercel.app/api/application", {headers}),
          axios.get("https://softinfraestructura-gray.vercel.app/api/responsible", {headers}),
          axios.get(urlUsers, {headers}),
          axios.get("https://softinfraestructura-gray.vercel.app/api/assignment", {headers}),
        ])

        setApplications(appRes.data)
        setUsers(userRes.data)

        // Buscar el tipo de reporte seleccionado
        const selectedApp = appRes.data.find((app) => app.id === Number(applicationId))
        const reportType = selectedApp ? selectedApp.reportType : null

        // 🟢 Verificar datos recibidos
        console.log("🔹 Aplicaciones:", appRes.data)
        console.log("🔹 Responsables:", respRes.data)
        console.log("🔹 Asignaciones:", assignRes.data)
        console.log("🔹 Reporte seleccionado:", reportType)

        // Obtener el estado actual de cada asignación
        const assignmentStatuses = {}

        // Primero, obtener el estado de cada asignación desde las aplicaciones
        appRes.data.forEach((app) => {
          assignRes.data.forEach((assign) => {
            if (assign.applicationId === app.id) {
              assignmentStatuses[assign.id] = app.status
            }
          })
        })

        console.log("🔹 Estados de asignaciones:", assignmentStatuses)

        // Contar solicitudes con estado "Asignada" por responsable
        const asignacionesPorResponsable = {}

        assignRes.data.forEach((assignment) => {
          // Buscar la aplicación correspondiente a esta asignación
          const app = appRes.data.find((app) => app.id === assignment.applicationId)

          if (assignment.responsibleId && app) {
            // Solo contar si el estado es "Asignada"
            if (app.status === "Asignada") {
              asignacionesPorResponsable[assignment.responsibleId] =
                (asignacionesPorResponsable[assignment.responsibleId] || 0) + 1
            }
          }
        })

        console.log("🔹 Contador de asignaciones en estado 'Asignada':", asignacionesPorResponsable)

        const filteredResponsibles = respRes.data.filter((resp) => {
          // Obtener el número de asignaciones con estado "Asignada" para este responsable
          const asignacionesActivas = asignacionesPorResponsable[resp.id] || 0

          // ✅ Permitir asignación solo si tiene menos de 3 en estado "Asignada"
          const disponible = asignacionesActivas < 3

          const hasMatchingResponsibility =
            Array.isArray(resp.Responsibilities) &&
            resp.Responsibilities.some((r) => r.name.trim().toLowerCase() === reportType?.trim().toLowerCase())

          console.log(
            `🔹 Responsable: ${resp.id}, Asignaciones activas: ${asignacionesActivas}, Disponible: ${disponible}, Coincide con reporte: ${hasMatchingResponsibility}`,
          )

          return disponible && hasMatchingResponsibility
        })

        setResponsibles(filteredResponsibles)
      } catch (error) {
        console.error("❌ Error al obtener datos:", error)
      }
    }

    fetchData()
  }, [applicationId])

  const userName = (userId) => {
    const user = Users.find((user) => user.id === userId)
    return user ? user.name : "Desconocido"
  }

  const responsibleName = (responsibleId) => {
    if (!Users.length || !responsibles.length) return "Cargando..."
    const responsible = responsibles.find((resp) => resp.id === responsibleId)
    if (!responsible) return "Desconocido"
    return Users.find((user) => user.id === responsible.userId)?.name || "Desconocido"
  }

  const handleSubmit = async () => {
    if (!applicationId || !responsibleId) {
      showAlert("Todos los campos son obligatorios.", "warning")
      return
    }

    const assignmentDate = new Date().toISOString().split("T")[0]
    const assignmentData = { assignmentDate, applicationId, responsibleId }

    try {
      // Registrar la asignación
      await axios.post("https://softinfraestructura-gray.vercel.app/api/assignment", assignmentData, {headers})

      try {
        // Intentar actualizar el estado de la aplicación (si falla, no afectará el flujo principal)
        await axios.put(`https://softinfraestructura-gray.vercel.app/api/application/${applicationId}`, {headers}, {
          status: "Asignada",
        })
      } catch (updateError) {
        console.log(
          "Aviso: No se pudo actualizar el estado de la aplicación, pero la asignación se registró correctamente.",
        )
        // No mostramos este error al usuario ya que la operación principal fue exitosa
      }

      showAlert("Asignación registrada correctamente.", "success")
      await onAssignmentCreated()
      handleClose()
    } catch (error) {
      console.error("Error al registrar la asignación:", error)
      showAlert("Error al registrar la asignación.", "error")
    }
  }

  const options = applications.map((app) => ({
    value: app.id,
    label: `${app.location} | Fecha: ${new Date(app.reportDate).toISOString().split("T")[0]} | Codigo: ${app.id} | Tipo: ${app.reportType}`,
  }))

  return (
    <Modal show={show} onHide={handleClose} backdrop="static">
      <Modal.Header closeButton>
        <Modal.Title>Registrar Asignación</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group className="mb-3">
            <Form.Label className="required">Solicitud</Form.Label>
            <Select
              value={options.find((option) => option.value === applicationId)}
              onChange={(selectedOption) => setApplicationId(selectedOption.value)}
              options={options}
              placeholder="Seleccione una solicitud"
              isDisabled
            />
          </Form.Group>
          <Form.Group>
            <Form.Label className="required">Responsable</Form.Label>
            <Form.Select value={responsibleId} onChange={(e) => setResponsibleId(e.target.value)}>
              <option value="">Seleccione un responsable</option>
              {responsibles.map((resp) => (
                <option key={resp.id} value={resp.id}>
                  {responsibleName(resp.id)}
                </option>
              ))}
            </Form.Select>
            {responsibles.length === 0 && (
              <div className="text-danger mt-2">
                No hay responsables disponibles para este tipo de reporte o todos tienen 3 asignaciones activas.
              </div>
            )}
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
  )
}

export default ModalAssignment
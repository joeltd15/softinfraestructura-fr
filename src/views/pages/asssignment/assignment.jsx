import { useEffect, useState } from "react"
import axios from "axios"
import ModalAssignment from "./modalAssignment/index"
import ModalAssignmentEdit from "./modalAssignmentEdit/index"
import { toast } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import { FaPencilAlt } from "react-icons/fa"
import { MdAssignment } from "react-icons/md"
import { FaSearch, FaTimes } from "react-icons/fa"
import Tooltip from "@mui/material/Tooltip"
import ModalTracking from "../tracking/modalTracking/index"
import ModalShowApplication from "../application/ApplicationModalShow/index"
import { FaEye } from "react-icons/fa"
import { FaFilePdf } from "react-icons/fa"
import DocumentPdf from "../application/DocumentPdf/index"
import { pdf } from "@react-pdf/renderer"
import { saveAs } from "file-saver"
import TablePagination from "../../../components/Paginator/index.jsx"
import { useAlert } from "../../../assets/functions/index.jsx"

const Assignment = () => {
  const [responsibles, setResponsibles] = useState([])
  const [assignmentData, setAssignmentData] = useState([])
  const [Users, setUsers] = useState([])
  const [showEditModal, setShowEditModal] = useState(false)
  const [showTracking, setShowTracking] = useState(false)
  const [selectedAssignmentId, setSelectedAssignmentId] = useState(null)
  const [selectedAssignment, setSelectedAssignment] = useState(null)
  const [showModal, setShowModal] = useState(false)
  const [selectedAssignmentShow, setSelectedAssignmentShow] = useState(null)
  const [showModalShow, setShowModalShow] = useState(false)
  const [showApplicationId, setShowApplicationId] = useState(null)
  const [search, setSearch] = useState("")
  const [dataQt, setDataQt] = useState(4)
  const [currentPages, setCurrentPages] = useState(1)
  const [applicationStatuses, setApplicationStatuses] = useState({})
  const { showAlert } = useAlert()
  const [startDate, setStartDate] = useState("")
  const [endDate, setEndDate] = useState("")
  const [appliedStartDate, setAppliedStartDate] = useState("")
  const [appliedEndDate, setAppliedEndDate] = useState("")

  useEffect(() => {
    getAssignment()
    getUsers()
  }, [])

  useEffect(() => {
    return () => {
      toast.dismiss() // Limpia todas las alertas Reservados al desmontar el componente
    }
  }, [])

  useEffect(() => {
    if (selectedAssignmentShow && showApplicationId) {
      console.log("Datos listos para generar el PDF")
    }
  }, [selectedAssignmentShow, showApplicationId])

  const token = localStorage.getItem("token")
  const headers = {
    Authorization: `Bearer ${token}`,
  }

  const getAssignment = async () => {
    try {
      const [assignmentsResponse, responsiblesResponse, applicationsResponse] = await Promise.all([
        axios.get("https://softinfraestructura-gray.vercel.app/api/assignment", { headers }),
        axios.get("https://softinfraestructura-gray.vercel.app/api/responsible", { headers }),
        axios.get("https://softinfraestructura-gray.vercel.app/api/application", { headers }),
      ])
      const assignmentsData = assignmentsResponse.data
      const responsiblesData = responsiblesResponse.data
      const applicationsData = applicationsResponse.data
      setResponsibles(responsiblesData)
      // Crear un objeto con los estados de las solicitudes
      const statuses = {}
      applicationsData.forEach((app) => {
        statuses[app.id] = app.status
      })
      setApplicationStatuses(statuses)
      const user = JSON.parse(localStorage.getItem("user"))
      if (!user) return
      let filteredAssignments = []
      if (user.roleId === 1 || user.roleId === 4) {
        filteredAssignments = assignmentsData
      } else if (user.roleId === 2) {
        const userResponsibilities = responsiblesData
          .filter((responsible) => responsible.userId === user.id)
          .map((responsible) => responsible.id)
        filteredAssignments = assignmentsData.filter((assignment) =>
          userResponsibilities.includes(assignment.responsibleId),
        )
      }
      setAssignmentData(filteredAssignments)
    } catch (error) {
      console.error("Error al obtener las asignaciones:", error)
      showAlert("Error al cargar las asignaciones.", "error")
    }
  }

  const handleShow = async (applicationId) => {
    try {
      const response = await axios.get(`https://softinfraestructura-gray.vercel.app/api/application/${applicationId}`, {
        headers,
      })
      setSelectedAssignmentShow(response.data)
      setShowModalShow(true)
    } catch (error) {
      console.error("Error al obtener los detalles de la solicitud:", error)
      showAlert("Error al cargar los detalles de la solicitud.", "error")
    }
  }

  const handlePdf = async (applicationId) => {
    try {
      const response = await axios.get(`https://softinfraestructura-gray.vercel.app/api/application/${applicationId}`, {
        headers,
      })
      setSelectedAssignmentShow(response.data)
      setShowApplicationId(applicationId)
    } catch (error) {
      console.error("Error al obtener los detalles de la solicitud:", error)
      showAlert("Error al cargar los detalles de la solicitud.", "error")
    }
  }

  const getUsers = async () => {
    try {
      const response = await axios.get("https://softinfraestructura-gray.vercel.app/api/user", { headers })
      setUsers(response.data)
    } catch (error) {
      console.error("Error al obtener los usuarios:", error)
      showAlert("Error al cargar los usuarios.", "error")
    }
  }

  const handleOpenTrackingModal = (assignmentId) => {
    setSelectedAssignmentId(assignmentId)
    setShowTracking(true)
  }

  const handleOpenEditModal = (assignment) => {
    setSelectedAssignment(assignment)
    setShowEditModal(true)
  }

  const handleUpdateAssignment = async (updatedAssignment) => {
    try {
      await axios.put(
        `https://softinfraestructura-gray.vercel.app/api/assignment/${updatedAssignment.id}`,
        updatedAssignment,
        { headers },
      )
      showAlert("Asignación actualizada con éxito.", "success")
      getAssignment()
      setShowEditModal(false)
    } catch (error) {
      console.error("Error al actualizar la asignación:", error)
      showAlert("Error al actualizar la asignación.", "error")
    }
  }

  const user = JSON.parse(localStorage.getItem("user"))

  const handlePdfDownload = async (applicationId) => {
    try {
      const response = await axios.get(`https://softinfraestructura-gray.vercel.app/api/application/${applicationId}`, {
        headers,
      })
      setSelectedAssignmentShow(response.data)
      const doc = <DocumentPdf Application={response.data} />
      const asPdf = pdf([])
      asPdf.updateContainer(doc)
      const blob = await asPdf.toBlob()
      saveAs(blob, `DetalleReporte${applicationId}.pdf`)
    } catch (error) {
      console.error("Error al obtener los detalles de la solicitud:", error)
      showAlert("Error al generar el PDF.", "error")
    }
  }

  // Función para aplicar el filtro de fechas
  const handleApplyDateFilter = () => {
    if (startDate && endDate && new Date(startDate) > new Date(endDate)) {
      showAlert("La fecha de inicio no puede ser mayor que la fecha de fin.", "error")
      return
    }
    setAppliedStartDate(startDate)
    setAppliedEndDate(endDate)
    setCurrentPages(1)
    showAlert("Filtro de fechas aplicado correctamente.", "success")
  }

  // Función para limpiar filtros de fecha
  const handleClearDateFilter = () => {
    setStartDate("")
    setEndDate("")
    setAppliedStartDate("")
    setAppliedEndDate("")
    setCurrentPages(1)
    showAlert("Filtros de fecha limpiados.", "info")
  }

  // Aplicar todos los filtros a los datos
  const applyFilters = () => {
    let filtered = [...assignmentData]

    // Filtrar por fecha de inicio aplicada
    if (appliedStartDate) {
      filtered = filtered.filter((dato) => new Date(dato.assignmentDate) >= new Date(appliedStartDate))
    }

    // Filtrar por fecha de fin aplicada
    if (appliedEndDate) {
      filtered = filtered.filter((dato) => new Date(dato.assignmentDate) <= new Date(appliedEndDate))
    }

    // Filtrar por búsqueda
    if (search) {
      const searchTerm = search.toLowerCase()
      filtered = filtered.filter((dato) => {
        return (
          dato.id.toString().includes(searchTerm) ||
          dato.assignmentDate.toLowerCase().includes(searchTerm) ||
          dato.applicationId.toString().includes(searchTerm) ||
          (responsibles.find((resp) => resp.id === dato.responsibleId)?.userId || "").toString().includes(searchTerm)
        )
      })
    }

    return filtered
  }

  // Obtener los datos filtrados
  const filteredData = applyFilters()

  // Calcular la paginación
  const indexEnd = currentPages * dataQt
  const indexStart = indexEnd - dataQt
  const nPages = Math.ceil(filteredData.length / dataQt)

  // Obtener los resultados paginados
  const results = filteredData.slice(indexStart, indexEnd)

  return (
    <>
      <div className="container">
        <div className="row">
          <div className="panel panel-primary filterable">
            <div className="panel-heading mb-3">
              <div className="d-flex align-items-center justify-content-between flex-wrap gap-3">
                <div className="d-flex align-items-center gap-2">
                  <div className="group d-flex align-items-center">
                    <svg className="icon-search" aria-hidden="true" viewBox="0 0 24 24">
                      <g>
                        <path d="M21.53 20.47l-3.66-3.66C19.195 15.24 20 13.214 20 11c0-4.97-4.03-9-9-9s-9 4.03-9 9 4.03 9 9 9c2.215 0 4.24-.804 5.808-2.13l3.66 3.66c.147.146.34.22.53.22s.385-.073.53-.22c.295-.293.295-.767.002-1.06zM3.5 11c0-4.135 3.365-7.5 7.5-7.5s7.5 3.365 7.5 7.5-3.365 7.5-7.5 7.5-7.5-3.365-7.5-7.5z"></path>
                      </g>
                    </svg>
                    <input
                      placeholder="Buscar"
                      value={search}
                      onChange={(e) => {
                        setSearch(e.target.value)
                        setCurrentPages(1)
                      }}
                      type="search"
                      className="input-search"
                    />
                  </div>
                </div>

                <div className="d-flex align-items-center gap-2 flex-wrap">
                  <label className="mb-0 fw-semibold" style={{ fontSize: "14px" }}>Desde</label>
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="input-date"
                    style={{ fontSize: "14px" }}
                  />
                  <label className="mb-0 fw-semibold" style={{ fontSize: "14px" }}>Hasta</label>
                  <input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="input-date"
                    style={{ fontSize: "14px" }}
                  />

                  <Tooltip title="Aplicar filtro de fechas">
                    <button
                      onClick={handleApplyDateFilter}
                      disabled={!startDate && !endDate}
                      className="btn btn-primary btn-sm d-flex align-items-center gap-1"
                      style={{
                        fontSize: "12px",
                        opacity: startDate || endDate ? 1 : 0.6,
                        cursor: startDate || endDate ? "pointer" : "not-allowed",
                      }}
                    >
                      <FaSearch size={12} />
                      Buscar
                    </button>
                  </Tooltip>

                  <Tooltip title="Limpiar filtros de fecha">
                    <button
                      onClick={handleClearDateFilter}
                      disabled={!appliedStartDate && !appliedEndDate}
                      className="btn btn-secondary btn-sm d-flex align-items-center gap-1"
                      style={{
                        fontSize: "12px",
                        opacity: appliedStartDate || appliedEndDate ? 1 : 0.6,
                        cursor: appliedStartDate || appliedEndDate ? "pointer" : "not-allowed",
                      }}
                    >
                      <FaTimes size={12} />
                      Limpiar
                    </button>
                  </Tooltip>
                </div>
              </div>

              {(appliedStartDate || appliedEndDate) && (
                <div className="row mt-2">
                  <div className="col-12">
                    <small className="text-muted">
                      <strong>Filtros activos:</strong>
                      {appliedStartDate && ` Desde: ${appliedStartDate}`}
                      {appliedEndDate && ` Hasta: ${appliedEndDate}`}
                    </small>
                  </div>
                </div>
              )}
            </div>
            <div className="table-responsive">
              <table className="table">
                <thead className="thead">
                  <tr className="filters">
                    <th>#</th>
                    <th>Fecha de asignamiento</th>
                    <th>Solicitud</th>
                    <th>Responsable</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody className="tbody">
                  {results.length > 0 ? (
                    results.map((assignment, i) => {
                      const responsible = responsibles.find((resp) => resp.id === assignment.responsibleId)
                      const responsibleUser = responsible ? Users.find((user) => user.id === responsible.userId) : null
                      return (
                        <tr key={i}>
                          <td>{indexStart + i + 1}</td>
                          <td>{new Date(assignment.assignmentDate).toISOString().split("T")[0]}</td>
                          <td>{assignment.applicationId}</td>
                          <td>{responsibleUser ? responsibleUser.name : "Desconocido"}</td>
                          <td className="content-buttons">
                            <Tooltip title="Ver detalles de la solicitud">
                              <button
                                className="Table-button Show-button"
                                onClick={() => handleShow(assignment.applicationId)}
                              >
                                <FaEye />
                              </button>
                            </Tooltip>
                            <Tooltip title="Descargar detalles de la solicitud">
                              <button
                                className="Table-button"
                                onClick={() => handlePdfDownload(assignment.applicationId)}
                              >
                                <FaFilePdf />
                              </button>
                            </Tooltip>
                            {applicationStatuses[assignment.applicationId] !== "Realizado" &&
                              applicationStatuses[assignment.applicationId] !== "Cancelado" && (
                                <Tooltip title="Reasignar encargado">
                                  <button
                                    className="Table-button Update-button"
                                    onClick={() => handleOpenEditModal(assignment)}
                                  >
                                    <FaPencilAlt />
                                  </button>
                                </Tooltip>
                              )}
                            {applicationStatuses[assignment.applicationId] !== "Realizado" &&
                              applicationStatuses[assignment.applicationId] !== "Cancelado" && (
                                <Tooltip title="Registrar detalle de mantenimiento">
                                  <button
                                    className="Table-button Asign-button"
                                    onClick={() => handleOpenTrackingModal(assignment.id)}
                                  >
                                    <MdAssignment />
                                  </button>
                                </Tooltip>
                              )}
                          </td>
                        </tr>
                      )
                    })
                  ) : (
                    <tr>
                      <td colSpan="5" className="text-center">
                        No hay datos disponibles
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
            {filteredData.length > 0 && (
              <div className="row mb-5">
                <div className="col-sm-6 d-flex align-items-center justify-content-start">
                  <div className="d-flex table-footer">
                    <TablePagination nPages={nPages} currentPages={currentPages} setCurrentPages={setCurrentPages} />
                  </div>
                </div>
                <div className="col-sm-6 d-flex align-items-center justify-content-end">
                  <small className="text-muted">
                    Mostrando {results.length} de {filteredData.length} registros
                  </small>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      <ModalAssignment show={showModal} handleClose={() => setShowModal(false)} onAssignmentCreated={getAssignment} />
      <ModalAssignmentEdit
        show={showEditModal}
        handleClose={() => setShowEditModal(false)}
        assignment={selectedAssignment}
        handleUpdate={handleUpdateAssignment}
      />
      <ModalTracking
        show={showTracking}
        handleClose={() => setShowTracking(false)}
        selectedAssignmentId={selectedAssignmentId}
        getAssignment={() => getAssignment()}
      />
      <ModalShowApplication
        show={showModalShow}
        handleClose={() => setShowModalShow(false)}
        application={selectedAssignmentShow}
      />
    </>
  )
}

export default Assignment

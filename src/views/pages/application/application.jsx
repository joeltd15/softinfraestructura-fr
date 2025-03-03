"use client"

import { useEffect, useState } from "react"
import axios from "axios"
import { FaPencilAlt } from "react-icons/fa"
import { MdDelete } from "react-icons/md"
import { FaEye } from "react-icons/fa"
import { FaCirclePlus } from "react-icons/fa6"
import ModalApplication from "./modalApplication"
import { FaUserPlus } from "react-icons/fa"
import ModalAssignment from "../asssignment/modalAssignment/index"
import ModalEditApplication from "./modalApplicationEdit/index"
import ModalShowApplication from "./ApplicationModalShow/index"
import Tooltip from "@mui/material/Tooltip"
import { Dialog, DialogActions, DialogContent, DialogTitle, Button } from "@mui/material"
import { toast } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import DateRangeModal from "./DownloadReports/DateRangeModal"
import fetchFilteredData from "./DownloadReports/fetchFilteredData.jsx"
import ApplicationPDF from "./DownloadReports/generatePDF"
import { pdf } from "@react-pdf/renderer"
import TablePagination from "../../../components/Paginator/index.jsx"
import { FaVoteYea } from "react-icons/fa"
import ModalTrackingView from "./../tracking/modalTrackingShow/index.jsx"

const Application = () => {
  const url = "http://localhost:2025/api/application"
  const urlUsers = "http://localhost:2025/api/user"
  const [Users, setUsers] = useState([])
  const [applications, setApplication] = useState([])
  const [show, setShow] = useState(false)
  const [showAssign, setShowAssign] = useState(false)
  const [showModalEdit, setShowModalEdit] = useState(false)
  const [selectedApplication, setSelectedApplication] = useState(null)
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false)
  const [selectedId, setSelectedId] = useState(null)
  const [selectId, setSelectId] = useState(null)
  const [showModal, setShowModal] = useState(false)
  const [dateRangeModalOpen, setDateRangeModalOpen] = useState(false)
  const [search, setSearch] = useState("")
  const [dataQt, setDataQt] = useState(4)
  const [currentPages, setCurrentPages] = useState(1)
  const [showTrackingModal, setShowTrackingModal] = useState(false)
  const [selectedTracking, setSelectedTracking] = useState(null)

  useEffect(() => {
    getApplications()
    getUsers()
  }, [])

  //Buscador y paginador
  const searcher = (e) => {
    setSearch(e.target.value)
    console.log(e.target.value)
  }

  const indexEnd = currentPages * dataQt
  const indexStart = indexEnd - dataQt

  const nPages = Math.ceil(applications.length / dataQt)

  let results = []
  if (!search) {
    results = applications.slice(indexStart, indexEnd)
  } else {
    results = applications.filter((dato) => {
      const searchTerm = search.toLowerCase()
      return (
        dato.news.toLowerCase().includes(searchTerm) ||
        dato.dependence.toLowerCase().includes(searchTerm) ||
        dato.reportDate.toString().includes(searchTerm) ||
        dato.location.toLowerCase().includes(searchTerm) ||
        dato.reportType.toLowerCase().includes(searchTerm) ||
        dato.status.toString().includes(searchTerm)
      )
    })
  }

  const getApplications = async () => {
    try {
      const [applicationsResponse, assignmentsResponse] = await Promise.all([
        axios.get(url),
        axios.get("http://localhost:2025/api/assignment"),
      ])

      const applicationsData = applicationsResponse.data
      const assignmentsData = assignmentsResponse.data
      const user = JSON.parse(localStorage.getItem("user")) // Obtiene el usuario logueado
      if (!user) return

      let filteredApplications = []

      if (user.roleId === 1) {
        // Si es admin, ve todas las aplicaciones
        filteredApplications = applicationsData
      } else if (user.roleId === 2) {
        // Si es responsable, filtra por asignaciones
        const assignedApps = assignmentsData
          .filter((assignment) => assignment.responsibleId === user.id)
          .map((assignment) => assignment.applicationId)
        filteredApplications = applicationsData.filter((app) => assignedApps.includes(app.id))
      } else if (user.roleId === 3) {
        // Si es usuario normal, solo ve las aplicaciones que él creó
        filteredApplications = applicationsData.filter((app) => app.userId === user.id)
      }

      setApplication(filteredApplications)
    } catch (error) {
      console.error("Error obteniendo aplicaciones:", error)
    }
  }

  const getUsers = async () => {
    const response = await axios.get(urlUsers)
    setUsers(response.data)
  }

  const handleSolicitudCreated = () => {
    setShowAssign(false)
    getApplications()
  }

  const userName = (userId) => {
    const user = Users.find((user) => user.id === userId)
    return user ? user.name : "Desconocido"
  }

  const handleEdit = (application) => {
    setSelectedApplication(application)
    setShowModalEdit(true)
  }

  const handleShow = (application) => {
    if (!application) return
    setSelectedApplication(application)
    setShowModal(true)
  }

  const handleUpdate = (formData) => {
    if (!selectedApplication) {
      console.error("No hay una solicitud seleccionada para actualizar")
      return
    }

    axios
      .put(`http://localhost:2025/api/application/${selectedApplication.id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      })
      .then((response) => {
        console.log("Respuesta del servidor:", response.data)
        getApplications()
        setShowModalEdit(false)
      })
      .catch((error) => {
        console.error("Error al actualizar la solicitud:", error.response ? error.response.data : error.message)
      })
  }

  const handleOpenDeleteDialog = (id) => {
    setSelectedId(id)
    setOpenDeleteDialog(true)
  }

  const handleCloseDeleteDialog = () => {
    setOpenDeleteDialog(false)
    setSelectedId(null)
  }

  const handleConfirmDelete = () => {
    if (!selectedId) return

    axios
      .delete(`${url}/${selectedId}`)
      .then(() => {
        toast.success("El registro ha sido eliminado.")
        getApplications()

        // Verifica si la página actual está vacía
        const indexEnd = currentPages * dataQt
        const indexStart = indexEnd - dataQt
        const remainingItems = applications.slice(indexStart, indexEnd).length - 1

        // Si no quedan elementos en la página actual, retrocede una página
        if (remainingItems === 0 && currentPages > 1) {
          setCurrentPages(currentPages - 1)
        }
      })
      .catch((error) => {
        toast.error("No se pudo eliminar el registro.")
        console.error("Error al eliminar:", error)
      })
      .finally(() => handleCloseDeleteDialog())
  }

  const user = JSON.parse(localStorage.getItem("user"))

  const handleDownloadReport = async (startDate, endDate) => {
    try {
      const data = await fetchFilteredData(startDate, endDate)
      if (data.length === 0) {
        toast.info("No hay datos para el rango de fechas seleccionado.")
        return
      }

      const pdfDoc = <ApplicationPDF applications={data} />
      const asPdf = pdf([])
      asPdf.updateContainer(pdfDoc)
      const blob = await asPdf.toBlob()
      const url = URL.createObjectURL(blob)
      const link = document.createElement("a")
      link.href = url
      link.download = `informe_aplicaciones_${startDate}_${endDate}.pdf`
      link.click()
      URL.revokeObjectURL(url)

      toast.success("El informe se ha descargado correctamente.")
    } catch (error) {
      console.error("Error al generar el informe:", error)
      toast.error("Error al generar el informe.")
    }
  }

  const handleShowTracking = async (applicationId) => {
    try {
      // Obtener todas las asignaciones
      const assignmentsResponse = await axios.get("http://localhost:2025/api/assignment")
      const assignments = assignmentsResponse.data

      // Buscar la asignación relacionada con esta applicationId
      const assignment = assignments.find((a) => a.applicationId === applicationId)

      if (!assignment) {
        toast.info("No se encontró asignación para esta solicitud.")
        return
      }

      // Ahora obtener el tracking con el assignmentId encontrado
      const trackingResponse = await axios.get("http://localhost:2025/api/tracking")
      const trackings = trackingResponse.data
      const tracking = trackings.find((t) => t.assignmentId === assignment.id)

      if (tracking) {
        setSelectedTracking(tracking)
        setShowTrackingModal(true)
      } else {
        toast.info("No se encontró seguimiento para esta solicitud.")
      }
    } catch (error) {
      console.error("Error al obtener el seguimiento:", error)
      if (error.response) {
        console.error("Respuesta del servidor:", error.response.data)
        console.error("Estado HTTP:", error.response.status)
      }
      toast.error("Error al cargar el seguimiento. Por favor, intente de nuevo más tarde.")
    }
  }

  return (
    <>
      <div className="container">
        <div className="row">
          <div className="panel panel-primary filterable">
            <div className="panel-heading mb-3">
              <div className="row w-100">
                {/* Columna izquierda - Botón de registro */}
                <div className="col-12 col-md-6 d-flex align-items-center justify-content-center justify-content-md-start mb-3 mb-md-0">
                  <button className="Register-button Button-save" onClick={() => setShow(true)}>
                    <FaCirclePlus /> Registrar
                  </button>
                </div>

                <div className="col-12 col-md-6 d-flex align-items-center justify-content-center justify-content-md-end">
                  <div className="d-flex align-items-center flex-wrap justify-content-center justify-content-md-end">
                    <Tooltip title="Descargar informes" arrow>
                      <button className="Btn-download me-3 mb-2 mb-sm-0" onClick={() => setDateRangeModalOpen(true)}>
                        <svg
                          className="svgIcon-download"
                          viewBox="0 0 384 512"
                          height="1em"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path d="M169.4 470.6c12.5 12.5 32.8 12.5 45.3 0l160-160c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L224 370.8 224 64c0-17.7-14.3-32-32-32s-32 14.3-32 32l0 306.7L54.6 265.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l160 160z"></path>
                        </svg>
                        <span className="icon2-download"></span>
                      </button>
                    </Tooltip>
                    <div className="group">
                      <svg className="icon-search" aria-hidden="true" viewBox="0 0 24 24">
                        <g>
                          <path d="M21.53 20.47l-3.66-3.66C19.195 15.24 20 13.214 20 11c0-4.97-4.03-9-9-9s-9 4.03-9 9 4.03 9 9 9c2.215 0 4.24-.804 5.808-2.13l3.66 3.66c.147.146.34.22.53.22s.385-.073.53-.22c.295-.293.295-.767.002-1.06zM3.5 11c0-4.135 3.365-7.5 7.5-7.5s7.5 3.365 7.5 7.5-3.365 7.5-7.5 7.5-7.5-3.365-7.5-7.5z"></path>
                        </g>
                      </svg>
                      <input
                        placeholder="Buscar"
                        value={search}
                        onChange={searcher}
                        type="search"
                        className="input-search"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="table-responsive">
              <table class="table">
                <thead className="thead">
                  <tr>
                    <th>Código</th>
                    <th>Fecha del reporte</th>
                    <th>Centro/dependencia</th>
                    <th>Lugar</th>
                    <th>Detalles</th>
                    <th>Evidencia</th>
                    <th>Tipo de reporte</th>
                    <th>Estado</th>
                    <th>Usuario</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody className="tbody">
                  {results.length > 0 ? (
                    results.map((application, i) => (
                      <tr key={application.id}>
                        <td>{application.id}</td>
                        <td>{new Date(application.reportDate).toISOString().split("T")[0]}</td>
                        <td>{application.dependence}</td>
                        <td>{application.location}</td>
                        <td>{application.news}</td>
                        <td>
                          <img
                            src={
                              application.photographicEvidence && application.photographicEvidence.trim() !== ""
                                ? `http://localhost:2025/uploads/${application.photographicEvidence}`
                                : "/noImage.png"
                            }
                            alt=""
                          />
                        </td>
                        <td>{application.reportType}</td>
                        <td>{application.status}</td>
                        <td>{userName(application.userId)}</td>
                        <td className="content-buttons">
                          <Tooltip title="Ver detalles de la solicitud">
                            <button className="Table-button Show-button" onClick={() => handleShow(application)}>
                              <FaEye />
                            </button>
                          </Tooltip>
                          {application.status === "Realizado" && (
                            <Tooltip title="Ver detalle del mantenimiento">
                              <button className="Table-button" onClick={() => handleShowTracking(application.id)}>
                                <FaVoteYea />
                              </button>
                            </Tooltip>
                          )}
                          {application.status !== "Realizado" && (
                            <>
                              <Tooltip title="Editar solicitud">
                                <button className="Table-button Update-button" onClick={() => handleEdit(application)}>
                                  <FaPencilAlt />
                                </button>
                              </Tooltip>
                              <Tooltip title="Eliminar solicitud">
                                <button
                                  className="Table-button Delete-button"
                                  onClick={() => handleOpenDeleteDialog(application.id)}
                                >
                                  <MdDelete />
                                </button>
                              </Tooltip>
                            </>
                          )}

                          {application.status !== "Asignada" &&
                            application.status !== "Realizado" &&
                            application.status != "En espera por falta de material" &&
                            user.roleId == 1 && (
                              <Tooltip title="Asignar encargado">
                                <button
                                  className="Table-button Asign-button"
                                  onClick={() => {
                                    console.log("Asignando ID:", application.id)
                                    setShowAssign(true)
                                    setSelectId(application.id)
                                  }}
                                >
                                  <FaUserPlus />
                                </button>
                              </Tooltip>
                            )}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={10} className="text-center">
                        No hay solicitudes disponibles
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
            {results.length > 0 ? (
              <div className="row mb-5">
                <div className="col-sm-6 d-flex align-items-center justify-content-start">
                  <div className="d-flex table-footer">
                    <TablePagination nPages={nPages} currentPages={currentPages} setCurrentPages={setCurrentPages} />
                  </div>
                </div>
              </div>
            ) : (
              <div className="d-flex table-footer"></div>
            )}
          </div>
        </div>
      </div>
      {/* Modal */}
      <ModalApplication show={show} handleClose={() => setShow(false)} onSolicitudCreated={handleSolicitudCreated} />
      {/* Modal Asignamiento*/}
      <ModalAssignment
        show={showAssign}
        handleClose={() => setShowAssign(false)}
        onAssignmentCreated={handleSolicitudCreated}
        assignmentApplication={selectId}
      />
      <ModalEditApplication
        show={showModalEdit}
        handleClose={() => setShowModalEdit(false)}
        application={selectedApplication}
        handleUpdate={handleUpdate}
      />
      <ModalShowApplication
        show={showModal}
        handleClose={() => setShowModal(false)}
        application={selectedApplication}
        userName={selectedApplication ? userName(selectedApplication.userId) : ""}
      />
      {/* Diálogo de Confirmación de Eliminación */}
      <Dialog open={openDeleteDialog} onClose={handleCloseDeleteDialog}>
        <DialogTitle>¿Estás seguro?</DialogTitle>
        <DialogContent>Esta acción no se puede deshacer.</DialogContent>
        <DialogActions>
          <Button className="buttons-form Button-blue" onClick={handleCloseDeleteDialog}>
            Cancelar
          </Button>
          <Button className="buttons-form Button-next" onClick={handleConfirmDelete}>
            Eliminar
          </Button>
        </DialogActions>
      </Dialog>
      <DateRangeModal
        open={dateRangeModalOpen}
        onClose={() => setDateRangeModalOpen(false)}
        onConfirm={handleDownloadReport}
      />
      <ModalTrackingView
        show={showTrackingModal}
        handleClose={() => setShowTrackingModal(false)}
        tracking={selectedTracking}
      />
    </>
  )
}
export default Application
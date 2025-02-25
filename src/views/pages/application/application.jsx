import { useEffect, useState } from "react"
import axios from "axios"
import { FaPencilAlt, FaEye, FaUserPlus, FaVoteYea } from "react-icons/fa"
import { FaPlusCircle } from "react-icons/fa"
import { MdDelete } from "react-icons/md"
import ModalApplication from "./modalApplication"
import ModalAssignment from "../asssignment/modalAssignment/index"
import ModalEditApplication from "./modalApplicationEdit/index"
import ModalShowApplication from "./ApplicationModalShow/index"
import ModalTrackingView from "../tracking/modalTrackingShow/index"
import Tooltip from "@mui/material/Tooltip"
import { Dialog, DialogActions, DialogContent, DialogTitle, Button } from "@mui/material"
import { toast } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import DateRangeModal from "./DownloadReports/DateRangeModal"
import fetchFilteredData from "./DownloadReports/fetchFilteredData"
import ApplicationPDF from "./DownloadReports/generatePDF"
import { pdf } from "@react-pdf/renderer"
import TablePagination from "../../../components/Paginator/index"
import { useAlert } from '../../../assets/functions/index';

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
    const [dataQt] = useState(4)
    const [currentPages, setCurrentPages] = useState(1)
    const [showTrackingModal, setShowTrackingModal] = useState(false)
    const [selectedTracking, setSelectedTracking] = useState(null)
    const { showAlert } = useAlert();


    useEffect(() => {
        getApplications()
        getUsers()
    }, [])

    useEffect(() => {
        return () => {
            toast.dismiss(); // Limpia todas las alertas pendientes al desmontar el componente
        };
    }, []);

    const searcher = (e) => {
        setSearch(e.target.value)
    }

    const indexEnd = currentPages * dataQt
    const indexStart = indexEnd - dataQt
    const nPages = Math.ceil(applications.length / dataQt)

    let results = []
    if (!search) {
        results = applications.slice(indexStart, indexEnd)
    } else {
        const searchTerm = search.toLowerCase()
        results = applications.filter(
            (dato) =>
                dato.news.toLowerCase().includes(searchTerm) ||
                dato.dependence.toLowerCase().includes(searchTerm) ||
                dato.reportDate.toString().includes(searchTerm) ||
                dato.location.toLowerCase().includes(searchTerm) ||
                dato.reportType.toLowerCase().includes(searchTerm) ||
                dato.status.toString().includes(searchTerm),
        )
    }

    const getApplications = async () => {
        try {
            const [applicationsResponse, assignmentsResponse] = await Promise.all([
                axios.get(url),
                axios.get("http://localhost:2025/api/assignment"),
            ])

            const applicationsData = applicationsResponse.data
            const assignmentsData = assignmentsResponse.data
            const user = JSON.parse(localStorage.getItem("user"))
            if (!user) return

            let filteredApplications = []

            if (user.roleId === 1) {
                filteredApplications = applicationsData
            } else if (user.roleId === 2) {
                const assignedApps = assignmentsData
                    .filter((assignment) => assignment.responsibleId === user.id)
                    .map((assignment) => assignment.applicationId)
                filteredApplications = applicationsData.filter((app) => assignedApps.includes(app.id))
            } else if (user.roleId === 3) {
                filteredApplications = applicationsData.filter((app) => app.userId === user.id)
            }

            setApplication(filteredApplications)
        } catch (error) {
            console.error("Error obteniendo aplicaciones:", error)
            showAlert('Error al cargar las aplicaciones.', 'error');
        }
    }

    const getUsers = async () => {
        try {
            const response = await axios.get(urlUsers)
            setUsers(response.data)
        } catch (error) {
            console.error("Error obteniendo usuarios:", error)
            showAlert('Error al cargar los usuarios', 'error');
        }
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

    const handleUpdate = async (formData) => {
        if (!selectedApplication) return

        try {
            await axios.put(`${url}/${selectedApplication.id}`, formData, {
                headers: { "Content-Type": "multipart/form-data" },
            })
            showAlert('Solicitud actualizada exitosamente', 'success');
            getApplications()
            setShowModalEdit(false)
        } catch (error) {
            console.error("Error al actualizar la solicitud:", error)
            showAlert('Error al actualizar la solicitud', 'error');
        }
    }

    const handleShowTracking = async (applicationId) => {
        try {
            const assignmentsResponse = await axios.get("http://localhost:2025/api/assignment")
            const assignments = assignmentsResponse.data
            const assignment = assignments.find((a) => a.applicationId === applicationId)

            if (!assignment) {
                showAlert('No se encontró asignación para esta solicitud.', 'info');
                return
            }

            const trackingResponse = await axios.get("http://localhost:2025/api/tracking")
            const trackings = trackingResponse.data
            const tracking = trackings.find((t) => t.assignmentId === assignment.id)

            if (tracking) {
                setSelectedTracking(tracking)
                setShowTrackingModal(true)
            } else {
                showAlert('No se encontró seguimiento para esta solicitud.', 'info');
            }
        } catch (error) {
            console.error("Error al obtener el seguimiento:", error)
            showAlert('Error al cargar el seguimiento.', 'error');
        }
    }

    const handleDownloadReport = async (startDate, endDate) => {
        try {
            const data = await fetchFilteredData(startDate, endDate)
            if (data.length === 0) {
                showAlert('No hay datos para el rango de fechas seleccionado.', 'info');
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
            showAlert('El informe se ha descargado correctamente.', 'success');
        } catch (error) {
            console.error("Error al generar el informe:", error)
            showAlert('Error al generar el informe.', 'error');
        }
    }

    const handleConfirmDelete = async () => {
        if (!selectedId) return

        try {
            await axios.delete(`${url}/${selectedId}`)
            showAlert('El registro ha sido eliminado.', 'success');
            getApplications()

            const remainingItems = applications.slice(indexStart, indexEnd).length - 1
            if (remainingItems === 0 && currentPages > 1) {
                setCurrentPages(currentPages - 1)
            }
        } catch (error) {
            console.error("Error al eliminar:", error)
            showAlert('No se pudo eliminar el registro.', 'error');
        } finally {
            setOpenDeleteDialog(false)
            setSelectedId(null)
        }
    }

    const user = JSON.parse(localStorage.getItem("user"))

    return (
        <div className="container">
            <div className="row">
                <div className="panel panel-primary filterable">
                    <div className="panel-heading mb-3 d-flex align-items-center row">
                        <div className="col-sm-6 d-flex align-items-center justify-content-start">
                            <button className="Register-button Button-save" onClick={() => setShow(true)}>
                                <FaPlusCircle /> Registrar
                            </button>
                        </div>
                        <div className="col-sm-6 d-flex align-items-center justify-content-end">
                            <Tooltip title="Descargar informes" arrow>
                                <button className="Btn-download" onClick={() => setDateRangeModalOpen(true)}>
                                    <svg
                                        className="svgIcon-download"
                                        viewBox="0 0 384 512"
                                        height="1em"
                                        xmlns="http://www.w3.org/2000/svg"
                                    >
                                        <path d="M169.4 470.6c12.5 12.5 32.8 12.5 45.3 0l160-160c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L224 370.8 224 64c0-17.7-14.3-32-32-32s-32 14.3-32 32l0 306.7L54.6 265.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l160 160z"></path>
                                    </svg>
                                </button>
                            </Tooltip>
                            <div className="group">
                                <svg className="icon-search" aria-hidden="true" viewBox="0 0 24 24">
                                    <g>
                                        <path d="M21.53 20.47l-3.66-3.66C19.195 15.24 20 13.214 20 11c0-4.97-4.03-9-9-9s-9 4.03-9 9 4.03 9 9 9c2.215 0 4.24-.804 5.808-2.13l3.66 3.66c.147.146.34.22.53.22s.385-.073.53-.22c.295-.293.295-.767.002-1.06zM3.5 11c0-4.135 3.365-7.5 7.5-7.5s7.5 3.365 7.5 7.5-3.365 7.5-7.5 7.5-7.5-3.365-7.5-7.5z"></path>
                                    </g>
                                </svg>
                                <input placeholder="Buscar" value={search} onChange={searcher} type="search" className="input-search" />
                            </div>
                        </div>
                    </div>

                    <div className="table-responsive">
                        <table className="table">
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
                                    results.map((application) => (
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
                                                                onClick={() => {
                                                                    setSelectedId(application.id)
                                                                    setOpenDeleteDialog(true)
                                                                }}
                                                            >
                                                                <MdDelete />
                                                            </button>
                                                        </Tooltip>
                                                    </>
                                                )}
                                                {application.status !== "Asignada" &&
                                                    application.status !== "Realizado" &&
                                                    application.status !== "En espera por falta de material" &&
                                                    user.roleId === 1 && (
                                                        <Tooltip title="Asignar encargado">
                                                            <button
                                                                className="Table-button Asign-button"
                                                                onClick={() => {
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

                    {results.length > 0 && (
                        <div className="row mb-5">
                            <div className="col-sm-6 d-flex align-items-center justify-content-start">
                                <div className="d-flex table-footer">
                                    <TablePagination nPages={nPages} currentPages={currentPages} setCurrentPages={setCurrentPages} />
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            <ModalApplication show={show} handleClose={() => setShow(false)} onSolicitudCreated={handleSolicitudCreated} />
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
            />
            <ModalTrackingView
                show={showTrackingModal}
                handleClose={() => setShowTrackingModal(false)}
                tracking={selectedTracking}
            />

            <Dialog open={openDeleteDialog} onClose={() => setOpenDeleteDialog(false)}>
                <DialogTitle>¿Estás seguro?</DialogTitle>
                <DialogContent>Esta acción no se puede deshacer.</DialogContent>
                <DialogActions>
                    <Button className="buttons-form Button-blue" onClick={() => setOpenDeleteDialog(false)}>
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
        </div>
    )
}

export default Application
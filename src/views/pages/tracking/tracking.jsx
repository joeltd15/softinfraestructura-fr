import { useEffect, useState } from "react"
import axios from "axios"
import { MdDelete } from "react-icons/md"
import ModalTracking from "./modalTracking"
import ModalTrackingEdit from "./modalTrackingEdit"
import ModalTrackingView from "./modalTrackingShow"
import Tooltip from "@mui/material/Tooltip"
import { Dialog, DialogActions, DialogContent, DialogTitle, Button } from "@mui/material"
import { toast } from "react-toastify";
import TablePagination from "../../../components/Paginator/index.jsx"
import { useAlert } from '../../../assets/functions/index';
import { FaEye } from "react-icons/fa";
import { FaPencilAlt } from "react-icons/fa"

const CLOUDINARY_CLOUD_NAME = "dvzjinfzq"
const Tracking = () => {
  const [trackingData, setTrackingData] = useState([])
  const [show, setShow] = useState(false)
  const [showModalEdit, setShowModalEdit] = useState(false)
  const [showModalView, setShowModalView] = useState(false)
  const [selectedTracking, setSelectedTracking] = useState(null)
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false)
  const [selectedId, setSelectedId] = useState(null)
  const [search, setSearch] = useState("")
  const [dataQt, setDataQt] = useState(4)
  const [currentPages, setCurrentPages] = useState(1)
  const [assignmentToApplicationMap, setAssignmentToApplicationMap] = useState({})
  const [loading, setLoading] = useState(true) // Added loading state
  const { showAlert } = useAlert();

  const token = localStorage.getItem("token");

  const headers = {
    Authorization: `Bearer ${token}`,
  }

  const getImageUrl = (path) => {
    if (!path || path.trim() === "") return "/noImage.png"

    // If it's already a complete URL, use it directly
    if (path.startsWith("http://") || path.startsWith("https://")) {
      // Fix duplicated URLs if they exist
      if (path.includes("https://res.cloudinary.com") && path.includes("https://res.cloudinary.com", 10)) {
        return path.replace(
          /https:\/\/res\.cloudinary\.com\/[^/]+\/image\/upload\/https:\/\/res\.cloudinary\.com\/[^/]+\/image\/upload\//,
          `https://res.cloudinary.com/${CLOUDINARY_CLOUD_NAME}/image/upload/`,
        )
      }
      return path
    }

    // If it's a relative Cloudinary path, build the complete URL
    return `https://res.cloudinary.com/${CLOUDINARY_CLOUD_NAME}/image/upload/${path}`
  }

  const getTracking = async () => {
    setLoading(true)
    try {
      const [trackingResponse, assignmentsResponse, responsiblesResponse] = await Promise.all([
        axios.get("https://softinfraestructura-gray.vercel.app/api/tracking", { headers }),
        axios.get("https://softinfraestructura-gray.vercel.app/api/assignment", { headers }),
        axios.get("https://softinfraestructura-gray.vercel.app/api/responsible", { headers }),
      ])

      const trackingData = trackingResponse.data
      const assignmentsData = assignmentsResponse.data
      const responsiblesData = responsiblesResponse.data
      const user = JSON.parse(localStorage.getItem("user"))
      if (!user) return

      const assignmentMap = {}
      assignmentsData.forEach((assignment) => {
        assignmentMap[assignment.id] = assignment.applicationId
      })
      setAssignmentToApplicationMap(assignmentMap)

      let filteredTracking = []

      if (user.roleId === 1 || user.roleId === 4)
 {
        filteredTracking = trackingData
      } else if (user.roleId === 2) {
        const userResponsibilities = responsiblesData
          .filter((responsible) => responsible.userId === user.id)
          .map((responsible) => responsible.id)

        const userAssignments = assignmentsData
          .filter((assignment) => userResponsibilities.includes(assignment.responsibleId))
          .map((assignment) => assignment.id)

        filteredTracking = trackingData.filter((tracking) => userAssignments.includes(tracking.assignmentId))
      }

      setTrackingData(filteredTracking)
    } catch (error) {
      console.error("Error al obtener los datos:", error)
      showAlert("Error al cargar los datos de seguimiento.", 'error');
    } finally {
      setLoading(false) // Set loading to false after fetching data, regardless of success or failure
    }
  }

  useEffect(() => {
    getTracking()
  }, [])

  useEffect(() => {
    return () => {
      toast.dismiss();
    };
  }, []);

  const handleEdit = (tracking) => {
    setSelectedTracking(tracking)
    setShowModalEdit(true)
  }

  const handleView = (tracking) => {
    setSelectedTracking(tracking)
    setShowModalView(true)
  }

  const handleUpdate = (formData) => {
    axios
      .put(`https://softinfraestructura-gray.vercel.app/api/tracking/${selectedTracking.id}`, formData, { headers }, {
        headers: { "Content-Type": "multipart/form-data" },
      })
      .then(() => {
        getTracking()
        setShowModalEdit(false)
      })
      .catch((error) => {
        console.error("Error al actualizar el tracking:", error.response ? error.response.data : error.message)
        showAlert("Error al actualizar el seguimiento.", 'error');

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
      .delete(`https://softinfraestructura-gray.vercel.app/api/tracking/${selectedId}`, { headers })
      .then(() => {
        showAlert("El registro ha sido eliminado.", 'success');

        getTracking()
      })
      .catch((error) => {
        showAlert("No se pudo eliminar el registro.", 'error');

        console.error("Error al eliminar:", error)
      })
      .finally(() => handleCloseDeleteDialog())
  }

  const searcher = (e) => {
    setSearch(e.target.value)
    setCurrentPages(1)
  }

  const indexEnd = currentPages * dataQt
  const indexStart = indexEnd - dataQt

  const filteredData = trackingData.filter((dato) => {
    const searchTerm = search.toLowerCase()
    return (
      dato.observations.toLowerCase().includes(searchTerm) ||
      dato.buildingMaterials.toLowerCase().includes(searchTerm) ||
      dato.dateService.toLowerCase().includes(searchTerm) ||
      dato.actionsTaken.toLowerCase().includes(searchTerm) ||
      dato.status.toLowerCase().includes(searchTerm) ||
      dato.assignmentId.toString().includes(searchTerm)
    )
  })

  const nPages = Math.ceil(filteredData.length / dataQt)
  const results = filteredData.slice(indexStart, indexEnd)

  return (
    <>
      <div className="container">
        <div className="row">
          <div className="panel panel-primary filterable">
            <div className="panel-heading mb-3 d-flex align-items-center justify-content-end">
              <div className="col-sm-6 d-flex align-items-center justify-content-end">
                <div className="group">
                  <svg className="icon-search" aria-hidden="true" viewBox="0 0 24 24">
                    <g>
                      <path d="M21.53 20.47l-3.66-3.66C19.195 15.24 20 13.214 20 11c0-4.97-4.03-9-9-9s-9 4.03-9 9 4.03 9 9 9c2.215 0 4.24-.804 5.808-2.13l3.66 3.66c.147.146.34.22.53.22s.385-.073.53-.22c.295-.293.295-.767.002-1.06zM3.5 11c0-4.135 3.365-7.5 7.5-7.5s7.5 3.365 7.5 7.5-3.365 7.5-7.5 7.5-7.5-3.365-7.5-7.5z"></path>
                    </g>
                  </svg>
                  <input
                    placeholder="Buscar"
                    type="search"
                    className="input-search"
                    value={search}
                    onChange={searcher}
                  />
                </div>
              </div>
            </div>
            <div className="table-responsive">
              <table className="table">
                <thead className="thead">
                  <tr className="filters">
                    <th>#</th>
                    <th>Observaciones</th>
                    <th>Materiales</th>
                    <th>Fecha del Servicio</th>
                    <th>Acciones Tomadas</th>
                    <th>Evidencia Fotográfica</th>
                    <th>Estado</th>
                    <th>Código de la solicitud</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody className="tbody">
                  {loading ? (
                    <tr>
                      <td colSpan="9" className="text-center">
                        Cargando...
                      </td>
                    </tr>
                  ) : results.length > 0 ? (
                    results.map((tracking, i) => (
                      <tr key={i}>
                        <td>{indexStart + i + 1}</td>
                        <td>{tracking.observations}</td>
                        <td>{tracking.buildingMaterials}</td>
                        <td>{tracking.dateService}</td>
                        <td>{tracking.actionsTaken}</td>
                        <td>
                          <img
                            src={getImageUrl(tracking.photographicEvidence) || "/placeholder.svg"}
                            width="80"
                            className="hover-zoom"
                            alt="Evidencia fotográfica"
                            onError={(e) => {
                              e.target.onerror = null
                              e.target.src = "/noImage.png"
                            }}
                          />
                        </td>
                        <td>{tracking.status}</td>
                        <td>{assignmentToApplicationMap[tracking.assignmentId] || "N/A"}</td>
                        <td className="content-buttons">
                          <Tooltip title="Ver detalles del seguimiento">
                            <button className="Table-button Show-button" onClick={() => handleView(tracking)}>
                              <FaEye />
                            </button>
                          </Tooltip>
                          {tracking.status !== "Realizado" && (
                            <>
                              <Tooltip title="Actualizar el seguimiento">
                                <button className="Table-button Update-button" onClick={() => handleEdit(tracking)}>
                                  <FaPencilAlt />
                                </button>
                              </Tooltip>
                              <Tooltip title="Eliminar el seguimiento">
                                <button
                                  className="Table-button Delete-button"
                                  onClick={() => handleOpenDeleteDialog(tracking.id)}
                                >
                                  <MdDelete />
                                </button>
                              </Tooltip>
                            </>
                          )}

                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="9" className="text-center">
                        No hay datos disponibles
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
      </div>

      {/* Diálogo de confirmación de eliminación */}
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

      {/* Modales */}
      <ModalTracking show={show} handleClose={() => setShow(false)} onSolicitudCreated={getTracking} />
      <ModalTrackingEdit
        show={showModalEdit}
        handleClose={() => setShowModalEdit(false)}
        tracking={selectedTracking}
        handleUpdate={handleUpdate}
      />
      <ModalTrackingView show={showModalView} handleClose={() => setShowModalView(false)} tracking={selectedTracking} />
    </>
  )
}

export default Tracking
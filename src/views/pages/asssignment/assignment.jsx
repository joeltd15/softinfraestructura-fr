"use client"

import { useEffect, useState } from "react"
import axios from "axios"
import ModalAssignment from "./modalAssignment/index"
import ModalAssignmentEdit from "./modalAssignmentEdit/index"
import { ToastContainer, toast } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import { FaPencilAlt } from "react-icons/fa"
import { MdAssignment } from "react-icons/md"
import Tooltip from "@mui/material/Tooltip"
import ModalTracking from "../tracking/modalTracking/index"
import ModalShowApplication from "../application/ApplicationModalShow/index"
import { FaEye } from "react-icons/fa"
import { FaFilePdf } from "react-icons/fa"
import DocumentPdf from "../application/DocumentPdf/index"
import { pdf } from "@react-pdf/renderer"
import { saveAs } from "file-saver"
import TablePagination from "../../../components/Paginator/index.jsx"

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

  useEffect(() => {
    getAssignment()
    getUsers()
  }, [])

  useEffect(() => {
    if (selectedAssignmentShow && showApplicationId) {
      console.log("Datos listos para generar el PDF")
    }
  }, [selectedAssignmentShow, showApplicationId])

  const getAssignment = async () => {
    try {
      const [assignmentsResponse, responsiblesResponse, applicationsResponse] = await Promise.all([
        axios.get("http://localhost:2025/api/assignment"),
        axios.get("http://localhost:2025/api/responsible"),
        axios.get("http://localhost:2025/api/application"),
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

      if (user.roleId === 1) {
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
      toast.error("Error al cargar las asignaciones")
    }
  }

  const handleShow = async (applicationId) => {
    try {
      const response = await axios.get(`http://localhost:2025/api/application/${applicationId}`)
      setSelectedAssignmentShow(response.data)
      setShowModalShow(true)
    } catch (error) {
      console.error("Error al obtener los detalles de la solicitud:", error)
      toast.error("Error al cargar los detalles de la solicitud")
    }
  }

  const handlePdf = async (applicationId) => {
    try {
      const response = await axios.get(`http://localhost:2025/api/application/${applicationId}`)
      setSelectedAssignmentShow(response.data)
      setShowApplicationId(applicationId)
    } catch (error) {
      console.error("Error al obtener los detalles de la solicitud:", error)
      toast.error("Error al cargar los detalles de la solicitud")
    }
  }

  const getUsers = async () => {
    try {
      const response = await axios.get("http://localhost:2025/api/user")
      setUsers(response.data)
    } catch (error) {
      console.error("Error al obtener los usuarios:", error)
      toast.error("Error al cargar los usuarios")
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
      await axios.put(`http://localhost:2025/api/assignment/${updatedAssignment.id}`, updatedAssignment)
      toast.success("Asignación actualizada con éxito")
      getAssignment()
      setShowEditModal(false)
    } catch (error) {
      console.error("Error al actualizar la asignación:", error)
      toast.error("Error al actualizar la asignación")
    }
  }

  const user = JSON.parse(localStorage.getItem("user"))

  const handlePdfDownload = async (applicationId) => {
    try {
      const response = await axios.get(`http://localhost:2025/api/application/${applicationId}`)
      setSelectedAssignmentShow(response.data)

      const doc = <DocumentPdf Application={response.data} />
      const asPdf = pdf([])
      asPdf.updateContainer(doc)
      const blob = await asPdf.toBlob()

      saveAs(blob, `DetalleReporte${applicationId}.pdf`)
    } catch (error) {
      console.error("Error al obtener los detalles de la solicitud:", error)
      toast.error("Error al generar el PDF")
    }
  }

  const searcher = (e) => {
    setSearch(e.target.value)
    console.log(e.target.value)
  }

  const indexEnd = currentPages * dataQt
  const indexStart = indexEnd - dataQt

  const nPages = Math.ceil(assignmentData.length / dataQt)

  let results = []
  if (!search) {
    results = assignmentData.slice(indexStart, indexEnd)
  } else {
    results = assignmentData.filter((dato) => {
      const searchTerm = search.toLowerCase()
      return (
        dato.id.toString().includes(searchTerm) ||
        dato.assignmentDate.toLowerCase().includes(searchTerm) ||
        dato.applicationId.toString().includes(searchTerm) ||
        (responsibles.find((resp) => resp.id === dato.responsibleId)?.userId || "").toString().includes(searchTerm)
      )
    })
  }

  return (
    <>
      <ToastContainer position="top-right" autoClose={3000} />
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
                    value={search}
                    onChange={searcher}
                    type="search"
                    className="input-search"
                  />
                </div>
              </div>
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
                        <td>{indexStart + i+ 1}</td>
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

                          {user.roleId == "1" && (
                            <>
                            {applicationStatuses[assignment.applicationId] !== "Realizado" && (
                              <Tooltip title="Reasignar encargado">
                                <button
                                  className="Table-button Update-button"
                                  onClick={() => handleOpenEditModal(assignment)}
                                >
                                  <FaPencilAlt />
                                </button>
                              </Tooltip>
                                )}
                            </> 
                          )}
                          {applicationStatuses[assignment.applicationId] !== "Realizado" && (
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
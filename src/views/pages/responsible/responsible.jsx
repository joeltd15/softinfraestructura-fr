import { useState, useEffect } from "react"
import axios from "axios"
import {  toast } from "react-toastify"
import { useAlert } from '../../../assets/functions/index.jsx';
import { FaPencilAlt, FaEye } from "react-icons/fa"
import { MdDelete } from "react-icons/md"
import Tooltip from "@mui/material/Tooltip"
import { FaCirclePlus } from "react-icons/fa6"
import { Dialog, DialogActions, DialogContent, DialogTitle, Button } from "@mui/material"
import RegisterResponsibleModal from "./modalResponsible/index"
import EditResponsibleModal from "./modalResponsibleEdit/index"
import ShowResponsibleModal from "./responsibleModalShow/index"
import TablePagination from "../../../components/Paginator/index.jsx"

const Responsible = () => {
  const [responsibles, setResponsibles] = useState([])
  const [users, setUsers] = useState([])
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false)
  const [selectedId, setSelectedId] = useState(null)
  const [openRegisterModal, setOpenRegisterModal] = useState(false)
  const [openEditModal, setOpenEditModal] = useState(false)
  const [selectedResponsible, setSelectedResponsible] = useState(null)
  const [openShowModal, setOpenShowModal] = useState(false)
  const [selectedResponsibleShow, setSelectedResponsibleShow] = useState(null)
  const [search, setSearch] = useState("")
  const [dataQt, setDataQt] = useState(4)
  const [currentPages, setCurrentPages] = useState(1)
  const { showAlert } = useAlert();

  useEffect(() => {
    return () => {
      toast.dismiss();
    };
  }, []);

  useEffect(() => {
    getResponsibles()
    getUsers()
  }, [])

  const getResponsibles = async () => {
    try {
      const response = await axios.get("https://softinfraestructura-a6yl4j3yy-joeltuiran15-gmailcoms-projects.vercel.app/api/responsible")
      console.log("Datos obtenidos de responsables:", response.data)
      setResponsibles(response.data)
    } catch (error) {
      console.error("Error al obtener los responsables:", error)
    }
  }

  const getUsers = async () => {
    try {
      const response = await axios.get("https://softinfraestructura-a6yl4j3yy-joeltuiran15-gmailcoms-projects.vercel.app/api/user")
      setUsers(response.data)
    } catch (error) {
      console.error("Error al obtener los usuarios:", error)
    }
  }

  const handleOpenDeleteDialog = (id) => {
    setSelectedId(id)
    setOpenDeleteDialog(true)
  }

  const handleCloseDeleteDialog = () => {
    setOpenDeleteDialog(false)
    setSelectedId(null)
  }

  const handleConfirmDelete = async () => {
    if (!selectedId) return

    try {
      await axios.delete(`https://softinfraestructura-a6yl4j3yy-joeltuiran15-gmailcoms-projects.vercel.app/api/responsible/${selectedId}`)
      showAlert("Responsable eliminado correctamente.", 'success');
      getResponsibles()
    } catch (error) {
      showAlert("Error al eliminar el responsable.", 'error');
      console.error("Error al eliminar:", error)
    } finally {
      handleCloseDeleteDialog()
    }
  }

  const handleOpenRegisterModal = () => {
    setOpenRegisterModal(true)
  }

  const handleCloseRegisterModal = () => {
    setOpenRegisterModal(false)
  }

  const handleOpenEditModal = (responsible) => {
    setSelectedResponsible(responsible)
    setOpenEditModal(true)
  }

  const handleCloseEditModal = () => {
    setOpenEditModal(false)
    setSelectedResponsible(null)
  }

  const handleOpenShowModal = (responsible) => {
    setSelectedResponsibleShow(responsible)
    setOpenShowModal(true)
  }

  const handleCloseShowModal = () => {
    setOpenShowModal(false)
    setSelectedResponsibleShow(null)
  }

  const searcher = (e) => {
    setSearch(e.target.value)
    console.log(e.target.value)
  }

  const indexEnd = currentPages * dataQt
  const indexStart = indexEnd - dataQt

  const nPages = Math.ceil(responsibles.length / dataQt)

  let results = []
  if (!search) {
    results = responsibles.slice(indexStart, indexEnd)
  } else {
    results = responsibles.filter((responsible) => {
      const searchTerm = search.toLowerCase()
      const user = users.find((user) => user.id === responsible.userId)
      return (
        responsible.id.toString().includes(searchTerm) ||
        (responsible.Responsibilities &&
          responsible.Responsibilities.some((r) => r.name.toLowerCase().includes(searchTerm))) ||
        (user && user.name.toLowerCase().includes(searchTerm))
      )
    })
  }

  return (
    <>
      <div className="container">
        <div className="row">
          <div className="panel panel-primary filterable">
            <div className="panel-heading mb-3 d-flex align-items-center justify-content-between">
              <button className="Register-button Button-save" onClick={handleOpenRegisterModal}>
                <FaCirclePlus /> Registrar
              </button>
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
                  <th>Actividad</th>
                  <th>Nombre T.O</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody className="tbody">
                {results.length > 0 ? (
                  results.map((responsible, i) => {
                    const user = users.find((user) => user.id === responsible.userId)
                    return (
                      <tr key={i}>
                        <td>{indexStart + i + 1}</td>
                        <td>
                          {responsible.Responsibilities && responsible.Responsibilities.length > 0
                            ? responsible.Responsibilities.map((r) => r.name).join(", ")
                            : "Sin responsabilidades"}
                        </td>
                        <td>{user ? user.name : "Desconocido"}</td>
                        <td className="content-buttons-responsibles">
                        <Tooltip title="Ver detalle">

                          <button className="Table-button Show-button" onClick={() => handleOpenShowModal(responsible)}>
                            <FaEye />
                          </button>
                          </Tooltip>

                          <Tooltip title="Editar">
                            <button
                              className="Table-button Update-button"
                              onClick={() => handleOpenEditModal(responsible)}
                            >
                              <FaPencilAlt />
                            </button>
                          </Tooltip>

                          <Tooltip title="Eliminar">
                            <button
                              className="Table-button Delete-button"
                              onClick={() => handleOpenDeleteDialog(responsible.id)}
                            >
                              <MdDelete />
                            </button>
                          </Tooltip>
                        </td>
                      </tr>
                    )
                  })
                ) : (
                  <tr>
                    <td colSpan="4" className="text-center">
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

      <Dialog open={openDeleteDialog} onClose={handleCloseDeleteDialog}>
        <DialogTitle>Confirmar eliminación</DialogTitle>
        <DialogContent>¿Estás seguro de que deseas eliminar este responsable?</DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDeleteDialog} className="buttons-form Button-blue">
            Cancelar
          </Button>
          <Button onClick={handleConfirmDelete} className="buttons-form Button-next">
            Eliminar
          </Button>
        </DialogActions>
      </Dialog>

      <RegisterResponsibleModal
        show={openRegisterModal}
        handleClose={handleCloseRegisterModal}
        onResponsibleCreated={getResponsibles}
      />
      <EditResponsibleModal
        show={openEditModal}
        handleClose={handleCloseEditModal}
        onResponsibleUpdated={getResponsibles}
        responsible={selectedResponsible}
      />
      <ShowResponsibleModal
        show={openShowModal}
        handleClose={handleCloseShowModal}
        responsible={selectedResponsibleShow}
        users={users}
      />
    </>
  )
}

export default Responsible
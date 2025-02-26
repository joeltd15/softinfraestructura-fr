import { useState, useEffect } from "react"
import axios from "axios"
import {ToastContainer} from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import { FaPencilAlt } from "react-icons/fa"
import { MdDelete } from "react-icons/md"
import Tooltip from "@mui/material/Tooltip"
import { FaCirclePlus } from "react-icons/fa6"
import { Dialog, DialogActions, DialogContent, DialogTitle, Button } from "@mui/material"
import RegisterRoleModal from "./modalRole/index"
import EditRoleModal from "./modalRoleEdit/index"
import TablePagination from "../../../components/Paginator/index.jsx"
import { useAlert } from '../../../assets/functions/index';


const Roles = () => {
  const [roles, setRoles] = useState([])
  const [showModal, setShowModal] = useState(false)
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false)
  const [selectedId, setSelectedId] = useState(null)
  const [roleToEdit, setRoleToEdit] = useState(null)
  const [showEditModal, setShowEditModal] = useState(false)
  const [search, setSearch] = useState("")
  const [dataQt, setDataQt] = useState(4)
  const [currentPages, setCurrentPages] = useState(1)
  const { showAlert } = useAlert();

  useEffect(() => {
    getRoles()
  }, [])

  const getRoles = async () => {
    try {
      const response = await axios.get("http://localhost:2025/api/role")
      setRoles(response.data)
    } catch (error) {
      console.error("Error al obtener los roles:", error)
      showAlert("Error al obtener los roles.", "error");
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
      await axios.delete(`http://localhost:2025/api/role/${selectedId}`)
      showAlert("Rol eliminado correctamente.", "success");
      getRoles()
    } catch (error) {
      showAlert("Error al eliminar el rol.", "error");

      console.error("Error al eliminar:", error)
    } finally {
      handleCloseDeleteDialog()
    }
  }

  const handleOpenEditModal = async (role) => {
    if (!role || !role.id) {
      showAlert("Error: No se pudo cargar el rol para edición.", "error");
      return
    }

    try {
      const [roleResponse, permissionRoleResponse] = await Promise.all([
        axios.get(`http://localhost:2025/api/role/${role.id}`),
        axios.get(`http://localhost:2025/api/permissionRole?roleId=${role.id}`),
      ])

      const roleData = roleResponse.data
      const permissionRoles = permissionRoleResponse.data

      const roleWithPermissions = {
        ...roleData,
        permissions: permissionRoles.map((pr) => ({ id: pr.permissionId })),
      }

      console.log("Rol con permisos asignados:", roleWithPermissions)

      setRoleToEdit(roleWithPermissions)
      setShowEditModal(true)
    } catch (error) {
      console.error("Error al obtener el rol:", error)
      showAlert("Error al obtener el rol.", "error");

    }
  }

  const handleCloseEditModal = () => {
    setShowEditModal(false)
    setRoleToEdit(null)
  }

  const searcher = (e) => {
    setSearch(e.target.value)
    console.log(e.target.value)
  }

  const indexEnd = currentPages * dataQt
  const indexStart = indexEnd - dataQt

  const nPages = Math.ceil(roles.length / dataQt)

  let results = []
  if (!search) {
    results = roles.slice(indexStart, indexEnd)
  } else {
    results = roles.filter((role) => {
      const searchTerm = search.toLowerCase()
      return role.id.toString().includes(searchTerm) || role.name.toLowerCase().includes(searchTerm)
    })
  }

  return (
    <div className="container">
      <ToastContainer position="top-right" autoClose={3000} />
      <div className="row">
        <div className="panel panel-primary filterable">
          <div className="panel-heading mb-3 d-flex align-items-center justify-content-between">
            <button className="Register-button Button-save" onClick={() => setShowModal(true)}>
              <FaCirclePlus /> Registrar
            </button>
            <div className="col-sm-6 d-flex align-items-center justify-content-end">
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
                <tr className="filters">
                  <th>#</th>
                  <th>Nombre del rol</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody className="tbody">
                {results.length > 0 ? (
                  results.map((role, i) => (
                    <tr key={i}>
                      <td>{indexStart + i + 1}</td>
                      <td>{role.name}</td>
                      <td className="content-buttons">
                        <Tooltip title="Editar">
                          <button className="Table-button Update-button" onClick={() => handleOpenEditModal(role)}>
                            <FaPencilAlt />
                          </button>
                        </Tooltip>
                        <Tooltip title="Eliminar">
                          <button className="Table-button Delete-button" onClick={() => handleOpenDeleteDialog(role.id)}>
                            <MdDelete />
                          </button>
                        </Tooltip>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="3" className="text-center">
                      No hay roles disponibles
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

      <Dialog open={openDeleteDialog} onClose={handleCloseDeleteDialog}>
        <DialogTitle>Confirmar eliminación</DialogTitle>
        <DialogContent>¿Estás seguro de que deseas eliminar este rol?</DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDeleteDialog} className="buttons-form Button-blue">
            Cancelar
          </Button>
          <Button onClick={handleConfirmDelete} className="buttons-form Button-next">
            Eliminar
          </Button>
        </DialogActions>
      </Dialog>

      <RegisterRoleModal show={showModal} handleClose={() => setShowModal(false)} onRoleCreated={getRoles} />
      <EditRoleModal
        show={showEditModal}
        handleClose={handleCloseEditModal}
        onRoleUpdated={getRoles}
        role={roleToEdit}
      />
    </div>
  )
}

export default Roles
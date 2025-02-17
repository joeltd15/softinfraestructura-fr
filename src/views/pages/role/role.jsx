import { useState, useEffect } from "react"
import axios from "axios"
import { ToastContainer, toast } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import { FaPencilAlt, FaEye } from "react-icons/fa"
import { MdDelete } from "react-icons/md"
import Tooltip from "@mui/material/Tooltip"
import { FaCirclePlus } from "react-icons/fa6"
import { Dialog, DialogActions, DialogContent, DialogTitle, Button } from "@mui/material"
import RegisterRoleModal from "./modalRole/index"
import EditRoleModal from "./modalRoleEdit/index"

const Roles = () => {
    const [roles, setRoles] = useState([])
    const [showModal, setShowModal] = useState(false)
    const [openDeleteDialog, setOpenDeleteDialog] = useState(false)
    const [selectedId, setSelectedId] = useState(null)
    const [roleToEdit, setRoleToEdit] = useState(null)
    const [showEditModal, setShowEditModal] = useState(false)

    useEffect(() => {
        getRoles()
    }, [])

    const getRoles = async () => {
        try {
            const response = await axios.get("http://localhost:2025/api/role")
            setRoles(response.data)
        } catch (error) {
            console.error("Error al obtener los roles:", error)
            toast.error("Error al obtener los roles.")
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
            toast.success("Rol eliminado correctamente.")
            getRoles()
        } catch (error) {
            toast.error("Error al eliminar el rol.")
            console.error("Error al eliminar:", error)
        } finally {
            handleCloseDeleteDialog()
        }
    }

    const handleOpenEditModal = async (role) => {
        if (!role || !role.id) {
            toast.error("Error: No se pudo cargar el rol para edición.")
            return
        }

        try {
            const [roleResponse, permissionRoleResponse] = await Promise.all([
                axios.get(`http://localhost:2025/api/role/${role.id}`),
                axios.get(`http://localhost:2025/api/permissionRole?roleId=${role.id}`),
            ])

            const roleData = roleResponse.data
            const permissionRoles = permissionRoleResponse.data

            const permissionIds = permissionRoles.map((pr) => pr.permissionId)

            const roleWithPermissions = {
                ...roleData,
                permissions: permissionIds,
            }

            console.log("Rol con permisos:", roleWithPermissions)

            setRoleToEdit(roleWithPermissions)
            setShowEditModal(true)
        } catch (error) {
            console.error("Error al obtener el rol:", error)
            toast.error("Error al obtener el rol.")
        }
    }

    const handleCloseEditModal = () => {
        setShowEditModal(false)
        setRoleToEdit(null)
    }

    return (
        <div className="container">
            <ToastContainer position="top-right" autoClose={3000} />
            <div className="row">
                <div className="panel panel-primary filterable">
                    <div className="panel-heading mb-3">
                        <button className="Register-button Button-save" onClick={() => setShowModal(true)}>
                            <FaCirclePlus /> Registrar
                        </button>
                    </div>
                    <table className="table">
                        <thead className="thead">
                            <tr className="filters">
                                <th>Código</th>
                                <th>Nombre del rol</th>
                                <th>Acciones</th>
                            </tr>
                        </thead>
                        <tbody className="tbody">
                            {roles.length > 0 ? (
                                roles.map((role, i) => (
                                    <tr key={i}>
                                        <td>{role.id}</td>
                                        <td>{role.name}</td>
                                        <td className="content-buttons">
                                            <button className="Table-button Show-button">
                                                <FaEye />
                                            </button>
                                            <Tooltip title="Editar">
                                                <button
                                                    className="Table-button Update-button"
                                                    onClick={() => handleOpenEditModal(role)}
                                                >
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


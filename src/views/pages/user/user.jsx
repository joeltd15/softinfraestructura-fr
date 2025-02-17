import { useEffect, useState } from "react";
import axios from "axios";
import { MdDelete } from "react-icons/md";
import { FaEye } from "react-icons/fa";
import Tooltip from "@mui/material/Tooltip";
import { FaCirclePlus } from "react-icons/fa6";
import { Dialog, DialogActions, DialogContent, DialogTitle, Button } from "@mui/material";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ViewUserModal from "./UserModalShow";
import UserModalRegister from "./modalUser";


const User = () => {
    const userUrl = "http://localhost:2025/api/user";
    const roleUrl = "http://localhost:2025/api/role";
    const [users, setUsers] = useState([]);
    const [roles, setRoles] = useState([]);
    const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
    const [selectedId, setSelectedId] = useState(null);
    const [openViewModal, setOpenViewModal] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
    const [openRegisterModal, setOpenRegisterModal] = useState(false);


    useEffect(() => {
        getUsers();
        getRoles();
    }, []);

    const getUsers = async () => {
        try {
            const response = await axios.get(userUrl);
            setUsers(response.data);
        } catch (error) {
            console.error("Error obteniendo usuarios:", error);
            toast.error("No se pudieron cargar los usuarios.");
        }
    };

    const getRoles = async () => {
        try {
            const response = await axios.get(roleUrl);
            setRoles(response.data);
        } catch (error) {
            console.error("Error obteniendo roles:", error);
            toast.error("No se pudieron cargar los roles.");
        }
    };

    const getRoleName = (roleId) => {
        const role = roles.find((r) => r.id === roleId);
        return role ? role.name : "Desconocido";
    };

    const handleOpenDeleteDialog = (id) => {
        setSelectedId(id);
        setOpenDeleteDialog(true);
    };

    const handleCloseDeleteDialog = () => {
        setOpenDeleteDialog(false);
        setSelectedId(null);
    };

    const handleConfirmDelete = async () => {
        if (!selectedId) return;

        try {
            await axios.delete(`${userUrl}/${selectedId}`);
            toast.success("El usuario ha sido eliminado.");
            getUsers();
        } catch (error) {
            toast.error("No se pudo eliminar el usuario.");
            console.error("Error al eliminar:", error);
        } finally {
            handleCloseDeleteDialog();
        }
    };

    const handleOpenViewModal = (user) => {
        setSelectedUser(user);
        setOpenViewModal(true);
    };

    const handleCloseViewModal = () => {
        setOpenViewModal(false);
        setSelectedUser(null);
    };

    const handleOpenRegisterModal = () => {
        setOpenRegisterModal(true);
    };

    const handleCloseRegisterModal = () => {
        setOpenRegisterModal(false);
    };


    return (
        <div className="container">
            <div className="row">
                <div className="panel panel-primary filterable">
                    <div className="panel-heading mb-3">
                        <button className="Register-button Button-save" onClick={handleOpenRegisterModal}>
                            <FaCirclePlus /> Registrar
                        </button>

                    </div>
                    <table className="table">
                        <thead className="thead">
                            <tr>
                                <th>Código</th>
                                <th>Nombre</th>
                                <th>Email</th>
                                <th>Teléfono</th>
                                <th>Estado</th>
                                <th>Rol</th>
                                <th>Acciones</th>
                            </tr>
                        </thead>
                        <tbody className="tbody">
                            {users.map((user) => (
                                <tr key={user.id}>
                                    <td>{user.id}</td>
                                    <td>{user.name}</td>
                                    <td>{user.email}</td>
                                    <td>{user.phone}</td>
                                    <td>{user.status}</td>
                                    <td>{getRoleName(user.roleId)}</td>
                                    <td className="content-buttons">
                                        <button className="Table-button Show-button" onClick={() => handleOpenViewModal(user)}>
                                            <FaEye />
                                        </button>
                                        <Tooltip title="Eliminar usuario">
                                            <button className="Table-button Delete-button" onClick={() => handleOpenDeleteDialog(user.id)}>
                                                <MdDelete />
                                            </button>
                                        </Tooltip>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

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

            <UserModalRegister
                show={openRegisterModal}
                handleClose={handleCloseRegisterModal}
                getUsers={getUsers}
            />
            <ViewUserModal show={openViewModal} handleClose={handleCloseViewModal} user={selectedUser} roles={roles} />

        </div>
    );
};

export default User;
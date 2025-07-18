import { useEffect, useState } from "react";
import axios from "axios";
import { MdDelete } from "react-icons/md";
import { FaEye } from "react-icons/fa";
import Tooltip from "@mui/material/Tooltip";
import { FaCirclePlus } from "react-icons/fa6";
import { FaPencilAlt } from "react-icons/fa"
import { Dialog, DialogActions, DialogContent, DialogTitle, Button } from "@mui/material";
import ViewUserModal from "./UserModalShow";
import UserModalRegister from "./modalUser";
import UserEditModal from "./modalUserEdit";
import TablePagination from '../../../components/Paginator/index.jsx';
import { useAlert } from '../../../assets/functions/index.jsx';
import { toast } from "react-toastify";

const User = () => {
    const userUrl = "https://softinfraestructura-gray.vercel.app/api/user";
    const roleUrl = "https://softinfraestructura-gray.vercel.app/api/role";
    const [users, setUsers] = useState([]);
    const [roles, setRoles] = useState([]);
    const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
    const [selectedId, setSelectedId] = useState(null);
    const [openViewModal, setOpenViewModal] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
    const [openRegisterModal, setOpenRegisterModal] = useState(false);
    const [search, setSearch] = useState('');
    const [dataQt, setDataQt] = useState(4);
    const [currentPages, setCurrentPages] = useState(1);
    const [openEditModal, setOpenEditModal] = useState(false);
    const [selectedEditUser, setSelectedEditUser] = useState(null);
    const { showAlert } = useAlert();


    useEffect(() => {
        getUsers();
        getRoles();
    }, []);

    useEffect(() => {
        return () => {
            toast.dismiss();
        };
    }, []);

    const token = localStorage.getItem("token");

    const headers = {
        Authorization: `Bearer ${token}`,
    }

    //Buscador y paginador
    const searcher = (e) => {
        setSearch(e.target.value);
        console.log(e.target.value)
    }

    const indexEnd = currentPages * dataQt;
    const indexStart = indexEnd - dataQt;

    const nPages = Math.ceil(users.length / dataQt);

    let results = []
    if (!search) {
        results = users.slice(indexStart, indexEnd);
    } else {
        results = users.filter((dato) => {
            const searchTerm = search.toLowerCase();
            return (
                dato.name?.toLowerCase().includes(searchTerm) ||
                dato.email?.toLowerCase().includes(searchTerm) ||
                dato.reportDate?.toString().includes(searchTerm) ||
                dato.phone?.toString().includes(searchTerm) ||
                dato.status?.toString().includes(searchTerm)
            );
        });
    }

    const getUsers = async () => {
        try {
            const response = await axios.get(userUrl, {headers});
            setUsers(response.data);
        } catch (error) {
            console.error("Error obteniendo usuarios:", error);
            showAlert("No se pudieron cargar los usuarios.", 'error');
        }
    };

    const getRoles = async () => {
        try {
            const response = await axios.get(roleUrl, {headers});
            setRoles(response.data);
        } catch (error) {
            console.error("Error obteniendo roles:", error);
            showAlert("No se pudieron cargar los roles.", 'error');

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
            await axios.delete(`${userUrl}/${selectedId}`, {headers});
            showAlert("El usuario ha sido eliminado.", 'success');
            getUsers();
        } catch (error) {
            showAlert("No se pudo eliminar el usuario.", 'error');
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

    const handleEdit = (user) => {
        setSelectedEditUser(user);
        setOpenEditModal(true);
    };

    const handleCloseEditModal = () => {
        setOpenEditModal(false);
        setSelectedEditUser(null);
    };

    return (
        <div className="container">
            <div className="row">
                <div className="panel panel-primary filterable">
                    <div className="panel-heading mb-3">
                        <div className="row w-100">
                            <div className="col-12 col-md-6 mb-3 mb-md-0 d-flex align-items-center justify-content-center justify-content-md-start">
                                <button className="Register-button Button-save" onClick={handleOpenRegisterModal}>
                                    <FaCirclePlus /> Registrar
                                </button>
                            </div>
                            <div className="col-12 col-md-6 d-flex align-items-center justify-content-center justify-content-md-end">
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
                    <div className="table-responsive">
                        <table className="table">
                            <thead className="thead">
                                <tr>
                                    <th>#</th>
                                    <th>Nombre</th>
                                    <th>Email</th>
                                    <th>Teléfono</th>
                                    <th>Estado</th>
                                    <th>Rol</th>
                                    <th>Acciones</th>
                                </tr>
                            </thead>
                            <tbody className="tbody">
                                {
                                    results.length > 0 ? (
                                        results.map((user) => (
                                            <tr key={user.id}>
                                                <td>{user.id}</td>
                                                <td>{user.name}</td>
                                                <td>{user.email}</td>
                                                <td>{user.phone}</td>
                                                <td>{<span className={`status ${user.status === 'Activo' ? 'Active' : 'Inactive'}`}>{user.status}</span>}</td>
                                                <td>{getRoleName(user.roleId)}</td>
                                                <td className="content-buttons">
                                                    <Tooltip title="Ver detalle usuario">
                                                        <button className="Table-button Show-button" onClick={() => handleOpenViewModal(user)}>
                                                            <FaEye />
                                                        </button>
                                                    </Tooltip>
                                                    <Tooltip title="Actualizar usuario">
                                                        <button className="Table-button Update-button" onClick={() => handleEdit(user)}>
                                                            <FaPencilAlt />
                                                        </button>
                                                    </Tooltip>
                                                    <Tooltip title="Eliminar usuario">
                                                        <button className="Table-button Delete-button" onClick={() => handleOpenDeleteDialog(user.id)}>
                                                            <MdDelete />
                                                        </button>
                                                    </Tooltip>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        (
                                            <tr>
                                                <td colSpan={10} className='text-center'>
                                                    No hay usuarios disponibles
                                                </td>
                                            </tr>
                                        )

                                    )
                                }
                            </tbody>
                        </table>
                    </div>
                    {
                        results.length > 0 ? (
                            <div className="row mb-5">
                                <div className="col-sm-6 d-flex align-items-center justify-content-start">
                                    <div className="d-flex table-footer">
                                        <TablePagination
                                            nPages={nPages}
                                            currentPages={currentPages}
                                            setCurrentPages={setCurrentPages}
                                        />

                                    </div>
                                </div>
                            </div>

                        ) : (<div className="d-flex table-footer">
                        </div>)
                    }
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
                getUsers={() => getUsers()}
            />
            <ViewUserModal show={openViewModal} handleClose={handleCloseViewModal} user={selectedUser} roles={roles} />
            <UserEditModal
                show={openEditModal}
                handleClose={handleCloseEditModal}
                getUsers={getUsers}
                user={selectedEditUser}  // Pasamos los datos del usuario a editar
            />


        </div>
    );
};

export default User;
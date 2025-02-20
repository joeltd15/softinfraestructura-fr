import { useState, useEffect } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FaPencilAlt, FaEye } from "react-icons/fa";
import { MdAssignment, MdDelete } from "react-icons/md";
import Tooltip from "@mui/material/Tooltip";
import { FaCirclePlus } from "react-icons/fa6";
import { Dialog, DialogActions, DialogContent, DialogTitle, Button } from "@mui/material";
import RegisterResponsibleModal from "./modalResponsible/index";
import EditResponsibleModal from "./modalResponsibleEdit/index";
import ShowResponsibleModal from "./responsibleModalShow/index";


const Responsible = () => {
    const [responsibles, setResponsibles] = useState([]);
    const [users, setUsers] = useState([]);
    const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
    const [selectedId, setSelectedId] = useState(null);
    const [openRegisterModal, setOpenRegisterModal] = useState(false);
    const [openEditModal, setOpenEditModal] = useState(false);
    const [selectedResponsible, setSelectedResponsible] = useState(null);
    const [openShowModal, setOpenShowModal] = useState(false);
    const [selectedResponsibleShow, setSelectedResponsibleShow] = useState(null);


    useEffect(() => {
        getResponsibles();
        getUsers();
    }, []);

    const getResponsibles = async () => {
        try {
            const response = await axios.get("http://localhost:2025/api/responsible");
            console.log("Datos obtenidos de responsables:", response.data);
            setResponsibles(response.data);
        } catch (error) {
            console.error("Error al obtener los responsables:", error);
        }
    };    

    const getUsers = async () => {
        try {
            const response = await axios.get("http://localhost:2025/api/user");
            setUsers(response.data);
        } catch (error) {
            console.error("Error al obtener los usuarios:", error);
        }
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
            await axios.delete(`http://localhost:2025/api/responsible/${selectedId}`);
            toast.success("Responsable eliminado correctamente.");
            getResponsibles();
        } catch (error) {
            toast.error("Error al eliminar el responsable.");
            console.error("Error al eliminar:", error);
        } finally {
            handleCloseDeleteDialog();
        }
    };

    const handleOpenRegisterModal = () => {
        setOpenRegisterModal(true);
    };

    const handleCloseRegisterModal = () => {
        setOpenRegisterModal(false);
    };

    const handleOpenEditModal = (responsible) => {
        setSelectedResponsible(responsible);
        setOpenEditModal(true);
    };

    const handleCloseEditModal = () => {
        setOpenEditModal(false);
        setSelectedResponsible(null);
    };

    const handleOpenShowModal = (responsible) => {
        setSelectedResponsibleShow(responsible);
        setOpenShowModal(true);
    };

    const handleCloseShowModal = () => {
        setOpenShowModal(false);
        setSelectedResponsibleShow(null);
    };


    return (
        <>
            <ToastContainer position="top-right" autoClose={3000} />
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
                                <tr className="filters">
                                    <th>Código</th>
                                    <th>Actividad</th>
                                    <th>Nombre T.O</th>
                                    <th>Acciones</th>
                                </tr>
                            </thead>
                            <tbody className="tbody">
                                {responsibles.length > 0 ? (
                                    responsibles.map((responsible, i) => {
                                        const user = users.find(user => user.id === responsible.userId);
                                        return (
                                            <tr key={i}>
                                                <td>{responsible.id}</td>
                                                <td>
                                                    {responsible.Responsibilities.length > 0
                                                        ? responsible.Responsibilities.map(r => r.name).join(", ")
                                                        : "Sin responsabilidades"}
                                                </td>
                                                <td>{user ? user.name : "Desconocido"}</td>
                                                <td className="content-buttons">
                                                    <button
                                                        className="Table-button Show-button"
                                                        onClick={() => handleOpenShowModal(responsible)}
                                                    >
                                                        <FaEye />
                                                    </button>

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
                                        );
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
                </div>
            </div>

            {/* Diálogo de confirmación para eliminar */}
            <Dialog open={openDeleteDialog} onClose={handleCloseDeleteDialog}>
                <DialogTitle>Confirmar eliminación</DialogTitle>
                <DialogContent>
                    ¿Estás seguro de que deseas eliminar este responsable?
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDeleteDialog} className="buttons-form Button-blue">
                        Cancelar
                    </Button>
                    <Button onClick={handleConfirmDelete} className="buttons-form Button-next">
                        Eliminar
                    </Button>
                </DialogActions>
            </Dialog>

            <RegisterResponsibleModal show={openRegisterModal} handleClose={handleCloseRegisterModal} onResponsibleCreated={getResponsibles}
            />
            <EditResponsibleModal show={openEditModal} handleClose={handleCloseEditModal} onResponsibleUpdated={getResponsibles} responsible={selectedResponsible}
            />
            <ShowResponsibleModal show={openShowModal} handleClose={handleCloseShowModal} responsible={selectedResponsibleShow} users={users}
            />

        </>
    );
};

export default Responsible;
import { useEffect, useState } from "react";
import axios from 'axios';
import { FaPencilAlt } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import { FaEye } from "react-icons/fa";
import { FaCirclePlus } from "react-icons/fa6";
import ModalApplication from "./modalApplication";
import { FaUserPlus } from "react-icons/fa";
import ModalAssignment from "../asssignment/modalAssignment/index";
import ModalEditApplication from "./modalApplicationEdit/index";
import ModalShowApplication from "./ApplicationModalShow/index";
import Tooltip from '@mui/material/Tooltip';
import { Dialog, DialogActions, DialogContent, DialogTitle, Button } from "@mui/material";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FaFilePdf } from "react-icons/fa";

const Application = () => {
    const url = 'http://localhost:2025/api/application';
    const urlUsers = 'http://localhost:2025/api/user';
    const [Users, setUsers] = useState([]);
    const [applications, setApplication] = useState([]);
    const [show, setShow] = useState(false);
    const [showAssign, setShowAssign] = useState(false);
    const [showModalEdit, setShowModalEdit] = useState(false);
    const [selectedApplication, setSelectedApplication] = useState(null);
    const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
    const [selectedId, setSelectedId] = useState(null);
    const [selectId, setSelectId] = useState(null);
    const [showModal, setShowModal] = useState(false);

    useEffect(() => {
        getApplications();
        getUsers();
    }, [])

    const getApplications = async () => {
        try {
            const [applicationsResponse, assignmentsResponse] = await Promise.all([
                axios.get(url),
                axios.get("http://localhost:2025/api/assignment")
            ]);
    
            const applicationsData = applicationsResponse.data;
            const assignmentsData = assignmentsResponse.data;
            const user = JSON.parse(localStorage.getItem("user")); // Obtiene el usuario logueado
            if (!user) return;
    
            let filteredApplications = [];
    
            if (user.roleId === 1) {
                // Si es admin, ve todas las aplicaciones
                filteredApplications = applicationsData;
            } else if (user.roleId === 2) {
                // Si es responsable, filtra por asignaciones
                const assignedApps = assignmentsData
                    .filter(assignment => assignment.responsibleId === user.id)
                    .map(assignment => assignment.applicationId);
    
                filteredApplications = applicationsData.filter(app => assignedApps.includes(app.id));
            } else if (user.roleId === 3) {
                // Si es usuario normal, solo ve las aplicaciones que él creó
                filteredApplications = applicationsData.filter(app => app.userId === user.id);
            }
    
            setApplication(filteredApplications);
        } catch (error) {
            console.error("Error obteniendo aplicaciones:", error);
        }
    };
    

    const getUsers = async () => {
        const response = await axios.get(urlUsers);
        setUsers(response.data);
    }

    const handleSolicitudCreated = () => {
        setShowAssign(false)
        getApplications();
    }

    const userName = (userId) => {
        const user = Users.find(user => user.id === userId);
        return user ? user.name : 'Desconocido';
    };

    const handleEdit = (application) => {
        setSelectedApplication(application)
        setShowModalEdit(true)
    }

    const handleShow = (application) => {
        if (!application) return;
        setSelectedApplication(application);
        setShowModal(true);
    };

    const handleUpdate = (formData) => {
        if (!selectedApplication) {
            console.error("No hay una solicitud seleccionada para actualizar");
            return;
        }

        axios.put(`http://localhost:2025/api/application/${selectedApplication.id}`, formData, {
            headers: { "Content-Type": "multipart/form-data" },
        })
            .then((response) => {
                console.log("Respuesta del servidor:", response.data);
                getApplications();
                setShowModalEdit(false);
            })
            .catch((error) => {
                console.error("Error al actualizar la solicitud:", error.response ? error.response.data : error.message);
            });
    };

    const handleOpenDeleteDialog = (id) => {
        setSelectedId(id);
        setOpenDeleteDialog(true);
    };

    const handleCloseDeleteDialog = () => {
        setOpenDeleteDialog(false);
        setSelectedId(null);
    };

    const handleConfirmDelete = () => {
        if (!selectedId) return;

        axios.delete(`${url}/${selectedId}`)
            .then(() => {
                toast.success("El registro ha sido eliminado.");
                getApplications();
            })
            .catch(error => {
                toast.error("No se pudo eliminar el registro.");
                console.error("Error al eliminar:", error);
            })
            .finally(() => handleCloseDeleteDialog());
    };

    return (
        <>
            <div className="container">
                <div className="row">
                    <div className="panel panel-primary filterable">
                        <div className="panel-heading mb-3">
                            <button className="Register-button" onClick={() => setShow(true)}>
                                <FaCirclePlus /> Registrar
                            </button>
                        </div>
                        <table class="table">
                            <thead className="thead">
                                <tr>
                                    <th>Codigo</th>
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
                                {
                                    applications.map((application, i) => (
                                        <tr key={application.id}>
                                            <td>{application.id}</td>
                                            <td>{new Date(application.reportDate).toISOString().split('T')[0]}</td>
                                            <td>{application.dependence}</td>
                                            <td>{application.location}</td>
                                            <td>{application.news}</td>
                                            <td><img src={application.photographicEvidence && application.photographicEvidence.trim() !== "" ? `http://localhost:2025/uploads/${application.photographicEvidence}` : "/noImage.png"} alt="" /></td>
                                            <td>{application.reportType}</td>
                                            <td>{application.status}</td>
                                            <td>{userName(application.userId)}</td>
                                            <td className="content-buttons">
                                                <button className="Table-button Show-button" onClick={() => handleShow(application)}><FaEye /></button>
                                                <button className="Table-button Update-button" onClick={() => handleEdit(application)}><FaPencilAlt /></button>
                                                <button className="Table-button Delete-button" onClick={() => handleOpenDeleteDialog(application.id)}><MdDelete /></button>
                                                {application.status != 'Asignada' && (
                                                    <>
                                                        <Tooltip title="Asignar encargado">
                                                            <button className="Table-button Asign-button" onClick={() => { console.log("Asignando ID:", application.id); setShowAssign(true); setSelectId(application.id) }}><FaUserPlus /></button>
                                                        </Tooltip>
                                                    </>
                                                )}
                                            </td>
                                        </tr>
                                    ))
                                }
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
            {/* Modal */}
            <ModalApplication show={show} handleClose={() => setShow(false)} onSolicitudCreated={handleSolicitudCreated} />
            {/* Modal Asignamiento*/}
            <ModalAssignment show={showAssign} handleClose={() => setShowAssign(false)} onAssignmentCreated={handleSolicitudCreated} assignmentApplication={selectId}/>
            <ModalEditApplication show={showModalEdit} handleClose={() => setShowModalEdit(false)} application={selectedApplication} handleUpdate={handleUpdate} />
            <ModalShowApplication show={showModal} handleClose={() => setShowModal(false)} application={selectedApplication} />
            {/* Diálogo de Confirmación de Eliminación */}
            <Dialog open={openDeleteDialog} onClose={handleCloseDeleteDialog}>
                <DialogTitle>¿Estás seguro?</DialogTitle>
                <DialogContent>
                    Esta acción no se puede deshacer.
                </DialogContent>
                <DialogActions>
                    <Button className="buttons-form Button-blue" onClick={handleCloseDeleteDialog} >Cancelar</Button>
                    <Button className="buttons-form Button-next" onClick={handleConfirmDelete}>Eliminar</Button>
                </DialogActions>
            </Dialog>
        </>
    )
}

export default Application;

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


const Application = () => {
    const url = 'http://localhost:2025/api/application'
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
    }, [])

    const getApplications = async () => {
        const response = await axios.get(url)
        setApplication(response.data)
    }

    const handleSolicitudCreated = () => {
        getApplications();
    }

    const handleEdit = (application) => {
        setSelectedApplication(application)
        setShowModalEdit(true)
    }

    const handleShow = (application) => {
        setSelectedApplication(application)
        setShowModal(true)
    }

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
                                    <th>#</th>
                                    <th>Fecha del reporte</th>
                                    <th>Centro/dependencia</th>
                                    <th>Lugar</th>
                                    <th>Novedades</th>
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
                                            <td>{i + 1}</td>
                                            <td>{new Date(application.reportDate).toISOString().split('T')[0]}</td>
                                            <td>{application.dependence}</td>
                                            <td>{application.location}</td>
                                            <td>{application.news}</td>
                                            <td><img src={application.photographicEvidence && application.photographicEvidence.trim() !== "" ? `http://localhost:2025/uploads/${application.photographicEvidence}` : "/noImage.png"} alt="" /></td>
                                            <td>{application.reportType}</td>
                                            <td>{application.status}</td>
                                            <td>{application.userId}</td>
                                            <td className="content-buttons">
                                                <button className="Table-button Show-button" onClick={() => handleShow(application)}><FaEye /></button>
                                                <button className="Table-button Update-button" onClick={() => handleEdit(application)}><FaPencilAlt /></button>
                                                <button className="Table-button Delete-button" onClick={() => handleOpenDeleteDialog(application.id)}><MdDelete /></button>
                                                <Tooltip title="Asignar encargado">
                                                    <button className="Table-button Asign-button" onClick={() => { console.log("Asignando ID:", application.id); setShowAssign(true); setSelectId(application.id)}}><FaUserPlus /></button>
                                                </Tooltip>
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
            <ModalAssignment show={showAssign} handleClose={() => setShowAssign(false)} assignmentApplication={selectId}/>
            <ModalEditApplication show={showModalEdit} handleClose={() => setShowModalEdit(false)} application={selectedApplication} handleUpdate={handleUpdate}/>
            <ModalShowApplication show={showModal} handleClose={() => setShowModal(false)} application={selectedApplication}/>
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

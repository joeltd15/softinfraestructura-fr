import { useEffect, useState } from "react";
import axios from "axios";
import { MdDelete } from "react-icons/md";
import { FaCirclePlus } from "react-icons/fa6";
import ModalTracking from "./modalTracking";
import ModalTrackingEdit from "./modalTrackingEdit";
import ModalTrackingView from "./modalTrackingShow";
import { FaPencilAlt, FaEye } from "react-icons/fa";
import { ToastContainer, toast } from "react-toastify";
import { Dialog, DialogActions, DialogContent, DialogTitle, Button } from "@mui/material";
import "react-toastify/dist/ReactToastify.css";

const Tracking = () => {
    const [trackingData, setTrackingData] = useState([]);
    const [show, setShow] = useState(false);
    const [showModalEdit, setShowModalEdit] = useState(false);
    const [showModalView, setShowModalView] = useState(false);
    const [selectedTracking, setSelectedTracking] = useState(null);
    const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
    const [selectedId, setSelectedId] = useState(null);

    const getTracking = () => {
        axios.get("http://localhost:2025/api/tracking")
            .then(response => {
                setTrackingData(response.data);
            })
            .catch(error => {
                console.error("Error al obtener los datos:", error);
            });
    };

    useEffect(() => {
        getTracking();
    }, []);

    const handleEdit = (tracking) => {
        setSelectedTracking(tracking);
        setShowModalEdit(true);
    };

    const handleView = (tracking) => {
        setSelectedTracking(tracking);
        setShowModalView(true);
    };

    const handleUpdate = (formData) => {
        axios.put(`http://localhost:2025/api/tracking/${selectedTracking.id}`, formData, {
            headers: { "Content-Type": "multipart/form-data" },
        })
        .then(() => {
            getTracking();
            setShowModalEdit(false);
        })
        .catch((error) => {
            console.error("Error al actualizar el tracking:", error.response ? error.response.data : error.message);
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

        axios.delete(`http://localhost:2025/api/tracking/${selectedId}`)
            .then(() => {
                toast.success("El registro ha sido eliminado.");
                getTracking();
            })
            .catch(error => {
                toast.error("No se pudo eliminar el registro.");
                console.error("Error al eliminar:", error);
            })
            .finally(() => handleCloseDeleteDialog());
    };

    return (
        <>
            <ToastContainer position="top-right" autoClose={3000} />
            <div className="container">
                <div className="row">
                    <div className="panel panel-primary filterable">
                        <div className="panel-heading mb-3">
                            <button className="Register-button" onClick={() => setShow(true)}>
                                <FaCirclePlus /> Registrar
                            </button>
                        </div>
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
                                    <th>Asignación</th>
                                    <th>Acciones</th>
                                </tr>
                            </thead>
                            <tbody className="tbody">
                                {trackingData.length > 0 ? (
                                    trackingData.map((tracking, i) => (
                                        <tr key={i}>
                                            <td>{i + 1}</td>
                                            <td>{tracking.observations}</td>
                                            <td>{tracking.buildingMaterials}</td>
                                            <td>{tracking.dateService}</td>
                                            <td>{tracking.actionsTaken}</td>
                                            <td>
                                                <img
                                                    src={tracking.photographicEvidence && tracking.photographicEvidence.trim() !== ""
                                                        ? `http://localhost:2025/uploads/${tracking.photographicEvidence}`
                                                        : "/noImage.png"}
                                                    width="80"
                                                    className="hover-zoom"
                                                />
                                            </td>
                                            <td>{tracking.status}</td>
                                            <td>{tracking.assignmentId}</td>
                                            <td className="content-buttons">
                                                <button className="Table-button Show-button" onClick={() => handleView(tracking)}>
                                                    <FaEye />
                                                </button>
                                                <button className="Table-button Update-button" onClick={() => handleEdit(tracking)}>
                                                    <FaPencilAlt />
                                                </button>
                                                <button className="Table-button Delete-button" onClick={() => handleOpenDeleteDialog(tracking.id)}>
                                                    <MdDelete />
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="9" className="text-center">No hay datos disponibles</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* Diálogo de confirmación de eliminación */}
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

            {/* Modales */}
            <ModalTracking show={show} handleClose={() => setShow(false)} onSolicitudCreated={getTracking} />
            <ModalTrackingEdit show={showModalEdit} handleClose={() => setShowModalEdit(false)} tracking={selectedTracking} handleUpdate={handleUpdate} />
            <ModalTrackingView show={showModalView} handleClose={() => setShowModalView(false)} tracking={selectedTracking} />
        </>
    );
};

export default Tracking;
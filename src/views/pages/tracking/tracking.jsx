import { useEffect, useState } from "react";
import axios from "axios";
import { FaPencilAlt } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import { FaEye } from "react-icons/fa";
import { FaCirclePlus } from "react-icons/fa6";
import ModalTracking from "./modalTracking";
import ModalTrackingEdit from "./modalTrackingEdit";


const Tracking = () => {
    const [trackingData, setTrackingData] = useState([]);
    const [show, setShow] = useState(false);
    const [showModalEdit, setShowModalEdit] = useState(false);
    const [selectedTracking, setSelectedTracking] = useState(null)


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
        setSelectedTracking(tracking)
        setShowModalEdit(true)
    }

    const handleUpdate = (updatedTracking) => {
        axios
            .put(`http://localhost:2025/api/tracking/${updatedTracking.id}`, updatedTracking)
            .then(() => {
                getTracking() // Refresh the data after update
                setShowModalEdit(false)
            })
            .catch((error) => {
                console.error("Error al actualizar el tracking:", error)
            })
    }


    return (
        <>
            <div className="container">
                <div className="row">
                    <div className="panel panel-primary filterable">
                        <div class="panel-heading mb-3">
                            <button className="Register-button" onClick={() => { setShow(true); }}>
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
                                                <button className="Table-button Show-button"><FaEye /></button>
                                                <button className="Table-button Update-button" onClick={() => handleEdit(tracking)}>
                                                    <FaPencilAlt />
                                                </button>
                                                <button className="Table-button Delete-button"><MdDelete /></button>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="8" className="text-center">No hay datos disponibles</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
            {/* Modal */}
            <ModalTracking show={show} handleClose={() => setShow(false)} />
            <ModalTrackingEdit
                show={showModalEdit}
                handleClose={() => setShowModalEdit(false)}
                tracking={selectedTracking}
                handleUpdate={handleUpdate}
            />
        </>
    );
};

export default Tracking;
import { useEffect, useState } from "react";
import axios from "axios";

const Tracking = () => {
    const [trackingData, setTrackingData] = useState([]);

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

    return (
        <div className="container">
            <div className="row">
                <div className="panel panel-primary filterable">
                    <div className="panel-heading">
                        <h3 className="panel-title">Tracking</h3>
                    </div>
                    <table className="table">
                        <thead>
                            <tr className="filters">
                                <th>#</th>
                                <th>Observaciones</th>
                                <th>Materiales</th>
                                <th>Fecha del Servicio</th>
                                <th>Acciones Tomadas</th>
                                <th>Evidencia Fotográfica</th>
                                <th>Estado</th>
                                <th>Asignación</th>
                            </tr>
                        </thead>
                        <tbody>
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
    );
};

export default Tracking;
import { useEffect, useState } from "react";
import axios from "axios";

const Assignment = () => {
    const [assignmentData, setAssignmentData] = useState([]);

    const getAssignment = () => {
        axios.get("http://localhost:2025/api/assignment")
            .then(response => {
                setAssignmentData(response.data);
            })
            .catch(error => {
                console.error("Error al obtener los datos:", error);
            });
    };

    useEffect(() => {
        getAssignment();
    }, []);

    return (
        <div className="container">
            <div className="row">
                <div className="panel panel-primary filterable">
                    <div className="panel-heading">
                        <h3 className="panel-title">Asignamientos</h3>
                    </div>
                    <table className="table">
                        <thead>
                            <tr className="filters">
                                <th>#</th>
                                <th>Fecha de asignamiento</th>
                                <th>Solicitud</th>
                                <th>Responsable</th>
                            </tr>
                        </thead>
                        <tbody>
                            {assignmentData.length > 0 ? (
                                assignmentData.map((assignment, i) => (
                                    <tr key={i}>
                                        <td>{i + 1}</td>
                                        <td>{assignment.assignmentDate}</td>
                                        <td>{assignment.applicationId}</td>
                                        <td>{assignment.responsibleId}</td>
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

export default Assignment;

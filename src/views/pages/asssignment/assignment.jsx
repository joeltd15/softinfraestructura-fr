import { useEffect, useState } from "react";
import axios from "axios";
import { FaPencilAlt } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import { FaEye } from "react-icons/fa";
import { FaCirclePlus } from "react-icons/fa6";
import ModalAssignment from "./modalAssignment/index";


const Assignment = () => {
    const [assignmentData, setAssignmentData] = useState([]);
    const [showModal, setShow] = useState(false);

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
    <>
        <div className="container">
            <div className="row">
                <div className="panel panel-primary filterable">
                <div class="panel-heading mb-3">
                            <button className="Register-button" onClick={() => setShow(true)}>
                                <FaCirclePlus /> Registrar
                            </button>
                        </div>
                    <table className="table">
                        <thead className="thead">
                            <tr className="filters">
                                <th>#</th>
                                <th>Fecha de asignamiento</th>
                                <th>Solicitud</th>
                                <th>Responsable</th>
                                <th>Acciones</th>
                            </tr>
                        </thead>
                        <tbody className="tbody">
                            {assignmentData.length > 0 ? (
                                assignmentData.map((assignment, i) => (
                                    <tr key={i}>
                                        <td>{i + 1}</td>
                                        <td>{assignment.assignmentDate}</td>
                                        <td>{assignment.applicationId}</td>
                                        <td>{assignment.responsibleId}</td>
                                        <td className="content-buttons">
                                                <button className="Table-button Show-button"><FaEye /></button>
                                                <button className="Table-button Update-button"><FaPencilAlt /></button>
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
         <ModalAssignment show={showModal} handleClose={() => setShow(false)} />
    </>
    );
};

export default Assignment;
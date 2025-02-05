import { useState, useEffect } from "react";
import axios from "axios";
import { MdDelete } from "react-icons/md";
import ModalAssignment from "./modalAssignment/index";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FaPencilAlt } from "react-icons/fa";
import { FaEye } from "react-icons/fa";
import { FaCirclePlus } from "react-icons/fa6";

const Assignment = () => {
  const [assignmentData, setAssignmentData] = useState([]);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    getAssignment();
  }, []);

  const getAssignment = async () => {
    try {
      const response = await axios.get("http://localhost:2025/api/assignment");
      setAssignmentData([...response.data]); // Asegurar que React detecte el cambio de estado
    } catch (error) {
      console.error("Error al obtener las asignaciones:", error);
      toast.error("Error al cargar las asignaciones");
    }
  };


  return (
    <>
      <ToastContainer position="top-right" autoClose={3000} />
      <div className="container">
        <div className="row">
          <div className="panel panel-primary filterable">
            <div className="panel-heading mb-3">
              <button className="Register-button" onClick={() => setShowModal(true)}>
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
                      <td>{new Date(assignment.assignmentDate).toISOString().split("T")[0]}</td>
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
                    <td colSpan="5" className="text-center">No hay datos disponibles</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      <ModalAssignment show={showModal} handleClose={() => setShowModal(false)} onAssignmentCreated={getAssignment} />
    </>
  );
};

export default Assignment;

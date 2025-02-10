import { useState, useEffect } from "react";
import axios from "axios";
import ModalAssignment from "./modalAssignment/index";
import ModalAssignmentEdit from "./modalAssignmentEdit/index";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FaPencilAlt } from "react-icons/fa";
import { MdAssignment } from "react-icons/md";
import Tooltip from "@mui/material/Tooltip";
import ModalTracking from "../tracking/modalTracking/index";

const Assignment = () => {
  const [assignmentData, setAssignmentData] = useState([]);
  const [users, setUsers] = useState([]); // Estado para almacenar los usuarios
  const [showModal, setShowModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showTracking, setShowTracking] = useState(false);
  const [selectedAssignmentId, setSelectedAssignmentId] = useState(null);
  const [selectedAssignment, setSelectedAssignment] = useState(null);

  useEffect(() => {
    getAssignment();
    getUsers();
  }, []);

  const getAssignment = async () => {
    try {
      const response = await axios.get("http://localhost:2025/api/assignment");
      setAssignmentData(response.data);
    } catch (error) {
      console.error("Error al obtener las asignaciones:", error);
      toast.error("Error al cargar las asignaciones");
    }
  };

  const getUsers = async () => {
    try {
      const response = await axios.get("http://localhost:2025/api/user");
      setUsers(response.data);
    } catch (error) {
      console.error("Error al obtener los usuarios:", error);
      toast.error("Error al cargar los usuarios");
    }
  };

  const handleOpenTrackingModal = (assignmentId) => {
    setSelectedAssignmentId(assignmentId);
    setShowTracking(true);
  };

  const handleOpenEditModal = (assignment) => {
    setSelectedAssignment(assignment);
    setShowEditModal(true);
  };

  const handleUpdateAssignment = async (updatedAssignment) => {
    try {
      await axios.put(`http://localhost:2025/api/assignment/${updatedAssignment.id}`, updatedAssignment);
      toast.success("Asignación actualizada con éxito");
      getAssignment();
      setShowEditModal(false);
    } catch (error) {
      console.error("Error al actualizar la asignación:", error);
      toast.error("Error al actualizar la asignación");
    }
  };

  return (
    <>
      <ToastContainer position="top-right" autoClose={3000} />
      <div className="container">
        <div className="row">
          <div className="panel panel-primary filterable">
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
                  assignmentData.map((assignment, i) => {
                    // Buscar el usuario correspondiente al responsibleId
                    const responsibleUser = users.find(user => user.id === assignment.responsibleId);
                    return (
                      <tr key={i}>
                        <td>{i + 1}</td>
                        <td>{new Date(assignment.assignmentDate).toISOString().split("T")[0]}</td>
                        <td>{assignment.applicationId}</td>
                        <td>{responsibleUser ? responsibleUser.name : "Desconocido"}</td> {/* Muestra el nombre del responsable */}
                        <td className="content-buttons">
                      
                          <button
                            className="Table-button Update-button"
                            onClick={() => handleOpenEditModal(assignment)}
                          >
                            <FaPencilAlt />
                          </button>
                          <Tooltip title="Asignar Seguimiento">
                            <button
                              className="Table-button Asign-button"
                              onClick={() => handleOpenTrackingModal(assignment.id)}
                            >
                              <MdAssignment />
                            </button>
                          </Tooltip>
                        </td>
                      </tr>
                    );
                  })
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
      <ModalAssignment 
        show={showModal} 
        handleClose={() => setShowModal(false)} 
        onAssignmentCreated={getAssignment} 
      />
      <ModalAssignmentEdit 
        show={showEditModal} 
        handleClose={() => setShowEditModal(false)} 
        assignment={selectedAssignment}
        handleUpdate={handleUpdateAssignment}
      />
      <ModalTracking 
        show={showTracking} 
        handleClose={() => setShowTracking(false)} 
        selectedAssignmentId={selectedAssignmentId}
      />
    </>
  );
};

export default Assignment;

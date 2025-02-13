import { useState, useEffect } from "react"
import axios from "axios"
import ModalAssignment from "./modalAssignment/index"
import ModalAssignmentEdit from "./modalAssignmentEdit/index"
import { ToastContainer, toast } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import { FaPencilAlt } from "react-icons/fa"
import { MdAssignment } from "react-icons/md"
import Tooltip from "@mui/material/Tooltip"
import ModalTracking from "../tracking/modalTracking/index"
import ModalShowApplication from "../application/ApplicationModalShow/index";
import { FaEye } from "react-icons/fa";

const Assignment = () => {
  const [responsibles, setResponsibles] = useState([]);
  const [assignmentData, setAssignmentData] = useState([])
  const [Users, setUsers] = useState([])
  const [showEditModal, setShowEditModal] = useState(false)
  const [showTracking, setShowTracking] = useState(false)
  const [selectedAssignmentId, setSelectedAssignmentId] = useState(null)
  const [selectedAssignment, setSelectedAssignment] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedAssignmentShow, setSelectedAssignmentShow] = useState(null);
  const [showModalShow, setShowModalShow] = useState(false)

  useEffect(() => {
    getAssignment()
    getUsers()
  }, [])

  const getAssignment = async () => {
    try {
      const [assignmentsResponse, responsiblesResponse] = await Promise.all([
        axios.get("http://localhost:2025/api/assignment"),
        axios.get("http://localhost:2025/api/responsible"),
      ]);

      const assignmentsData = assignmentsResponse.data;
      const responsiblesData = responsiblesResponse.data;
      setResponsibles(responsiblesData); // Aquí guardamos los responsables

      const user = JSON.parse(localStorage.getItem("user"));
      if (!user) return;

      let filteredAssignments = [];

      if (user.roleId === 1) {
        filteredAssignments = assignmentsData;
      } else if (user.roleId === 2) {
        const userResponsibilities = responsiblesData
          .filter((responsible) => responsible.userId === user.id)
          .map((responsible) => responsible.id);

        filteredAssignments = assignmentsData.filter((assignment) =>
          userResponsibilities.includes(assignment.responsibleId),
        );
      }

      setAssignmentData(filteredAssignments);
    } catch (error) {
      console.error("Error al obtener las asignaciones:", error);
      toast.error("Error al cargar las asignaciones");
    }
  };

  const handleShow = async (applicationId) => {
    try {
      const response = await axios.get(`http://localhost:2025/api/application/${applicationId}`);
      setSelectedAssignmentShow(response.data);
      setShowModalShow(true);
    } catch (error) {
      console.error("Error al obtener los detalles de la solicitud:", error);
      toast.error("Error al cargar los detalles de la solicitud");
    }
  };
  

  const getUsers = async () => {
    try {
      const response = await axios.get("http://localhost:2025/api/user")
      setUsers(response.data)
    } catch (error) {
      console.error("Error al obtener los usuarios:", error)
      toast.error("Error al cargar los usuarios")
    }
  }

  const handleOpenTrackingModal = (assignmentId) => {
    setSelectedAssignmentId(assignmentId)
    setShowTracking(true)
  }

  const handleOpenEditModal = (assignment) => {
    setSelectedAssignment(assignment)
    setShowEditModal(true)
  }

  const handleUpdateAssignment = async (updatedAssignment) => {
    try {
      await axios.put(`http://localhost:2025/api/assignment/${updatedAssignment.id}`, updatedAssignment)
      toast.success("Asignación actualizada con éxito")
      getAssignment()
      setShowEditModal(false)
    } catch (error) {
      console.error("Error al actualizar la asignación:", error)
      toast.error("Error al actualizar la asignación")
    }
  }

  const user = JSON.parse(localStorage.getItem("user"));

  return (
    <>
      <ToastContainer position="top-right" autoClose={3000} />
      <div className="container">
        <div className="row">
          <div className="panel panel-primary filterable">
            <table className="table">
              <thead className="thead">
                <tr className="filters">
                  <th>Código</th>
                  <th>Fecha de asignamiento</th>
                  <th>Solicitud</th>
                  <th>Responsable</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody className="tbody">
                {assignmentData.length > 0 ? (
                  assignmentData.map((assignment, i) => {
                    const responsible = responsibles.find(resp => resp.id === assignment.responsibleId);
                    const responsibleUser = responsible ? Users.find(user => user.id === responsible.userId) : null;

                    return (
                      <tr key={i}>
                        <td>{assignment.id}</td>
                        <td>{new Date(assignment.assignmentDate).toISOString().split("T")[0]}</td>
                        <td>{assignment.applicationId}</td>
                        <td>{responsibleUser ? responsibleUser.name : "Desconocido"}</td>
                        <td className="content-buttons">
                          <button className="Table-button Show-button" onClick={() => handleShow(assignment.applicationId)}><FaEye /></button>
                          {user.roleId == '1' && (
                            <>
                              <Tooltip title="Reasignar encargado">
                                <button
                                  className="Table-button Update-button"
                                  onClick={() => handleOpenEditModal(assignment)}
                                >
                                  <FaPencilAlt />
                                </button>
                              </Tooltip>
                            </>
                          )}
                          <Tooltip title="Registrar detalle de mantenimiento">
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
                    <td colSpan="5" className="text-center">
                      No hay datos disponibles
                    </td>
                  </tr>
                )}
              </tbody>

            </table>
          </div>
        </div>
      </div>
      <ModalAssignment show={showModal} handleClose={() => setShowModal(false)} onAssignmentCreated={getAssignment} />
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
      <ModalShowApplication show={showModalShow} handleClose={() => setShowModalShow(false)} application={selectedAssignmentShow} />
    </>
  )
}

export default Assignment
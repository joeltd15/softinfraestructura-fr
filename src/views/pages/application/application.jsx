import { useEffect, useState } from "react";
import axios from 'axios';
import { FaPencilAlt } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import { FaEye } from "react-icons/fa";
import { FaCirclePlus } from "react-icons/fa6";
import ModalApplication from "./modalApplication";
import { FaUserPlus } from "react-icons/fa";
import ModalAssignment from "../asssignment/modalAssignment/index";


const Application = () => {
    const url = 'http://localhost:2025/api/application'
    const [applications, setApplication] = useState([]);
    const [show, setShow] = useState(false);
    const [showAssign, setShowAssign] = useState(false);
    const [Title, setTitle] = useState('');

    useEffect(() => {
        getApplications();
    }, [])

    const getApplications = async () => {
        const response = await axios.get(url)
        setApplication(response.data)
    }
    return (
        <>
            <div class="container">
                <div class="row">
                    <div class="panel panel-primary filterable">
                        <div class="panel-heading mb-3">
                            <button className="Register-button" onClick={() => {setShow(true); setTitle('Registrar')}}>
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
                                            <td>{application.reportDate}</td>
                                            <td>{application.dependence}</td>
                                            <td>{application.location}</td>
                                            <td>{application.news}</td>
                                            <td><img src={application.photographicEvidence && application.photographicEvidence.trim() !== "" ? `http://localhost:2025/uploads/${application.photographicEvidence}` : "/noImage.png"} alt="" /></td>
                                            <td>{application.reportType}</td>
                                            <td>{application.status}</td>
                                            <td>{application.userId}</td>
                                            <td className="content-buttons">
                                                <button className="Table-button Show-button"><FaEye /></button>
                                                <button className="Table-button Update-button" onClick={() => {setShow(true); setTitle('Editar')}}><FaPencilAlt /></button>
                                                <button className="Table-button Delete-button"><MdDelete /></button>
                                                <button className="Table-button Asign-button" onClick={() => setShowAssign(true)}><FaUserPlus /></button>
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
            <ModalApplication show={show} handleClose={() => setShow(false)} Title={Title}/>
            {/* Modal Asignamiento*/}
         <ModalAssignment show={showAssign} handleClose={() => setShowAssign(false)} />
        </>
    )
}

export default Application;

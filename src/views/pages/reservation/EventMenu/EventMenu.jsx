import React from "react";
import { Card, CardContent, Button } from "@mui/material";
import { FaPencilAlt } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import { FaEye } from "react-icons/fa";
import { IoCloseCircleSharp } from "react-icons/io5";

const EventMenu = ({ event, onClose }) => {
    if (!event) return null;

    return (
        <Card style={{ position: "absolute", top: event.y, left: event.x, zIndex: 1000, width: '140px', padding: '0px' }}>
            <CardContent className="CardComponent">
                <Button fullWidth className="Update-button" onClick={() => console.log("Opción 1 seleccionada")}>
                    <FaPencilAlt/> Editar
                </Button>
                <Button fullWidth className="Delete-button" onClick={() => console.log("Opción 2 seleccionada")}>
                    <MdDelete/> Eliminar
                </Button>
                <Button fullWidth className="Show-button" onClick={() => console.log("Opción 3 seleccionada")}>
                    <FaEye/> Ver detalle
                </Button>
                <Button fullWidth className="Delete-button" onClick={onClose}>
                    <IoCloseCircleSharp/> Cerrar
                </Button>
            </CardContent>
        </Card>
    );
};

export default EventMenu;

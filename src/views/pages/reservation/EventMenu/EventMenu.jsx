import React, { useEffect, useState } from "react";
import { Card, CardContent, Button } from "@mui/material";
import { FaPencilAlt } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import { FaEye } from "react-icons/fa";
import { IoCloseCircleSharp } from "react-icons/io5";
import ModalEditReservation from "../reservationEdit/index";
import ModalShowReservation from "../ShowReservation/index"
import DialogDelete from "../deleteDialog/index";
import { toast } from "react-toastify";
import { useAlert } from '../../../../assets/functions/index';


const EventMenu = ({ event, onClose, getReservations }) => {
    const [ModalEdit, setModalEdit] = useState(false);
    const [ModalShow, setModalShow] = useState(false);
    const [SelectedReservation, setSelectedReservation] = useState(null);
    const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
    const { showAlert } = useAlert();

    useEffect(() => {
        return () => {
            toast.dismiss(); // Limpia todas las alertas pendientes al desmontar el componente
        };
    }, []);

    if (!event) return null;

    const handleEdit = () => {
        setSelectedReservation(event.id);
        setModalEdit(true);
    };

    const handleShow = () => {
        setSelectedReservation(event.id);
        setModalShow(true);
    };


    const handleOpenDeleteDialog = () => {
        setSelectedReservation(event.id);
        setOpenDeleteDialog(true);
    };

    const handleCloseDeleteDialog = () => {
        setOpenDeleteDialog(false);
    };

    const handleConfirmDelete = async () => {
        try {
            await fetch(`http://localhost:2025/api/reservation/${event.id}`, { method: 'DELETE' });
            getReservations();
            showAlert('Reserva Eliminada correctamente.', 'success');
            setOpenDeleteDialog(false);
            onClose();
        } catch (error) {
            console.error("Error al eliminar la reserva:", error);
        }
    };
    return (
        <>
            <Card style={{ position: "absolute", top: event.y, left: event.x, zIndex: 1000, width: '140px', padding: '0px' }}>
                <CardContent className="CardComponent">
                    {(event.estatus !== 'Realizado' && event.estatus !== 'Cancelado') && (
                        <>
                            <Button fullWidth className="Update-button" onClick={handleEdit}>
                                <FaPencilAlt /> Editar
                            </Button>
                            <Button fullWidth className="Delete-button" onClick={handleOpenDeleteDialog}>
                                <MdDelete /> Eliminar
                            </Button>
                        </>
                    )}
                    <Button fullWidth className="Show-button" onClick={handleShow}>
                        <FaEye /> Ver detalle
                    </Button>
                    <Button fullWidth className="Delete-button" id="cerrar" onClick={onClose}>
                        <IoCloseCircleSharp /> Cerrar
                    </Button>
                </CardContent>
            </Card>
            <ModalEditReservation show={ModalEdit} reservationId={SelectedReservation} onClose={() => setModalEdit(false)} />
            <ModalShowReservation show={ModalShow} reservationId={SelectedReservation} onClose={() => setModalShow(false)} />
            <DialogDelete
                open={openDeleteDialog}
                onClose={handleCloseDeleteDialog}
                onConfirm={handleConfirmDelete}
            />
        </>
    );
};

export default EventMenu;

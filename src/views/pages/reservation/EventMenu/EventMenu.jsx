"use client"

import { useState } from "react"
import { Card, CardContent, Button } from "@mui/material"
import { FaPencilAlt, FaEye } from "react-icons/fa"
import { MdDelete } from "react-icons/md"
import { IoCloseCircleSharp } from "react-icons/io5"
import { FcCancel } from "react-icons/fc"
import axios from "axios"
import ModalEditReservation from "../reservationEdit/index"
import ModalShowReservation from "../ShowReservation/index"
import DialogDelete from "../deleteDialog/index"
import { useAlert } from "../../../../assets/functions/index"
import { FaCalendarCheck } from "react-icons/fa6"

const EventMenu = ({ event, onClose, getReservations }) => {
  const [ModalEdit, setModalEdit] = useState(false)
  const [ModalShow, setModalShow] = useState(false)
  const [SelectedReservation, setSelectedReservation] = useState(null)
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false)
  const [openCancelDialog, setOpenCancelDialog] = useState(false)
  const [openConfirmDialog, setOpenConfirmDialog] = useState(false)
  const { showAlert } = useAlert()

  const token = localStorage.getItem("token")

  const headers = {
    Authorization: `Bearer ${token}`,
  }

  if (!event) return null

  const handleEdit = () => {
    setSelectedReservation(event.id)
    setModalEdit(true)
  }

  const handleShow = () => {
    setSelectedReservation(event.id)
    setModalShow(true)
  }

  const handleOpenDeleteDialog = () => {
    setSelectedReservation(event.id)
    setOpenDeleteDialog(true)
  }

  const handleCloseDeleteDialog = () => {
    setOpenDeleteDialog(false)
  }

  const handleOpenCancelDialog = () => {
    setSelectedReservation(event.id)
    setOpenCancelDialog(true)
  }

  const handleCloseCancelDialog = () => {
    setOpenCancelDialog(false)
  }

  const handleOpenConfirmDialog = () => {
    setSelectedReservation(event.id)
    setOpenConfirmDialog(true)
  }

  const handleCloseConfirmDialog = () => {
    setOpenConfirmDialog(false)
  }

  const handleConfirmDelete = async () => {
    try {
      await fetch(`http://localhost:2025/api/reservation/${event.id}`, {
        method: "DELETE",
        headers: headers,
      })
      showAlert("Eliminado correctamente", "success")
      getReservations()
      setOpenDeleteDialog(false)
    } catch (error) {
      console.error("Error al eliminar la reserva:", error)
    }
  }

  const handleConfirmCancel = async () => {
    try {
      await axios.put(
        `http://localhost:2025/api/reservation/${event.id}`,
        { estatus: "Cancelado" },
        { headers: headers },
      )
      showAlert("Reserva cancelada correctamente", "success")
      getReservations()
      setOpenCancelDialog(false)
    } catch (error) {
      console.error("Error al cancelar la reserva:", error)
      showAlert("Error al cancelar la reserva.", "error")
    }
  }

  const handleConfirmReserved = async () => {
    try {
      await axios.put(
        `http://localhost:2025/api/reservation/${event.id}`,
        { estatus: "Reservado" },
        { headers: headers },
      )
      showAlert("Reserva confirmada correctamente", "success")
      getReservations()
      onClose()
      setOpenConfirmDialog(false)
    } catch (error) {
      console.error("Error al confirmar la reserva:", error)
      showAlert("Error al confirmar la reserva.", "error")
    }
  }

  const userStr = localStorage.getItem("user")
  if (!userStr) {
    return (
      console.log('No hay datos del usuario')
    )
  }

  const user = JSON.parse(userStr)
  const isAdmin = user.roleId === 1 || user.roleId === 5
  const isUser = user.roleId === 3
  const isCompletedOrCanceled = event.estatus === "Realizado" || event.estatus === "Cancelado"

  return (
    <>
      <Card style={{ position: "absolute", top: event.y, left: event.x, zIndex: 1000, width: "140px", padding: "0px" }}>
        <CardContent className="CardComponent">
          {/* Si el estado es Cancelado o Realizado, solo mostrar "Ver detalle" */}
          {isCompletedOrCanceled ? (
            <Button fullWidth className="Show-button" onClick={handleShow}>
              <FaEye /> Ver detalle
            </Button>
          ) : (
            <>
              {/* Si es admin (rol 1 o 5) puede ver todo menos "Cancelar" */}
              {isAdmin && (
                <>
                  <Button fullWidth className="Update-button" onClick={handleEdit}>
                    <FaPencilAlt /> Editar
                  </Button>
                  <Button fullWidth className="Delete-button" onClick={handleOpenDeleteDialog}>
                    <MdDelete /> Eliminar
                  </Button>
                  <Button fullWidth className="Show-button" onClick={handleShow}>
                    <FaEye /> Ver detalle
                  </Button>
                  {event.estatus === "Pendiente" && (
                    <Button fullWidth className="Update-button" onClick={handleOpenConfirmDialog}>
                      <FaCalendarCheck /> Confirmar
                    </Button>
                  )}
                </>
              )}

              {/* Si es usuario (rol 3) solo puede ver "Editar" y "Cancelar" */}
              {isUser && (
                <>
                  <Button fullWidth className="Update-button" onClick={handleEdit}>
                    <FaPencilAlt /> Editar
                  </Button>
                  <Button fullWidth className="Delete-button" onClick={handleOpenCancelDialog}>
                    <FcCancel /> Cancelar
                  </Button>
                  <Button fullWidth className="Show-button" onClick={handleShow}>
                    <FaEye /> Ver detalle
                  </Button>
                </>
              )}
            </>
          )}
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
        title="¿Estás seguro que deseas eliminar?"
        confirmText="Eliminar reserva"
      />
      <DialogDelete
        open={openCancelDialog}
        onClose={handleCloseCancelDialog}
        onConfirm={handleConfirmCancel}
        title="¿Estás seguro que deseas cancelar?"
        confirmText="Cancelar reserva"
      />
      <DialogDelete
        open={openConfirmDialog}
        onClose={handleCloseConfirmDialog}
        onConfirm={handleConfirmReserved}
        title="¿Estás seguro que deseas confirmar esta reserva?"
        confirmText="Confirmar reserva"
        style="Button-save"
      />
    </>
  )
}

export default EventMenu


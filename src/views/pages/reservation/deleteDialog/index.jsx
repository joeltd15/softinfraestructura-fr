import React from "react";
import { Dialog, DialogTitle, DialogContent, DialogActions, Button } from "@mui/material";

const DialogDelete = ({ open, onClose, onConfirm, title = "¿Estás seguro?", confirmText = "Eliminar", style = "Button-next" }) => {
    return (
        <Dialog open={open} onClose={onClose}>
            <DialogTitle>{title}</DialogTitle>
            <DialogContent>
                Esta acción no se puede deshacer.
            </DialogContent>
            <DialogActions>
                <Button className="buttons-form Button-blue" onClick={onClose}>Cancelar</Button>
                <Button className={`buttons-form ${style}`} onClick={onConfirm}>{confirmText}</Button>
            </DialogActions>
        </Dialog>
    );
};

export default DialogDelete;
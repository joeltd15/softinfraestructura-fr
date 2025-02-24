import React from "react";
import { Dialog, DialogTitle, DialogContent, DialogActions, Button } from "@mui/material";

const DialogDelete = ({ open, onClose, onConfirm }) => {
    return (
        <Dialog open={open} onClose={onClose}>
            <DialogTitle>¿Estás seguro?</DialogTitle>
            <DialogContent>
                Esta acción no se puede deshacer.
            </DialogContent>
            <DialogActions>
                <Button className="buttons-form Button-blue" onClick={onClose}>Cancelar</Button>
                <Button className="buttons-form Button-next" onClick={onConfirm}>Eliminar</Button>
            </DialogActions>
        </Dialog>
    );
};

export default DialogDelete;

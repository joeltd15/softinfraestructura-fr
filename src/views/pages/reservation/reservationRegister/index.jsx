import React from "react";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";

const modalStyle = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  boxShadow: 24,
  p: 4,
  borderRadius: "8px",
};

const ReservationModal = ({ selectedDate, onClose }) => {
  return (
    <Modal open={true} onClose={onClose}>
      <Box sx={modalStyle}>
        <Typography variant="h6" gutterBottom>
          Crear Reserva
        </Typography>
        <TextField
          label="Fecha seleccionada"
          value={selectedDate}
          fullWidth
          disabled
          margin="normal"
        />
        <TextField
          label="Nombre"
          fullWidth
          margin="normal"
        />
        <TextField
          label="Teléfono"
          fullWidth
          margin="normal"
        />
        <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 2, mt: 2 }}>
          <Button variant="contained" onClick={onClose}>
            Cancelar
          </Button>
          <Button variant="contained" color="primary">
            Guardar
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};

export default ReservationModal;

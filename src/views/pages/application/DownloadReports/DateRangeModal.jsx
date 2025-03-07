import { useState } from "react"
import { Dialog, DialogActions, DialogContent, DialogTitle, Button, TextField } from "@mui/material"

const DateRangeModal = ({ open, onClose, onConfirm }) => {
  const [startDate, setStartDate] = useState("")
  const [endDate, setEndDate] = useState("")
  const [error, setError] = useState("")

  const handleConfirm = () => {
    // Validación de fechas
    const start = new Date(startDate)
    const end = new Date(endDate)
    const today = new Date()
    today.setHours(0, 0, 0, 0) // Resetear la hora a 00:00:00

    if (start > end) {
      setError("La fecha inicial debe ser anterior a la fecha final.")
      return
    }

    if (start > today || end > today) {
      setError("No se pueden seleccionar fechas futuras.")
      return
    }

    setError("")
    onConfirm(startDate, endDate)
    onClose()
  }

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Seleccionar rango de fechas</DialogTitle>
      <DialogContent>
        <TextField
          label="Fecha de inicio"
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          InputLabelProps={{ shrink: true }}
          fullWidth
          margin="normal"
          max={new Date().toISOString().split("T")[0]}
        />
        <TextField
          label="Fecha de fin"
          type="date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
          InputLabelProps={{ shrink: true }}
          fullWidth
          margin="normal"
          max={new Date().toISOString().split("T")[0]}
        />
        {error && <p style={{ color: "red" }}>{error}</p>}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} className="buttons-form Button-next">Cancelar</Button>
        <Button onClick={handleConfirm} className="buttons-form Button-blue">
          Confirmar y Descargar
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default DateRangeModal
import { useEffect, useRef, useState } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import listPlugin from "@fullcalendar/list";
import interactionPlugin from "@fullcalendar/interaction";
import esLocale from "@fullcalendar/core/locales/es";
import axios from "axios";
import Alert from "@mui/material/Alert";
import Stack from "@mui/material/Stack";
import EventMenu from "./EventMenu/EventMenu"; 
import ReservationModal from "./reservationRegister/index"; // Importamos el modal

const Reservation = () => {
  const calendarRef = useRef(null);
  const [events, setEvents] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchReservations = async () => {
    try {
      const response = await axios.get("http://localhost:2025/api/reservation");
      const reservations = response.data;

      const formattedEvents = reservations.map((reservation) => ({
        title: reservation.scenery,
        start: `${reservation.date}T${reservation.startTime}`,
        end: `${reservation.date}T${reservation.finishTime}`,
        className: getEventClass(reservation.estatus),
      }));

      setEvents(formattedEvents);
    } catch (error) {
      console.error("Error al obtener reservas:", error);
    }
  };

  const getEventClass = (estatus) => {
    switch (estatus) {
      case "Pendiente":
        return "event-pending";
      case "Realizado":
        return "event-completed";
      case "Cancelado":
        return "event-canceled";
      default:
        return "";
    }
  };

  useEffect(() => {
    fetchReservations();
  }, []);

  useEffect(() => {
    if (calendarRef.current) {
      calendarRef.current.getApi().updateSize();
    }
  }, [events]);

  const handleDateClick = (info) => {
    setSelectedDate(info.dateStr); // Guardamos la fecha seleccionada
    setIsModalOpen(true); // Abrimos la modal
  };

  return (
    <div style={{ width: "100%", overflow: "hidden" }}>
      <Stack sx={{ width: "100%" }} spacing={2} className="mb-3">
        <Alert severity="info">Seleccione el día para registrar la reserva.</Alert>
      </Stack>
      <FullCalendar
        viewClassNames={"mb-5"}
        ref={calendarRef}
        plugins={[dayGridPlugin, timeGridPlugin, listPlugin, interactionPlugin]}
        initialView="dayGridMonth"
        headerToolbar={{
          left: "prev,next today",
          center: "title",
          right: "dayGridMonth,timeGridWeek,timeGridDay,listWeek",
        }}
        locale={esLocale}
        events={events}
        height="auto"
        aspectRatio={1.35}
        dateClick={handleDateClick} // Evento para abrir la modal al seleccionar una fecha
      />

      {/* Modal que se muestra cuando se selecciona una fecha */}
      {isModalOpen && (
        <ReservationModal 
          selectedDate={selectedDate} 
          onClose={() => setIsModalOpen(false)} 
        />
      )}
    </div>
  );
};

export default Reservation;

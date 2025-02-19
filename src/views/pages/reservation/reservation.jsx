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
import EventMenu from "./EventMenu/EventMenu"; // Importamos el menú

const Reservation = ({ sidebarOpen }) => {
  const calendarRef = useRef(null);
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);

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

  const handleEventClick = (clickInfo) => {
    const rect = clickInfo.jsEvent.target.getBoundingClientRect();
    setSelectedEvent({ 
      x: rect.left + window.scrollX, 
      y: rect.bottom + window.scrollY 
    });
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
        eventClick={handleEventClick}
      />
      {selectedEvent && <EventMenu event={selectedEvent} onClose={() => setSelectedEvent(null)} />}
    </div>
  );
};

export default Reservation;

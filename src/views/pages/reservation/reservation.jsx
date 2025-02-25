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
import ReservationModal from "./reservationRegister/index";
import { toast } from "react-toastify";

const Reservation = () => {
  const calendarRef = useRef(null);
  const [events, setEvents] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);

  // Función para formatear la hora a formato de 12 horas con AM/PM
  const formatTime = (timeString) => {
    const [hours, minutes] = timeString.split(":");
    const date = new Date();
    date.setHours(hours, minutes);
    return date.toLocaleTimeString("es-ES", { hour: "2-digit", minute: "2-digit", hour12: true });
  };

  // Función para obtener reservas
  const fetchReservations = async () => {
    try {
      const response = await axios.get("http://localhost:2025/api/reservation");
      const reservations = response.data;
  
      // Obtener usuario logueado
      const user = JSON.parse(localStorage.getItem("user"));
  
      const filteredReservations = reservations.filter((reservation) => {
        // Si el usuario no es admin (roleId !== 1), excluir eventos cancelados
        return user.roleId === 1 || reservation.estatus !== "Cancelado";
      });
  
      const formattedEvents = filteredReservations.map((reservation) => ({
        id: reservation.id,
        estatus: reservation.estatus,
        title: `${formatTime(reservation.startTime)} - ${formatTime(reservation.finishTime)}`,
        start: `${reservation.date}T${reservation.startTime}`,
        end: `${reservation.date}T${reservation.finishTime}`,
        className: getEventClass(reservation.estatus),
      }));
  
      setEvents(formattedEvents);
    } catch (error) {
      console.error("Error al obtener reservas:", error);
    }
  };
  

  // Asignar clases según estado
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

    const intervalId = setInterval(() => {
      fetchReservations();
    }, 60000);
    return () => clearInterval(intervalId);
  }, []);

  useEffect(() => {
    if (calendarRef.current) {
      calendarRef.current.getApi().updateSize();
    }
  }, [events]);

  const handleDateClick = (info) => {
    const selectedDate = new Date(info.dateStr);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (selectedDate < today) {
      toast.warning("No se pueden registrar reservas en fechas pasadas.");
      return;
    }

    setSelectedDate(info.dateStr);
    setIsModalOpen(true);
  };


  const handleEventClick = (clickInfo) => {
    const rect = clickInfo.jsEvent.target.getBoundingClientRect();
    setSelectedEvent({
      id: clickInfo.event.id,
      estatus: clickInfo.event.extendedProps.estatus,
      x: rect.left + window.scrollX,
      y: rect.bottom + window.scrollY
    });
  };

  const user = JSON.parse(localStorage.getItem("user"));


  return (
    <div style={{ width: "100%", overflow: "hidden" }}>
      <div className="row">
        <div className="col-sm-6">
          <Stack sx={{ width: "100%" }} spacing={2} className="mb-3">
            <Alert severity="info">Seleccione el día para registrar la reserva.</Alert>
          </Stack>
        </div>
        <div className="col-sm-6">
          <Stack sx={{ width: "100%" }} spacing={2} className="mb-3">
            <Alert>
              <div className="d-flex align-items-center">
                <div className="pending d-flex align-items-center"><div className="pending-Circle"></div><span>Pendiente</span></div>
                <div className="completed d-flex align-items-center"><div className="completed-Circle"></div><span>Completado</span></div>
                {
                  user.roleId == 1 && (
                    <div className="cancelado d-flex align-items-center"><div className="cancelado-Circle"></div><span>Cancelado</span></div>
                  )
                }
              </div>
            </Alert>
          </Stack>
        </div>
      </div>
      <FullCalendar
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
        dateClick={handleDateClick}
        eventClick={handleEventClick}
        displayEventTime={false}
      />

      {selectedEvent && (
        <EventMenu
          event={selectedEvent}
          onClose={() => setSelectedEvent(null)}
          getReservations={() => fetchReservations()}
        />
      )}

      {isModalOpen && (
        <ReservationModal
          show={isModalOpen}
          selectedDate={selectedDate}
          onClose={() => setIsModalOpen(false)}
          getReservations={() => fetchReservations()}
        />
      )}
    </div>
  );
};

export default Reservation;
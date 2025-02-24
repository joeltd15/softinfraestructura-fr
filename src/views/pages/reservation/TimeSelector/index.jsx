import React, { useState } from 'react';
import { Button, Popover, OverlayTrigger, Form } from 'react-bootstrap';

const CustomTimeSelector = ({ value, onChange, name, disabled = false }) => {
    const [show, setShow] = useState(false);
    const [selectedHour, setSelectedHour] = useState(null);

    const generateHourSlots = () => {
        const slots = [];
        for (let hour = 8; hour <= 17; hour++) { // Ajustado de 8 AM a 5 PM
            const time24 = `${hour.toString().padStart(2, '0')}:00`;
            const time12 = convertTo12HourFormat(time24);
            slots.push({ time24, time12 });
        }
        return slots;
    };

    const generateMinuteSlots = (hour) => {
        const slots = [];
        for (let minute = 0; minute <= 30; minute += 30) {
            const time24 = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
            const time12 = convertTo12HourFormat(time24);
            slots.push({ time24, time12 });
        }
        return slots;
    };

    const convertTo12HourFormat = (time24) => {
        const [hour, minute] = time24.split(':');
        let hour12 = parseInt(hour, 10) % 12;
        hour12 = hour12 === 0 ? 12 : hour12;
        const ampm = parseInt(hour, 10) >= 12 ? 'PM' : 'AM';
        return `${hour12}:${minute} ${ampm}`;
    };

    const handleHourSelect = (hour) => {
        setSelectedHour(hour);
    };

    const handleTimeSelect = (time24, event) => {
        if (event) {
            event.preventDefault();
            event.stopPropagation();  // Evita la propagación del evento
        }
        onChange(time24);
        setShow(false);
        setSelectedHour(null);
    };



    const popover = (
        <Popover id="popover-basic" className="custom-time-popover">
            <Popover.Body>
                <div className="time-grid">
                    {selectedHour === null ? (
                        generateHourSlots().map(({ time24, time12 }) => (
                            <Button
                                key={time24}
                                variant="outline-secondary"
                                size="sm"
                                type="button"  // Asegura que no sea un submit
                                onClick={(event) => handleTimeSelect(time24, event)}
                                className="m-1"
                            >
                                {time12}
                            </Button>

                        ))
                    ) : (
                        generateMinuteSlots(selectedHour).map(({ time24, time12 }) => (
                            <Button
                                key={time24}
                                variant="outline-primary"
                                size="sm"
                                type="button"  // Asegura que no sea un submit
                                onClick={(event) => handleTimeSelect(time24, event)}
                                className="m-1"
                            >
                                {time12}
                            </Button>

                        ))
                    )}
                </div>
                {selectedHour !== null && (
                    <Button
                        variant="link"
                        size="sm"
                        onClick={() => setSelectedHour(null)}
                        className="mt-2"
                    >
                        Volver a selección de hora
                    </Button>
                )}
            </Popover.Body>
        </Popover>
    );

    return (
        <div className="d-flex align-items-center">
            <Form.Control
                type="text"
                name={name}
                value={value ? convertTo12HourFormat(value) : ''}
                disabled={disabled}
                placeholder="hh:mm AM/PM"
            />
            {!disabled && (
                <OverlayTrigger
                    trigger="click"
                    placement="bottom"
                    show={show}
                    overlay={popover}
                    rootClose={true}  // Cierra el popover al hacer clic fuera
                    onToggle={() => {
                        setShow(!show);
                        setSelectedHour(null);
                    }}
                >
                    <button type="button" className="menu__icon"></button>
                </OverlayTrigger>
            )}
        </div>
    );
};

export default CustomTimeSelector;

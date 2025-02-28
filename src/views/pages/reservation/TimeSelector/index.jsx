"use client"

import { useState } from "react"
import { Button, Popover, OverlayTrigger, Form } from "react-bootstrap"

const CustomTimeSelector = ({
  value,
  onChange,
  name,
  disabled = false,
  availableTimes = [],
  isFullyBooked = false,
}) => {
  const [show, setShow] = useState(false)

  const convertTo12HourFormat = (time24) => {
    const [hour, minute] = time24.split(":")
    let hour12 = Number.parseInt(hour, 10) % 12
    hour12 = hour12 === 0 ? 12 : hour12
    const ampm = Number.parseInt(hour, 10) >= 12 ? "PM" : "AM"
    return `${hour12}:${minute} ${ampm}`
  }

  const handleTimeSelect = (time24, event) => {
    if (event) {
      event.preventDefault()
      event.stopPropagation()
    }
    onChange(time24)
    setShow(false)
  }

  const popover = (
    <Popover id="popover-basic" className="custom-time-popover">
      <Popover.Body>
        <div className="time-grid">
          {availableTimes.map((time24) => (
            <Button
              key={time24}
              variant="outline-secondary"
              size="sm"
              type="button"
              onClick={(event) => handleTimeSelect(time24, event)}
              className="m-1"
            >
              {convertTo12HourFormat(time24)}
            </Button>
          ))}
        </div>
      </Popover.Body>
    </Popover>
  )

  return (
    <div className="d-flex align-items-center">
      <Form.Control
        type="text"
        name={name}
        value={value ? convertTo12HourFormat(value) : ""}
        disabled={disabled || isFullyBooked}
        placeholder="hh:mm AM/PM"
        readOnly
      />
      {!disabled && !isFullyBooked && availableTimes.length > 0 && (
        <OverlayTrigger
          trigger="click"
          placement="bottom"
          show={show}
          overlay={popover}
          rootClose={true}
          onToggle={() => setShow(!show)}
        >
          <button type="button" className="menu__icon"></button>
        </OverlayTrigger>
      )}
      {(disabled || isFullyBooked || availableTimes.length === 0) && (
        <button type="button" className="menu__icon menu__icon--disabled" disabled></button>
      )}
    </div>
  )
}

export default CustomTimeSelector;
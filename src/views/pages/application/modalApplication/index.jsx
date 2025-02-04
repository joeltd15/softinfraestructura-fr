import { useState } from "react";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Modal from "react-bootstrap/Modal";
import { Col, Row } from 'react-bootstrap';


const CustomModal = ({ show, handleClose }) => {
    return (
        <Modal show={show} onHide={handleClose} backdrop="static">
            <Modal.Header closeButton>
                <Modal.Title>Registrar solicitud</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form>
                    <Form.Group className="mb-3" as={Row} controlId="formReportDate">
                        <Col sm="6">
                            <Form.Label className="required">Fecha</Form.Label>
                            <Form.Control type="date" />
                        </Col>
                        <Col sm="6">
                            <Form.Label className="required">Centro/dependencia</Form.Label>
                            <Form.Control type="text" placeholder="Ingrese la dependencia" />
                        </Col>
                    </Form.Group>
                    <Form.Group className="mb-3" as={Row} controlId="formDependence">
                        <Col sm="6">
                            <Form.Label className="required">Lugar</Form.Label>
                            <Form.Control type="text" placeholder="Ingrese el lugar" />
                        </Col>
                        <Col sm="6">
                            <Form.Label className="required">Novedades</Form.Label>
                            <Form.Control as="textarea" rows={2} placeholder="Describa las novedades" />
                        </Col>
                    </Form.Group>
                    <Form.Group className="mb-3" as={Row} controlId="formLocation">
                        <Col sm="6">
                            <Form.Label>Evidencia</Form.Label>
                            <Form.Control type="file" />
                        </Col>
                        <Col sm="6">
                            <Form.Label className='required'>Tipo de solicitud</Form.Label>
                            <Form.Select aria-label="Default select example">
                                <option>...</option>
                                <option value="20">Electricidad</option>
                                <option value="30">Plomeria</option>
                                <option value="45">Inmobiliario</option>
                                <option value="60">Redes</option>
                                <option value="60">Acabados</option>
                            </Form.Select>
                        </Col>
                    </Form.Group>
                    <Form.Group className="mb-3" as={Row} controlId="forType">
                        <Col sm="6">
                            <Form.Label className='required'>Estado</Form.Label>
                            <Form.Select aria-label="Default select example">
                                <option hidden="">...</option>
                                <option value="20">En espera</option>
                                <option value="20">En espera por falta de recursos</option>
                                <option value="30">Realizada</option>
                                <option value="30">Asignada</option>
                            </Form.Select>
                        </Col>
                        <Col sm="6">
                            <Form.Label className='required'>Usuario</Form.Label>
                            <Form.Select aria-label="Default select example">
                                <option hidden="">...</option>
                                <option value="20">Miguel</option>
                                <option value="20">Joel</option>
                                <option value="30">Daniel</option>
                                <option value="30">Carolina</option>
                            </Form.Select>
                        </Col>
                    </Form.Group>
                </Form>
            </Modal.Body>
            <Modal.Footer>
                <Button className="buttons-form Button-next" onClick={handleClose}>
                    Salir
                </Button>
                <Button className="buttons-form Button-save" onClick={handleClose}>
                    Guardar
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default CustomModal;

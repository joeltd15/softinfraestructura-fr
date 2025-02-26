import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';

function ShowUserModal({ show, handleClose, user = null, roles = [] }) {
  const getRoleName = (roleId) => {
    const role = roles.find((r) => r.id === roleId);
    return role ? role.name : "Desconocido";
  };

  return (
    <Modal show={show} onHide={handleClose} backdrop="static" keyboard={false}>
      <Modal.Header closeButton>
        <Modal.Title>Detalles del Usuario</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {user && (
          <div className="container">
            <div className="row">
              <div className="col-sm-6">
                <p><strong>Id:</strong> {user.id}</p>
              </div>
              <div className="col-sm-6">
                <p><strong>Nombre:</strong> {user.name}</p>
              </div>
            </div>

            <div className="row">
              <div className="col-sm-6">
                <p className="text-truncate"><strong>Email:</strong> {user.email}</p>
              </div>
              <div className="col-sm-6">
                <p><strong>Teléfono:</strong> {user.phone}</p>
              </div>
            </div>

            <div className="row">
              <div className="col-sm-6">
                <p><strong>Estado:</strong> {user.status}</p>
              </div>
              <div className="col-sm-6">
                <p><strong>Rol:</strong> {getRoleName(user.roleId)}</p>
              </div>
            </div>
          </div>
        )}
      </Modal.Body>
      <Modal.Footer>
        <Button className="buttons-form Button-next" onClick={handleClose}>
          Cerrar
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default ShowUserModal;
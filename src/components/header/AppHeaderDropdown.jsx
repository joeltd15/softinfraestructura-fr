import React, { useState } from 'react'
import {
  CAvatar,
  CBadge,
  CDropdown,
  CDropdownDivider,
  CDropdownHeader,
  CDropdownItem,
  CDropdownMenu,
  CDropdownToggle,
} from '@coreui/react'
import {
  cilBell,
  cilCreditCard,
  cilCommentSquare,
  cilEnvelopeOpen,
  cilFile,
  cilLockLocked,
  cilSettings,
  cilTask,
  cilUser,
} from '@coreui/icons'
import CIcon from '@coreui/icons-react'
import { Link, useNavigate } from 'react-router-dom';
import avatar8 from './../../assets/images/Logosimbolo-SENA-PRINCIPAL.png'
import UpdatedPasswordModal from '../../views/pages/forgotPassword/updatedPassword'

const AppHeaderDropdown = () => {
  const navigate = useNavigate();
  const [show, setShow] = useState(false);

  const token = localStorage.getItem("token");

  const handleModal = () => {
    setShow(true)
    console.log(token)
  }

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };


  return (
    <>
      <CDropdown variant="nav-item">
        <CDropdownToggle placement="bottom-end" className="py-0 pe-0" caret={false}>
          <CAvatar src={avatar8} size="lg" />
        </CDropdownToggle>
        <CDropdownMenu className="pt-0" placement="bottom-end">
          <CDropdownHeader className="bg-body-secondary fw-semibold my-2">Configuraciones</CDropdownHeader>
          <Link className='t-decoration' onClick={handleModal}>
            <CDropdownItem>
              <CIcon icon={cilUser} className="me-2" />
              Cambiar contraseña
            </CDropdownItem>
          </Link>
          <CDropdownDivider />
          <CDropdownItem onClick={handleLogout}>
            <CIcon icon={cilLockLocked} className="me-2" />
            Cerrar sesión
          </CDropdownItem>

        </CDropdownMenu>
      </CDropdown>
      <UpdatedPasswordModal show={show} handleClose={() => setShow(false)} token={token} />
    </>
  )
}

export default AppHeaderDropdown

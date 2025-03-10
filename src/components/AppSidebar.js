import React, { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'

import {
  CCloseButton,
  CSidebar,
  CSidebarBrand,
  CSidebarFooter,
  CSidebarHeader,
  CSidebarToggler,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'

import { AppSidebarNav } from './AppSidebarNav'

import { FaUserCircle } from "react-icons/fa";
import { FaScroll } from "react-icons/fa6";

// sidebar nav config
import navigation from '../_nav'
import axios from 'axios'

const AppSidebar = () => {
  const urlRole = 'https://softinfraestructura-86fdvmh2g-ingdanielbs-projects.vercel.app/api/role';
  const dispatch = useDispatch()
  const unfoldable = useSelector((state) => state.sidebarUnfoldable)
  const sidebarShow = useSelector((state) => state.sidebarShow)
  const [role, setRole] = useState([]);
  const token = localStorage.getItem("token");

  const headers = {
    Authorization: `Bearer ${token}`,
  }


  useEffect(() => {
    getRoles();
  }, [])

  const getRoles = async () => {
    const response = await axios.get(urlRole, {headers});
    setRole(response.data)
  }

  const user = JSON.parse(localStorage.getItem("user"));
  if (!user || !user.id) {
    toast.error("No se pudo obtener la información del usuario.");
    return;
  };

  const userRole = (RoleId) => {
    if (!role.length) return "Cargando...";
    const foundRole = role.find(r => r.id === RoleId);
    return foundRole ? foundRole.name : "Desconocido";
  };


  return (
    <CSidebar
      className="border-end"
      colorScheme="dark"
      position="fixed"
      unfoldable={unfoldable}
      visible={sidebarShow}
      onVisibleChange={(visible) => {
        dispatch({ type: 'set', sidebarShow: visible })
      }}
    >
      <CSidebarHeader className="border-bottom">
        <CSidebarBrand to="/">
          <div className='user-login'>
            <p><FaUserCircle />{user.name}</p>
            <div className='user-content'>
              <span className='info-user'>{userRole(user.roleId)}</span>
            </div>
          </div>
        </CSidebarBrand>
        <CCloseButton
          className="d-lg-none"
          dark
          onClick={() => dispatch({ type: 'set', sidebarShow: false })}
        />
      </CSidebarHeader>
      <AppSidebarNav items={navigation} />
      <CSidebarFooter className="border-top d-none d-lg-flex">
        <CSidebarToggler
          onClick={() => dispatch({ type: 'set', sidebarUnfoldable: !unfoldable })}
        />
      </CSidebarFooter>
    </CSidebar>
  )
}

export default React.memo(AppSidebar)

import React from 'react';
import { BottomNavigation, BottomNavigationAction } from '@mui/material';
import { Link } from 'react-router-dom';
import HomeIcon from '@mui/icons-material/Home';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import ManageAccountsIcon from '@mui/icons-material/ManageAccounts';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import { useAuth } from '../../context/AuthContext'

function FooterNavigation() {
  const { userInfo } = useAuth()

  return (
    <BottomNavigation
      sx={{
        width: '100%',
        position: 'fixed',
        bottom: 0,
        backgroundColor: '#f6a700',
        color: 'white',
      }}
    >
      <BottomNavigationAction component={Link} to="/inicio" label="Início" icon={<HomeIcon />} showLabel />
      <BottomNavigationAction component={Link} to="/novo-agendamento" label="Agendar" icon={<AddCircleIcon />} showLabel />
      {userInfo?.profile !== 'client' && (
      <BottomNavigationAction component={Link} to="/agenda" label="Agenda" icon={<CalendarMonthIcon />} showLabel />
      )}
      <BottomNavigationAction component={Link} to="/configuracoes" label="Perfil" icon={<ManageAccountsIcon />} showLabel />
    </BottomNavigation>
  );
}

export default FooterNavigation;

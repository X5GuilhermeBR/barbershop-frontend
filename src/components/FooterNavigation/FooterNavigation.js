import React from 'react';
import { BottomNavigation, BottomNavigationAction } from '@mui/material';
import { Link } from 'react-router-dom';
import HomeIcon from '@mui/icons-material/Home';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';

function FooterNavigation() {
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
      <BottomNavigationAction component={Link} to="/agendar" label="Agendar" icon={<AddCircleIcon />} showLabel />
      <BottomNavigationAction component={Link} to="/perfil" label="Perfil" icon={<AccountCircleIcon />} showLabel />
    </BottomNavigation>
  );
}

export default FooterNavigation;

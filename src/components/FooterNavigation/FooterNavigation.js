import React from 'react';
import { BottomNavigation, BottomNavigationAction } from '@mui/material';

import HomeIcon from '@mui/icons-material/Home';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import LibraryBooksIcon from '@mui/icons-material/LibraryBooks';

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
      <BottomNavigationAction label="Início" icon={<HomeIcon />} showLabel />
      <BottomNavigationAction label="Agendar" icon={<AddCircleIcon />} showLabel />
      <BottomNavigationAction label="Histórico" icon={<LibraryBooksIcon />} showLabel />
      <BottomNavigationAction label="Perfil" icon={<AccountCircleIcon />} showLabel />
    </BottomNavigation>
  );
}

export default FooterNavigation;

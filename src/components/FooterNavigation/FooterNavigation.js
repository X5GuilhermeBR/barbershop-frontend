import React, { useState } from 'react';
import { BottomNavigation, BottomNavigationAction } from '@mui/material';
import { Link } from 'react-router-dom';
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';
import AddCircleOutlinedIcon from '@mui/icons-material/AddCircleOutlined';
import CalendarMonthOutlinedIcon from '@mui/icons-material/CalendarMonthOutlined';
import ManageAccountsOutlinedIcon from '@mui/icons-material/ManageAccountsOutlined';
import HomeIcon from '@mui/icons-material/Home';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import ManageAccountsIcon from '@mui/icons-material/ManageAccounts';
import { useAuth } from '../../context/AuthContext';

function FooterNavigation() {
  const { userInfo } = useAuth();
  const [value, setValue] = useState('home');

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <BottomNavigation
      value={value}
      onChange={handleChange}
      sx={{
        width: '100%',
        position: 'fixed',
        bottom: 0,
        backgroundColor: 'black',
        color: 'white',
      }}
    >
      <BottomNavigationAction
        component={Link}
        to="/inicio"
        label="Início"
        value="home"
        icon={value === 'home' ? <HomeIcon sx={{ fill: 'white' }} /> : <HomeOutlinedIcon />}
        sx={{ color: 'inherit', '&.Mui-selected': { color: 'white' } }}
        showLabel
      />
      {userInfo?.profile !== 'barber' && (
        <BottomNavigationAction
          component={Link}
          to="/novo-agendamento"
          label="Agendar"
          value="schedule"
          icon={value === 'schedule' ? <AddCircleIcon sx={{ fill: 'white' }} /> : <AddCircleOutlinedIcon />}
          sx={{ color: 'inherit', '&.Mui-selected': { color: 'white' } }}
          showLabel
        />
      )}
      {userInfo?.profile !== 'client' && (
        <BottomNavigationAction
          component={Link}
          to="/agenda"
          label="Agenda"
          value="agenda"
          icon={value === 'agenda' ? <CalendarMonthIcon sx={{ fill: 'white' }} /> : <CalendarMonthOutlinedIcon />}
          sx={{ color: 'inherit', '&.Mui-selected': { color: 'white' } }}
          showLabel
        />
      )}
      <BottomNavigationAction
        component={Link}
        to="/configuracoes"
        label="Perfil"
        value="profile"
        icon={value === 'profile' ? <ManageAccountsIcon sx={{ fill: 'white' }} /> : <ManageAccountsOutlinedIcon />}
        sx={{ color: 'inherit', '&.Mui-selected': { color: 'white' } }}
        showLabel
      />
    </BottomNavigation>
  );
}

export default FooterNavigation;

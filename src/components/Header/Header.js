/* eslint-disable react/prop-types */
import React from 'react';
import ListSubheader from '@mui/material/ListSubheader';
import ListItemIcon from '@mui/material/ListItemIcon';

function Header
({ icon, title }) {
  return (
    <ListSubheader
      component="div"
      id="nested-list-subheader"
      sx={{
        display: 'flex',
        alignItems: 'center', // Alinhar verticalmente
        fontWeight: 'bold',
        fontSize: '1.2rem',
        paddingTop: '12px',
        paddingBottom: '12px',
        borderBottom: '1px solid #ddd',
        bgcolor: 'black', // Fundo preto
        color: 'orange', // Texto laranja
        boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.1)', // Sombra
        borderRadius: '0', // Remover borda curvada
      }}
    >
      {icon && (
        <ListItemIcon sx={{ color: 'orange'}}>
          {icon}
        </ListItemIcon>
      )}
      {title}
    </ListSubheader>
  );
}

export default Header
;

import CardGiftcardIcon from '@mui/icons-material/CardGiftcard'
import ExitToAppIcon from '@mui/icons-material/ExitToApp'
import HistoryIcon from '@mui/icons-material/History'
import InsertEmoticonIcon from '@mui/icons-material/InsertEmoticon'
import PasswordIcon from '@mui/icons-material/Password'
import List from '@mui/material/List'
import ListItemButton from '@mui/material/ListItemButton'
import ListItemIcon from '@mui/material/ListItemIcon'
import ListItemText from '@mui/material/ListItemText'
import ListSubheader from '@mui/material/ListSubheader'
import * as React from 'react'
import FooterNavigation from '../../components/FooterNavigation/FooterNavigation'

export default function Options() {
  return (
    <>
      <List
        sx={{
          width: '100%',
          bgcolor: '#f5f5f5',
          borderRadius: '10px',
          boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.1)',
          '& .MuiListSubheader-root': {
            fontWeight: 'bold',
            fontSize: '1.2rem',
            paddingTop: '12px',
            paddingBottom: '12px',
            borderBottom: '1px solid #ddd',
            bgcolor: 'black', // Fundo preto
            color: 'orange', // Texto laranja
            boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.1)', // Sombra
            borderRadius: '0', // Remover borda curvada
          },
          '& .MuiListItemButton-root': {
            '&:hover': {
              backgroundColor: '#e0e0e0', // Fundo das opções ao passar o mouse
            },
            bgcolor: '#fff', // Fundo das opções
            padding: '16px 24px', // Espaçamento maior
          },
        }}
        component="nav"
        aria-labelledby="nested-list-subheader"
        subheader={
          <ListSubheader component="div" id="nested-list-subheader">
            Configurações
          </ListSubheader>
        }
      >
        <ListItemButton>
          <ListItemIcon>
            <InsertEmoticonIcon />
          </ListItemIcon>
          <ListItemText primary="Editar Perfil" />
        </ListItemButton>
        <ListItemButton>
          <ListItemIcon>
            <PasswordIcon />
          </ListItemIcon>
          <ListItemText primary="Alterar Senha" />
        </ListItemButton>
        <ListItemButton>
          <ListItemIcon>
            <HistoryIcon />
          </ListItemIcon>
          <ListItemText primary="Meu histórico" />
        </ListItemButton>
        <ListItemButton>
          <ListItemIcon>
            <CardGiftcardIcon />
          </ListItemIcon>
          <ListItemText primary="Cartão Fidelidade" />
        </ListItemButton>
        <ListItemButton>
          <ListItemIcon>
            <ExitToAppIcon />
          </ListItemIcon>
          <ListItemText primary="Sair" />
        </ListItemButton>
      </List>
      <FooterNavigation />
    </>
  );
}

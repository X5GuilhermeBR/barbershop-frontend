import CardGiftcardIcon from '@mui/icons-material/CardGiftcard'
import ExitToAppIcon from '@mui/icons-material/ExitToApp'
import HistoryIcon from '@mui/icons-material/History'
import InsertEmoticonIcon from '@mui/icons-material/InsertEmoticon'
import PasswordIcon from '@mui/icons-material/Password'
import SettingsIcon from '@mui/icons-material/Settings'
import { Grid } from '@mui/material'
import ListItemButton from '@mui/material/ListItemButton'
import ListItemIcon from '@mui/material/ListItemIcon'
import ListItemText from '@mui/material/ListItemText'
import * as React from 'react'
import { Link } from 'react-router-dom'; // Importe o componente Link
import FooterNavigation from '../../components/FooterNavigation/FooterNavigation'
import PageHeader from '../../components/Header/Header'

export default function Options() {
  return (
    <>
      <PageHeader icon={<SettingsIcon/>}  title='Configurações' />
      <Grid item style={{ marginBottom: '4rem', marginTop: '1rem', flex: '1 0 auto', zIndex: 1 }}>
        <ListItemButton component={Link} to="/configuracoes/editar-perfil"> {/* Adicione o Link com a rota desejada */}
          <ListItemIcon>
            <InsertEmoticonIcon />
          </ListItemIcon>
          <ListItemText primary="Editar Perfil" />
        </ListItemButton>
        <ListItemButton component={Link} to="/change-password"> {/* Adicione o Link com a rota desejada */}
          <ListItemIcon>
            <PasswordIcon />
          </ListItemIcon>
          <ListItemText primary="Alterar Senha" />
        </ListItemButton>
        <ListItemButton component={Link} to="/my-history"> {/* Adicione o Link com a rota desejada */}
          <ListItemIcon>
            <HistoryIcon />
          </ListItemIcon>
          <ListItemText primary="Meu histórico" />
        </ListItemButton>
        <ListItemButton component={Link} to="/loyalty-card"> {/* Adicione o Link com a rota desejada */}
          <ListItemIcon>
            <CardGiftcardIcon />
          </ListItemIcon>
          <ListItemText primary="Cartão Fidelidade" />
        </ListItemButton>
        <ListItemButton component={Link} to="/logout"> {/* Adicione o Link com a rota desejada */}
          <ListItemIcon>
            <ExitToAppIcon />
          </ListItemIcon>
          <ListItemText primary="Sair" />
        </ListItemButton>
      </Grid>
      <FooterNavigation />
    </>
  );
}

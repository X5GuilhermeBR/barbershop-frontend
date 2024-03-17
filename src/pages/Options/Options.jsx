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
import { Link, useNavigate } from 'react-router-dom'
import FooterNavigation from '../../components/FooterNavigation/FooterNavigation'
import PageHeader from '../../components/Header/Header'
import { useAuth } from '../../context/AuthContext'


export default function Options() {
  const { logout } = useAuth(); // Obtém a função logout do contexto de autenticação
  const navigate = useNavigate(); // Obtém a função de navegação

  const handleLogout = () => {
    if (logout()) {
      navigate('/'); // Redireciona para a página inicial após o logout
    }
  };

  return (
    <>
      <PageHeader icon={<SettingsIcon/>}  title='Configurações' />
      <Grid item style={{ marginBottom: '4rem', marginTop: '1rem', flex: '1 0 auto', zIndex: 1 }}>
        <ListItemButton component={Link} to="/configuracoes/editar-perfil">
          <ListItemIcon>
            <InsertEmoticonIcon />
          </ListItemIcon>
          <ListItemText primary="Editar Perfil" />
        </ListItemButton>
        <ListItemButton component={Link} to="/configuracoes/alterar-senha">
          <ListItemIcon>
            <PasswordIcon />
          </ListItemIcon>
          <ListItemText primary="Alterar Senha" />
        </ListItemButton>
        <ListItemButton component={Link} to="/configuracoes/historico">
          <ListItemIcon>
            <HistoryIcon />
          </ListItemIcon>
          <ListItemText primary="Meu Histórico" />
        </ListItemButton>
        <ListItemButton component={Link} to="/loyalty-card" disabled> {/* Desabilita o clique */}
          <ListItemIcon>
            <CardGiftcardIcon />
          </ListItemIcon>
          <ListItemText primary="Cartão Fidelidade" />
        </ListItemButton>
        <ListItemButton onClick={handleLogout}> {/* Chama a função handleLogout ao clicar */}
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

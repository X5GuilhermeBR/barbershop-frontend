import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import CardGiftcardIcon from '@mui/icons-material/CardGiftcard';
import CategoryIcon from '@mui/icons-material/Category';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import GroupsIcon from '@mui/icons-material/Groups';
import HistoryIcon from '@mui/icons-material/History';
import InsertEmoticonIcon from '@mui/icons-material/InsertEmoticon';
import PasswordIcon from '@mui/icons-material/Password';
import RoomServiceIcon from '@mui/icons-material/RoomService';
import SettingsIcon from '@mui/icons-material/Settings';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import { Grid, ListItemText } from '@mui/material';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import * as React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styled from 'styled-components'; // Importa styled-components
import FooterNavigation from '../../components/FooterNavigation/FooterNavigation';
import PageHeader from '../../components/Header/Header';
import { useAuth } from '../../context/AuthContext';

// Define um novo componente ListItemTextStyled usando styled-components
const ListItemTextStyled = styled(ListItemText)`
  color: white; // Define a cor do texto como branco
`;

export default function Options() {
  const { logout, userInfo } = useAuth(); // Obtém a função logout do contexto de autenticação
  const navigate = useNavigate(); // Obtém a função de navegação

  const handleLogout = () => {
    if (logout()) {
      navigate('/');
    }
  };

  const handleWhatsAppClick = () => {
    const phoneNumber = '5521972862906';
    const message = encodeURIComponent(
      `Olá, Tudo bem? Me chamo ${userInfo.name} e vim através do app Flow Barbershop e gostaria de tirar algumas dúvidas com vocês.`
    );
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${message}`;

    window.location.href = whatsappUrl;
  };

  const ListItemIconStyled = styled(ListItemIcon)`
    & .MuiSvgIcon-root {
      color: white;
    }
  `;

  const BottomButtonContainer = styled.div`
    position: fixed;
    bottom: 60px; /* Ajuste a posição vertical conforme necessário */
    width: 100%;
    max-width: 400px; /* Defina a largura máxima conforme desejado */
    z-index: 1000; /* Defina um z-index maior que o do menu inferior */
    font-family: 'Bahnschrift', sans-serif;
  `;

  return (
    <>
      <PageHeader icon={<SettingsIcon />} title="Configurações" />
      <Grid item style={{ marginBottom: '4rem', marginTop: '1rem', flex: '1 0 auto', zIndex: 1 }}>
        <ListItemButton component={Link} to="/configuracoes/editar-perfil">
          <ListItemIconStyled>
            <InsertEmoticonIcon />
          </ListItemIconStyled>
          {/* Usa o novo componente ListItemTextStyled */}
          <ListItemTextStyled primary="Editar Perfil" />
        </ListItemButton>
        <ListItemButton component={Link} to="/configuracoes/alterar-senha">
          <ListItemIconStyled>
            <PasswordIcon />
          </ListItemIconStyled>
          <ListItemTextStyled primary="Alterar Senha" />
        </ListItemButton>
        <ListItemButton component={Link} to="/configuracoes/historico">
          <ListItemIconStyled>
            <HistoryIcon />
          </ListItemIconStyled>
          <ListItemTextStyled primary="Meu Histórico" />
        </ListItemButton>
        {userInfo.profile === 'client' && (
          <ListItemButton component={Link} to="/loyalty-card" disabled>
            <ListItemIconStyled>
              <CardGiftcardIcon />
            </ListItemIconStyled>
            <ListItemTextStyled primary="Cartão Fidelidade" />
          </ListItemButton>
        )}
        {userInfo.profile === 'barber' && (
          <>
            <ListItemButton component={Link} to="/configuracoes/clientes">
              <ListItemIconStyled>
                <GroupsIcon />
              </ListItemIconStyled>
              <ListItemTextStyled primary="Clientes" />
            </ListItemButton>
            <ListItemButton component={Link} to="/configuracoes/produtos">
              <ListItemIconStyled>
                <CategoryIcon />
              </ListItemIconStyled>
              <ListItemTextStyled primary="Produtos" />
            </ListItemButton>
            <ListItemButton component={Link} to="/configuracoes/servicos">
              <ListItemIconStyled>
                <RoomServiceIcon />
              </ListItemIconStyled>
              <ListItemTextStyled primary="Serviços" />
            </ListItemButton>
            <ListItemButton component={Link} to="/configuracoes/financeiro">
              <ListItemIconStyled>
                <AccountBalanceWalletIcon />
              </ListItemIconStyled>
              <ListItemTextStyled primary="Financeiro" />
            </ListItemButton>
          </>
        )}
        {userInfo.profile === 'client' && (
          <ListItemButton onClick={handleWhatsAppClick}>
            <ListItemIconStyled>
              <WhatsAppIcon />
            </ListItemIconStyled>
            <ListItemTextStyled primary="Fale Conosco" />
          </ListItemButton>
        )}
      </Grid>
      <BottomButtonContainer>
        <ListItemButton onClick={handleLogout}>
          <ListItemIconStyled>
            <ExitToAppIcon />
          </ListItemIconStyled>
          <ListItemTextStyled primary="Sair" />
        </ListItemButton>
      </BottomButtonContainer>
      <FooterNavigation />
    </>
  );
}

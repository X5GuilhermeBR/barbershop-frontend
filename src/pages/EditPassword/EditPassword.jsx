import PasswordIcon from '@mui/icons-material/Password';
import { Button, Container, Grid, Snackbar, TextField } from '@mui/material';
import MuiAlert from '@mui/material/Alert';
import React, { useState } from 'react';
import styled from 'styled-components';
import FooterNavigation from '../../components/FooterNavigation/FooterNavigation';
import Header from '../../components/Header/Header';
import { useAuth } from '../../context/AuthContext';
import { changePassword } from '../../service/api';
import colors from '../../utils/colors';

function EditPassword() {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [alertOpen, setAlertOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [severity, setSeverity] = useState('success'); // Define a gravidade padrão como sucesso
  const { userInfo } = useAuth();

  // Estiliza o componente TextField com styled-components
  const StyledTextField = styled(TextField)`
    background-color: white; // Define o fundo como branco
    color: black; // Define a cor do texto como preto
  `;

  const InfoText = styled.div`
    color: ${colors.third};
    font-size: 20px;
  `;

  const handleUpdatePassword = async () => {
    try {
      if (newPassword !== confirmPassword) {
        setMessage('As senhas não coincidem');
        setSeverity('error'); // Define a gravidade como erro
        setAlertOpen(true);
        throw new Error('As senhas não coincidem');
      }
      await changePassword(userInfo.id, currentPassword, newPassword);
      setMessage('Senha alterada com sucesso!');
      setSeverity('success'); // Define a gravidade como sucesso
      setAlertOpen(true);
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (error) {
      console.error('Erro ao atualizar a senha:', error.message);
      setMessage('Erro ao atualizar a senha. Por favor, tente novamente.');
      setSeverity('error'); // Define a gravidade como erro
      setAlertOpen(true);
    }
  };

  const handleAlertClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setAlertOpen(false);
  };

  return (
    <>
      <Header icon={<PasswordIcon />} title="Alterar Senha" />
      <Grid item style={{ marginBottom: '4rem', marginTop: '2rem', flex: '1 0 auto', zIndex: 1 }}>
        <Container maxWidth="sm" textAlign="center">
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <InfoText>Senha Atual: </InfoText>
            <StyledTextField
              variant="outlined"
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
            />
            <InfoText>Nova Senha: </InfoText>
            <StyledTextField
              variant="outlined"
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
            <InfoText>Confirmar Senha: </InfoText>
            <StyledTextField
              variant="outlined"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </div>
          <Button
            variant="contained"
            color="primary"
            size="large"
            fullWidth
            style={{
              width: '100%',
              marginTop: '2rem',
              marginBottom: '1rem',
              backgroundColor: colors.third,
              color: 'black',
            }}
            onClick={handleUpdatePassword}
          >
            Atualizar
          </Button>
        </Container>
      </Grid>
      <Snackbar
        open={alertOpen}
        autoHideDuration={6000}
        onClose={handleAlertClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <MuiAlert
          elevation={6}
          variant="filled"
          onClose={handleAlertClose}
          severity={severity} // Define a gravidade do alerta
        >
          {message}
        </MuiAlert>
      </Snackbar>
      <FooterNavigation />
    </>
  );
}

export default EditPassword;

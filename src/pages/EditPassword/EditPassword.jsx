import PasswordIcon from '@mui/icons-material/Password';
import { Button, Container, Grid, Snackbar, TextField } from '@mui/material';
import React, { useState } from 'react';
import FooterNavigation from '../../components/FooterNavigation/FooterNavigation';
import Header from '../../components/Header/Header';
import { useAuth } from '../../context/AuthContext';
import { changePassword } from '../../service/api';

function EditPassword() {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [alertOpen, setAlertOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [severity, setSeverity] = useState('success'); // Define a gravidade padrão como sucesso
  const { userInfo } = useAuth();

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
            <TextField
              label="Senha Atual"
              variant="outlined"
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
            />
            <TextField
              label="Nova Senha"
              variant="outlined"
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
            <TextField
              label="Confirmar Senha"
              variant="outlined"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </div>
        </Container>
      </Grid>
      <Grid item style={{ position: 'sticky', bottom: '5rem', zIndex: 2 }}>
        <Button
          variant="contained"
          color="primary"
          size="large"
          fullWidth
          style={{ width: 'calc(100% - 2rem)', margin: '0 1rem' }}
          onClick={handleUpdatePassword}
        >
          Atualizar
        </Button>
      </Grid>
      <Snackbar
        open={alertOpen}
        autoHideDuration={6000}
        onClose={handleAlertClose}
        message={message}
        setSeverity={severity}
      />
      <FooterNavigation />
    </>
  );
}

export default EditPassword;

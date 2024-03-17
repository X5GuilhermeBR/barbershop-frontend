import PasswordIcon from '@mui/icons-material/Password'
import { Button, Container, Grid, TextField } from '@mui/material'
import React, { useState } from 'react'
import FooterNavigation from '../../components/FooterNavigation/FooterNavigation'
import Header from '../../components/Header/Header'
import { useAuth } from '../../context/AuthContext'
import { changePassword } from '../../service/api'

function EditPassword() {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const { userInfo } = useAuth();

  const handleUpdatePassword = async () => {
    try {
      if (newPassword !== confirmPassword) {
        throw new Error('As senhas não coincidem');
      }
      await changePassword(userInfo.id, currentPassword, newPassword);
      alert('Senha alterada com sucesso!');
      // Limpar os campos após a alteração da senha
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (error) {
      console.error('Erro ao atualizar a senha:', error.message);
      alert('Erro ao atualizar a senha. Por favor, tente novamente.');
    }
  };

  return (
    <>
      <Header icon={<PasswordIcon />} title="Alterar Senha" />
      <Grid item style={{ marginBottom: '4rem', marginTop: '2rem', flex: '1 0 auto', zIndex: 1 }}>
        <Container maxWidth="sm" textAlign="center">
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <TextField label="Senha Atual" variant="outlined" type="password" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} />
            <TextField label="Nova Senha" variant="outlined" type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} />
            <TextField label="Confirmar Senha" variant="outlined" type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
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
          onClick={handleUpdatePassword} // Chama a função handleUpdatePassword quando o botão é clicado
        >
          Atualizar
        </Button>
      </Grid>
      <FooterNavigation />
    </>
  );
}

export default EditPassword;

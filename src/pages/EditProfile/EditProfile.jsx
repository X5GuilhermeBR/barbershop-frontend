import InsertEmoticonIcon from '@mui/icons-material/InsertEmoticon'
import { Button, Container, Grid, TextField } from '@mui/material'
import React, { useEffect, useState } from 'react'
import FooterNavigation from '../../components/FooterNavigation/FooterNavigation'
import Header from '../../components/Header/Header'
import { useAuth } from '../../context/AuthContext'
import { getAccount } from '../../service/api'

function EditProfile() {
  const [profileData, setProfileData] = useState({
    name: '',
    birthDate: '',
    email: '',
    phone: '',
  });
  const { userInfo } = useAuth();

  useEffect(() => {
    async function fetchProfileData() {
      try {
        if (userInfo && userInfo.id) {
          const userProfile = await getAccount(userInfo.id);
          setProfileData(userProfile);
        }
      } catch (error) {
        console.error('Erro ao carregar informações do perfil:', error);
      }
    }
    fetchProfileData();
  }, [userInfo.id]); // userInfo como dependência para garantir que o useEffect seja acionado quando ele mudar

  const handleUpdateProfile = async () => {
    // Lógica para atualizar o perfil
  };

  return (
    <>
      <Header icon={<InsertEmoticonIcon />} title="Editar Perfil" />
      <Grid item style={{ marginBottom: '4rem', marginTop: '2rem', flex: '1 0 auto', zIndex: 1 }}>
        <Container maxWidth="sm" textAlign="center">
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <TextField label="Nome" variant="outlined" value={profileData.name} />
            <TextField label="Data de Nascimento" type="date" variant="outlined" value={profileData.birthDate} />
            <TextField label="E-mail" variant="outlined" value={profileData.email} />
            <TextField label="Celular" variant="outlined" type="text" value={profileData.phone} />
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
          onClick={handleUpdateProfile}
        >
          Atualizar
        </Button>
      </Grid>
      <FooterNavigation />
    </>
  );
}

export default EditProfile;

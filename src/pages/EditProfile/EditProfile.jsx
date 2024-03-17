import InsertEmoticonIcon from '@mui/icons-material/InsertEmoticon';
import { Button, CircularProgress, Container, Grid, TextField } from '@mui/material';
import React, { useEffect, useState } from 'react';
import FooterNavigation from '../../components/FooterNavigation/FooterNavigation';
import Header from '../../components/Header/Header';
import { useAuth } from '../../context/AuthContext';
import { getAccount, updateAccount } from '../../service/api';

function EditProfile() {
  const { userInfo } = useAuth();
  const [loading, setLoading] = useState(true);
  const [profileData, setProfileData] = useState(null);
  const [formData, setFormData] = useState(null);
  const [buttonDisabled, setButtonDisabled] = useState(true);

  useEffect(() => {
    async function fetchProfileData() {
      try {
        if (userInfo && userInfo.id) {
          const { data } = await getAccount(userInfo.id);
          setProfileData(data);
          setFormData(data);
          setLoading(false);
        }
      } catch (error) {
        console.error('Erro ao carregar informações do perfil:', error);
        setLoading(false);
      }
    }
    fetchProfileData();
  }, [userInfo.id]);

  const handleUpdateProfile = async () => {
    try {
      setLoading(true);

      await updateAccount(userInfo.id, formData.name, formData.birthday, formData.cellphone);

      console.log('Perfil atualizado com sucesso');

      const { data } = await getAccount(userInfo.id);
      setProfileData(data);
    } catch (error) {
      console.error('Erro ao atualizar o perfil:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFormChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  useEffect(() => {
    if (profileData) {
      const isFormChanged = Object.keys(profileData).some(
        (key) => formData[key] !== profileData[key]
      );
      const isPhoneNumberValid = formData?.cellphone?.toString().length === 11;

      setButtonDisabled(!isFormChanged || !isPhoneNumberValid);
    }
  }, [formData, profileData]);

  if (loading) {
    return (
      <Grid
        container
        justifyContent="center"
        alignItems="center"
        style={{ minHeight: 'calc(100vh - 64px)' }}
      >
        <CircularProgress />
      </Grid>
    );
  }

  return (
    <>
      <Header icon={<InsertEmoticonIcon />} title="Editar Perfil" />
      <Grid item style={{ marginBottom: '4rem', marginTop: '2rem', flex: '1 0 auto', zIndex: 1 }}>
        <Container maxWidth="sm" textAlign="center">
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <TextField
              label="Nome"
              variant="outlined"
              value={formData?.name || ''}
              name="name"
              onChange={handleFormChange}
            />
            <TextField
              label="Data de Nascimento"
              type="date"
              variant="outlined"
              value={formData?.birthday || ''}
              name="birthday"
              onChange={handleFormChange}
            />
            <TextField
              label="Celular"
              variant="outlined"
              type="number"
              value={formData?.cellphone || ''}
              name="cellphone"
              onChange={handleFormChange}
              inputProps={{
                pattern: '\\d{11}',
                title: 'Por favor, insira exatamente 11 números',
              }}
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
          onClick={handleUpdateProfile}
          disabled={buttonDisabled || loading}
        >
          Atualizar
        </Button>
      </Grid>
      <FooterNavigation />
    </>
  );
}

export default EditProfile;

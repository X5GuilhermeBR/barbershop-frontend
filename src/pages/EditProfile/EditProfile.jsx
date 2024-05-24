import InsertEmoticonIcon from '@mui/icons-material/InsertEmoticon';
import { Button, Container, Grid, Snackbar, TextField } from '@mui/material';
import MuiAlert from '@mui/material/Alert';
import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import FooterNavigation from '../../components/FooterNavigation/FooterNavigation';
import Header from '../../components/Header/Header';
import { useAuth } from '../../context/AuthContext';
import { getAccount, updateAccount } from '../../service/api';
import colors from '../../utils/colors';

function EditProfile() {
  const { userInfo } = useAuth();
  const [loading, setLoading] = useState(true);
  const [profileData, setProfileData] = useState(null);
  const [formData, setFormData] = useState(null);
  const [buttonDisabled, setButtonDisabled] = useState(true);
  const [alertOpen, setAlertOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [severity, setSeverity] = useState('success'); // Define a gravidade padrão como sucesso

  // Estiliza o componente TextField com styled-components
  const StyledTextField = styled(TextField)`
    background-color: white; // Define o fundo como branco
    color: black; // Define a cor do texto como preto
  `;

  const InfoText = styled.div`
    color: ${colors.third};
    font-size: 20px;
  `;

  useEffect(() => {
    async function fetchProfileData() {
      try {
        if (userInfo?.id) {
          // Adicione uma verificação aqui para garantir que userInfo não seja nulo
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
  }, [userInfo?.id]); // Adicione userInfo?.id como uma dependência

  const handleUpdateProfile = async () => {
    try {
      setLoading(true);

      await updateAccount(userInfo.id, formData.name, formData.birthday, formData.cellphone);

      console.log('Perfil atualizado com sucesso');

      const { data } = await getAccount(userInfo.id);
      setProfileData(data);
      setMessage('Perfil atualizado com sucesso!');
      setSeverity('success');
      setAlertOpen(true);
    } catch (error) {
      console.error('Erro ao atualizar o perfil:', error);
      setMessage('Erro ao atualizar o perfil. Por favor, tente novamente.');
      setSeverity('error');
      setAlertOpen(true);
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

  const handleAlertClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setAlertOpen(false);
  };

  return (
    <>
      <Header icon={<InsertEmoticonIcon />} title="Editar Perfil" />
      <Grid item style={{ marginBottom: '4rem', marginTop: '2rem', flex: '1 0 auto', zIndex: 1 }}>
        <Container maxWidth="sm" textAlign="center">
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <InfoText>Nome: </InfoText>
            <StyledTextField
              variant="outlined"
              value={formData?.name || ''}
              type="text"
              name="name"
              onChange={handleFormChange}
            />
            <InfoText>Data de Nascimento: </InfoText>
            <StyledTextField
              type="date"
              variant="outlined"
              value={formData?.birthday || ''}
              name="birthday"
              onChange={handleFormChange}
            />
            <InfoText>Celular: </InfoText>
            <StyledTextField
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
          <Button
            ExportButton
            variant="contained"
            color="primary"
            onClick={handleUpdateProfile}
            disabled={buttonDisabled || loading}
            style={{
              width: '100%',
              marginTop: '2rem',
              marginBottom: '1rem',
              backgroundColor: colors.second,
              color: 'black',
              height: '60px',
              fontWeight: 'bold',
            }}
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
        <MuiAlert elevation={6} variant="filled" onClose={handleAlertClose} severity={severity}>
          {message}
        </MuiAlert>
      </Snackbar>
      <FooterNavigation />
    </>
  );
}

export default EditProfile;

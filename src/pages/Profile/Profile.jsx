/* eslint-disable no-nested-ternary */
import { Button, Container, Grid, TextField, Typography } from '@mui/material';
import React from 'react';
import FooterNavigation from '../../components/FooterNavigation/FooterNavigation';

function Profile() {
  return (
    <Grid container direction="column" style={{ minHeight: '100vh' }}>
      <Grid item style={{ marginBottom: '2rem', flex: '1 0 auto', zIndex: 1 }}>
        <Container maxWidth="sm" textAlign="center">
          <Typography
            variant="h4"
            style={{ marginBottom: '2rem', marginTop: '4rem' }}
            align="center"
          >
            Perfil
          </Typography>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <TextField label="Nome" variant="outlined" />
            <TextField label="Data de Nascimento" type="date" outlined />
            <TextField label="E-mail" variant="outlined" />
            <TextField label="Senha" variant="outlined" type="password" />
            <TextField label="Confirmar Senha" variant="outlined" type="password" />
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
        >
          Atualizar
        </Button>
      </Grid>
      <FooterNavigation />
    </Grid>
  );
}

export default Profile;

/* eslint-disable no-nested-ternary */
import { Button, Container, Grid, TextField } from '@mui/material'
import React from 'react'
import FooterNavigation from '../../components/FooterNavigation/FooterNavigation'
import Header from '../../components/Header/Header'

function Profile() {
  return (
    <>
      <Header  title="Editar Perfil" />
      <Grid item style={{ marginBottom: '4rem', marginTop: '2rem', flex: '1 0 auto', zIndex: 1 }}>
        <Container maxWidth="sm" textAlign="center">
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
    </>
  );
}

export default Profile;

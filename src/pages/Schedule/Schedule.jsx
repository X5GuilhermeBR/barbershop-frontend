import { Button, Container, Grid, MenuItem, Select, TextField, Typography } from '@mui/material';
import React from 'react';
import FooterNavigation from '../../components/FooterNavigation/FooterNavigation';

function Schedule() {
  // Função para obter a data atual no formato YYYY-MM-DD
  const getCurrentDate = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = (today.getMonth() + 1).toString().padStart(2, '0');
    const day = today.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  // Função para calcular a data daqui a 45 dias no formato YYYY-MM-DD
  const getFutureDate = () => {
    const futureDate = new Date();
    futureDate.setDate(futureDate.getDate() + 45);
    const year = futureDate.getFullYear();
    const month = (futureDate.getMonth() + 1).toString().padStart(2, '0');
    const day = futureDate.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  return (
    <Grid container direction="column" style={{ minHeight: '100vh' }}>
      <Grid item style={{ marginBottom: '2rem', flex: '1 0 auto', zIndex: 1 }}>
        <Container maxWidth="sm" textAlign="center">
          <Typography variant="h4" style={{ marginBottom: '2rem', marginTop: '4rem' }}>
            Agendamento
          </Typography>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <Select label="Barbeiro" variant="outlined" fullWidth defaultValue="">
              <MenuItem value="">Selecione um barbeiro</MenuItem>
              <MenuItem value="barbeiro1">Barbeiro 1</MenuItem>
              <MenuItem value="barbeiro2">Barbeiro 2</MenuItem>
              <MenuItem value="barbeiro3">Barbeiro 3</MenuItem>
            </Select>
            <Select label="Serviço" variant="outlined" fullWidth defaultValue="">
              <MenuItem value="">Selecione um serviço</MenuItem>
              <MenuItem value="servico1">Serviço 1</MenuItem>
              <MenuItem value="servico2">Serviço 2</MenuItem>
              <MenuItem value="servico3">Serviço 3</MenuItem>
            </Select>
            <TextField
              label="Data"
              type="date"
              variant="outlined"
              fullWidth
              InputLabelProps={{
                shrink: true,
              }}
              inputProps={{
                min: getCurrentDate(), // Define a data mínima como a data atual
                max: getFutureDate(), // Define a data máxima como a data daqui a 45 dias
              }}
            />
            <Select label="Hora" variant="outlined" fullWidth defaultValue="">
              <MenuItem value="">Selecione uma hora</MenuItem>
              {[...Array(10).keys()].map((hour) => (
                <MenuItem key={hour} value={hour + 9}>{`${hour + 9}:00`}</MenuItem>
              ))}
            </Select>
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
          Agendar
        </Button>
      </Grid>
      <FooterNavigation />
    </Grid>
  );
}

export default Schedule;

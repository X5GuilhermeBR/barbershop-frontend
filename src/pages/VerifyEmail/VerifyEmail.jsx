import { Box, Card, Typography } from '@mui/material';
import React from 'react';
import background from '../../assets/background.jpg';

function VerifyEmail() {
  return (
    <Box
      sx={{
        width: '100%',
        height: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundImage: `url(${background})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <Card sx={{ maxWidth: 400 }}>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            gap: 2,
            width: '300px',
            padding: 2,
          }}
        >
          <Typography variant="h5" align="center">
            Teste
          </Typography>
          <Typography align="center">Teste</Typography>
        </Box>
      </Card>
    </Box>
  );
}

export default VerifyEmail;

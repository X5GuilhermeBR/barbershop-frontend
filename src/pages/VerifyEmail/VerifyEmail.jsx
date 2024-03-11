/* eslint-disable no-nested-ternary */
import { Box, Card, CircularProgress, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react';
import background from '../../assets/background.jpg';
import { verifyToken } from '../../service/api';

function VerifyEmail() {
  const [loading, setLoading] = useState(true);
  const [verificationStatus, setVerificationStatus] = useState('');

  useEffect(() => {
    const queryString = window.location.search;
    const params = new URLSearchParams(queryString);
    const token = params.get('token');

    const verifyEmail = async () => {
      try {
        const response = await verifyToken(token);

        if (response.status === 204) {
          setVerificationStatus('verified');
        }
      } catch (error) {
        if (error.response && error.response.status === 401) {
          setVerificationStatus('invalidToken');
        } else if (error.response && error.response.status === 400) {
          setVerificationStatus('alreadyVerified');
        } else {
          console.error('Erro ao verificar o e-mail:', error);
          setVerificationStatus('unknownError');
        }
      }
      setLoading(false);
    };

    verifyEmail();
  }, []);

  return (
    <Box
      sx={{
        width: '100vw',
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
          {loading ? (
            <CircularProgress />
          ) : verificationStatus === 'verified' ? (
            <Typography variant="h6" align="center">
              E-mail verificado com sucesso!
            </Typography>
          ) : verificationStatus === 'alreadyVerified' ? (
            <Typography variant="h6" align="center">
              E-mail já verificado.
            </Typography>
          ) : (
            <Typography variant="h6" align="center">
              Falha ao verificar o e-mail. Token inválido.
            </Typography>
          )}
        </Box>
      </Card>
    </Box>
  );
}

export default VerifyEmail;

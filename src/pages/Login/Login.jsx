import { Box, Button, Card, CardActions, CardContent, TextField, Typography } from '@mui/material';
import background from '../../assets/background.jpg';

function Login() {
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
        <CardContent />
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
            Login
          </Typography>

          <TextField fullWidth label="Email" type="email" />
          <TextField fullWidth label="Password" type="password" />
        </Box>
        <CardActions>
          <Box sx={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
            <Button
              variant="contained"
              sx={{ backgroundColor: '#2231ff', '&:hover': { backgroundColor: '#2231ff' } }} // Cor do botão e cor do hover
            >
              ENTRAR
            </Button>
          </Box>
        </CardActions>
      </Card>
    </Box>
  );
}

export default Login;

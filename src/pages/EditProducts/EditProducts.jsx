import { Button, CircularProgress, Container, Grid, Snackbar, TextField } from '@mui/material';
import MuiAlert from '@mui/material/Alert';
import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import FooterNavigation from '../../components/FooterNavigation/FooterNavigation';
import Header from '../../components/Header/Header';
import { createProduct, deleteProduct, getProductById, updateProduct } from '../../service/api';
import colors from '../../utils/colors';

const StyledTextField = styled(TextField)`
  background-color: white; // Define o fundo como branco
  color: black; // Define a cor do texto como preto
`;

const InfoText = styled.div`
  color: ${colors.third};
  font-size: 20px;
`;

function EditProduct() {
  const location = useLocation();
  const navigate = useNavigate();
  const productId = new URLSearchParams(location.search).get('productId');

  const [productName, setProductName] = useState('');
  const [productDescription, setProductDescription] = useState('');
  const [productPrice, setProductPrice] = useState('');
  const [loading, setLoading] = useState(false);
  const [alertOpen, setAlertOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [severity, setSeverity] = useState('success');

  const fetchProductDetails = async () => {
    try {
      const { data } = await getProductById(productId);
      setProductName(data.name);
      setProductDescription(data.description);
      setProductPrice(data.price);
    } catch (error) {
      console.error('Erro ao obter detalhes do produto:', error);
    }
  };

  useEffect(() => {
    if (productId) {
      fetchProductDetails();
    }
  }, [productId]);

  const handleSaveProduct = async () => {
    try {
      setLoading(true);
      if (!productId) {
        await createProduct({
          name: productName,
          description: productDescription,
          price: productPrice,
          disable: false,
        });
        setMessage(
          'Produto criado com sucesso! Você será redirecionado para a tela inicial em 3 segundos...'
        );
      } else {
        await updateProduct(productId, {
          name: productName,
          description: productDescription,
          price: productPrice,
          disable: false,
        });
        setMessage(
          'Produto atualizado com sucesso! Você será redirecionado para a tela inicial em 3 segundos...'
        );
      }
      setSeverity('success');
      setAlertOpen(true);
      setTimeout(() => {
        navigate('/configuracoes/produtos');
      }, 3000);
    } catch (error) {
      console.error('Erro ao salvar o produto:', error.message);
      setMessage('Erro ao salvar o produto. Por favor, tente novamente.');
      setSeverity('error');
      setAlertOpen(true);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteProduct = async () => {
    try {
      setLoading(true);
      await deleteProduct(productId);
      setMessage(
        'Produto excluído com sucesso! Você será redirecionado para a tela inicial em 3 segundos...'
      );
      setSeverity('success');
      setAlertOpen(true);
      setTimeout(() => {
        navigate('/configuracoes/produtos');
      }, 3000);
    } catch (error) {
      console.error('Erro ao excluir o produto:', error.message);
      setMessage('Erro ao excluir o produto. Por favor, tente novamente.');
      setSeverity('error');
      setAlertOpen(true);
    } finally {
      setLoading(false);
    }
  };

  const handleAlertClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setAlertOpen(false);
  };

  return (
    <>
      <Header title={productId ? 'Editar Produto' : 'Criar Produto'} />
      <Container>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <InfoText>Nome: </InfoText>
            <StyledTextField
              value={productName}
              onChange={(e) => setProductName(e.target.value)}
              fullWidth
              margin="normal"
            />
          </Grid>
          <Grid item xs={12}>
            <InfoText>Descrição: </InfoText>
            <StyledTextField
              value={productDescription}
              onChange={(e) => setProductDescription(e.target.value)}
              fullWidth
              margin="normal"
            />
          </Grid>
          <Grid item xs={12}>
            <InfoText>Preço: </InfoText>
            <StyledTextField
              value={productPrice}
              onChange={(e) => setProductPrice(e.target.value)}
              fullWidth
              margin="normal"
            />
          </Grid>
        </Grid>
        <Grid container spacing={2} direction="column" marginTop={1}>
          <Grid item xs={12}>
            <Button
              variant="contained"
              style={{
                backgroundColor: colors.third,
                color: 'black',
              }}
              size="large"
              fullWidth
              onClick={handleSaveProduct}
              disabled={loading}
            >
              {productId ? 'Salvar' : 'Criar'}
              {loading && <CircularProgress size={24} />}
            </Button>
          </Grid>
          {productId && (
            <Grid item xs={12}>
              <Button
                variant="outlined"
                style={{
                  borderColor: colors.third,
                  color: colors.third,
                }}
                size="large"
                fullWidth
                onClick={handleDeleteProduct}
                disabled={loading}
              >
                Excluir
                {loading && <CircularProgress size={24} />}
              </Button>
            </Grid>
          )}
        </Grid>
      </Container>
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

export default EditProduct;

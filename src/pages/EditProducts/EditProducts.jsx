import { Button, Container, Grid, Snackbar, TextField } from '@mui/material';
import MuiAlert from '@mui/material/Alert';
import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import FooterNavigation from '../../components/FooterNavigation/FooterNavigation';
import Header from '../../components/Header/Header';
import { createProduct, deleteProduct, getProductById, updateProduct } from '../../service/api'; // Importe as funções necessárias para produtos

function EditProduct() {
  const location = useLocation();
  const navigate = useNavigate();
  const productId = new URLSearchParams(location.search).get('productId');

  const [productName, setProductName] = useState('');
  const [productDescription, setProductDescription] = useState('');
  const [productPrice, setProductPrice] = useState('');
  const [alertOpen, setAlertOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [severity, setSeverity] = useState('success'); // Define a gravidade padrão como sucesso

  const fetchProductDetails = async () => {
    try {
      const { data } = await getProductById(productId);
      setProductName(data.name);
      setProductDescription(data.description);
      setProductPrice(data.price);
    } catch (error) {
      console.error('Erro ao obter detalhes do produto:', error);
      // Redirecionar para uma página de erro ou lidar com isso de alguma outra maneira
    }
  };

  useEffect(() => {
    // Se houver um productId na query string, carregue os detalhes do produto
    if (productId) {
      fetchProductDetails();
    }
  }, [productId]);

  const handleSaveProduct = async () => {
    try {
      if (!productId) {
        await createProduct({
          name: productName,
          description: productDescription,
          price: productPrice,
          disable: false,
        });
        setMessage('Produto criado com sucesso!');
      } else {
        await updateProduct(productId, {
          name: productName,
          description: productDescription,
          price: productPrice,
          disable: false,
        });
        setMessage('Produto atualizado com sucesso!');
      }
      setSeverity('success'); // Define a gravidade como sucesso
      setAlertOpen(true);
    } catch (error) {
      console.error('Erro ao salvar o produto:', error.message);
      setMessage('Erro ao salvar o produto. Por favor, tente novamente.');
      setSeverity('error'); // Define a gravidade como erro
      setAlertOpen(true);
    }
  };

  const handleDeleteProduct = async () => {
    try {
      await deleteProduct(productId);
      setMessage('Produto excluído com sucesso!');
      setSeverity('success'); // Define a gravidade como sucesso
      setAlertOpen(true);
      // Redirecionar para a lista de produtos após a exclusão
      navigate('/configuracoes/produtos');
    } catch (error) {
      console.error('Erro ao excluir o produto:', error.message);
      setMessage('Erro ao excluir o produto. Por favor, tente novamente.');
      setSeverity('error'); // Define a gravidade como erro
      setAlertOpen(true);
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
            <TextField
              label="Nome"
              value={productName}
              onChange={(e) => setProductName(e.target.value)}
              fullWidth
              margin="normal"
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Descrição"
              value={productDescription}
              onChange={(e) => setProductDescription(e.target.value)}
              fullWidth
              margin="normal"
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Preço"
              value={productPrice}
              onChange={(e) => setProductPrice(e.target.value)}
              fullWidth
              margin="normal"
            />
          </Grid>
        </Grid>
        <Grid container spacing={2}>
          <Grid item xs={6}>
            <Button
              variant="contained"
              color="primary"
              size="large"
              fullWidth
              onClick={handleSaveProduct}
            >
              {productId ? 'Salvar' : 'Criar'}
            </Button>
          </Grid>
          {productId && (
            <Grid item xs={6}>
              <Button
                variant="contained"
                color="error"
                size="large"
                fullWidth
                onClick={handleDeleteProduct}
              >
                Excluir
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
        <MuiAlert
          elevation={6}
          variant="filled"
          onClose={handleAlertClose}
          severity={severity} // Define a gravidade do alerta
        >
          {message}
        </MuiAlert>
      </Snackbar>
      <FooterNavigation />
    </>
  );
}

export default EditProduct;

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useProductStore } from './store';
import Header from './Header';
import {
  Container,
  Card,
  CardContent,
  TextField,
  Button,
  Typography,
  Box,
  CircularProgress,
  Alert
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import SaveIcon from '@mui/icons-material/Save';

const EditProduct: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { products, fetchProducts, updateProduct } = useProductStore();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const product = products.find(p => p.id === Number(id));

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    image: ''
  });

  useEffect(() => {
    const loadProduct = async () => {
      setLoading(true);
      if (products.length === 0) {
        await fetchProducts();
      }
      setLoading(false);
    };

    loadProduct();
  }, [fetchProducts, products.length]);

  useEffect(() => {
    if (product) {
      setFormData({
        title: product.title,
        description: product.description,
        price: product.price.toString(),
        image: product.image
      });
    }
  }, [product]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError('');

    try {
      if (!product) {
        throw new Error('Товар не найден');
      }

      // Валидация
      if (!formData.title.trim() || !formData.description.trim() || !formData.price || !formData.image.trim()) {
        throw new Error('Все поля обязательны для заполнения');
      }

      const price = parseFloat(formData.price);
      if (isNaN(price) || price <= 0) {
        throw new Error('Цена должна быть положительным числом');
      }

      await updateProduct(product.id, {
        title: formData.title.trim(),
        description: formData.description.trim(),
        price: price,
        image: formData.image.trim()
      });

      navigate('/products');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Произошла ошибка при сохранении');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <>
        <Header />
        <Container className="product-details-container">
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
            <CircularProgress size={60} thickness={5} />
          </div>
        </Container>
      </>
    );
  }

  if (!product) {
    return (
      <>
        <Header />
        <Container className="product-details-container">
          <Typography variant="h5" gutterBottom>
            Товар не найден
          </Typography>
          <Button 
            startIcon={<ArrowBackIcon />} 
            onClick={() => navigate('/products')}
            className="product-details-back-btn"
            sx={{ mt: 2 }}
          >
            Вернуться к каталогу
          </Button>
        </Container>
      </>
    );
  }

  return (
    <>
      <Header />
      <Container className="product-details-container">
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate('/products')}
          className="product-details-back-btn"
          sx={{ mb: 3 }}
        >
          К списку
        </Button>

        <Card className="product-details-card">
          <CardContent>
            <Typography variant="h4" gutterBottom sx={{ textAlign: 'center', mb: 4 }}>
              Редактировать товар
            </Typography>

            {error && (
              <Alert severity="error" sx={{ mb: 3 }}>
                {error}
              </Alert>
            )}

            <Box component="form" onSubmit={handleSubmit} sx={{ maxWidth: 600, margin: '0 auto' }}>
              <TextField
                fullWidth
                label="Название товара"
                name="title"
                value={formData.title}
                onChange={handleChange}
                margin="normal"
                required
                variant="outlined"
              />
              
              <TextField
                fullWidth
                label="Описание"
                name="description"
                value={formData.description}
                onChange={handleChange}
                margin="normal"
                required
                multiline
                rows={4}
                variant="outlined"
              />
              
              <TextField
                fullWidth
                label="Цена (руб)"
                name="price"
                type="number"
                value={formData.price}
                onChange={handleChange}
                margin="normal"
                required
                variant="outlined"
                inputProps={{ min: 0, step: 1 }}
              />
              
              <TextField
                fullWidth
                label="URL изображения"
                name="image"
                value={formData.image}
                onChange={handleChange}
                margin="normal"
                required
                variant="outlined"
              />

              <Box sx={{ display: 'flex', gap: 2, mt: 4 }}>
                <Button
                  type="submit"
                  variant="contained"
                  startIcon={<SaveIcon />}
                  disabled={saving}
                  sx={{
                    flex: 1,
                    py: 1.5,
                    background: 'linear-gradient(135deg, #10b981 0%, #0da271 100%)',
                    '&:hover': {
                      background: 'linear-gradient(135deg, #0da271 0%, #0c9668 100%)'
                    }
                  }}
                >
                  {saving ? <CircularProgress size={24} /> : 'Сохранить изменения'}
                </Button>
                
                <Button
                  variant="outlined"
                  onClick={() => navigate('/products')}
                  sx={{ flex: 1, py: 1.5 }}
                >
                  Отмена
                </Button>
              </Box>
            </Box>
          </CardContent>
        </Card>
      </Container>
    </>
  );
};

export default EditProduct;
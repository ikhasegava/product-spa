import React from 'react';
import { useForm } from 'react-hook-form';
import { useProductStore } from './store';
import {
  Container,
  Paper,
  TextField,
  Button,
  Typography,
  Box,
  Alert
} from '@mui/material';
import { useNavigate } from 'react-router-dom';

interface CreateProductForm {
  title: string;
  price: number | '';
  description: string;
  image: string;
}

const CreateProduct: React.FC = () => {
  const { register, handleSubmit, formState: { errors }, reset } = useForm<CreateProductForm>({
    defaultValues: {
      title: '',
      price: '',
      description: '',
      image: ''
    }
  });

  const { addProduct } = useProductStore();
  const navigate = useNavigate();
  const [submitError, setSubmitError] = React.useState<string | null>(null);

  const onSubmit = (data: CreateProductForm) => {
    try {
      const newId = Math.max(...useProductStore.getState().products.map(p => p.id), 0) + 1;

      const newProduct = {
        id: newId,
        title: data.title,
        price: Number(data.price),
        description: data.description,
        image: data.image || 'https://via.placeholder.com/400x400?text=No+Image',
        liked: false,
        category: 'custom'
      };

      addProduct(newProduct);
      reset();
      setSubmitError(null);
      navigate('/products');
    } catch (err) {
      setSubmitError('Не удалось создать продукт');
    }
  };

  return (
    <Container maxWidth="sm" sx={{ py: 4 }}>
      <Paper elevation={3} sx={{ p: 4 }} className="create-product-paper">
        <Typography variant="h5" gutterBottom align="center" className="create-product-title">
          Создать новый продукт
        </Typography>

        {submitError && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {submitError}
          </Alert>
        )}

        <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate className="create-product-form">
          <TextField
            label="Название"
            fullWidth
            margin="normal"
            {...register('title', {
              required: 'Название обязательно',
              minLength: { value: 3, message: 'Минимум 3 символа' }
            })}
            error={!!errors.title}
            helperText={errors.title?.message}
          />

          <TextField
            label="Цена"
            type="number"
            fullWidth
            margin="normal"
            InputProps={{ inputProps: { min: 0.01, step: 0.01 } }}
            {...register('price', {
              required: 'Цена обязательна',
              min: { value: 0.01, message: 'Цена должна быть больше 0' }
            })}
            error={!!errors.price}
            helperText={errors.price?.message}
          />

          <TextField
            label="Описание"
            multiline
            rows={3}
            fullWidth
            margin="normal"
            {...register('description', {
              required: 'Описание обязательно',
              minLength: { value: 10, message: 'Минимум 10 символов' }
            })}
            error={!!errors.description}
            helperText={errors.description?.message}
          />

          <TextField
            label="URL изображения"
            fullWidth
            margin="normal"
            placeholder="https://example.com/image.jpg"
            {...register('image', {
              required: 'Изображение обязательно',
              pattern: {
                value: /^https?:\/\/.+/,
                message: 'Введите корректный URL (начинается с http:// или https://)'
              }
            })}
            error={!!errors.image}
            helperText={errors.image?.message || 'Можно вставить ссылку на изображение'}
          />

          <Box sx={{ mt: 3, display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
            <Button
              variant="outlined"
              onClick={() => navigate('/products')}
            >
              Отмена
            </Button>
            <Button
              type="submit"
              variant="contained"
            >
              Создать
            </Button>
          </Box>
        </Box>
      </Paper>
    </Container>
  );
};

export default CreateProduct;
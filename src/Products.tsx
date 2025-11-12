import React, { useEffect, useMemo, useState } from 'react';
import { useProductStore, Product } from './store';
import {
  Grid, Card, CardMedia, CardContent, CardActions,
  Typography, IconButton, FormControl, InputLabel, Select, MenuItem,
  Button, CircularProgress, Box, Pagination, FormControlLabel, 
  RadioGroup, Radio, Slider, Chip, Popover
} from '@mui/material';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import ClearIcon from '@mui/icons-material/Clear';
import FilterListIcon from '@mui/icons-material/FilterList';
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';
import { useNavigate } from 'react-router-dom';
import Header from './Header';
import './index.css';

const Products: React.FC = () => {
  const { 
    products, 
    filter, 
    currentPage,
    itemsPerPage,
    priceRange,
    selectedCategory,
    searchQuery,
    fetchProducts, 
    toggleLike, 
    deleteProduct, 
    setFilter,
    setCurrentPage,
    setItemsPerPage,
    setPriceRange,
    setSelectedCategory,
    resetFilters,
    addToCart
  } = useProductStore();
  const navigate = useNavigate();

  const [filterAnchorEl, setFilterAnchorEl] = useState<HTMLButtonElement | null>(null);

  useEffect(() => {
    if (products.length === 0) {
      fetchProducts();
    }
  }, [fetchProducts, products.length]);

  const categories = useMemo(() => {
    const uniqueCategories = Array.from(new Set(products.map(product => product.category)));
    return ['all', ...uniqueCategories];
  }, [products]);

  const filtered = useMemo(() => {
    let result = filter === 'all' ? products : products.filter(p => p.liked);
    
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(product => 
        product.title.toLowerCase().includes(query) ||
        product.description.toLowerCase().includes(query)
      );
    }
    
    if (selectedCategory !== 'all') {
      result = result.filter(product => product.category === selectedCategory);
    }
    
    result = result.filter(product => 
      product.price >= priceRange[0] && product.price <= priceRange[1]
    );
    
    return result;
  }, [products, filter, searchQuery, selectedCategory, priceRange]);

  const totalPages = Math.ceil(filtered.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedProducts = filtered.slice(startIndex, startIndex + itemsPerPage);

  const truncate = (text: string, length: number) =>
    text.length > length ? text.slice(0, length) + '...' : text;

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('ru-RU', {
      style: 'currency',
      currency: 'RUB',
      minimumFractionDigits: 0
    }).format(price);
  };

  const handlePageChange = (event: React.ChangeEvent<unknown>, value: number) => {
    setCurrentPage(value);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleItemsPerPageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setItemsPerPage(parseInt(event.target.value));
  };

  const handlePriceRangeChange = (event: Event, newValue: number | number[]) => {
    setPriceRange(newValue as [number, number]);
  };

  const handleCategoryChange = (event: any) => {
    setSelectedCategory(event.target.value);
  };

  const handleOpenFilters = (event: React.MouseEvent<HTMLButtonElement>) => {
    setFilterAnchorEl(event.currentTarget);
  };

  const handleCloseFilters = () => {
    setFilterAnchorEl(null);
  };

  const handleResetFiltersAndClose = () => {
    resetFilters();
    handleCloseFilters();
  };

  const handleAddToCart = (product: Product, e: React.MouseEvent) => {
    e.stopPropagation();
    addToCart(product);
  };

  const activeFiltersCount = [
    searchQuery ? 1 : 0,
    selectedCategory !== 'all' ? 1 : 0,
    priceRange[0] > 0 || priceRange[1] < 3000 ? 1 : 0
  ].reduce((a, b) => a + b, 0);

  const filterOpen = Boolean(filterAnchorEl);
  const filterId = filterOpen ? 'filter-popover' : undefined;

  if (products.length === 0) {
    return (
      <>
        <Header />
        <div className="loading-container">
          <CircularProgress size={60} thickness={5} />
        </div>
      </>
    );
  }

  return (
    <>
      <Header />
      <div className="products-container">
        <div className="products-header">
          <FormControl className="products-filter">
            <InputLabel>Фильтр</InputLabel>
            <Select
              value={filter}
              label="Фильтр"
              onChange={(e) => setFilter(e.target.value as 'all' | 'favorites')}
            >
              <MenuItem value="all">Все товары</MenuItem>
              <MenuItem value="favorites">Избранное</MenuItem>
            </Select>
          </FormControl>

          <Button
            variant="outlined"
            size="large"
            startIcon={<FilterListIcon />}
            endIcon={activeFiltersCount > 0 ? <Chip label={activeFiltersCount} size="small" color="primary" /> : undefined}
            onClick={handleOpenFilters}
            className="filters-btn"
          >
            Фильтры
          </Button>

          <Button
            variant="contained"
            size="large"
            startIcon={<AddIcon />}
            onClick={() => navigate('/create-product')}
            className="add-product-btn"
          >
            Добавить товар
          </Button>
        </div>

        <Popover
          id={filterId}
          open={filterOpen}
          anchorEl={filterAnchorEl}
          onClose={handleCloseFilters}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'left',
          }}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'left',
          }}
          className="filters-popover"
        >
          <Box className="filters-popover-content">
            <Typography variant="h6" gutterBottom className="filters-title">
              Фильтры
              {activeFiltersCount > 0 && (
                <Chip 
                  label={activeFiltersCount} 
                  size="small" 
                  color="primary" 
                  className="filters-chip"
                />
              )}
            </Typography>

            <Box className="filter-group">
              <Typography variant="subtitle2" gutterBottom className="filter-label">
                Категория
              </Typography>
              <FormControl fullWidth size="small">
                <Select
                  value={selectedCategory}
                  onChange={handleCategoryChange}
                  className="category-select"
                >
                  <MenuItem value="all">Все категории</MenuItem>
                  <MenuItem value="мармелад">Мармелад</MenuItem>
                  <MenuItem value="лакрица">Лакрица</MenuItem>
                  <MenuItem value="ленточки">Ленточки</MenuItem>
                  <MenuItem value="мерч">Мерч</MenuItem>
                </Select>
              </FormControl>
            </Box>

            <Box className="filter-group">
              <Typography variant="subtitle2" gutterBottom className="filter-label">
                Цена: {formatPrice(priceRange[0])} - {formatPrice(priceRange[1])}
              </Typography>
              <Slider
                value={priceRange}
                onChange={handlePriceRangeChange}
                valueLabelDisplay="auto"
                valueLabelFormat={formatPrice}
                min={0}
                max={3000}
                step={100}
                className="price-slider"
              />
            </Box>

            <Box className="filter-actions">
              {activeFiltersCount > 0 && (
                <Button 
                  variant="outlined" 
                  onClick={handleResetFiltersAndClose}
                  size="small"
                  startIcon={<ClearIcon />}
                  className="reset-filters-btn"
                >
                  Сбросить
                </Button>
              )}
              <Button 
                variant="contained" 
                onClick={handleCloseFilters}
                size="small"
                className="apply-filters-btn"
              >
                Применить
              </Button>
            </Box>
          </Box>
        </Popover>

        <Box className="pagination-settings">
          <Typography variant="body2" className="pagination-label">
            Товаров на странице:
          </Typography>
          <RadioGroup
            row
            value={itemsPerPage.toString()}
            onChange={handleItemsPerPageChange}
            className="items-per-page-group"
          >
            <FormControlLabel value="6" control={<Radio size="small" />} label="6" />
            <FormControlLabel value="9" control={<Radio size="small" />} label="9" />
            <FormControlLabel value="12" control={<Radio size="small" />} label="12" />
          </RadioGroup>
        </Box>

        <Box className="pagination-info">
          <Typography variant="body2" className="pagination-text">
            Показано {paginatedProducts.length} из {filtered.length} товаров
            {filter === 'favorites' && ' в избранном'}
          </Typography>
        </Box>

        <Grid container spacing={3} className="products-grid">
          {paginatedProducts.map((product: Product) => (
            <Grid>
              <Card
                className="product-card"
                onClick={(e) => {
                  const target = e.target as HTMLElement;
                  if (!target.closest('button') && !target.closest('svg')) {
                    navigate(`/products/${product.id}`);
                  }
                }}
              >
                <div className="product-image-wrapper">
                  <CardMedia
                    component="img"
                    image={product.image}
                    alt={product.title}
                    className="product-image"
                  />
                  <div className="price-chip">{formatPrice(product.price)}</div>
                </div>

                <CardContent className="product-content">
                  <Typography variant="body2" className="product-category">
                    {product.category}
                  </Typography>
                  <Typography variant="h6" className="product-title">
                    {product.title}
                  </Typography>
                  <Typography variant="body2" className="product-description">
                    {truncate(product.description, 85)}
                  </Typography>
                </CardContent>

                <CardActions disableSpacing className="product-actions">
                  <IconButton
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleLike(product.id);
                    }}
                    className={`like-btn ${product.liked ? 'liked' : ''}`}
                  >
                    {product.liked ? <FavoriteIcon /> : <FavoriteBorderIcon />}
                  </IconButton>

                  <Button
                    variant="contained"
                    size="small"
                    startIcon={<AddShoppingCartIcon />}
                    onClick={(e) => handleAddToCart(product, e)}
                    className="add-to-cart-btn"
                  >
                    В корзину
                  </Button>

                  <IconButton
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteProduct(product.id);
                    }}
                    className="delete-btn"
                  >
                    <DeleteIcon />
                  </IconButton>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>

        {totalPages > 1 && (
          <Box className="pagination-container">
            <Pagination
              count={totalPages}
              page={currentPage}
              onChange={handlePageChange}
              color="primary"
              size="large"
              showFirstButton
              showLastButton
              className="pagination"
            />
          </Box>
        )}
      </div>
    </>
  );
};

export default Products;
import React from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import Products from './Products';
import ProductDetails from './ProductDetails';
import CreateProduct from './CreateProduct';
import EditProduct from './EditProduct';
import Home from './Home';

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/products" element={<Products />} />
        <Route path="/products/:id" element={<ProductDetails />} />
        <Route path="/create-product" element={<CreateProduct />} />
        <Route path="/edit-product/:id" element={<EditProduct />} />
      </Routes>
    </Router>
  );
};

export default App;
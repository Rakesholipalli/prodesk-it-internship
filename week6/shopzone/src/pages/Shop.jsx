import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './Shop.css';

const Shop = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const response = await fetch('https://dummyjson.com/products?limit=30');
        const data = await response.json();
        setProducts(data.products);
        setError(null);
      } catch (err) {
        setError('Failed to load products. Please try again later.');
        console.error('Error fetching products:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  if (loading) {
    return (
      <div className="shop-container">
        <div className="loading">Loading products...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="shop-container">
        <div className="error">{error}</div>
      </div>
    );
  }

  return (
    <div className="shop-container">
      <div className="shop-header">
        <h1>Our Products</h1>
        <p>Discover our amazing collection of products</p>
      </div>

      <div className="products-grid">
        {products.map((product) => (
          <Link
            to={`/product/${product.id}`}
            key={product.id}
            className="product-card"
          >
            <div className="product-image-container">
              <img
                src={product.thumbnail}
                alt={product.title}
                className="product-image"
              />
              {product.discountPercentage > 10 && (
                <span className="discount-badge">
                  -{Math.round(product.discountPercentage)}%
                </span>
              )}
            </div>
            <div className="product-info">
              <h3 className="product-title">{product.title}</h3>
              <p className="product-category">{product.category}</p>
              <div className="product-rating">
                <span className="star-icon">★</span> {product.rating.toFixed(1)}
              </div>
              <div className="product-price">
                <span className="price">${product.price}</span>
                {product.discountPercentage > 0 && (
                  <span className="original-price">
                    ${(product.price / (1 - product.discountPercentage / 100)).toFixed(2)}
                  </span>
                )}
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Shop;

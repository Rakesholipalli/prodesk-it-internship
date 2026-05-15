import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, ShoppingCart, Star, Check } from 'lucide-react';
import { useCart } from '../context/CartContext';
import './ProductDetail.css';

const ProductDetail = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedImage, setSelectedImage] = useState(0);
  const [addedToCart, setAddedToCart] = useState(false);
  const { addToCart } = useCart();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const response = await fetch(`https://dummyjson.com/products/${id}`);
        if (!response.ok) {
          throw new Error('Product not found');
        }
        const data = await response.json();
        setProduct(data);
        setError(null);
      } catch (err) {
        setError('Failed to load product. Please try again later.');
        console.error('Error fetching product:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  const handleAddToCart = () => {
    if (product) {
      addToCart(product);
      setAddedToCart(true);
      setTimeout(() => setAddedToCart(false), 2000); // reset after 2s
    }
  };

  if (loading) {
    return (
      <div className="product-detail-container">
        <div className="loading">Loading product...</div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="product-detail-container">
        <div className="error">{error || 'Product not found'}</div>
        <Link to="/shop" className="back-button">← Back to Shop</Link>
      </div>
    );
  }

  return (
    <div className="product-detail-container">
      <Link to="/shop" className="back-button">
        <ArrowLeft size={18} /> Back to Shop
      </Link>
      
      <div className="product-detail">
        <div className="product-images">
          <div className="main-image">
            <img
              src={product.images[selectedImage] || product.thumbnail}
              alt={product.title}
            />
            {product.discountPercentage > 10 && (
              <span className="discount-badge">
                -{Math.round(product.discountPercentage)}% OFF
              </span>
            )}
          </div>
          
          {product.images && product.images.length > 1 && (
            <div className="image-thumbnails">
              {product.images.map((image, index) => (
                <img
                  key={index}
                  src={image}
                  alt={`${product.title} ${index + 1}`}
                  className={selectedImage === index ? 'active' : ''}
                  onClick={() => setSelectedImage(index)}
                />
              ))}
            </div>
          )}
        </div>

        <div className="product-details-info">
          <div className="product-category">{product.category}</div>
          <h1 className="product-title">{product.title}</h1>
          
          <div className="product-rating">
            <span className="stars">
              <Star size={18} fill="#f39c12" color="#f39c12" /> {product.rating.toFixed(1)}
            </span>
            <span className="stock">
              {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
            </span>
          </div>

          <div className="product-price-section">
            <div className="current-price">${product.price}</div>
            {product.discountPercentage > 0 && (
              <div className="price-details">
                <span className="original-price">
                  ${(product.price / (1 - product.discountPercentage / 100)).toFixed(2)}
                </span>
                <span className="savings">
                  You save ${((product.price / (1 - product.discountPercentage / 100)) - product.price).toFixed(2)}
                </span>
              </div>
            )}
          </div>

          <div className="product-description">
            <h3>Description</h3>
            <p>{product.description}</p>
          </div>

          <div className="product-meta">
            <div className="meta-item">
              <strong>Brand:</strong> {product.brand || 'Generic'}
            </div>
            <div className="meta-item">
              <strong>SKU:</strong> {product.sku || 'N/A'}
            </div>
            <div className="meta-item">
              <strong>Warranty:</strong> {product.warrantyInformation || 'Standard warranty'}
            </div>
            <div className="meta-item">
              <strong>Shipping:</strong> {product.shippingInformation || 'Standard shipping'}
            </div>
          </div>

          <button
            className={`add-to-cart-button ${addedToCart ? 'added' : ''}`}
            onClick={handleAddToCart}
            disabled={product.stock === 0}
          >
            {addedToCart ? (
              <>
                <Check size={20} /> Added to Cart!
              </>
            ) : product.stock === 0 ? (
              'Out of Stock'
            ) : (
              <>
                <ShoppingCart size={20} /> Add to Cart
              </>
            )}
          </button>

          <Link to="/cart" className="view-cart-link">
            View Cart <ArrowLeft size={16} style={{ transform: 'rotate(180deg)' }} />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;

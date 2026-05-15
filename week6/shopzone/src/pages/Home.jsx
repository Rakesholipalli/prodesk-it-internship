import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, Truck, CreditCard, RotateCcw, Star } from 'lucide-react';
import './Home.css';

const Home = () => {
  return (
    <div className="home">
      <div className="hero-section">
        <div className="hero-content">
          <h1 className="hero-title">Welcome to ShopZone</h1>
          <p className="hero-subtitle">
            Discover amazing products at unbeatable prices
          </p>
          <p className="hero-description">
            Your one-stop destination for all your shopping needs. 
            Browse through thousands of products and enjoy a seamless shopping experience.
          </p>
          <Link to="/shop" className="hero-button">
            <ShoppingBag size={20} /> Start Shopping
          </Link>
        </div>
      </div>

      <div className="features-section">
        <div className="feature-card">
          <div className="feature-icon">
            <Truck size={48} />
          </div>
          <h3>Free Shipping</h3>
          <p>On orders over $50</p>
        </div>
        <div className="feature-card">
          <div className="feature-icon">
            <CreditCard size={48} />
          </div>
          <h3>Secure Payment</h3>
          <p>100% secure transactions</p>
        </div>
        <div className="feature-card">
          <div className="feature-icon">
            <RotateCcw size={48} />
          </div>
          <h3>Easy Returns</h3>
          <p>30-day return policy</p>
        </div>
        <div className="feature-card">
          <div className="feature-icon">
            <Star size={48} />
          </div>
          <h3>Quality Products</h3>
          <p>Verified and tested</p>
        </div>
      </div>
    </div>
  );
};

export default Home;

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle, Lock } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import './Checkout.css';

const Checkout = () => {
  const { cart, getTotalPrice, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [formData, setFormData] = useState({
    fullName: user?.username || '',
    email: '',
    phone: '',
    address: '',
    city: '',
    zipCode: '',
    cardNumber: '',
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setOrderPlaced(true);
    
    // redirect after 3s
    setTimeout(() => {
      clearCart();
      navigate('/');
    }, 3000);
  };

  if (orderPlaced) {
    return (
      <div className="checkout-container">
        <div className="order-success">
          <div className="success-icon">
            <CheckCircle size={80} strokeWidth={2} />
          </div>
          <h1>Order Placed Successfully!</h1>
          <p>Thank you for your purchase, {user?.username}!</p>
          <p>Your order has been confirmed and will be shipped soon.</p>
          <p className="redirect-message">Redirecting to home page...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="checkout-container">
      <h1>Checkout</h1>

      <div className="checkout-content">
        <form onSubmit={handleSubmit} className="checkout-form">
          <div className="form-section">
            <h2>Shipping Information</h2>
            
            <div className="form-group">
              <label htmlFor="fullName">Full Name *</label>
              <input
                type="text"
                id="fullName"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="email">Email *</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="phone">Phone *</label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="address">Address *</label>
              <input
                type="text"
                id="address"
                name="address"
                value={formData.address}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="city">City *</label>
                <input
                  type="text"
                  id="city"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="zipCode">ZIP Code *</label>
                <input
                  type="text"
                  id="zipCode"
                  name="zipCode"
                  value={formData.zipCode}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
          </div>

          <div className="form-section">
            <h2>Payment Information</h2>
            
            <div className="form-group">
              <label htmlFor="cardNumber">Card Number *</label>
              <input
                type="text"
                id="cardNumber"
                name="cardNumber"
                value={formData.cardNumber}
                onChange={handleChange}
                placeholder="1234 5678 9012 3456"
                required
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="expiry">Expiry Date *</label>
                <input
                  type="text"
                  id="expiry"
                  placeholder="MM/YY"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="cvv">CVV *</label>
                <input
                  type="text"
                  id="cvv"
                  placeholder="123"
                  maxLength="3"
                  required
                />
              </div>
            </div>

            <p className="payment-note">
              <Lock size={16} /> This is a demo. No real payment will be processed.
            </p>
          </div>

          <button type="submit" className="place-order-button">
            Place Order
          </button>
        </form>

        <div className="order-summary">
          <h2>Order Summary</h2>
          
          <div className="summary-items">
            {cart.map((item) => (
              <div key={item.id} className="summary-item">
                <img src={item.thumbnail} alt={item.title} />
                <div className="item-info">
                  <p className="item-title">{item.title}</p>
                  <p className="item-quantity">Qty: {item.quantity}</p>
                </div>
                <p className="item-price">${(item.price * item.quantity).toFixed(2)}</p>
              </div>
            ))}
          </div>

          <div className="summary-divider"></div>

          <div className="summary-row">
            <span>Subtotal:</span>
            <span>${getTotalPrice().toFixed(2)}</span>
          </div>

          <div className="summary-row">
            <span>Shipping:</span>
            <span className="free">FREE</span>
          </div>

          <div className="summary-row">
            <span>Tax:</span>
            <span>${(getTotalPrice() * 0.1).toFixed(2)}</span>
          </div>

          <div className="summary-divider"></div>

          <div className="summary-row total">
            <span>Total:</span>
            <span>${(getTotalPrice() * 1.1).toFixed(2)}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;

import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Login.css';

const Login = () => {
  const [username, setUsername] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || '/';

  const handleSubmit = (e) => {
    e.preventDefault();
    const name = username.trim() || 'Guest';
    login(name);
    navigate(from, { replace: true });
  };

  const handleGuestLogin = () => {
    login('Guest');
    navigate(from, { replace: true });
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
          <h1>Welcome to ShopZone</h1>
          <p>Login to continue shopping</p>
        </div>

        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label htmlFor="username">Username (Optional)</label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter your name"
            />
          </div>

          <button type="submit" className="login-button">
            Login
          </button>
        </form>

        <div className="divider">
          <span>OR</span>
        </div>

        <button onClick={handleGuestLogin} className="guest-button">
          Login as Guest
        </button>

        <p className="login-info">
          This is a demo application. No real authentication is required.
        </p>
      </div>
    </div>
  );
};

export default Login;

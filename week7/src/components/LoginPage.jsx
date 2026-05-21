import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Eye, EyeOff, LogIn } from 'lucide-react';
import './StepForm.css';
import './LoginPage.css';

const loginSchema = z.object({
  email: z.string()
    .min(1, 'Email is required')
    .regex(/^[^\s@]+@[^\s@]+\.[^\s@]+$/, 'Invalid email format'),
  password: z.string()
    .min(1, 'Password is required')
});

const LoginPage = ({ onLogin, onSwitchToRegister }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm({
    resolver: zodResolver(loginSchema),
    mode: 'onChange'
  });

  const onSubmit = (data) => {
    // Get users from localStorage
    const users = JSON.parse(localStorage.getItem('registeredUsers') || '[]');
    
    // Find user with matching email
    const user = users.find(u => u.email === data.email);
    
    if (!user) {
      setLoginError('No account found with this email. Please register first.');
      return;
    }
    
    if (user.password !== data.password) {
      setLoginError('Incorrect password. Please try again.');
      return;
    }
    
    // Successful login
    setLoginError('');
    onLogin(user);
  };

  return (
    <div className="app-container">
      <div className="wizard-card">
        <div className="wizard-header">
          <h1 className="wizard-title">Sign In</h1>
          <p className="wizard-subtitle">Enter your credentials to continue</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="wizard-form">
          {loginError && (
            <div className="login-error-box">
              {loginError}
            </div>
          )}

          <div className="form-group">
            <label htmlFor="email">Email Address *</label>
            <input
              id="email"
              type="email"
              className={errors.email ? 'input-error' : ''}
              placeholder="your.email@example.com"
              {...register('email')}
            />
            {errors.email && (
              <span className="error-message">{errors.email.message}</span>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="password">Password *</label>
            <div className="password-wrapper">
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                className={errors.password ? 'input-error' : ''}
                placeholder="Enter your password"
                {...register('password')}
              />
              <button
                type="button"
                className="toggle-password"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
            {errors.password && (
              <span className="error-message">{errors.password.message}</span>
            )}
          </div>

          <button type="submit" className="btn-submit btn-login">
            Sign In
          </button>

          <div className="login-footer">
            <p>Don't have an account?</p>
            <button 
              type="button" 
              className="link-button"
              onClick={onSwitchToRegister}
            >
              Create Account
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;

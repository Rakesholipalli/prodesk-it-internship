import React, { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import './StepForm.css';

const StepTwo = ({ register, errors, watch }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const password = watch('password');
  const email = watch('email');

  return (
    <div className="step-container">
      <h2 className="step-title">Account Details</h2>
      <p className="step-description">Create your secure account credentials</p>

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
        {email && !email.includes('@') && !errors.email && (
          <span className="error-message">Email must contain @ symbol</span>
        )}
      </div>

      <div className="form-group">
        <label htmlFor="password">Password *</label>
        <div className="password-wrapper">
          <input
            id="password"
            type={showPassword ? 'text' : 'password'}
            className={errors.password ? 'input-error' : ''}
            placeholder="Minimum 8 characters"
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
        {password && password.length < 8 && !errors.password && (
          <span className="error-message">Password must be at least 8 characters</span>
        )}
      </div>

      <div className="form-group">
        <label htmlFor="confirmPassword">Confirm Password *</label>
        <div className="password-wrapper">
          <input
            id="confirmPassword"
            type={showConfirmPassword ? 'text' : 'password'}
            className={errors.confirmPassword ? 'input-error' : ''}
            placeholder="Re-enter your password"
            {...register('confirmPassword')}
          />
          <button
            type="button"
            className="toggle-password"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
          >
            {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        </div>
        {errors.confirmPassword && (
          <span className="error-message">{errors.confirmPassword.message}</span>
        )}
      </div>
    </div>
  );
};

export default StepTwo;

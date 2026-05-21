import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { registrationSchema } from './validationSchema';
import ProgressBar from './components/ProgressBar';
import StepOne from './components/StepOne';
import StepTwo from './components/StepTwo';
import StepThree from './components/StepThree';
import SuccessScreen from './components/SuccessScreen';
import LoginPage from './components/LoginPage';
import WelcomeBack from './components/WelcomeBack';
import './App.css';

function App() {
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [loggedInUser, setLoggedInUser] = useState(null);

  // React Hook Form initialization with Zod resolver
  const {
    register,
    handleSubmit,
    watch,
    trigger,
    reset,
    formState: { errors }
  } = useForm({
    resolver: zodResolver(registrationSchema),
    mode: 'onChange', // Real-time validation
    defaultValues: {
      firstName: '',
      lastName: '',
      dateOfBirth: '',
      email: '',
      password: '',
      confirmPassword: ''
    }
  });

  const formData = watch(); // Watch all form values for state persistence

  // Step-specific validation before navigation
  const validateCurrentStep = async () => {
    let fieldsToValidate = [];
    
    if (currentStep === 1) {
      fieldsToValidate = ['firstName', 'lastName', 'dateOfBirth'];
    } else if (currentStep === 2) {
      fieldsToValidate = ['email', 'password', 'confirmPassword'];
    }

    const result = await trigger(fieldsToValidate);
    return result;
  };

  // Navigation handlers
  const handleNext = async () => {
    const isStepValid = await validateCurrentStep();
    
    if (isStepValid) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    setCurrentStep(currentStep - 1);
  };

  // Final submission handler
  const onSubmit = (data) => {
    // Check if user already exists
    const users = JSON.parse(localStorage.getItem('registeredUsers') || '[]');
    const existingUser = users.find(u => u.email === data.email);
    
    if (existingUser) {
      alert('User with this email already exists! Please login instead.');
      setShowLogin(true);
      reset();
      setCurrentStep(1);
      return;
    }
    
    // Save new user to localStorage
    const newUser = {
      firstName: data.firstName,
      lastName: data.lastName,
      dateOfBirth: data.dateOfBirth,
      email: data.email,
      password: data.password,
      registeredAt: new Date().toISOString()
    };
    
    users.push(newUser);
    localStorage.setItem('registeredUsers', JSON.stringify(users));
    
    console.log('=== REGISTRATION FORM SUBMISSION ===');
    console.log(data);
    console.log('====================================');
    
    // Trigger success state
    setIsSubmitted(true);
  };

  // Reset form and start over
  const handleReset = () => {
    reset();
    setCurrentStep(1);
    setIsSubmitted(false);
    setShowLogin(false);
    setShowRegister(true);
  };

  // Handle login
  const handleLogin = (user) => {
    setLoggedInUser(user);
  };

  // Handle logout
  const handleLogout = () => {
    setLoggedInUser(null);
    setShowLogin(true);
    setShowRegister(false);
  };

  // Switch to registration
  const handleSwitchToRegister = () => {
    setShowLogin(false);
    setShowRegister(true);
    reset();
    setCurrentStep(1);
  };

  // Switch to login from success screen
  const handleGoToLogin = () => {
    setIsSubmitted(false);
    setShowLogin(true);
    setShowRegister(false);
    reset();
  };

  // Check if current step fields are valid for conditional button disabling
  const isStepValid = () => {
    if (currentStep === 1) {
      return formData.firstName && 
             formData.lastName && 
             formData.dateOfBirth &&
             !errors.firstName &&
             !errors.lastName &&
             !errors.dateOfBirth;
    } else if (currentStep === 2) {
      return formData.email && 
             formData.password && 
             formData.confirmPassword &&
             !errors.email &&
             !errors.password &&
             !errors.confirmPassword;
    }
    return true;
  };

  // Show welcome back screen if user is logged in (Dashboard)
  if (loggedInUser) {
    return <WelcomeBack user={loggedInUser} onLogout={handleLogout} />;
  }

  // Show login page
  if (showLogin) {
    return (
      <LoginPage 
        onLogin={handleLogin} 
        onSwitchToRegister={handleSwitchToRegister}
      />
    );
  }

  // Render success screen after registration submission
  if (isSubmitted) {
    return <SuccessScreen formData={formData} onGoToLogin={handleGoToLogin} />;
  }

  return (
    <div className="app-container">
      <div className="wizard-card">
        <div className="wizard-header">
          <h1 className="wizard-title">Registration Wizard</h1>
          <p className="wizard-subtitle">Enterprise-Grade Multi-Step Form</p>
        </div>

        <ProgressBar currentStep={currentStep} totalSteps={3} />

        <form onSubmit={handleSubmit(onSubmit)} className="wizard-form">
          {/* Conditional rendering based on current step */}
          {currentStep === 1 && (
            <StepOne register={register} errors={errors} />
          )}

          {currentStep === 2 && (
            <StepTwo register={register} errors={errors} watch={watch} />
          )}

          {currentStep === 3 && (
            <StepThree formData={formData} />
          )}

          {/* Navigation buttons */}
          <div className="button-group">
            {currentStep > 1 && (
              <button
                type="button"
                onClick={handleBack}
                className="btn-secondary"
              >
                Back
              </button>
            )}

            {currentStep < 3 && (
              <button
                type="button"
                onClick={handleNext}
                className="btn-primary"
                disabled={!isStepValid()}
              >
                Next
              </button>
            )}

            {currentStep === 3 && (
              <button
                type="submit"
                className="btn-submit"
              >
                Submit Registration
              </button>
            )}
          </div>
        </form>

        <div className="wizard-footer">
          <p>Powered by React Hook Form + Zod Validation</p>
          <button 
            type="button" 
            className="link-button-footer"
            onClick={() => {
              setShowLogin(true);
              setShowRegister(false);
            }}
          >
            Already have an account? Sign in
          </button>
        </div>
      </div>
    </div>
  );
}

export default App;

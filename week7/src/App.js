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

  const {
    register,
    handleSubmit,
    watch,
    trigger,
    reset,
    formState: { errors }
  } = useForm({
    resolver: zodResolver(registrationSchema),
    mode: 'onChange',
    defaultValues: {
      firstName: '',
      lastName: '',
      dateOfBirth: '',
      email: '',
      password: '',
      confirmPassword: ''
    }
  });

  const formData = watch();

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

  const handleNext = async () => {
    const isStepValid = await validateCurrentStep();
    
    if (isStepValid) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    setCurrentStep(currentStep - 1);
  };

  const onSubmit = (data) => {
    const users = JSON.parse(localStorage.getItem('registeredUsers') || '[]');
    const existingUser = users.find(u => u.email === data.email);
    
    if (existingUser) {
      alert('User with this email already exists! Please login instead.');
      setShowLogin(true);
      reset();
      setCurrentStep(1);
      return;
    }
    
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
    
    setIsSubmitted(true);
  };

  const handleLogin = (user) => {
    setLoggedInUser(user);
  };

  const handleLogout = () => {
    setLoggedInUser(null);
    setShowLogin(true);
  };

  const handleSwitchToRegister = () => {
    setShowLogin(false);
    reset();
    setCurrentStep(1);
  };

  const handleGoToLogin = () => {
    setIsSubmitted(false);
    setShowLogin(true);
    reset();
  };

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

  if (loggedInUser) {
    return <WelcomeBack user={loggedInUser} onLogout={handleLogout} />;
  }

  if (showLogin) {
    return (
      <LoginPage 
        onLogin={handleLogin} 
        onSwitchToRegister={handleSwitchToRegister}
      />
    );
  }

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
          {currentStep === 1 && (
            <StepOne register={register} errors={errors} />
          )}

          {currentStep === 2 && (
            <StepTwo register={register} errors={errors} watch={watch} />
          )}

          {currentStep === 3 && (
            <StepThree formData={formData} />
          )}

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
            onClick={() => setShowLogin(true)}
          >
            Already have an account? Sign in
          </button>
        </div>
      </div>
    </div>
  );
}

export default App;

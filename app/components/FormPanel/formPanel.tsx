import React from 'react';
import InputField from '../InputField/inputField';
import SocialLogin from '../SocialLogin/socialLogin';
import './formPanel.scss';

interface FormPanelProps {
  isLogin: boolean;
  showPassword: boolean;
  formData: any;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  toggleMode: () => void;
  setShowPassword: React.Dispatch<React.SetStateAction<boolean>>;
  errors: any;
  isLoading: boolean;
}

const FormPanel: React.FC<FormPanelProps> = ({
  isLogin,
  showPassword,
  formData,
  handleInputChange,
  handleSubmit,
  toggleMode,
  setShowPassword,
  errors,
  isLoading
}) => {
  return (
    <div className="form-panel">
      <div className="form-header">
        <h2>{isLogin ? 'Welcome Back' : 'Create Account'}</h2>
        <p>{isLogin ? 'Sign in to access your bookings' : 'Join us to start booking queues'}</p>
      </div>

      <form onSubmit={handleSubmit} className="auth-form">
        {!isLogin && (
          <InputField
            label="Full Name"
            name="fullName"
            type="text"
            iconType="user"
            placeholder="John Doe"
            value={formData.fullName}
            onChange={handleInputChange}
            error={errors.fullName}
          />
        )}

        <InputField
          label="Email Address"
          name="email"
          type="email"
          iconType="mail"
          placeholder="your@email.com"
          value={formData.email}
          onChange={handleInputChange}
          error={errors.email}
        />

        {!isLogin && (
          <InputField
            label="Phone Number"
            name="phone"
            type="tel"
            iconType="phone"
            placeholder="+1 (555) 000-0000"
            value={formData.phone}
            onChange={handleInputChange}
            error={errors.phone}
          />
        )}

        <InputField
          label="Password"
          name="password"
          type={showPassword ? 'text' : 'password'}
          iconType="lock"
          placeholder="••••••••"
          value={formData.password}
          onChange={handleInputChange}
          showPassword={showPassword}
          setShowPassword={setShowPassword}
          error={errors.password}
        />

        {!isLogin && (
          <InputField
            label="Confirm Password"
            name="confirmPassword"
            type={showPassword ? 'text' : 'password'}
            iconType="lock"
            placeholder="••••••••"
            value={formData.confirmPassword}
            onChange={handleInputChange}
            error={errors.confirmPassword}
            success={!errors.confirmPassword && formData.confirmPassword && formData.password === formData.confirmPassword}
          />
        )}

        {isLogin && (
          <div className="forgot-password">
            <a href="#forgot">Forgot password?</a>
          </div>
        )}

        <button type="submit" className="submit-btn" disabled={isLoading}>
          {isLoading ? (
            <span className="loading-spinner">
              <span className="spinner"></span>
              {isLogin ? 'Signing In...' : 'Creating Account...'}
            </span>
          ) : (
            isLogin ? 'Sign In' : 'Create Account'
          )}
        </button>

        <div className="toggle-mode">
          {isLogin ? "Don't have an account? " : "Already have an account? "}
          <span className="toggle-link" onClick={toggleMode} role="button" tabIndex={0}>
            {isLogin ? 'Sign Up' : 'Sign In'}
          </span>
        </div>

        <div className="divider">
          <span>Or continue with</span>
        </div>

        <SocialLogin />
      </form>
    </div>
  );
};

export default FormPanel;
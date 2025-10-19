import React, { useState } from 'react';
import { Eye, EyeOff, User, Mail, Lock, Phone } from 'lucide-react';
import './inputField.scss';

interface InputFieldProps {
  label: string;
  name: string;
  type: string;
  iconType: 'user' | 'mail' | 'lock' | 'phone';
  placeholder: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  showPassword?: boolean;
  setShowPassword?: React.Dispatch<React.SetStateAction<boolean>>;
  error?: string;
  required?: boolean;
  success?: boolean;
}

const InputField: React.FC<InputFieldProps> = ({
  label,
  name,
  type,
  iconType,
  placeholder,
  value,
  onChange,
  showPassword,
  setShowPassword,
  error,
  required = true,
  success = false
}) => {
  const [isFocused, setIsFocused] = useState(false);

  const renderIcon = () => {
    if (iconType === 'user') return <User size={20} className="input-icon" />;
    if (iconType === 'mail') return <Mail size={20} className="input-icon" />;
    if (iconType === 'lock') return <Lock size={20} className="input-icon" />;
    if (iconType === 'phone') return <Phone size={20} className="input-icon" />;
  };

  const handleFocus = () => setIsFocused(true);
  const handleBlur = () => setIsFocused(false);

  return (
    <div className={`form-group ${error ? 'error' : ''} ${isFocused ? 'focused' : ''} ${success ? 'success' : ''}`}>
      <label className="form-label">
        {label}
        {required && <span className="required-asterisk">*</span>}
      </label>
      <div className="input-wrapper">
        {renderIcon()}
        <input
          type={type}
          name={name}
          value={value}
          onChange={onChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          className="form-input"
          placeholder={placeholder}
          required={required}
        />
        {iconType === 'lock' && setShowPassword && (
          <button
            type="button"
            className="password-toggle"
            onClick={() => setShowPassword(!showPassword)}
            aria-label="Toggle password visibility"
          >
            {showPassword ? <Eye size={20} /> : <EyeOff size={20} />}
          </button>
        )}
      </div>
      {error && <span className="error-message">{error}</span>}
      {success && <span className="success-message">Passwords match!</span>}
    </div>
  );
};

export default InputField;
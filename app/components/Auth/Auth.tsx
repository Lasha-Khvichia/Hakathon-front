"use client";

import React, { useState } from 'react';
import './Auth.scss';
import InfoPanel from '../InfoPanel/InfoPanel';
import FormPanel from '../FormPanel/formPanel';
import './variables.scss';

interface FormData {
  fullName: string;
  email: string;
  password: string;
  confirmPassword: string;
  phone: string;
}

interface FormErrors {
  fullName?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
  phone?: string;
}

const Auth: React.FC = () => {
  const [isLogin, setIsLogin] = useState<boolean>(true);
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [formData, setFormData] = useState<FormData>({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: ''
  });
  const [errors, setErrors] = useState<FormErrors>({});

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Clear error when user starts typing
    if (errors[name as keyof FormErrors]) {
      setErrors(prev => ({
        ...prev,
        [name]: undefined
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // TODO: Add submit logic
  };

  const toggleMode = () => {
    setIsLogin(!isLogin);
    setFormData({
      fullName: '',
      email: '',
      password: '',
      confirmPassword: '',
      phone: ''
    });
    setShowPassword(false);
    setErrors({});
  };

  return (
    <div className="auth-page">
      <div className="auth-container">
        <InfoPanel />
        <FormPanel
          isLogin={isLogin}
          showPassword={showPassword}
          formData={formData}
          handleInputChange={handleInputChange}
          handleSubmit={handleSubmit}
          toggleMode={toggleMode}
          setShowPassword={setShowPassword}
          errors={errors}
          isLoading={false}
        />
      </div>
    </div>
  );
};

export default Auth;
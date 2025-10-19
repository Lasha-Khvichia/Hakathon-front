 
import { VALIDATION } from '../constants';
import { Category, Service, Branch } from '../types';

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
}

 
 
export const validateName = (name: string): ValidationResult => {
  const errors: string[] = [];

  if (!name || name.trim().length === 0) {
    errors.push('Name is required');
  } else if (name.trim().length < VALIDATION.MIN_NAME_LENGTH) {
    errors.push(`Name must be at least ${VALIDATION.MIN_NAME_LENGTH} characters`);
  } else if (name.trim().length > VALIDATION.MAX_NAME_LENGTH) {
    errors.push(`Name must be less than ${VALIDATION.MAX_NAME_LENGTH} characters`);
 
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};

export const validateEmail = (email: string): ValidationResult => {
  const errors: string[] = [];
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!email || email.trim().length === 0) {
    errors.push('Email is required');
  } else if (!emailRegex.test(email)) {
    errors.push('Please enter a valid email address');
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};

export const validatePhone = (phone: string): ValidationResult => {
  const errors: string[] = [];
  const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;

  if (!phone || phone.trim().length === 0) {
    errors.push('Phone number is required');
  } else if (!phoneRegex.test(phone.replace(/[\s\-\(\)]/g, ''))) {
    errors.push('Please enter a valid phone number');
  }

  return {
    isValid: errors.length === 0,
    errors,
 
  };
};

export const validateRequired = (value: unknown, fieldName: string): ValidationResult => {
  const errors: string[] = [];

  if (value === null || value === undefined || value === '') {
    errors.push(`${fieldName} is required`);
  }

  return {
    isValid: errors.length === 0,
    errors
  };
 
};

export const validateBookingForm = (data: {
  category: Category | null;
  service: Service | null;
  branch?: Branch | null;
  date: string | Date | null;
  time: string | null;
}): ValidationResult => {
  const errors: string[] = [];

  const categoryValidation = validateRequired(data.category, 'Category');
  const serviceValidation = validateRequired(data.service, 'Service');
  const dateValidation = validateRequired(data.date, 'Date');
  const timeValidation = validateRequired(data.time, 'Time');

  errors.push(...categoryValidation.errors);
  errors.push(...serviceValidation.errors);
  errors.push(...dateValidation.errors);
  errors.push(...timeValidation.errors);

  if (data.category?.hasBranches) {
    const branchValidation = validateRequired(data.branch, 'Branch');
    errors.push(...branchValidation.errors);
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};

export const sanitizeString = (input: string): string => {
  return input.trim().replace(/[<>]/g, '');
};

export const sanitizeFormData = <T extends Record<string, unknown>>(data: T): T => {
  const sanitized = { ...data } as Record<string, unknown>;

  Object.keys(sanitized).forEach((key) => {
    if (typeof sanitized[key] === 'string') {
      sanitized[key] = sanitizeString(sanitized[key] as string);
    }
  });

  return sanitized as T;
};
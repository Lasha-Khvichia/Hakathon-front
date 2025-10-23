// app/utils/env-validation.ts

interface RequiredEnvVars {
  // Core API Configuration
  NEXT_PUBLIC_API_URL: string;
  BACKEND_API_URL: string;
  
  // Development Auth Token (required for dev)
  DEV_AUTH_TOKEN: string;
  
  // Optional but recommended
  GEMINI_API_KEY?: string;
  NEXT_PUBLIC_GEMINI_API_URL?: string;
}

interface OptionalEnvVars {
  NEXT_PUBLIC_API_TIMEOUT: string;
  NEXT_PUBLIC_AUTH_TOKEN_KEY: string;
  NEXT_PUBLIC_GEMINI_API_KEY_STORAGE: string;
  NEXT_PUBLIC_DEBUG_MODE: string;
  NEXT_PUBLIC_ENABLE_API_LOGGING: string;
  NEXT_PUBLIC_API_CORS_ENABLED: string;
}

export class EnvironmentValidationError extends Error {
  constructor(public missingVars: string[]) {
    super(`Missing required environment variables: ${missingVars.join(', ')}`);
    this.name = 'EnvironmentValidationError';
  }
}

export function validateEnvironmentVariables(): {
  isValid: boolean;
  missingVars: string[];
  warnings: string[];
} {
  const requiredVars: (keyof RequiredEnvVars)[] = [
    'NEXT_PUBLIC_API_URL',
    'BACKEND_API_URL',
    'DEV_AUTH_TOKEN',
  ];

  const recommendedVars: (keyof RequiredEnvVars)[] = [
    'GEMINI_API_KEY',
    'NEXT_PUBLIC_GEMINI_API_URL',
  ];

  const missingVars: string[] = [];
  const warnings: string[] = [];

  // Check required variables
  for (const varName of requiredVars) {
    const value = process.env[varName];
    if (!value || value.trim() === '') {
      missingVars.push(varName);
    }
  }

  // Check recommended variables
  for (const varName of recommendedVars) {
    const value = process.env[varName];
    if (!value || value.trim() === '' || value === 'your_gemini_api_key_here' || value === 'your_actual_gemini_api_key_here') {
      warnings.push(`Recommended environment variable ${varName} is not set or using placeholder value. AI features may not work properly.`);
    }
  }

  // Additional validation
  if (process.env.NEXT_PUBLIC_API_URL && !process.env.NEXT_PUBLIC_API_URL.startsWith('http')) {
    warnings.push('NEXT_PUBLIC_API_URL should start with http:// or https://');
  }

  if (process.env.BACKEND_API_URL && !process.env.BACKEND_API_URL.startsWith('http')) {
    warnings.push('BACKEND_API_URL should start with http:// or https://');
  }

  if (process.env.NEXT_PUBLIC_API_TIMEOUT) {
    const timeout = parseInt(process.env.NEXT_PUBLIC_API_TIMEOUT);
    if (isNaN(timeout) || timeout <= 0) {
      warnings.push('NEXT_PUBLIC_API_TIMEOUT should be a positive number');
    }
  }

  return {
    isValid: missingVars.length === 0,
    missingVars,
    warnings,
  };
}

export function getEnvironmentInfo() {
  const validation = validateEnvironmentVariables();
  
  return {
    nodeEnv: process.env.NODE_ENV || 'development',
    apiUrl: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001',
    backendUrl: process.env.BACKEND_API_URL || 'http://localhost:3002',
    timeout: parseInt(process.env.NEXT_PUBLIC_API_TIMEOUT || '10000'),
    debugMode: process.env.NEXT_PUBLIC_DEBUG_MODE === 'true',
    apiLogging: process.env.NEXT_PUBLIC_ENABLE_API_LOGGING === 'true',
    hasGeminiKey: !!(process.env.GEMINI_API_KEY && 
                    process.env.GEMINI_API_KEY !== 'your_gemini_api_key_here' &&
                    process.env.GEMINI_API_KEY !== 'your_actual_gemini_api_key_here'),
    validation,
  };
}

// Runtime validation function for development
export function validateEnvironmentOnStartup() {
  if (typeof window !== 'undefined') {
    // Only run on client-side in development
    return;
  }

  const { isValid, missingVars, warnings } = validateEnvironmentVariables();

  if (!isValid) {
    console.error('❌ Environment Validation Failed');
    console.error('Missing required environment variables:', missingVars);
    console.error('Please check your .env.local file and ensure all required variables are set.');
    
    if (process.env.NODE_ENV === 'development') {
      console.error('Copy .env.example to .env.local and fill in the values.');
    }
    
    throw new EnvironmentValidationError(missingVars);
  }

  if (warnings.length > 0) {
    console.warn('⚠️  Environment Warnings:');
    warnings.forEach(warning => console.warn(`  - ${warning}`));
  }

  console.log('✅ Environment validation passed');
  
  if (process.env.NEXT_PUBLIC_DEBUG_MODE === 'true') {
    console.log('Environment Info:', getEnvironmentInfo());
  }
}
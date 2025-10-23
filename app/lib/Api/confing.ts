// lib/api/config.ts

// Environment-based API configuration
export const API_CONFIG = {
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001',
  timeout: parseInt(process.env.NEXT_PUBLIC_API_TIMEOUT || '10000'),
  headers: {
    'Content-Type': process.env.NEXT_PUBLIC_API_CONTENT_TYPE || 'application/json',
  },
};

// Backend API URL for proxy configuration
export const BACKEND_API_URL = process.env.BACKEND_API_URL || 'http://localhost:3002';

// Authentication configuration
export const AUTH_CONFIG = {
  tokenKey: process.env.NEXT_PUBLIC_AUTH_TOKEN_KEY || 'authToken',
  devToken: process.env.DEV_AUTH_TOKEN || '',
};

// Gemini AI configuration
export const GEMINI_CONFIG = {
  apiUrl: process.env.NEXT_PUBLIC_GEMINI_API_URL || 'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent',
  apiKey: process.env.GEMINI_API_KEY || '',
  storageKey: process.env.NEXT_PUBLIC_GEMINI_API_KEY_STORAGE || 'gemini_api_key',
};

// Environment-controllable API endpoints
export const API_ENDPOINTS = {
  // Auth
  auth: {
    login: process.env.NEXT_PUBLIC_AUTH_LOGIN_ENDPOINT || '/auth/login',
    register: process.env.NEXT_PUBLIC_AUTH_REGISTER_ENDPOINT || '/auth/register',
    logout: process.env.NEXT_PUBLIC_AUTH_LOGOUT_ENDPOINT || '/auth/logout',
    profile: process.env.NEXT_PUBLIC_AUTH_PROFILE_ENDPOINT || '/auth/profile',
  },
  // Categories
  categories: {
    getAll: process.env.NEXT_PUBLIC_CATEGORIES_ENDPOINT || '/category',
    getById: (id: number) => `${process.env.NEXT_PUBLIC_CATEGORIES_BY_ID_ENDPOINT || '/category'}/${id}`,
    getCompanies: (id: number) => `${process.env.NEXT_PUBLIC_CATEGORIES_COMPANIES_ENDPOINT || '/category'}/${id}/companies`,
  },
  // Companies
  companies: {
    getAll: process.env.NEXT_PUBLIC_COMPANIES_ENDPOINT || '/company',
    getById: (id: number) => `${process.env.NEXT_PUBLIC_COMPANIES_BY_ID_ENDPOINT || '/company'}/${id}`,
    getByCategory: (categoryId: number) => `${process.env.NEXT_PUBLIC_COMPANIES_BY_CATEGORY_ENDPOINT || '/company'}?categoryId=${categoryId}`,
  },
  // Bookings
  bookings: {
    getAll: process.env.NEXT_PUBLIC_BOOKINGS_ENDPOINT || '/booking',
    getById: (id: number) => `${process.env.NEXT_PUBLIC_BOOKINGS_BY_ID_ENDPOINT || '/booking'}/${id}`,
    create: process.env.NEXT_PUBLIC_BOOKINGS_CREATE_ENDPOINT || '/booking',
    update: (id: number) => `${process.env.NEXT_PUBLIC_BOOKINGS_UPDATE_ENDPOINT || '/booking'}/${id}`,
    delete: (id: number) => `${process.env.NEXT_PUBLIC_BOOKINGS_DELETE_ENDPOINT || '/booking'}/${id}`,
    getUserBookings: process.env.NEXT_PUBLIC_BOOKINGS_USER_ENDPOINT || '/booking/me',
  },
  // Users
  users: {
    getProfile: process.env.NEXT_PUBLIC_USERS_PROFILE_ENDPOINT || '/user',
    updateProfile: process.env.NEXT_PUBLIC_USERS_UPDATE_PROFILE_ENDPOINT || '/user',
  },
};

// Debug and development settings
export const DEBUG_CONFIG = {
  debugMode: process.env.NEXT_PUBLIC_DEBUG_MODE === 'true',
  enableApiLogging: process.env.NEXT_PUBLIC_ENABLE_API_LOGGING === 'true',
  corsEnabled: process.env.NEXT_PUBLIC_API_CORS_ENABLED === 'true',
};
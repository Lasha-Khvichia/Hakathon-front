// lib/api/config.ts
export const API_CONFIG = {
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
};

export const API_ENDPOINTS = {
  // Auth
  auth: {
    login: '/auth/login',
    register: '/auth/register',
    logout: '/auth/logout',
    profile: '/auth/profile',
  },
  // Categories
  categories: {
    getAll: '/categories',
    getById: (id: number) => `/categories/${id}`,
    getCompanies: (id: number) => `/categories/${id}/companies`,
  },
  // Companies
  companies: {
    getAll: '/companies',
    getById: (id: number) => `/companies/${id}`,
    getByCategory: (categoryId: number) => `/companies?categoryId=${categoryId}`,
  },
  // Bookings
  bookings: {
    getAll: '/booking',
    getById: (id: number) => `/booking/${id}`,
    create: '/booking',
    update: (id: number) => `/booking/${id}`,
    delete: (id: number) => `/booking/${id}`,
    getUserBookings: '/booking/me',
  },
  // Users
  users: {
    getProfile: '/users/profile',
    updateProfile: '/users/profile',
  },
};
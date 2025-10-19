// lib/api/config.ts
export const API_CONFIG = {
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api',
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
    me: '/auth/me',
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
    getAll: '/bookings',
    getById: (id: number) => `/bookings/${id}`,
    create: '/bookings',
    update: (id: number) => `/bookings/${id}`,
    delete: (id: number) => `/bookings/${id}`,
    getUserBookings: '/bookings/me',
  },
  // Users
  users: {
    getProfile: '/users/profile',
    updateProfile: '/users/profile',
  },
};
// lib/api/services.ts
import { UserTypes } from '@/app/BackAPI/UserTypes';
import { apiClient } from './client';
import { API_ENDPOINTS } from './confing';
import { CategoryTypes } from '@/app/BackAPI/CategoryTypes';
import { CompanyTypes } from '@/app/BackAPI/CompanyTypes';
import { BookingTypes } from '@/app/BackAPI/BookingTypes';
 
// Auth Service
export const authService = {
  login: async (email: string, password: string) => {
    return apiClient.post<{ user: UserTypes; token: string }>(
      API_ENDPOINTS.auth.login,
      { email, password }
    );
  },

  register: async (data: { name: string; email: string; password: string }) => {
    return apiClient.post<{ user: UserTypes; token: string }>(
      API_ENDPOINTS.auth.register,
      data
    );
  },

  logout: async () => {
    return apiClient.post(API_ENDPOINTS.auth.logout);
  },

  getMe: async () => {
    return apiClient.get<UserTypes>(API_ENDPOINTS.auth.me);
  },
};

// Category Service
export const categoryService = {
  getAll: async () => {
    return apiClient.get<CategoryTypes[]>(API_ENDPOINTS.categories.getAll);
  },

  getById: async (id: number) => {
    return apiClient.get<CategoryTypes>(API_ENDPOINTS.categories.getById(id));
  },

  getCompanies: async (id: number) => {
    return apiClient.get<CompanyTypes[]>(API_ENDPOINTS.categories.getCompanies(id));
  },
};

// Company Service
export const companyService = {
  getAll: async () => {
    return apiClient.get<CompanyTypes[]>(API_ENDPOINTS.companies.getAll);
  },

  getById: async (id: number) => {
    return apiClient.get<CompanyTypes>(API_ENDPOINTS.companies.getById(id));
  },

  getByCategory: async (categoryId: number) => {
    return apiClient.get<CompanyTypes[]>(
      API_ENDPOINTS.companies.getByCategory(categoryId)
    );
  },
};

// Booking Service
export const bookingService = {
  getAll: async () => {
    return apiClient.get<BookingTypes[]>(API_ENDPOINTS.bookings.getAll);
  },

  getById: async (id: number) => {
    return apiClient.get<BookingTypes>(API_ENDPOINTS.bookings.getById(id));
  },

  getUserBookings: async () => {
    return apiClient.get<BookingTypes[]>(API_ENDPOINTS.bookings.getUserBookings);
  },

  create: async (data: {
    companyId: number;
    booked: Date | string;
    serviceId?: number;
    serviceName?: string;
  }) => {
    return apiClient.post<BookingTypes>(API_ENDPOINTS.bookings.create, data);
  },

  update: async (id: number, data: Partial<BookingTypes>) => {
    return apiClient.put<BookingTypes>(API_ENDPOINTS.bookings.update(id), data);
  },

  delete: async (id: number) => {
    return apiClient.delete(API_ENDPOINTS.bookings.delete(id));
  },
};

// User Service
export const userService = {
  getProfile: async () => {
    return apiClient.get<UserTypes>(API_ENDPOINTS.users.getProfile);
  },

  updateProfile: async (data: Partial<UserTypes>) => {
    return apiClient.put<UserTypes>(API_ENDPOINTS.users.updateProfile, data);
  },
};
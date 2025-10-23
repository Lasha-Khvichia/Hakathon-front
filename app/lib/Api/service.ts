// lib/api/services.ts
import { UserTypes } from '@/app/BackAPI/UserTypes';
import { apiClient } from './client';
import axios from 'axios';
import { API_ENDPOINTS, AUTH_CONFIG } from './confing';
import { CategoryTypes, CreateCategoryDto } from '@/app/BackAPI/CategoryTypes';
import { CompanyTypes } from '@/app/BackAPI/CompanyTypes';
import { BookingTypes } from '@/app/BackAPI/BookingTypes';
import { CreateBookingDto, CompanyAvailability, BookingInsights } from '../../types/booking.types';

function getAuthToken(): string {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem(AUTH_CONFIG.devToken);
    if (token) return token;
  }
  // Use environment-controlled dev token
  return AUTH_CONFIG.devToken;
}

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

  getProfile: async () => {
    return apiClient.get<UserTypes>(API_ENDPOINTS.auth.profile);
  },
};

// Category Service
export const categoryService = {
  getAll: async () => {
    // Try different endpoint variations to find the correct one
    const endpoints = ['/api/category', '/category'];
    const token = getAuthToken();

    for (const endpoint of endpoints) {
      console.log(`Trying endpoint: ${endpoint}`);
      try {
        const res = await axios.get(endpoint, {
          timeout: 5000,
          headers: {
            Authorization: `Bearer ${token}`,
            'Cache-Control': 'no-cache, no-store, must-revalidate',
            'Pragma': 'no-cache',
            'Expires': '0',
          },
        });
        console.log(`✅ Success with endpoint: ${endpoint}`);
        const categories = res.data as CategoryTypes[];

        // For each category, attempt to load related companies from backend
        await Promise.all(categories.map(async (cat) => {
          try {
            const comps = await companyService.getByCategory(cat.id);
            (cat as any).companies = comps;
          } catch (e) {
            (cat as any).companies = [];
          }
        }));

        return categories;
      } catch (err) {
        console.log(`❌ Failed with endpoint: ${endpoint}`, (err as any).response?.status);
        continue;
      }
    }

    // If all endpoints fail, throw error
    console.error('All category endpoints failed');
    throw new Error('Unable to fetch categories from any endpoint');
  },

  getById: async (id: number) => {
    return apiClient.get<CategoryTypes>(API_ENDPOINTS.categories.getById(id));
  },

  create: async (data: CreateCategoryDto) => {
    return apiClient.post<CategoryTypes>(API_ENDPOINTS.categories.getAll, data);
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
    // Request companies via Next proxy using environment-controlled endpoint
    const url = `/api/company?categoryId=${categoryId}`;
    const token = getAuthToken();

    try {
      const res = await axios.get(url, {
        timeout: 5000,
        headers: {
          Authorization: `Bearer ${token}`,
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          'Pragma': 'no-cache',
          'Expires': '0',
        },
      });
      return res.data as CompanyTypes[];
    } catch (err) {
      // Fallback to existing API client path
      try {
        const fallback = await apiClient.get<CompanyTypes[]>(API_ENDPOINTS.companies.getByCategory(categoryId));
        return fallback;
      } catch (inner) {
        console.error('companyService.getByCategory failed:', err, inner);
        return [] as CompanyTypes[];
      }
    }
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

  getByUser: async (userId: number) => {
    const token = getAuthToken();
    const res = await axios.get(`/api/booking/user/${userId}`, {
      timeout: 5000,
      headers: {
        Authorization: `Bearer ${token}`,
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0',
      },
    });
    return res.data as BookingTypes[];
  },

  getByCompany: async (companyId: number) => {
    const token = getAuthToken();
    const res = await axios.get(`/api/booking/company/${companyId}`, {
      timeout: 5000,
      headers: {
        Authorization: `Bearer ${token}`,
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0',
      },
    });
    return res.data as BookingTypes[];
  },

  getAvailability: async (companyId: number, date: string) => {
    const token = getAuthToken();
    const res = await axios.get(`/api/booking/availability/${companyId}?date=${date}`, {
      timeout: 5000,
      headers: {
        Authorization: `Bearer ${token}`,
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0',
      },
    });
    return res.data as CompanyAvailability;
  },

  getInsights: async (bookingId: number) => {
    const token = getAuthToken();
    const res = await axios.get(`/api/booking/${bookingId}/insights`, {
      timeout: 5000,
      headers: {
        Authorization: `Bearer ${token}`,
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0',
      },
    });
    return res.data as BookingInsights;
  },

  getUserBookings: async () => {
    return apiClient.get<BookingTypes[]>(API_ENDPOINTS.bookings.getUserBookings);
  },

  create: async (data: CreateBookingDto) => {
    const token = getAuthToken();
    const res = await axios.post('/api/booking', data, {
      timeout: 10000,
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0',
      },
    });
    return res.data as BookingTypes;
  },

  update: async (id: number, data: Partial<CreateBookingDto>) => {
    const token = getAuthToken();
    const res = await axios.patch(`/api/booking/${id}`, data, {
      timeout: 10000,
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0',
      },
    });
    return res.data as BookingTypes;
  },

  confirm: async (id: number) => {
    const token = getAuthToken();
    const res = await axios.patch(`/api/booking/${id}/confirm`, {}, {
      timeout: 5000,
      headers: {
        Authorization: `Bearer ${token}`,
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0',
      },
    });
    return res.data as BookingTypes;
  },

  cancel: async (id: number, reason?: string) => {
    const token = getAuthToken();
    const res = await axios.patch(`/api/booking/${id}/cancel`, { reason }, {
      timeout: 5000,
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0',
      },
    });
    return res.data as BookingTypes;
  },

  complete: async (id: number) => {
    const token = getAuthToken();
    const res = await axios.patch(`/api/booking/${id}/complete`, {}, {
      timeout: 5000,
      headers: {
        Authorization: `Bearer ${token}`,
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0',
      },
    });
    return res.data as BookingTypes;
  },

  markNoShow: async (id: number) => {
    const token = getAuthToken();
    const res = await axios.patch(`/api/booking/${id}/no-show`, {}, {
      timeout: 5000,
      headers: {
        Authorization: `Bearer ${token}`,
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0',
      },
    });
    return res.data as BookingTypes;
  },

  delete: async (id: number) => {
    const token = getAuthToken();
    const res = await axios.delete(`/api/booking/${id}`, {
      timeout: 5000,
      headers: {
        Authorization: `Bearer ${token}`,
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0',
      },
    });
    return res.data;
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
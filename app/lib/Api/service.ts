// lib/api/services.ts
import { UserTypes } from '@/app/BackAPI/UserTypes';
import { apiClient } from './client';
import axios from 'axios';
import { API_ENDPOINTS } from './confing';
import { CategoryTypes } from '@/app/BackAPI/CategoryTypes';
import { CompanyTypes } from '@/app/BackAPI/CompanyTypes';
import { BookingTypes } from '@/app/BackAPI/BookingTypes';
// DEV fallback token (provided by user) - for local development only
const DEV_AUTH_TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImFkbWluIiwic3ViIjoxLCJyb2xlIjoidXNlciIsImlhdCI6MTc2MDgxODQyNCwiZXhwIjoxNzYwOTA0ODI0fQ.jNXAGyjvEKu8cNDJ6m6S4uZyH6t76o-Ulw8GEihZ_tA';

function getAuthToken(): string {
  if (typeof window !== 'undefined') {
    const t = localStorage.getItem('authToken');
    if (t) return t;
  }
  return DEV_AUTH_TOKEN;
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
    // Request categories via the Next proxy so we avoid browser CORS.
    // This will proxy /api/category -> http://localhost:3002/category per next.config.ts
    const url = '/api/category';
    const token = getAuthToken();

    const maxAttempts = 2;
    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
      try {
        const res = await axios.get(url, {
          timeout: 5000,
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const categories = res.data as CategoryTypes[];

        // For each category, attempt to load related companies from backend /company endpoint
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
        // On last attempt, log and fall back
        if (attempt === maxAttempts) {
          console.error('categoryService.getAll failed after retries:', err);
          // Fallback mock categories so UI can operate offline
          const fallback: CategoryTypes[] = [
            {
              id: 1,
              createdAt: new Date(),
              updatedAt: new Date(),
              name: 'Banking',
            },
            {
              id: 2,
              createdAt: new Date(),
              updatedAt: new Date(),
              name: 'Healthcare',
            },
            {
              id: 3,
              createdAt: new Date(),
              updatedAt: new Date(),
              name: 'Government',
            },
          ];
          return fallback;
        }
        // otherwise wait a short time and retry
        await new Promise(r => setTimeout(r, 500));
      }
    }
    // Shouldn't reach here, return empty array
    return [] as CategoryTypes[];
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
    // Request companies via Next proxy (/api/company -> http://localhost:3002/company)
  const url = `/api/company?categoryId=${categoryId}`;
  const token = getAuthToken();

    try {
      const res = await axios.get(url, { timeout: 5000, headers: { Authorization: `Bearer ${token}` } });
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

  getUserBookings: async () => {
    return apiClient.get<BookingTypes[]>(API_ENDPOINTS.bookings.getUserBookings);
  },

  create: async (data: {
    userId?: number;
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
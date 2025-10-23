import { BookingTypes } from "../BackAPI/BookingTypes";
import { CategoryTypes, CreateCategoryDto } from "../BackAPI/CategoryTypes";
import { CompanyTypes } from "../BackAPI/CompanyTypes";
import { RolesEnum, UserTypes } from "../BackAPI/UserTypes";
import { ReactNode } from 'react';

 

// Re-export all types
export type { BookingTypes, CategoryTypes, CreateCategoryDto, CompanyTypes, UserTypes };
export { RolesEnum };

// Additional types for the application
export interface Day {
  day: string;
  num: number;
  month: string;
  year: number;
}

export interface DateInfo {
  day: string;
  num: number;
  month: string;
  year: number;
  full: string;
}

export interface Category {
  id?: number;
  name: string;
  icon: string;
  color?: string;
  hasServices?: boolean;
  hasBranches?: boolean;
}

export interface Service {
  id: number;
  name: string;
  icon?: string;
}

export interface Branch {
  id: number;
  name: string;
  address?: string;
  icon?: string;
}

export interface BookingData {
  id?: number;
  ticketNumber: string;
  category: {
    name: string;
    icon?: string;
  };
  service: {
    icon: ReactNode;
    name: string;
  };
  branch: {
    name: string;
  } | null;
  date: Date | string;
  time: string;
  createdAt?: Date;
  updatedAt?: Date;
}

// API Response Types
export interface ApiResponse<T> {
  data: T;
  message?: string;
  success: boolean;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// Auth Response Types
export interface LoginResponse {
  user: UserTypes;
  token: string;
}

export interface RegisterResponse {
  user: UserTypes;
  token: string;
}
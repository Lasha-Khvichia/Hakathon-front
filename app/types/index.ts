import { ReactNode } from "react";
 

export interface Category {
  id: string | number;
  name: string;
  icon?: ReactNode | string;
  color?: "blue" | "green" | "purple" | "red" | "indigo" | "yellow";
 
  hasBranches?: boolean;
  hasServices?: boolean;
}

export interface Service {
  id: string | number;
  name: string;
  icon?: ReactNode | string;
  description?: string;
  estimatedTime?: string;
 
}

export interface Branch {
  id: string | number;
  name: string;
  address?: string;
  phone?: string;
  workingHours?: string;
  coordinates?: {
    lat: number;
    lng: number;
  };
}

export interface TimeSlot {
  id: string;
  time: string;
  available: boolean;
}

export interface DateInfo {
  day: string;
  num: number | string;
  month: string;
  year?: number;
  full?: string;
 
}

export interface BookingData {
  id: number;
  category: Category | null;
  service: Service | null;
  branch: Branch | null;
  date: string | Date | null;
  time: string | null;
  ticketNumber: number;
  status?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface LoadingState {
  isLoading: boolean;
  error?: string | null;
}

export interface Day {
  day: string;
  num: number | string;
  month: string;
  year?: number;
  full?: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export type BookingStepHandler<T = unknown> = (data: T) => void;
export type VoidHandler = () => void;

export interface ComponentWithChildren {
  children: ReactNode;
}

export interface ComponentWithClassName {
  className?: string;
}
 

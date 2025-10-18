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
}

export interface Branch {
  id: string | number;
  name: string;
  address?: string;
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

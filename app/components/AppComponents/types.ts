// ========================================
// TypeScript Type Definitions
// ========================================

export interface Category {
  id: number;
  name: string;
  icon: string;
  color: string;
  hasServices: boolean;
  hasBranches: boolean;
}

export interface Service {
  id: number;
  name: string;
  icon: string;
}

export interface Branch {
  id: number;
  name: string;
  address: string;
  icon: string;
}

export interface DateInfo {
  date: Date;
  day: string;
  num: number;
  month: string;
  full: string;
}

export interface Booking {
  id: number;
  category: Category;
  service: Service;
  branch: Branch | null;
  date: DateInfo;
  time: string;
  ticketNumber: number;
}

export interface ChatMessage {
  role: 'user' | 'ai';
  text: string;
}

export type TimeSlot = string;
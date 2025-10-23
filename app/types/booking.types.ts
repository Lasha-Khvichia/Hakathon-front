export enum BookingStatus {
  PENDING = 'pending',
  CONFIRMED = 'confirmed',
  CANCELLED = 'cancelled',
  COMPLETED = 'completed',
  NO_SHOW = 'no_show',
}

export enum BookingType {
  APPOINTMENT = 'appointment',
  CONSULTATION = 'consultation',
  EMERGENCY = 'emergency',
  FOLLOWUP = 'followup',
  ROUTINE = 'routine',
}

export interface BookingTypes {
  id: number;
  ticketNumber: string;
  bookedDate: string;
  startTime: string;
  endTime: string;
  status: BookingStatus;
  type: BookingType;
  notes?: string;
  aiRecommendation?: string;
  cancellationReason?: string;
  price?: number;
  isReminderSent: boolean;
  aiMetadata?: any;
  user: {
    id: number;
    email: string;
    firstName?: string;
    lastName?: string;
  };
  company: {
    id: number;
    name: string;
    category: {
      id: number;
      name: string;
      color: string;
    };
  };
  createdAt: string;
  updatedAt: string;
}

export interface CreateBookingDto {
  userId: number;
  companyId: number;
  bookedDate: string;
  startTime: string;
  endTime: string;
  status?: BookingStatus;
  type?: BookingType;
  notes?: string;
  price?: number;
  requestAiRecommendation?: boolean;
}

export interface AvailabilitySlot {
  time: string;
  confidence: number;
  reason: string;
}

export interface CompanyAvailability {
  date: string;
  company: string;
  availableSlots: AvailabilitySlot[];
  bookedSlots: {
    startTime: string;
    endTime: string;
    status: BookingStatus;
  }[];
}

export interface BookingInsights {
  booking: BookingTypes;
  insights: string;
  aiMetadata: any;
  recommendation: string;
}

export interface BookingConflict {
  hasConflict: boolean;
  suggestions: string[];
  severity: 'low' | 'medium' | 'high';
}
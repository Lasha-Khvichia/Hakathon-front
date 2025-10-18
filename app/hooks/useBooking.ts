"use client";
import { useState, useCallback, useEffect } from 'react';
import { Category, Service, Branch, BookingData, LoadingState } from '../types';
import { BOOKING_STEPS } from '../constants';
import { validateBookingForm } from '../utils/validation';
import { checkBookingAvailability } from '../components/services/geminiAPI.';

interface UseBookingReturn {
  step: number;
  selectedCategory: Category | null;
  selectedService: Service | null;
  selectedBranch: Branch | null;
  selectedDate: string | Date | null;
  selectedTime: string | null;
  bookings: BookingData[];
  loadingState: LoadingState;
  availabilityResult: any;
  
  handleCategorySelect: (category: Category) => void;
  handleServiceSelect: (service: Service) => void;
  handleBranchSelect: (branch: Branch) => void;
  handleDateSelect: (date: string | Date) => void;
  handleTimeSelect: (time: string) => void;
  confirmBooking: (geminiApiKey?: string) => void;
  resetBooking: () => void;
  goBack: () => void;
  setStep: (step: number) => void;
  setAvailabilityResult: (result: any) => void;
  
  canProceed: boolean;
  currentStepData: Record<string, unknown>;
  progressPercentage: number;
}

export const useBooking = (): UseBookingReturn => {
  const [step, setStep] = useState<number>(BOOKING_STEPS.CATEGORY_SELECTION);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [selectedBranch, setSelectedBranch] = useState<Branch | null>(null);
  const [selectedDate, setSelectedDate] = useState<string | Date | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [bookings, setBookings] = useState<BookingData[]>([]);
  const [availabilityResult, setAvailabilityResult] = useState<any>(null);
  const [loadingState, setLoadingState] = useState<LoadingState>({
    isLoading: false,
    error: null,
  });



  const handleCategorySelect = useCallback((category: Category) => {
    setSelectedCategory(category);
    setSelectedService(null);
    setSelectedBranch(null);
    setSelectedDate(null);
    setSelectedTime(null);
    setStep(BOOKING_STEPS.BRANCH_SELECTION);
  }, []);

  const handleBranchSelect = useCallback((branch: Branch) => {
    setSelectedBranch(branch);
    setSelectedService(null);
    setSelectedDate(null);
    setSelectedTime(null);
    setStep(BOOKING_STEPS.SERVICE_SELECTION);
  }, []);

  const handleServiceSelect = useCallback((service: Service) => {
    setSelectedService(service);
    setSelectedDate(null);
    setSelectedTime(null);
    setStep(BOOKING_STEPS.DATE_SELECTION);
  }, []);

  const handleDateSelect = useCallback((date: string | Date) => {
    setSelectedDate(date);
    setSelectedTime(null);
    setStep(BOOKING_STEPS.TIME_SELECTION);
  }, []);

  const handleTimeSelect = useCallback((time: string) => {
    setSelectedTime(time);
    setStep(BOOKING_STEPS.CONFIRMATION);
  }, []);

  const confirmBooking = useCallback(async (geminiApiKey?: string) => {
    const bookingData = {
      category: selectedCategory,
      service: selectedService,
      branch: selectedBranch,
      date: selectedDate,
      time: selectedTime,
    };

    const validation = validateBookingForm(bookingData);
    if (!validation.isValid) {
      setLoadingState({
        isLoading: false,
        error: validation.errors.join(', '),
      });
      return;
    }

    setLoadingState({ isLoading: true, error: null });

    try {
      // Use Gemini AI to check availability if API key provided
      if (geminiApiKey && selectedCategory && selectedService && selectedBranch && selectedDate && selectedTime) {
        const availabilityCheck = await checkBookingAvailability({
          category: selectedCategory.name,
          branch: selectedBranch.name,
          service: selectedService.name,
          date: typeof selectedDate === 'string' ? selectedDate : selectedDate.toISOString().split('T')[0],
          time: selectedTime
        }, geminiApiKey);

        setAvailabilityResult(availabilityCheck);

        if (!availabilityCheck.isAvailable) {
          setLoadingState({
            isLoading: false,
            error: availabilityCheck.message
          });
          return;
        }
      }

      await new Promise(resolve => setTimeout(resolve, 1000));

      const newBooking: BookingData = {
        id: Date.now(),
        category: selectedCategory,
        service: selectedService,
        branch: selectedBranch,
        date: selectedDate,
        time: selectedTime,
        ticketNumber: Math.floor(Math.random() * 2000) + 1,
        status: 'confirmed',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      setBookings(prev => [...prev, newBooking]);
      setStep(BOOKING_STEPS.SUCCESS);
      setLoadingState({ isLoading: false, error: null });
    } catch (error) {
      setLoadingState({
        isLoading: false,
        error: 'Failed to confirm booking. Please try again.',
      });
    }
  }, [selectedCategory, selectedService, selectedBranch, selectedDate, selectedTime]);

  const resetBooking = useCallback(() => {
    setSelectedCategory(null);
    setSelectedService(null);
    setSelectedBranch(null);
    setSelectedDate(null);
    setSelectedTime(null);
    setStep(BOOKING_STEPS.CATEGORY_SELECTION);
    setLoadingState({ isLoading: false, error: null });
  }, []);

  const goBack = useCallback(() => {
    if (step > BOOKING_STEPS.CATEGORY_SELECTION) {
      setStep(step - 1);
      setLoadingState({ isLoading: false, error: null });
    }
  }, [step]);

  const canProceed = useCallback(() => {
    switch (step) {
      case BOOKING_STEPS.CATEGORY_SELECTION:
        return !!selectedCategory;
      case BOOKING_STEPS.BRANCH_SELECTION:
        return !!selectedBranch;
      case BOOKING_STEPS.SERVICE_SELECTION:
        return !!selectedService;
      case BOOKING_STEPS.DATE_SELECTION:
        return !!selectedDate;
      case BOOKING_STEPS.TIME_SELECTION:
        return !!selectedTime;
      case BOOKING_STEPS.CONFIRMATION:
        return true;
      default:
        return false;
    }
  }, [step, selectedCategory, selectedService, selectedBranch, selectedDate, selectedTime]);

  const getCurrentStepData = useCallback(() => {
    switch (step) {
      case BOOKING_STEPS.CATEGORY_SELECTION:
        return { title: 'Select Category', data: selectedCategory };
      case BOOKING_STEPS.BRANCH_SELECTION:
        return { title: 'Select Branch', data: selectedBranch };
      case BOOKING_STEPS.SERVICE_SELECTION:
        return { title: 'Select Service', data: selectedService };
      case BOOKING_STEPS.DATE_SELECTION:
        return { title: 'Select Date', data: selectedDate };
      case BOOKING_STEPS.TIME_SELECTION:
        return { title: 'Select Time', data: selectedTime };
      case BOOKING_STEPS.CONFIRMATION:
        return { title: 'Confirm Booking', data: null };
      case BOOKING_STEPS.SUCCESS:
        return { title: 'Booking Confirmed', data: null };
      default:
        return { title: 'Unknown Step', data: null };
    }
  }, [step, selectedCategory, selectedService, selectedBranch, selectedDate, selectedTime]);

  const getProgressPercentage = useCallback(() => {
    const totalSteps = Object.keys(BOOKING_STEPS).length - 1; 
    return Math.round((step / totalSteps) * 100);
  }, [step]);

  return {
    step,
    selectedCategory,
    selectedService,
    selectedBranch,
    selectedDate,
    selectedTime,
    bookings,
    availabilityResult,
    loadingState,
    
    handleCategorySelect,
    handleServiceSelect,
    handleBranchSelect,
    handleDateSelect,
    handleTimeSelect,
    confirmBooking,
    resetBooking,
    goBack,
    setStep,
    setAvailabilityResult,
    
    canProceed: canProceed(),
    currentStepData: getCurrentStepData(),
    progressPercentage: getProgressPercentage(),
  };
};
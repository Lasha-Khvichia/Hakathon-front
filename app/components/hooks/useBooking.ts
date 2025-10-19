/* eslint-disable @typescript-eslint/no-explicit-any */
// hooks/useBooking.ts
import { BookingTypes } from '@/app/BackAPI/BookingTypes';
import { CategoryTypes } from '@/app/BackAPI/CategoryTypes';
import { CompanyTypes } from '@/app/BackAPI/CompanyTypes';
import { BOOKING_STEPS } from '@/app/constants';
import { bookingService, categoryService, companyService } from '@/app/lib/Api/service';
import { useState, useEffect } from 'react';
 

interface Service {
  id: number;
  name: string;
  icon?: string;
}

interface Branch {
  id: number;
  name: string;
  address?: string;
  icon?: string;
}

export const useBooking = () => {
  const [step, setStep] = useState<number>(BOOKING_STEPS.CATEGORY_SELECTION);
  const [selectedCategory, setSelectedCategory] = useState<CategoryTypes | null>(null);
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [selectedBranch, setSelectedBranch] = useState<Branch | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | string | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [bookings, setBookings] = useState<BookingTypes[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch categories from backend
  const [categories, setCategories] = useState<CategoryTypes[]>([]);
  const [companies, setCompanies] = useState<CompanyTypes[]>([]);

  useEffect(() => {
    loadCategories();
    loadUserBookings();
  }, []);

  const loadCategories = async () => {
    try {
      const data = await categoryService.getAll();
      setCategories(data);
      if (!data || data.length === 0) {
        setError('Failed to load categories');
      } else {
        setError(null);
      }
    } catch (err) {
      console.error('Failed to load categories:', err);
      setError('Failed to load categories');
    }
  };

  const loadUserBookings = async () => {
    try {
      const data = await bookingService.getUserBookings();
      setBookings(data);
    } catch (err) {
      console.error('Failed to load bookings:', err);
    }
  };

  const loadCompanies = async (categoryId: number) => {
    try {
      setLoading(true);
      const data = await companyService.getByCategory(categoryId);
      setCompanies(data);
    } catch (err) {
      console.error('Failed to load companies:', err);
      setError('Failed to load branches');
    } finally {
      setLoading(false);
    }
  };

  const handleCategorySelect = (category: CategoryTypes) => {
    setSelectedCategory(category);
    if (category.id) {
      loadCompanies(category.id);
    }
    setStep(BOOKING_STEPS.SERVICE_SELECTION);
  };

  const handleServiceSelect = (service: Service) => {
    setSelectedService(service);
    setStep(BOOKING_STEPS.BRANCH_SELECTION);
  };

  const handleBranchSelect = (branch: Branch) => {
    setSelectedBranch(branch);
    setStep(BOOKING_STEPS.DATE_SELECTION);
  };

  const handleDateSelect = (date: Date | string) => {
    setSelectedDate(date);
    setStep(BOOKING_STEPS.TIME_SELECTION);
  };

  const handleTimeSelect = (time: string) => {
    setSelectedTime(time);
    setStep(BOOKING_STEPS.CONFIRMATION);
  };

  const confirmBooking = async () => {
    if (!selectedBranch || !selectedDate || !selectedTime || !selectedService) {
      setError('Please complete all booking details');
      return;
    }

    try {
      setLoading(true);
      setError(null);

      // Find the company ID from selected branch
      const company = companies.find(c => c.name === selectedBranch.name);
      if (!company) {
        throw new Error('Company not found');
      }

      // Convert date and time to a proper Date object
      let bookedDateTime: Date;
      if (selectedDate instanceof Date) {
        bookedDateTime = selectedDate;
      } else {
        bookedDateTime = new Date(selectedDate);
      }

      // Parse time and set it
      const [time, period] = selectedTime.split(' ');
      const [hours, minutes] = time.split(':').map(Number);
      let adjustedHours = hours;
      
      if (period === 'PM' && hours !== 12) {
        adjustedHours += 12;
      } else if (period === 'AM' && hours === 12) {
        adjustedHours = 0;
      }

      bookedDateTime.setHours(adjustedHours, minutes, 0, 0);

      const bookingData = {
        companyId: company.id,
        booked: bookedDateTime.toISOString(),
        serviceName: selectedService.name,
      };

      const newBooking = await bookingService.create(bookingData);
      setBookings(prev => [...prev, newBooking]);
      setStep(BOOKING_STEPS.SUCCESS);
    } catch (err: any) {
      console.error('Booking failed:', err);
      setError(err.message || 'Failed to create booking');
    } finally {
      setLoading(false);
    }
  };

  const resetBooking = () => {
    setStep(BOOKING_STEPS.CATEGORY_SELECTION);
    setSelectedCategory(null);
    setSelectedService(null);
    setSelectedBranch(null);
    setSelectedDate(null);
    setSelectedTime(null);
    setError(null);
  };

  const goBack = () => {
    if (step > BOOKING_STEPS.CATEGORY_SELECTION) {
      setStep(step - 1);
      setError(null);
    }
  };

  const deleteBooking = async (bookingId: number) => {
    try {
      await bookingService.delete(bookingId);
      setBookings(prev => prev.filter(b => b.id !== bookingId));
    } catch (err) {
      console.error('Failed to delete booking:', err);
      throw err;
    }
  };

  return {
    step,
    selectedCategory,
    selectedService,
    selectedBranch,
    selectedDate,
    selectedTime,
    bookings,
    categories,
    companies,
    loading,
    error,
    handleCategorySelect,
    handleServiceSelect,
    handleBranchSelect,
    handleDateSelect,
    handleTimeSelect,
    confirmBooking,
    resetBooking,
    goBack,
    deleteBooking,
  };
};
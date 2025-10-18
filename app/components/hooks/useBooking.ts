"use client"
import { useState } from "react";

type Category = {
  id?: string | number;
  name?: string;
  icon?: React.ReactNode;
  color?: 'blue' | 'green' | 'purple' | 'red' | 'indigo' | 'yellow';
  hasBranches?: boolean;
  hasServices?: boolean;
};

type Service = {
  id?: string | number;
  name?: string;
};

type Branch = {
  id?: string | number;
  name?: string;
};

type Booking = {
  id: number;
  category: Category | null;
  service: Service | null;
  branch: Branch | null;
  date: string | Date | null;
  time: string | null;
  ticketNumber: number;
};

export const useBooking = () => {
  const [step, setStep] = useState<number>(1);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [selectedBranch, setSelectedBranch] = useState<Branch | null>(null);
  const [selectedDate, setSelectedDate] = useState<string | Date | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [bookings, setBookings] = useState<Booking[]>([]);

  const handleCategorySelect = (category: Category) => {
    setSelectedCategory(category);
    setStep(2);
  };

  const handleServiceSelect = (service: Service) => {
    setSelectedService(service);
    if (selectedCategory?.hasBranches) {
      setStep(3);
    } else {
      setStep(4);
    }
  };

  const handleBranchSelect = (branch: Branch) => {
    setSelectedBranch(branch);
    setStep(4);
  };

  const handleDateSelect = (date: string | Date) => {
    setSelectedDate(date);
    setStep(5);
  };

  const handleTimeSelect = (time: string) => {
    setSelectedTime(time);
    setStep(6);
  };

  const confirmBooking = (): Booking => {
    const newBooking: Booking = {
      id: Date.now(),
      category: selectedCategory,
      service: selectedService,
      branch: selectedBranch,
      date: selectedDate,
      time: selectedTime,
      ticketNumber: Math.floor(Math.random() * 900) + 100
    };
    setBookings([...bookings, newBooking]);
    setStep(7);
    return newBooking;
  };

  const resetBooking = () => {
    setStep(1);
    setSelectedCategory(null);
    setSelectedService(null);
    setSelectedBranch(null);
    setSelectedDate(null);
    setSelectedTime(null);
  };

  const goBack = () => {
    if (step === 2) {
      setStep(1);
      setSelectedService(null);
    } else if (step === 3) {
      setStep(2);
      setSelectedBranch(null);
    } else if (step === 4) {
      if (selectedCategory?.hasBranches) {
        setStep(3);
      } else {
        setStep(2);
      }
      setSelectedDate(null);
    } else if (step === 5) {
      setStep(4);
      setSelectedTime(null);
    } else if (step === 6) {
      setStep(5);
    } else {
      setStep(step - 1);
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
    handleCategorySelect,
    handleServiceSelect,
    handleBranchSelect,
    handleDateSelect,
    handleTimeSelect,
    confirmBooking,
    resetBooking,
    goBack
  };
};
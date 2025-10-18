
"use client";
import React, { useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import styles from './AppComponents.module.scss';
import type { DateInfo, Category, BookingData } from '../../types';
import { BOOKING_STEPS } from '../../constants';
import { Header } from '../Layout/Header/Header';
import { BranchSelection } from '../Booking/BranchSelection/BranchSelection';
import { DateSelection } from '../Booking/DateSelection/DateSelection';
import { ServiceSelection } from '../Booking/ServiceSelection/ServiceSelection';
import { TimeSelection } from '../Booking/TimeSelection/TimeSelection';
import { BookingConfirmation } from '../Booking/BookingConfirmation/BookingConfirmation';
import { BookingSuccess } from '../Booking/BookingSuccess/BookingSuccess';
import { TicketModal } from '../Ticket/TicketModal/TicketModal';
import { AIChatButton } from '../AI/AIChatButton';
import { AIChatModal } from '../AI/AIChatModal/AIChatModal';
import { Container } from '../Layout/Container/Container';
import { ProgressSteps } from '../ProgressSteps/ProgressSteps';
import { CategorySelection } from '../Layout/CategorySelection/CategorySelection';
import { MyBookings } from '../Ticket/MyBookings/MyBookings';
import { bankBranches, clinicBranches, GovernmentBranches, PostOfficeBranches, TelecomBranches, CarServiceBranches } from '../data/branches';
import { serviceOptions } from '../data/services';
import { categories } from '../data/categories';
import { timeSlots } from '../data/timeSlots';
import { useBooking } from '../../hooks/useBooking';

const App: React.FC = () => {
  const {
    step,
    selectedCategory,
    selectedService,
    selectedBranch,
    selectedDate,
    selectedTime,
    bookings,
    loadingState,
    handleCategorySelect,
    handleServiceSelect,
    handleBranchSelect,
    handleDateSelect,
    handleTimeSelect,
    confirmBooking,
    resetBooking,
    goBack
  } = useBooking();

  const [showTicketModal, setShowTicketModal] = useState<boolean>(false);
  const [selectedTicket, setSelectedTicket] = useState<BookingData | null>(null);
  const [showAIChat, setShowAIChat] = useState<boolean>(false);

  const handleShowTicket = (booking: BookingData): void => {
    setSelectedTicket(booking);
    setShowTicketModal(true);
  };

  const handleCloseTicketModal = (): void => {
    setShowTicketModal(false);
    setSelectedTicket(null);
  };

  const getProgressSteps = (): string[] => {
    const steps: string[] = ['Category', 'Branch', 'Service', 'Date', 'Time', 'Confirm'];
    return steps;
  };

  const getBranchesForCategory = () => {
    if (!selectedCategory) return [];
    
    switch (selectedCategory.id) {
      case 1: // Bank
        return bankBranches;
      case 2: // Health Clinic
        return clinicBranches;
      case 3: // Government Office
        return GovernmentBranches;
      case 4: // Post Office
        return PostOfficeBranches;
      case 5: // Telecom Center
        return TelecomBranches;
      case 6: // Car Service
        return CarServiceBranches;
      default:
        // For categories without specific branches, show a general location option
        return [{ id: 1, name: 'General Location', address: 'Main Office', icon: '🏢' }];
    }
  };

  return (
    <Container>
      <Header/>
      {step < 7 && (
        <ProgressSteps 
          steps={getProgressSteps()} 
          currentStep={step} 
        />
      )}

      <div className={styles.mainContent}>
        {step > BOOKING_STEPS.CATEGORY_SELECTION && step < BOOKING_STEPS.SUCCESS && (
          <button
            onClick={goBack}
            className={styles.backButton}
            disabled={loadingState.isLoading}
          >
            <ArrowLeft className={styles.backIcon} />
            Back
          </button>
        )}

        {step === 1 && (
          <CategorySelection 
            categories={categories as Category[]}
            onSelect={handleCategorySelect}
          />
        )}

        {step === 2 && (
          <BranchSelection 
            branches={getBranchesForCategory()}
            onSelect={handleBranchSelect}
          />
        )}

        {step === 3 && selectedCategory && (
          <ServiceSelection 
            category={selectedCategory}
            services={serviceOptions[selectedCategory.id! as keyof typeof serviceOptions] || []}
            onSelect={handleServiceSelect}
          />
        )}

        {step === 4 && (
          <DateSelection 
            onSelect={(day: DateInfo) => handleDateSelect(`${day.day} ${day.num}, ${day.month}`)}
          />
        )}

        {step === 5 && (
          <TimeSelection 
            timeSlots={timeSlots}
            onSelect={handleTimeSelect}
          />
        )}

        {step === 6 && selectedCategory && selectedService && selectedDate && selectedTime && (
          <BookingConfirmation 
            selectedCategory={{
              name: selectedCategory.name ?? '',
              icon: selectedCategory.icon,
            }}
            selectedService={{
              name: selectedService.name ?? '',
            }}
            selectedBranch={selectedBranch ? {
              name: selectedBranch.name ?? '',
            } : undefined}
            selectedDate={{
              full: typeof selectedDate === 'string' ? selectedDate : selectedDate.toLocaleDateString(),
            }}
            selectedTime={selectedTime}
            onConfirm={confirmBooking}
          />
        )}

        {step === 7 && bookings.length > 0 && (
          <BookingSuccess 
            booking={{
              ticketNumber: bookings[bookings.length - 1].ticketNumber,
              category: {
                name: bookings[bookings.length - 1].category?.name ?? '',
              },
              service: {
                name: bookings[bookings.length - 1].service?.name ?? '',
              },
              branch: bookings[bookings.length - 1].branch ? {
                name: bookings[bookings.length - 1].branch?.name ?? '',
              } : null,
              date: {
                full: typeof bookings[bookings.length - 1].date === 'string' 
                  ? bookings[bookings.length - 1].date as string
                  : (bookings[bookings.length - 1].date as Date)?.toLocaleDateString() ?? '',
              },
              time: bookings[bookings.length - 1].time ?? '',
            }}
            onBookAnother={resetBooking}
          />
        )}
      </div>

      {step === 1 && (
        <MyBookings 
          bookings={bookings}
          onShowTicket={handleShowTicket}
        />
      )}

      <TicketModal 
        isOpen={showTicketModal}
        onClose={handleCloseTicketModal}
        ticket={
          selectedTicket
            ? {
                ticketNumber: selectedTicket.id || 'N/A',
                category: {
                  icon: selectedTicket.category?.icon,
                  name: selectedTicket.category?.name || 'Unknown',
                },
                service: {
                  icon: selectedTicket.service?.icon,
                  name: selectedTicket.service?.name || 'Unknown',
                },
                branch: selectedTicket.branch ? { name: selectedTicket.branch.name } : null,
                date: {
                  full: selectedTicket.date?.toString() || 'Unknown',
                },
                time: selectedTicket.time || 'Unknown',
              }
            : null
        }
      />

      <AIChatButton onClick={() => setShowAIChat(true)} />

      <AIChatModal 
        isOpen={showAIChat}
        onClose={() => setShowAIChat(false)}
      />
    </Container>
  );
};

export default App;
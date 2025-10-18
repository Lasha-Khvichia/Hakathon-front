
"use client";
import React, { useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import styles from './AppComponents.module.scss';

import type { Day } from '../../types';
import { BOOKING_STEPS } from '../../constants';
import { Header } from '../Layout/Header/Header';
import { BranchSelection } from '../Booking/BranchSelection/BranchSelection';
import { 
  bankBranches, 
  clinicBranches, 
  governmentBranches, 
  postOfficeBranches, 
  telecomBranches, 
  carServiceBranches 
} from '../data/branches';
import { DateSelection } from '../Booking/DateSelection/DateSelection';
import { ServiceSelection } from '../Booking/ServiceSelection/ServiceSelection';
import { serviceOptions } from '../data/services';
import { useBooking } from '../hooks/useBooking';
import { MyBookings } from '../Ticket/MyBookings/MyBookings';
import { BookingData } from '../../types';
import { Container } from '../Layout/Container/Container';
import { ProgressSteps } from '../ProgressSteps/ProgressSteps';
import { CategorySelection } from '../Layout/CategorySelection/CategorySelection';
import { categories } from '../data/categories';
import { timeSlots } from '../data/timeSlots';
import { TimeSelection } from '../Booking/TimeSelection/TimeSelection';
import { BookingConfirmation } from '../Booking/BookingConfirmation/BookingConfirmation';
import { BookingSuccess } from '../Booking/BookingSuccess/BookingSuccess';
import { TicketModal } from '../Ticket/TicketModal/TicketModal';
import { AIChatButton } from '../AI/AIChatButton';
import { AIChatModal } from '../AI/AIChatModal/AIChatModal';

const App: React.FC = () => {
  // Booking Hook
  const {
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
    goBack,
  } = useBooking();

  // Ticket Modal State
  const [showTicketModal, setShowTicketModal] = useState<boolean>(false);
  const [selectedTicket, setSelectedTicket] = useState<BookingData | null>(null);

  // AI Chat State
  const [showAIChat, setShowAIChat] = useState<boolean>(false);

  // Ticket Modal Functions
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
        return governmentBranches;
      case 4: // Post Office
        return postOfficeBranches;
      case 5: // Telecom Center
        return telecomBranches;
      case 6: // Car Service
        return carServiceBranches;
      default:
        // For categories without specific branches, show a general location option
        return [{ id: 1, name: 'General Location', address: 'Main Office', icon: '🏢' }];
    }
  };

  const getCategoryDisplayName = () => {
    if (!selectedCategory) return 'ფილიალი - Branch';
    
    switch (selectedCategory.id) {
      case 1: // Bank
        return 'ბანკის - Bank';
      case 2: // Health Clinic
        return 'კლინიკის - Clinic';
      case 3: // Government Office
        return 'სამთავრობო ოფისის - Government Office';
      case 4: // Post Office
        return 'ფოსტის - Post Office';
      case 5: // Telecom Center
        return 'ტელეკომუნიკაციის ცენტრის - Telecom Center';
      case 6: // Car Service
        return 'ავტო სერვისის - Car Service';
      default:
        return 'ფილიალი - Branch';
    }
  };

  return (
    <Container>
      <Header/>

      {/* Progress Steps */}
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
          >
            <ArrowLeft className={styles.backIcon} />
            Back
          </button>
        )}

        {step === 1 && (
          <CategorySelection 
            categories={categories as any}
            onSelect={handleCategorySelect}
          />
        )}

        {/* Step 2: Service Selection */}
        {step === 2 && selectedCategory && (
          <ServiceSelection 
            category={selectedCategory}
            services={serviceOptions[selectedCategory.id! as keyof typeof serviceOptions] || []}
            onSelect={handleServiceSelect}
          />
        )}

        {/* Step 3: Branch Selection */}
        {step === 3 && (
          <BranchSelection 
            branches={bankBranches}
            onSelect={handleBranchSelect}
          />
        )}
        {/* Step 4: Date Selection */}
        {step === 4 && (
          <DateSelection 
            onSelect={(day: Day) => handleDateSelect(`${day.day} ${day.num}, ${day.month}`)}
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

        {/* Step 7: Booking Success */}
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
          bookings={bookings as BookingData[]}
          onShowTicket={handleShowTicket}
        />
      )}

      {/* Ticket Modal */}
      <TicketModal 
        isOpen={showTicketModal}
        onClose={handleCloseTicketModal}
        ticket={
          selectedTicket && selectedTicket.category && selectedTicket.service
            ? {
                ticketNumber: selectedTicket.ticketNumber,
                category: {
                  icon: selectedTicket.category.icon,
                  name: selectedTicket.category.name,
                },
                service: {
                  name: selectedTicket.service.name,
                },
                branch: selectedTicket.branch ? {
                  name: selectedTicket.branch.name,
                } : null,
                date: {
                  full: typeof selectedTicket.date === 'string' ? selectedTicket.date : selectedTicket.date?.toLocaleDateString() ?? '',
                },
                time: selectedTicket.time ?? '',
              }
            : null
        }
      />

      <AIChatButton onClick={() => setShowAIChat(true)} />

      {/* AI Chat Modal */}
      <AIChatModal 
        isOpen={showAIChat}
        onClose={() => setShowAIChat(false)}
      />
    </Container>
  );
};

export default App;
"use client";
import React, { useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import styles from './AppComponents.module.scss';

/* eslint-disable @typescript-eslint/no-explicit-any */
import type { Day } from '../../types';
import { BOOKING_STEPS } from '../../constants';
import { Header } from '../Layout/Header/Header';
import { BranchSelection } from '../Booking/BranchSelection/BranchSelection';
import { DateSelection } from '../Booking/DateSelection/DateSelection';
import { ServiceSelection } from '../Booking/ServiceSelection/ServiceSelection';
import { serviceOptions } from '../data/services';
import { useBooking } from '../hooks/useBooking';
import { MyBookings } from '../Ticket/MyBookings/MyBookings';
import { BookingData } from '../../types';
import { Container } from '../Layout/Container/Container';
import { ProgressSteps } from '../ProgressSteps/ProgressSteps';
import { CategorySelection } from '../Layout/CategorySelection/CategorySelection';
import { timeSlots } from '../data/timeSlots';
import { TimeSelection } from '../Booking/TimeSelection/TimeSelection';
import { BookingConfirmation } from '../Booking/BookingConfirmation/BookingConfirmation';
import { BookingSuccess } from '../Booking/BookingSuccess/BookingSuccess';
import { TicketModal } from '../Ticket/TicketModal/TicketModal';
import { AIChatButton } from '../AI/AIChatButton';
import { AIChatModal } from '../AI/AIChatModal/AIChatModal';
import { useAuthContext } from '../../context/AuthContext';
import { Register } from '../Auth/register/Register';
import { Login } from '../Auth/login/Logint';
import { EnvironmentStatus } from '../dev/EnvironmentStatus';


const App: React.FC = () => {
  const { isAuthenticated, loading: authLoading } = useAuthContext();
  const [showAuthModal, setShowAuthModal] = useState<'login' | 'register' | null>(null);

  // Booking Hook
  const {
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
  } = useBooking();

  // work around literal union typing from the hook by using a plain number for comparisons
  const stepNumber: number = Number(step as unknown as number);

  // Ticket Modal State
  const [showTicketModal, setShowTicketModal] = useState<boolean>(false);
  const [selectedTicket, setSelectedTicket] = useState<BookingData | null>(null);

  // Show auth if not authenticated
  if (authLoading) {
    return (
      <Container>
        <div className={styles.loading}>Loading...</div>
      </Container>
    );
  }

  if (!isAuthenticated) {
    if (!showAuthModal) {
      setShowAuthModal('login');
    }

    return (
      <>
        {showAuthModal === 'login' && (
          <Login onSwitchToRegister={() => setShowAuthModal('register')} />
        )}
        {showAuthModal === 'register' && (
          <Register onSwitchToLogin={() => setShowAuthModal('login')} />
        )}
      </>
    );
  }

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
    // Convert companies to branch format
    return companies.map(company => ({
      id: company.id,
      name: company.name,
      address: company.url || 'Address not available',
      icon: '🏢',
    }));
  };

  return (
    <Container>
      <Header />

      {/* Progress Steps */}
      {stepNumber < 7 && (
        <ProgressSteps
          steps={getProgressSteps()}
          currentStep={stepNumber}
        />
      )}

      <div className={styles.mainContent}>
        {stepNumber > BOOKING_STEPS.CATEGORY_SELECTION && stepNumber < BOOKING_STEPS.SUCCESS && (
          <button
            onClick={goBack}
            className={styles.backButton}
          >
            <ArrowLeft className={styles.backIcon} />
            Back
          </button>
        )}

        {loading && <div className={styles.loading}>Loading...</div>}
        {error && <div className={styles.error}>{error}</div>}

        {stepNumber === BOOKING_STEPS.CATEGORY_SELECTION && (
          <CategorySelection
            categories={categories}
            onSelect={handleCategorySelect}
          />
        )}

        {/* Step 2: Service Selection */}
        {stepNumber === BOOKING_STEPS.SERVICE_SELECTION && selectedCategory && (
          (() => {
            const categoryId = selectedCategory.id;
            const mappedServices = serviceOptions[categoryId as keyof typeof serviceOptions] || [];
            console.log('DEBUG - Category ID:', categoryId);
            console.log('DEBUG - Available serviceOptions keys:', Object.keys(serviceOptions));
            console.log('DEBUG - Mapped services:', mappedServices);
            console.log('DEBUG - All serviceOptions:', serviceOptions);
            
            return (
              <ServiceSelection
                // ServiceSelection expects a small category object (icon/color). Create a lightweight map.
                category={{ icon: String(selectedCategory.name).charAt(0), color: 'blue' } as any}
                services={mappedServices as any}
                onSelect={handleServiceSelect as any}
              />
            );
          })()
        )}

        {/* Step 3: Branch Selection */}
        {stepNumber === BOOKING_STEPS.BRANCH_SELECTION && (
          <BranchSelection
            categoryId={selectedCategory?.id}
            onSelect={handleBranchSelect as any}
            categoryName={selectedCategory?.name}
          />
        )}

        {/* Step 4: Date Selection */}
        {stepNumber === BOOKING_STEPS.DATE_SELECTION && (
          <DateSelection
            onSelect={(day: any) => handleDateSelect(day.full ?? `${day.day} ${day.num}, ${day.month}`)}
          />
        )}

        {stepNumber === BOOKING_STEPS.TIME_SELECTION && (
          <TimeSelection
            timeSlots={timeSlots}
            onSelect={handleTimeSelect}
          />
        )}

        {stepNumber === BOOKING_STEPS.CONFIRMATION && selectedCategory && selectedService && selectedDate && selectedTime && (
          <BookingConfirmation
            selectedCategory={{
              name: selectedCategory.name ?? '',
              // backend CategoryTypes doesn't include 'icon' — provide undefined fallback
              icon: (selectedCategory as any).icon ?? undefined,
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
        {stepNumber === BOOKING_STEPS.SUCCESS && bookings.length > 0 && (
          <BookingSuccess
            booking={{
              ticketNumber: bookings[bookings.length - 1].id?.toString() || 'N/A',
              category: {
                name: selectedCategory?.name || '',
              },
              service: {
                name: selectedService?.name || '',
              },
              branch: selectedBranch ? {
                name: selectedBranch.name,
              } : null,
              date: {
                full: typeof selectedDate === 'string'
                  ? selectedDate
                  : selectedDate?.toLocaleDateString() ?? '',
              },
              time: selectedTime ?? '',
            }}
            onBookAnother={resetBooking}
          />
        )}
      </div>

      {stepNumber === BOOKING_STEPS.CATEGORY_SELECTION && (
        <MyBookings
          bookings={bookings as any as BookingData[]}
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
              ticketNumber: selectedTicket.id?.toString() || 'N/A',
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

      <AIChatButton onClick={() => { }} />

      {/* AI Chat Modal */}
      <AIChatModal
        isOpen={false}
        onClose={() => { }}
      />

      {/* Development Environment Status */}
      <EnvironmentStatus />
    </Container>
  );
};

export default App;
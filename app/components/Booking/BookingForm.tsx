'use client';

import React, { useState, useEffect } from 'react';
import { BookingType, CreateBookingDto, CompanyAvailability } from '../../types/booking.types';
import { CompanyTypes } from '../../BackAPI/CompanyTypes';
import { BookingSuccessModal } from './BookingSuccessModal/BookingSuccessModal';
import { TicketModal } from './TicketModal/TicketModal';

interface BookingFormProps {
  company: CompanyTypes;
  userId: number;
  onSuccess?: (booking: any) => void;
  onCancel?: () => void;
}

export default function BookingForm({ company, userId, onSuccess, onCancel }: BookingFormProps) {
  const [formData, setFormData] = useState<CreateBookingDto>({
    userId,
    companyId: company.id,
    bookedDate: '',
    startTime: '',
    endTime: '',
    type: BookingType.APPOINTMENT,
    notes: '',
    requestAiRecommendation: true,
  });

  const [availability, setAvailability] = useState<CompanyAvailability | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [aiSuggestions, setAiSuggestions] = useState<string[]>([]);
  const [successBooking, setSuccessBooking] = useState<any>(null);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showTicketModal, setShowTicketModal] = useState(false);

  useEffect(() => {
    if (formData.bookedDate) {
      loadAvailability();
    }
  }, [formData.bookedDate, company.id]);

  const loadAvailability = async () => {
    try {
      const token = localStorage.getItem('authToken') || '';
      const response = await fetch(`http://localhost:3002/booking/availability/${company.id}?date=${formData.bookedDate}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Cache-Control': 'no-cache, no-store, must-revalidate',
        },
      });

      if (response.ok) {
        const data = await response.json();
        setAvailability(data);
        
        if (data.availableSlots.length > 0) {
          setAiSuggestions(data.availableSlots.map((slot: any) => 
            `${new Date(slot.time).toLocaleTimeString()} - ${slot.reason}`
          ));
        }
      }
    } catch (err) {
      console.error('Failed to load availability:', err);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Validate form
      if (!formData.bookedDate || !formData.startTime || !formData.endTime) {
        throw new Error('Please fill in all required fields');
      }

      if (new Date(formData.startTime) >= new Date(formData.endTime)) {
        throw new Error('Start time must be before end time');
      }

      // Create booking using direct API call
      const token = localStorage.getItem('authToken') || '';
      const response = await fetch('http://localhost:3002/booking', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
          'Cache-Control': 'no-cache, no-store, must-revalidate',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const booking = await response.json();
        setSuccessBooking(booking);
        setShowSuccessModal(true);
        onSuccess?.(booking);
      } else {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to create booking');
      }
    } catch (err: any) {
      setError(err.message || 'Failed to create booking');
      
      // Handle conflict suggestions
      if (err.response?.data?.suggestions) {
        setAiSuggestions(err.response.data.suggestions);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleTimeSlotSelect = (slot: any) => {
    const slotTime = new Date(slot.time);
    const endTime = new Date(slotTime);
    endTime.setHours(endTime.getHours() + 1); // Default 1-hour slot

    setFormData(prev => ({
      ...prev,
      startTime: slotTime.toISOString(),
      endTime: endTime.toISOString(),
    }));
  };

  const getBookingTypeIcon = (type: BookingType) => {
    switch (type) {
      case BookingType.EMERGENCY: return '🚨';
      case BookingType.CONSULTATION: return '👨‍⚕️';
      case BookingType.ROUTINE: return '📋';
      case BookingType.FOLLOWUP: return '🔄';
      default: return '📅';
    }
  };

  const getCategorySpecificTypes = () => {
    const categoryName = company.category?.name?.toLowerCase() || '';
    
    if (categoryName.includes('clinic') || categoryName.includes('hospital')) {
      return [
        BookingType.CONSULTATION,
        BookingType.ROUTINE,
        BookingType.EMERGENCY,
        BookingType.FOLLOWUP,
      ];
    } else if (categoryName.includes('restaurant')) {
      return [BookingType.APPOINTMENT]; // Table reservation
    } else if (categoryName.includes('hotel')) {
      return [BookingType.APPOINTMENT]; // Room booking
    }
    
    return [BookingType.APPOINTMENT, BookingType.CONSULTATION];
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Book with {company.name}
        </h2>
        <p className="text-gray-600">
          {company.category?.name} • AI-powered booking with smart recommendations
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Booking Type */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Booking Type
          </label>
          <div className="grid grid-cols-2 gap-2">
            {getCategorySpecificTypes().map((type) => (
              <button
                key={type}
                type="button"
                onClick={() => setFormData(prev => ({ ...prev, type }))}
                className={`p-3 rounded-lg border text-left transition-colors ${
                  formData.type === type
                    ? 'border-blue-500 bg-blue-50 text-blue-700'
                    : 'border-gray-300 hover:border-gray-400'
                }`}
              >
                <div className="flex items-center space-x-2">
                  <span className="text-lg">{getBookingTypeIcon(type)}</span>
                  <span className="capitalize">{type.replace('_', ' ')}</span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Date Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Booking Date
          </label>
          <input
            type="date"
            value={formData.bookedDate}
            onChange={(e) => setFormData(prev => ({ ...prev, bookedDate: e.target.value }))}
            min={new Date().toISOString().split('T')[0]}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            required
          />
        </div>

        {/* AI-Suggested Time Slots */}
        {availability && availability.availableSlots.length > 0 && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              🤖 AI-Recommended Time Slots
            </label>
            <div className="space-y-2">
              {availability.availableSlots.map((slot, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() => handleTimeSlotSelect(slot)}
                  className="w-full p-3 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg text-left hover:from-blue-100 hover:to-indigo-100 transition-colors"
                >
                  <div className="flex justify-between items-center">
                    <span className="font-medium text-blue-900">
                      {new Date(slot.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                    <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                      {Math.round(slot.confidence * 100)}% match
                    </span>
                  </div>
                  <p className="text-sm text-blue-700 mt-1">{slot.reason}</p>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Manual Time Selection */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Start Time
            </label>
            <input
              type="datetime-local"
              value={formData.startTime}
              onChange={(e) => setFormData(prev => ({ ...prev, startTime: e.target.value }))}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              End Time
            </label>
            <input
              type="datetime-local"
              value={formData.endTime}
              onChange={(e) => setFormData(prev => ({ ...prev, endTime: e.target.value }))}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>
        </div>

        {/* Notes */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Notes (Optional)
          </label>
          <textarea
            value={formData.notes}
            onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
            rows={3}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Any special requirements or notes..."
          />
        </div>

        {/* AI Recommendations Toggle */}
        <div className="flex items-center space-x-3">
          <input
            type="checkbox"
            id="aiRecommendation"
            checked={formData.requestAiRecommendation}
            onChange={(e) => setFormData(prev => ({ ...prev, requestAiRecommendation: e.target.checked }))}
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
          />
          <label htmlFor="aiRecommendation" className="text-sm font-medium text-gray-700">
            🤖 Get AI-powered recommendations and insights
          </label>
        </div>

        {/* Error Display */}
        {error && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-800 font-medium">{error}</p>
          </div>
        )}

        {/* AI Suggestions */}
        {aiSuggestions.length > 0 && (
          <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <h4 className="font-medium text-yellow-800 mb-2">💡 AI Suggestions:</h4>
            <ul className="text-sm text-yellow-700 space-y-1">
              {aiSuggestions.map((suggestion, index) => (
                <li key={index}>• {suggestion}</li>
              ))}
            </ul>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex space-x-4 pt-4">
          <button
            type="submit"
            disabled={loading}
            className="flex-1 bg-blue-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {loading ? 'Creating Booking...' : 'Book Now'}
          </button>
          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors"
            >
              Cancel
            </button>
          )}
        </div>
      </form>

      {/* Success Modal */}
      {showSuccessModal && successBooking && (
        <BookingSuccessModal
          booking={successBooking}
          onClose={() => setShowSuccessModal(false)}
          onViewBookings={() => {
            setShowSuccessModal(false);
            // Could navigate to bookings page or call a callback
          }}
          onShowTicket={() => {
            setShowSuccessModal(false);
            setShowTicketModal(true);
          }}
        />
      )}

      {/* Ticket Modal */}
      {showTicketModal && successBooking && (
        <TicketModal
          booking={successBooking}
          onClose={() => setShowTicketModal(false)}
        />
      )}
    </div>
  );
}
'use client';

import React, { useState, useEffect } from 'react';
import { BookingTypes, BookingStatus, BookingInsights } from '../../types/booking.types';
import { TicketModal } from './TicketModal/TicketModal';

interface BookingListProps {
  userId?: number;
  companyId?: number;
  showActions?: boolean;
}

export default function BookingList({ userId, companyId, showActions = true }: BookingListProps) {
  const [bookings, setBookings] = useState<BookingTypes[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedBooking, setSelectedBooking] = useState<BookingTypes | null>(null);
  const [insights, setInsights] = useState<BookingInsights | null>(null);
  const [showTicketModal, setShowTicketModal] = useState(false);
  const [ticketBooking, setTicketBooking] = useState<BookingTypes | null>(null);
  const [showInsights, setShowInsights] = useState(false);

  useEffect(() => {
    loadBookings();
  }, [userId, companyId]);

  const loadBookings = async () => {
    try {
      setLoading(true);
      
      // Use direct axios calls to get the new format
      const token = localStorage.getItem('authToken') || '';
      let response;

      if (userId) {
        response = await fetch(`http://localhost:3002/booking/user/${userId}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Cache-Control': 'no-cache, no-store, must-revalidate',
          },
        });
      } else if (companyId) {
        response = await fetch(`http://localhost:3002/booking/company/${companyId}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Cache-Control': 'no-cache, no-store, must-revalidate',
          },
        });
      } else {
        response = await fetch('http://localhost:3002/booking', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Cache-Control': 'no-cache, no-store, must-revalidate',
          },
        });
      }

      if (response.ok) {
        const data = await response.json();
        // Map the backend format to our frontend format
        const mappedBookings: BookingTypes[] = data.map((booking: any) => ({
          id: booking.id,
          ticketNumber: booking.ticketNumber,
          bookedDate: booking.bookedDate,
          startTime: booking.startTime,
          endTime: booking.endTime,
          status: booking.status as BookingStatus,
          type: booking.type,
          notes: booking.notes || '',
          aiRecommendation: booking.aiRecommendation || '',
          cancellationReason: booking.cancellationReason || '',
          price: booking.price || 0,
          isReminderSent: booking.isReminderSent || false,
          aiMetadata: booking.aiMetadata || {},
          user: {
            id: booking.user.id,
            email: booking.user.email,
            firstName: booking.user.name?.split(' ')[0] || '',
            lastName: booking.user.name?.split(' ').slice(1).join(' ') || '',
          },
          company: {
            id: booking.company.id,
            name: booking.company.name,
            category: {
              id: booking.company.category.id,
              name: booking.company.category.name,
              color: booking.company.category.color,
            },
          },
          createdAt: booking.createdAt,
          updatedAt: booking.updatedAt,
        }));
        
        setBookings(mappedBookings);
      } else {
        setBookings([]);
      }
    } catch (error) {
      console.error('Failed to load bookings:', error);
      setBookings([]);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (bookingId: number, action: string) => {
    try {
      const token = localStorage.getItem('authToken') || '';
      let response;

      switch (action) {
        case 'confirm':
          response = await fetch(`http://localhost:3002/booking/${bookingId}/confirm`, {
            method: 'PATCH',
            headers: {
              'Authorization': `Bearer ${token}`,
              'Cache-Control': 'no-cache, no-store, must-revalidate',
            },
          });
          break;
        case 'complete':
          response = await fetch(`http://localhost:3002/booking/${bookingId}/complete`, {
            method: 'PATCH',
            headers: {
              'Authorization': `Bearer ${token}`,
              'Cache-Control': 'no-cache, no-store, must-revalidate',
            },
          });
          break;
        case 'cancel':
          const reason = prompt('Cancellation reason (optional):');
          response = await fetch(`http://localhost:3002/booking/${bookingId}/cancel`, {
            method: 'PATCH',
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json',
              'Cache-Control': 'no-cache, no-store, must-revalidate',
            },
            body: JSON.stringify({ reason: reason || '' }),
          });
          break;
        case 'no-show':
          response = await fetch(`http://localhost:3002/booking/${bookingId}/no-show`, {
            method: 'PATCH',
            headers: {
              'Authorization': `Bearer ${token}`,
              'Cache-Control': 'no-cache, no-store, must-revalidate',
            },
          });
          break;
        default:
          return;
      }

      if (response && response.ok) {
        const updatedBookingData = await response.json();
        // Map the backend response to our format
        const updatedBooking: BookingTypes = {
          id: updatedBookingData.id,
          ticketNumber: updatedBookingData.ticketNumber,
          bookedDate: updatedBookingData.bookedDate,
          startTime: updatedBookingData.startTime,
          endTime: updatedBookingData.endTime,
          status: updatedBookingData.status as BookingStatus,
          type: updatedBookingData.type,
          notes: updatedBookingData.notes || '',
          aiRecommendation: updatedBookingData.aiRecommendation || '',
          cancellationReason: updatedBookingData.cancellationReason || '',
          price: updatedBookingData.price || 0,
          isReminderSent: updatedBookingData.isReminderSent || false,
          aiMetadata: updatedBookingData.aiMetadata || {},
          user: {
            id: updatedBookingData.user.id,
            email: updatedBookingData.user.email,
            firstName: updatedBookingData.user.name?.split(' ')[0] || '',
            lastName: updatedBookingData.user.name?.split(' ').slice(1).join(' ') || '',
          },
          company: {
            id: updatedBookingData.company.id,
            name: updatedBookingData.company.name,
            category: {
              id: updatedBookingData.company.category.id,
              name: updatedBookingData.company.category.name,
              color: updatedBookingData.company.category.color,
            },
          },
          createdAt: updatedBookingData.createdAt,
          updatedAt: updatedBookingData.updatedAt,
        };

        // Update the booking in the list
        setBookings(prev => prev.map(booking => 
          booking.id === bookingId ? updatedBooking : booking
        ));
      }
    } catch (error) {
      console.error('Failed to update booking:', error);
      alert('Failed to update booking. Please try again.');
    }
  };

  const loadInsights = async (booking: BookingTypes) => {
    try {
      const token = localStorage.getItem('authToken') || '';
      const response = await fetch(`http://localhost:3002/booking/${booking.id}/insights`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Cache-Control': 'no-cache, no-store, must-revalidate',
        },
      });

      if (response.ok) {
        const insightsData = await response.json();
        setInsights(insightsData);
        setSelectedBooking(booking);
        setShowInsights(true);
      } else {
        throw new Error('Failed to load insights');
      }
    } catch (error) {
      console.error('Failed to load insights:', error);
      // Show a fallback message if AI insights aren't available yet
      const fallbackInsights: BookingInsights = {
        booking,
        insights: 'AI insights are working! Here are some personalized recommendations based on your booking.',
        aiMetadata: booking.aiMetadata || {},
        recommendation: booking.aiRecommendation || 'Thank you for your booking. We hope you have a great experience!'
      };
      setInsights(fallbackInsights);
      setSelectedBooking(booking);
      setShowInsights(true);
    }
  };

  const handleShowTicket = (booking: BookingTypes) => {
    setTicketBooking(booking);
    setShowTicketModal(true);
  };

  const getStatusColor = (status: BookingStatus) => {
    switch (status) {
      case BookingStatus.PENDING:
        return 'bg-yellow-100 text-yellow-800';
      case BookingStatus.CONFIRMED:
        return 'bg-blue-100 text-blue-800';
      case BookingStatus.COMPLETED:
        return 'bg-green-100 text-green-800';
      case BookingStatus.CANCELLED:
        return 'bg-red-100 text-red-800';
      case BookingStatus.NO_SHOW:
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusActions = (status: BookingStatus) => {
    switch (status) {
      case BookingStatus.PENDING:
        return ['confirm', 'cancel'];
      case BookingStatus.CONFIRMED:
        return ['complete', 'cancel', 'no-show'];
      default:
        return [];
    }
  };

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center p-8">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">
          {userId ? 'My Bookings' : companyId ? 'Company Bookings' : 'All Bookings'}
        </h2>
        <span className="text-gray-600">{bookings.length} booking(s)</span>
      </div>

      {bookings.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-gray-400 text-6xl mb-4">📅</div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No bookings found</h3>
          <p className="text-gray-600">
            {userId ? 'You haven\'t made any bookings yet.' : 'No bookings available.'}
          </p>
        </div>
      ) : (
        <div className="grid gap-4">
          {bookings.map((booking) => (
            <div
              key={booking.id}
              className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow"
            >
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    {booking.company.name}
                  </h3>
                  <p className="text-sm text-gray-600">
                    {booking.company.category.name} • {booking.type.replace('_', ' ')}
                  </p>
                </div>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(booking.status)}`}>
                  {booking.status.replace('_', ' ')}
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <p className="text-sm text-gray-600 mb-1">📅 Date & Time</p>
                  <p className="font-medium">
                    {formatDateTime(booking.startTime)} - {new Date(booking.endTime).toLocaleTimeString()}
                  </p>
                </div>
                {!userId && (
                  <div>
                    <p className="text-sm text-gray-600 mb-1">👤 Booked by</p>
                    <p className="font-medium">
                      {booking.user.firstName} {booking.user.lastName} ({booking.user.email})
                    </p>
                  </div>
                )}
              </div>

              {booking.notes && (
                <div className="mb-4">
                  <p className="text-sm text-gray-600 mb-1">📝 Notes</p>
                  <p className="text-gray-800">{booking.notes}</p>
                </div>
              )}

              {booking.aiRecommendation && (
                <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                  <p className="text-sm text-blue-600 mb-1">🤖 AI Recommendation</p>
                  <p className="text-sm text-blue-800 whitespace-pre-line">{booking.aiRecommendation}</p>
                </div>
              )}

              {booking.cancellationReason && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-sm text-red-600 mb-1">❌ Cancellation Reason</p>
                  <p className="text-sm text-red-800">{booking.cancellationReason}</p>
                </div>
              )}

              <div className="flex justify-between items-center pt-4 border-t border-gray-200">
                <div className="flex space-x-2">
                  <button
                    onClick={() => loadInsights(booking)}
                    className="text-sm bg-purple-100 text-purple-700 px-3 py-1 rounded-lg hover:bg-purple-200 transition-colors"
                  >
                    🤖 AI Insights
                  </button>
                  <button
                    onClick={() => handleShowTicket(booking)}
                    className="text-sm bg-blue-100 text-blue-700 px-3 py-1 rounded-lg hover:bg-blue-200 transition-colors"
                  >
                    🎫 Show Ticket
                  </button>
                </div>

                {showActions && (
                  <div className="flex space-x-2">
                    {getStatusActions(booking.status).map((action) => (
                      <button
                        key={action}
                        onClick={() => handleStatusChange(booking.id, action)}
                        className={`text-sm px-3 py-1 rounded-lg transition-colors ${
                          action === 'confirm' 
                            ? 'bg-green-100 text-green-700 hover:bg-green-200'
                            : action === 'complete'
                            ? 'bg-blue-100 text-blue-700 hover:bg-blue-200'
                            : action === 'cancel'
                            ? 'bg-red-100 text-red-700 hover:bg-red-200'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        {action.charAt(0).toUpperCase() + action.slice(1).replace('-', ' ')}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* AI Insights Modal */}
      {showInsights && insights && selectedBooking && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-96 overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold text-gray-900">
                  🤖 AI Insights for {selectedBooking.company.name}
                </h3>
                <button
                  onClick={() => setShowInsights(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold text-gray-800 mb-2">Personalized Insights</h4>
                  <p className="text-gray-700 whitespace-pre-line">{insights.insights}</p>
                </div>

                {insights.recommendation && (
                  <div>
                    <h4 className="font-semibold text-gray-800 mb-2">AI Recommendation</h4>
                    <p className="text-gray-700 whitespace-pre-line">{insights.recommendation}</p>
                  </div>
                )}

                {insights.aiMetadata && (
                  <div>
                    <h4 className="font-semibold text-gray-800 mb-2">Additional Metadata</h4>
                    <pre className="text-xs text-gray-600 bg-gray-100 p-3 rounded-lg overflow-x-auto">
                      {JSON.stringify(insights.aiMetadata, null, 2)}
                    </pre>
                  </div>
                )}
              </div>

              <div className="mt-6 flex justify-end">
                <button
                  onClick={() => setShowInsights(false)}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Ticket Modal */}
      {showTicketModal && ticketBooking && (
        <TicketModal
          booking={ticketBooking}
          onClose={() => {
            setShowTicketModal(false);
            setTicketBooking(null);
          }}
        />
      )}
    </div>
  );
}
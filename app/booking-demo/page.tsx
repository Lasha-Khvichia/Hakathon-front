'use client';

import React, { useState, useEffect } from 'react';
import BookingForm from '../components/Booking/BookingForm';
import BookingList from '../components/Booking/BookingList';
import { CompanyTypes } from '../BackAPI/CompanyTypes';
import { companyService } from '../lib/Api/service';

export default function BookingDemo() {
  const [companies, setCompanies] = useState<CompanyTypes[]>([]);
  const [selectedCompany, setSelectedCompany] = useState<CompanyTypes | null>(null);
  const [showBookingForm, setShowBookingForm] = useState(false);
  const [userId] = useState(1); // Mock user ID for demo

  useEffect(() => {
    loadCompanies();
  }, []);

  const loadCompanies = async () => {
    try {
      // Get all companies with categories
      const allCategories = await companyService.getAll();
      if (allCategories.length > 0) {
        setCompanies(allCategories.slice(0, 6)); // Show first 6 companies for demo
      }
    } catch (error) {
      console.error('Failed to load companies:', error);
    }
  };

  const handleBookingSuccess = (booking: any) => {
    setShowBookingForm(false);
    setSelectedCompany(null);
    // Refresh the booking list
    window.location.reload();
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            🤖 AI-Powered Booking System
          </h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Experience intelligent booking with AI recommendations, conflict resolution, 
            and personalized insights for Georgian companies.
          </p>
        </div>

        {/* Companies Grid */}
        {!showBookingForm && (
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Select a Company to Book</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {companies.map((company) => (
                <div
                  key={company.id}
                  className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow cursor-pointer"
                  onClick={() => {
                    setSelectedCompany(company);
                    setShowBookingForm(true);
                  }}
                >
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-900">{company.name}</h3>
                    <div 
                      className="w-4 h-4 rounded-full"
                      style={{ backgroundColor: company.category?.color || '#3B82F6' }}
                    ></div>
                  </div>
                  <p className="text-gray-600 mb-2">{company.category?.name}</p>
                  <p className="text-sm text-gray-500">Ready for booking</p>
                  <div className="mt-4">
                    <button className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors">
                      📅 Book Now with AI
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Booking Form */}
        {showBookingForm && selectedCompany && (
          <div className="mb-12">
            <BookingForm
              company={selectedCompany}
              userId={userId}
              onSuccess={handleBookingSuccess}
              onCancel={() => {
                setShowBookingForm(false);
                setSelectedCompany(null);
              }}
            />
          </div>
        )}

        {/* Booking List */}
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Your Bookings</h2>
          <BookingList userId={userId} showActions={true} />
        </div>

        {/* Features Showcase */}
        <div className="mt-16 bg-white rounded-lg shadow-lg p-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
            🚀 AI-Powered Features
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="text-4xl mb-4">🤖</div>
              <h3 className="text-lg font-semibold mb-2">Smart Recommendations</h3>
              <p className="text-gray-600 text-sm">
                AI analyzes your preferences and suggests optimal booking times
              </p>
            </div>
            <div className="text-center">
              <div className="text-4xl mb-4">⚡</div>
              <h3 className="text-lg font-semibold mb-2">Conflict Prevention</h3>
              <p className="text-gray-600 text-sm">
                Intelligent conflict detection prevents double bookings
              </p>
            </div>
            <div className="text-center">
              <div className="text-4xl mb-4">🎯</div>
              <h3 className="text-lg font-semibold mb-2">Personalized Insights</h3>
              <p className="text-gray-600 text-sm">
                Category-specific tips and personalized recommendations
              </p>
            </div>
            <div className="text-center">
              <div className="text-4xl mb-4">📊</div>
              <h3 className="text-lg font-semibold mb-2">Real-time Analytics</h3>
              <p className="text-gray-600 text-sm">
                Fresh data with no caching ensures accuracy
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
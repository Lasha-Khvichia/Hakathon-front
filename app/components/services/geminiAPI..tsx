"use client"
import axios from 'axios';

interface GeminiPart {
    text: string;
}

interface GeminiContent {
    parts: GeminiPart[];
}

interface GeminiCandidate {
    content: GeminiContent;
}

interface GeminiResponse {
    candidates?: GeminiCandidate[];
}

export const callGeminiAPI = async (message: string, apiKey: string): Promise<string> => {
    if (!apiKey) {
        throw new Error("API key is required");
    }

    try {
        const response = await axios.post(
            `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${apiKey}`,
            {
                contents: [{
                    parts: [{
                        text: `You are a helpful assistant for an online queuing system. 
              
Available services:
- City Bank: Open New Account, Deposit Money, Withdraw Money, Get Loan, Credit Card Service, Money Transfer
- Health Clinic: General Checkup, Dental Care, Vaccination, Lab Tests, X-Ray, Emergency
- Government Office: ID Card, Passport, Driver License, Birth Certificate, Marriage Certificate, Tax Documents
- Post Office: Send Package, Receive Package, Buy Stamps, International Mail, Post Box Rental, Money Order
- Telecom Center: New SIM Card, Change Plan, Pay Bill, Technical Support, Internet Service, Device Repair
- Car Service: Oil Change, Tire Service, Car Wash, Engine Checkup, Brake Service, AC Repair

User question: ${message}

Provide a helpful, concise answer about the services, booking process, or general assistance.`
                    }]
                }]
            },
            {
                headers: {
                    'Content-Type': 'application/json',
                }
            }
        );

        const data: GeminiResponse = response.data;

        if (data.candidates && data.candidates[0]?.content?.parts[0]?.text) {
            return data.candidates[0].content.parts[0].text;
        } else {
            throw new Error("Invalid response from API");
        }
    } catch (error) {
        console.error('Gemini API Error:', error);
        throw error;
    }
};

export const checkBookingAvailability = async (
    bookingData: {
        category: string;
        branch: string;
        service: string;
        date: string;
        time: string;
    },
    apiKey: string
): Promise<{
    isAvailable: boolean;
    message: string;
    alternativeSlots?: Array<{ date: string; time: string; }>;
}> => {
    if (!apiKey) {
        throw new Error("API key is required");
    }

    // Simulate random availability (in real app, this would check your database)
    const isAvailable = Math.random() > 0.3; // 70% chance available

    const prompt = `You are a booking availability checker. 

Booking Request:
- Category: ${bookingData.category}
- Branch: ${bookingData.branch}
- Service: ${bookingData.service}
- Date: ${bookingData.date}
- Time: ${bookingData.time}

${isAvailable 
    ? `The requested time slot IS AVAILABLE. Generate a confirmation message with ticket number ${Math.floor(Math.random() * 2000) + 1}.`
    : `The requested time slot is NOT AVAILABLE. Suggest 3 alternative free time slots for the same date or next available dates.`
}

Respond in JSON format:
{
    "isAvailable": ${isAvailable},
    "message": "Your response message here",
    "alternativeSlots": ${!isAvailable ? '[{"date": "YYYY-MM-DD", "time": "HH:MM"}, ...]' : 'null'}
}`;

    try {
        const response = await axios.post(
            `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${apiKey}`,
            {
                contents: [{
                    parts: [{
                        text: prompt
                    }]
                }]
            },
            {
                headers: {
                    'Content-Type': 'application/json',
                }
            }
        );

        const data: GeminiResponse = response.data;

        if (data.candidates && data.candidates[0]?.content?.parts[0]?.text) {
            const responseText = data.candidates[0].content.parts[0].text;
            
            // Try to parse JSON response
            try {
                const jsonMatch = responseText.match(/\{[\s\S]*\}/);
                if (jsonMatch) {
                    const parsedResponse = JSON.parse(jsonMatch[0]);
                    return parsedResponse;
                }
            } catch (parseError) {
                console.warn('Failed to parse JSON response, using fallback');
            }
            
            // Fallback response
            return {
                isAvailable: isAvailable,
                message: responseText,
                alternativeSlots: !isAvailable ? [
                    { date: bookingData.date, time: "10:00" },
                    { date: bookingData.date, time: "14:00" },
                    { date: bookingData.date, time: "16:30" }
                ] : undefined
            };
        } else {
            throw new Error("Invalid response from API");
        }
    } catch (error) {
        console.error('Booking Availability Check Error:', error);
        throw error;
    }
};
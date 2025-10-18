"use client"

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
        const response = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${apiKey}`,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
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
                })
            }
        );

        const data: GeminiResponse = await response.json();

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
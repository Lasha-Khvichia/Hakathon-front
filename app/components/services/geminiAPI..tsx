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

// Minimal wrapper for calling AI. This is a placeholder that should be
// implemented to call your chosen LLM endpoint (Gemini/OpenAI/etc.). For
// now it returns the model text if available.
export const callGeminiAPI = async (message: string, apiKey: string): Promise<string> => {
    // NOTE: Implement your real API call here. For now this function simply
    // returns the prompt so the rest of the flow can be tested end-to-end.
    // You can replace this with a fetch to the AI provider when you have
    // an API key and endpoint.
    return `AI prompt sent:\n${message}`;
};

// Checks availability by asking the AI assistant. It first loads bookings
// from the backend (/api/booking) and then constructs a prompt that includes
// the user's desired category/company/service/date/time and the list of
// existing bookings. The AI is expected to answer whether the requested
// slot is free and suggest alternatives.
export const checkBookingAvailability = async (
    bookingData: {
        category: string;
        company: string;
        service?: string;
        date: string; // ISO or human-readable
        time: string; // e.g. "14:30"
    },
    apiKey?: string
): Promise<{
    isAvailable: boolean;
    message: string;
    aiRaw?: string;
    alternativeSlots?: Array<{ date: string; time: string }>
}> => {
    // Read token from localStorage if available (dev fallback).
    // Use the provided dev JWT so local dev requests to the backend are authorized.
    const DEV_AUTH = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImFkbWluIiwic3ViIjoxLCJyb2xlIjoidXNlciIsImlhdCI6MTc2MDgxODQyNCwiZXhwIjoxNzYwOTA0ODI0fQ.jNXAGyjvEKu8cNDJ6m6S4uZyH6t76o-Ulw8GEihZ_tA';
    const token = (typeof window !== 'undefined' && (localStorage.getItem('authToken') || DEV_AUTH)) || undefined;

    // Fetch bookings from backend. We use the proxied endpoint /api/booking
    // which is rewritten to http://localhost:3002/booking by next.config.
    let bookings: Array<any> = [];
    try {
        const res = await axios.get('/api/booking', {
            timeout: 5000,
            headers: token ? { Authorization: `Bearer ${token}` } : undefined,
        });
        bookings = Array.isArray(res.data) ? res.data : (res.data?.bookings || []);
    } catch (err) {
        // If fetching bookings failed, proceed with empty list but include warning in prompt
        bookings = [];
    }

    // Build a readable bookings list for the prompt. We include company and booked datetime.
    const bookingsList = bookings.map((b: any) => {
        // b.booked might be ISO string or Date-like
        const when = b.booked ? new Date(b.booked).toISOString() : (b.bookedAt || 'unknown');
        const company = b.company?.name || b.companyId || 'unknown';
        return `- ${when} at ${company}`;
    }).join('\n') || 'No existing bookings returned.';

    // Construct prompt
        const companyName = (bookingData as any).company || (bookingData as any).branch || 'N/A';

        const prompt = `You are an assistant that checks booking availability.
User requested a booking with the following details:
Category: ${bookingData.category}
Company: ${companyName}
Service: ${bookingData.service || 'N/A'}
Date: ${bookingData.date}
Time: ${bookingData.time}

Here are existing bookings (company, datetime):
${bookingsList}

Task: Based on the bookings above, tell me as a short answer whether the requested slot (${bookingData.date} ${bookingData.time}) is free (respond with YES or NO). If NO, suggest up to 3 alternative date/time slots (one per line) that are likely free. Also include a brief explanation (1-2 sentences) why the slot is or is not available.
Respond in JSON only with the following shape:
{
    "isAvailable": true|false,
    "explanation": "...",
    "alternatives": [ { "date": "YYYY-MM-DD", "time": "HH:MM" }, ... ]
}
`;

    // Call AI
    const aiRaw = await callGeminiAPI(prompt, apiKey || '');

    // DEV: if callGeminiAPI is a local placeholder that simply echoes the prompt
    // (it returns a string starting with "AI prompt sent:"), treat this as a
    // permissive positive response so the booking flow can proceed during dev.
    if (typeof aiRaw === 'string' && aiRaw.startsWith('AI prompt sent:')) {
        return {
            isAvailable: true,
            message: 'Checked (dev): assuming slot is available.',
            aiRaw,
            alternativeSlots: [],
        };
    }

    // Helper: produce a short one-sentence summary
    const shortText = (text?: string) => {
        if (!text) return '';
        const cleaned = String(text).trim();
        // take up to first sentence (period) or first 140 chars
        const idx = cleaned.indexOf('.');
        if (idx > 0) return cleaned.slice(0, idx + 1);
        return cleaned.length > 140 ? cleaned.slice(0, 137) + '...' : cleaned;
    };

    // Try to parse JSON from AI response. If parsing fails, fall back to heuristic.
    let parsed: any = null;
    try {
        // Try to extract JSON substring
        const jsonStart = aiRaw.indexOf('{');
        const jsonText = jsonStart >= 0 ? aiRaw.slice(jsonStart) : aiRaw;
        parsed = JSON.parse(jsonText);
    } catch (e) {
        // Heuristic fallback: look for YES/NO in text
        const text = String(aiRaw).toLowerCase();
        const isAvailable = text.includes('yes') || (text.includes('available') && !text.includes('not available'));
        const alternatives: Array<{ date: string; time: string }> = [];
        const altMatches = String(aiRaw).match(/(\d{4}-\d{2}-\d{2})\s+(\d{1,2}:\d{2})/g) || [];
        for (const m of altMatches.slice(0,3)) {
            const parts = m.split(/\s+/);
            alternatives.push({ date: parts[0], time: parts[1] });
        }

        const short = isAvailable ? 'Requested slot appears to be available.' : 'Requested slot appears to be unavailable.';

        return {
            isAvailable,
            message: shortText(short),
            aiRaw: String(aiRaw),
            alternativeSlots: alternatives,
        };
    }

    // If parsed JSON contains expected fields, normalize and return
    if (parsed && typeof parsed === 'object') {
        const isAvailable = Boolean(parsed.isAvailable);
        const explanation = parsed.explanation || parsed.explain || parsed.message || '';
        const alternatives = Array.isArray(parsed.alternatives) ? parsed.alternatives.map((a: any) => ({ date: a.date, time: a.time })) : undefined;
        return {
            isAvailable,
            message: shortText(explanation || (isAvailable ? 'Requested slot is available.' : 'Requested slot is not available.')),
            aiRaw: aiRaw,
            alternativeSlots: alternatives,
        };
    }

    // Default fallback
    return {
        isAvailable: false,
        message: String(aiRaw),
        aiRaw: String(aiRaw),
    };
};
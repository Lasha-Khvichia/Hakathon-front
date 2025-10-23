"use client"

import axios from 'axios';
import { AUTH_CONFIG, GEMINI_CONFIG } from '@/app/lib/Api/confing';

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
    candidates: GeminiCandidate[];
}

// Environment-controlled AI API wrapper
export const callGeminiAPI = async (message: string, apiKey?: string): Promise<string> => {
    // Use environment-provided Gemini API URL and key
    const geminiUrl = GEMINI_CONFIG.apiUrl;
    const geminiKey = apiKey || GEMINI_CONFIG.apiKey;
    
    // For development/testing - return placeholder if no real API key provided
    if (!geminiKey || geminiKey === 'your_actual_gemini_api_key_here') {
        return `AI prompt sent (dev mode):\n${message}`;
    }
    
    try {
        const response = await axios.post(
            `${geminiUrl}?key=${geminiKey}`,
            {
                contents: [{
                    parts: [{ text: message }]
                }]
            },
            {
                headers: {
                    'Content-Type': 'application/json',
                },
                timeout: 30000,
            }
        );
        
        const result = response.data as GeminiResponse;
        return result.candidates?.[0]?.content?.parts?.[0]?.text || 'No response from AI';
    } catch (error) {
        console.error('Gemini API error:', error);
        return `AI API Error: ${error instanceof Error ? error.message : 'Unknown error'}`;
    }
};

// Checks availability by asking the AI assistant using environment-controlled endpoints
export const checkBookingAvailability = async (
    bookingData: {
        category: string;
        company?: string;
        branch?: string;
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
    // Use environment-controlled authentication
    const token = (typeof window !== 'undefined' && (localStorage.getItem(AUTH_CONFIG.tokenKey) || AUTH_CONFIG.devToken)) || undefined;

    // Fetch bookings from backend using environment-controlled proxy endpoint
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
    const companyName = bookingData.company || bookingData.branch || 'N/A';

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
    if (typeof aiRaw === 'string' && aiRaw.startsWith('AI prompt sent')) {
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
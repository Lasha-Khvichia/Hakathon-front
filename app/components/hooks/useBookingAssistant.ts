import { useState } from 'react';
import { checkBookingAvailability } from '../services/geminiAPI.';

export const useBookingAssistant = () => {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any | null>(null);
  const [error, setError] = useState<string | null>(null);

  const check = async (data: { category: string; company: string; service?: string; date: string; time: string; }, apiKey?: string) => {
    setLoading(true);
    setError(null);
    try {
      const res = await checkBookingAvailability(data, apiKey);
      setResult(res);
      return res;
    } catch (e: any) {
      setError(e?.message || 'Failed to check availability');
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { loading, result, error, check };
};

export default useBookingAssistant;

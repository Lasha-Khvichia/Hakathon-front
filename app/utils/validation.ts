interface ValidationResult {
  isValid: boolean;
  errors: string[];
}

export const validateBookingForm = (bookingData: Record<string, unknown>): ValidationResult => {
  const errors: string[] = [];

  if (!bookingData.category) {
    errors.push('Category is required');
  }

  if (!bookingData.service) {
    errors.push('Service is required');
  }

  if (!bookingData.date) {
    errors.push('Date is required');
  }

  if (!bookingData.time) {
    errors.push('Time is required');
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};

export const validateRequired = (value: unknown, fieldName: string): ValidationResult => {
  const errors: string[] = [];

  if (value === null || value === undefined || value === '') {
    errors.push(`${fieldName} is required`);
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};
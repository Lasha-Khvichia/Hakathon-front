// constants/index.ts
import { AUTH_CONFIG, GEMINI_CONFIG } from '../lib/Api/confing';

export const BOOKING_STEPS = {
  CATEGORY_SELECTION: 1,
  SERVICE_SELECTION: 2,
  BRANCH_SELECTION: 3,
  DATE_SELECTION: 4,
  TIME_SELECTION: 5,
  CONFIRMATION: 6,
  SUCCESS: 7,
} as const;

export const API_STATUS = {
  IDLE: 'idle',
  LOADING: 'loading',
  SUCCESS: 'success',
  ERROR: 'error',
} as const;

// Environment-controlled storage keys
export const STORAGE_KEYS = {
  AUTH_TOKEN: AUTH_CONFIG.tokenKey,
  USER_DATA: 'userData',
  GEMINI_API_KEY: GEMINI_CONFIG.storageKey,
} as const;

export const DATE_FORMAT = {
  FULL: 'MMMM DD, YYYY',
  SHORT: 'MMM DD',
  TIME: 'hh:mm A',
} as const;

export const ERROR_MESSAGES = {
  NETWORK_ERROR: 'Network error. Please check your connection.',
  AUTH_REQUIRED: 'Please login to continue.',
  INVALID_CREDENTIALS: 'Invalid email or password.',
  BOOKING_FAILED: 'Failed to create booking. Please try again.',
  FETCH_FAILED: 'Failed to fetch data. Please try again.',
  ENV_VALIDATION_FAILED: 'Environment configuration error. Please check your .env.local file.',
} as const;

export const VALIDATION = {
  MIN_NAME_LENGTH: 2,
  MAX_NAME_LENGTH: 100,
  MIN_PASSWORD_LENGTH: 6,
  MAX_PASSWORD_LENGTH: 100,
} as const;
export const APP_NAME = 'Booking System';
export const APP_VERSION = '1.0.0';

export const BOOKING_STEPS = {
  CATEGORY_SELECTION: 1,
  BRANCH_SELECTION: 2,
  SERVICE_SELECTION: 3,
  DATE_SELECTION: 4,
  TIME_SELECTION: 5,
  CONFIRMATION: 6,
  SUCCESS: 7,
} as const;

export const BOOKING_STEP_NAMES = {
  [BOOKING_STEPS.CATEGORY_SELECTION]: 'Category',
  [BOOKING_STEPS.BRANCH_SELECTION]: 'Branch',
  [BOOKING_STEPS.SERVICE_SELECTION]: 'Service',
  [BOOKING_STEPS.DATE_SELECTION]: 'Date',
  [BOOKING_STEPS.TIME_SELECTION]: 'Time',
  [BOOKING_STEPS.CONFIRMATION]: 'Confirm',
  [BOOKING_STEPS.SUCCESS]: 'Success',
} as const;

export const TIME_FORMATS = {
  FULL_TIME: 'HH:mm:ss',
  SHORT_TIME: 'HH:mm',
  LOCALE_TIME: 'en-US',
} as const;

export const DATE_FORMATS = {
  FULL_DATE: 'YYYY-MM-DD',
  DISPLAY_DATE: 'MMM DD, YYYY',
  LOCALE_DATE: 'en-US',
} as const;

export const API_ENDPOINTS = {
  BOOKINGS: '/api/bookings',
  CATEGORIES: '/api/categories',
  SERVICES: '/api/services',
  BRANCHES: '/api/branches',
  TIME_SLOTS: '/api/time-slots',
} as const;

export const UI_CONSTANTS = {
  SIDEBAR_WIDTH: '280px',
  HEADER_HEIGHT: '70px',
  MOBILE_BREAKPOINT: '768px',
  TABLET_BREAKPOINT: '1024px',
} as const;

export const ANIMATION = {
  FAST: 150,
  NORMAL: 300,
  SLOW: 500,
} as const;

export const COLORS = {
  PRIMARY: '#3b82f6',
  SUCCESS: '#10b981',
  WARNING: '#f59e0b',
  ERROR: '#ef4444',
  INFO: '#6366f1',
} as const;

export const VALIDATION = {
  MIN_NAME_LENGTH: 2,
  MAX_NAME_LENGTH: 50,
  MAX_DESCRIPTION_LENGTH: 200,
} as const;
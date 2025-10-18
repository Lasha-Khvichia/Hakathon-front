
export const colors = {
  blue: 'bg-blue-500 hover:bg-blue-600',
  green: 'bg-green-500 hover:bg-green-600',
  purple: 'bg-purple-500 hover:bg-purple-600',
  red: 'bg-red-500 hover:bg-red-600',
  indigo: 'bg-indigo-500 hover:bg-indigo-600',
  yellow: 'bg-yellow-500 hover:bg-yellow-600',
} as const;

export type Color = keyof typeof colors;

export const getColorClasses = (color: Color): string => {
  return colors[color] || colors.blue;
};

export const generateColorTheme = (color: Color) => {
  const colorMap = {
    blue: { primary: '#3b82f6', secondary: '#1d4ed8', light: '#dbeafe' },
    green: { primary: '#10b981', secondary: '#047857', light: '#d1fae5' },
    purple: { primary: '#8b5cf6', secondary: '#6d28d9', light: '#e9d5ff' },
    red: { primary: '#ef4444', secondary: '#dc2626', light: '#fee2e2' },
    indigo: { primary: '#6366f1', secondary: '#4f46e5', light: '#e0e7ff' },
    yellow: { primary: '#f59e0b', secondary: '#d97706', light: '#fef3c7' },
  };

  return colorMap[color] || colorMap.blue;
};

export const hexToRgb = (hex: string): { r: number; g: number; b: number } | null => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
    : null;
};

export const getContrastColor = (backgroundColor: string): 'black' | 'white' => {
  const rgb = hexToRgb(backgroundColor);
  if (!rgb) return 'black';

  const luminance = (0.299 * rgb.r + 0.587 * rgb.g + 0.114 * rgb.b) / 255;
  return luminance > 0.5 ? 'black' : 'white';
};
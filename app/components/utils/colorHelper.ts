export const colors = {
  blue: 'bg-blue-500 hover:bg-blue-600',
  green: 'bg-green-500 hover:bg-green-600',
  purple: 'bg-purple-500 hover:bg-purple-600',
  red: 'bg-red-500 hover:bg-red-600',
  indigo: 'bg-indigo-500 hover:bg-indigo-600',
  yellow: 'bg-yellow-500 hover:bg-yellow-600'
} as const;

export type Color = keyof typeof colors;

export const getColorClasses = (color: Color) => {
  return colors[color] || colors.blue;
};
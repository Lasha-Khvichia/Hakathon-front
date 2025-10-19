export const getNextDays = (numDays = 7) => {
  const days = [];
  const today = new Date();
  
  for (let i = 0; i < numDays; i++) {
    const date = new Date(today);
    date.setDate(today.getDate() + i);
    days.push({
      date: date,
      day: date.toLocaleDateString('en-US', { weekday: 'short' }),
      num: date.getDate(),
      month: date.toLocaleDateString('en-US', { month: 'short' }),
      full: date.toLocaleDateString('en-US')
    });
  }
  
  return days;
};

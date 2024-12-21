import { DateTime } from 'luxon';

export const formatDate = (date: string | Date) => {
  try {
    const dateTime = typeof date === 'string' ? DateTime.fromISO(date) : DateTime.fromJSDate(date);

    if (!dateTime.isValid) {
      return 'Invalid date';
    }

    return dateTime.setLocale('ru').toLocaleString(DateTime.DATE_FULL);
  } catch (error) {
    console.error('Date formatting error:', error);
    return 'Invalid date';
  }
};

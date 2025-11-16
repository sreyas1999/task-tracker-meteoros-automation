import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';

dayjs.extend(relativeTime);

/**
 * Format ISO timestamp to readable date/time
 */
export const formatDateTime = (isoString: string): string => {
  return dayjs(isoString).format('MMM D, YYYY h:mm A');
};

/**
 * Get relative time (e.g., "2 hours ago")
 */
export const getRelativeTime = (isoString: string): string => {
  return dayjs(isoString).fromNow();
};

/**
 * Format timestamp for geolocation
 */
export const formatTimestamp = (timestamp: number): string => {
  return dayjs(timestamp).format('MMM D, YYYY h:mm:ss A');
};

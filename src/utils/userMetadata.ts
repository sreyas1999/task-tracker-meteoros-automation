import { UAParser } from 'ua-parser-js';
import type { DeviceInfo, Location } from '../types/user';

/**
 * Extract device information using ua-parser-js
 */
export const getDeviceInfo = (): DeviceInfo => {
  const parser = new UAParser();
  const result = parser.getResult();

  return {
    browser: `${result.browser.name || 'Unknown'} ${result.browser.version || ''}`.trim(),
    os: `${result.os.name || 'Unknown'} ${result.os.version || ''}`.trim(),
    deviceType: result.device.type || 'desktop',
  };
};

/**
 * Get user's geolocation using Browser Geolocation API
 */
export const getGeolocation = (): Promise<Location | null> => {
  return new Promise((resolve) => {
    if (!navigator.geolocation) {
      console.warn('Geolocation is not supported by this browser');
      resolve(null);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          lat: position.coords.latitude,
          lon: position.coords.longitude,
          accuracy: position.coords.accuracy,
          timestamp: position.timestamp,
        });
      },
      (error) => {
        console.warn('Geolocation permission denied or error:', error.message);
        resolve(null);
      },
      {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 0,
      }
    );
  });
};

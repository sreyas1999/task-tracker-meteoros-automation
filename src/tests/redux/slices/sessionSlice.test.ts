import { describe, it, expect } from 'vitest';
import sessionReducer, {
  setUserSession,
  clearUserSession,
} from '../../../redux/slices/sessionSlice';
import type { UserSession } from '../../../types/user';

describe('sessionSlice', () => {
  const initialState = {
    userSession: null,
  };

  const mockUserSession: UserSession = {
    email: 'test@example.com',
    loginTime: '2024-01-01T12:00:00.000Z',
    deviceInfo: {
      browser: 'Chrome',
      os: 'Windows',
      deviceType: 'desktop',
    },
    location: {
      lat: 40.7128,
      lon: -74.006,
      accuracy: 10,
      timestamp: Date.now(),
    },
  };

  it('should return the initial state', () => {
    expect(sessionReducer(undefined, { type: 'unknown' })).toEqual(initialState);
  });

  it('should handle setUserSession', () => {
    const actual = sessionReducer(initialState, setUserSession(mockUserSession));
    expect(actual.userSession).toEqual(mockUserSession);
  });

  it('should handle clearUserSession', () => {
    const stateWithSession = {
      userSession: mockUserSession,
    };
    const actual = sessionReducer(stateWithSession, clearUserSession());
    expect(actual.userSession).toBeNull();
  });

  it('should handle setUserSession with null location', () => {
    const sessionWithoutLocation: UserSession = {
      ...mockUserSession,
      location: null,
    };
    const actual = sessionReducer(initialState, setUserSession(sessionWithoutLocation));
    expect(actual.userSession?.location).toBeNull();
  });

  it('should overwrite existing session with new session', () => {
    const firstSession: UserSession = {
      email: 'first@example.com',
      loginTime: '2024-01-01T12:00:00.000Z',
      deviceInfo: {
        browser: 'Chrome',
        os: 'Windows',
        deviceType: 'desktop',
      },
      location: null,
    };

    const secondSession: UserSession = {
      email: 'second@example.com',
      loginTime: '2024-01-02T12:00:00.000Z',
      deviceInfo: {
        browser: 'Firefox',
        os: 'Mac',
        deviceType: 'desktop',
      },
      location: null,
    };

    let state = sessionReducer(initialState, setUserSession(firstSession));
    expect(state.userSession?.email).toBe('first@example.com');

    state = sessionReducer(state, setUserSession(secondSession));
    expect(state.userSession?.email).toBe('second@example.com');
  });
});

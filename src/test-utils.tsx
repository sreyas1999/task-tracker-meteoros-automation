import React, { type PropsWithChildren } from 'react';
import { render, type RenderOptions } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { BrowserRouter } from 'react-router-dom';
import rootReducer from './redux/reducers/rootReducer';
import type { RootState } from './redux/store';

// Create a test store with optional preloaded state
export function setupStore(preloadedState?: Partial<RootState>) {
  return configureStore({
    reducer: rootReducer,
    preloadedState: preloadedState as RootState,
  });
}

export type AppStore = ReturnType<typeof setupStore>;

interface ExtendedRenderOptions extends Omit<RenderOptions, 'wrapper'> {
  preloadedState?: Partial<RootState>;
  store?: AppStore;
}

// Custom render function with Redux Provider and Router
export function renderWithProviders(
  ui: React.ReactElement,
  {
    preloadedState = {},
    store = setupStore(preloadedState),
    ...renderOptions
  }: ExtendedRenderOptions = {}
) {
  function Wrapper({ children }: PropsWithChildren): React.ReactElement {
    return (
      <Provider store={store}>
        <BrowserRouter>{children}</BrowserRouter>
      </Provider>
    );
  }

  return { store, ...render(ui, { wrapper: Wrapper, ...renderOptions }) };
}

// Mock user metadata utilities
export const mockUserMetadata = {
  getDeviceInfo: () => ({
    browser: 'Chrome',
    browserVersion: '120.0.0',
    os: 'Windows',
    osVersion: '10',
    deviceType: 'desktop',
  }),
  getUserLocation: () =>
    Promise.resolve({
      latitude: 40.7128,
      longitude: -74.006,
      city: 'New York',
      country: 'United States',
    }),
};

// Mock geolocation success
export const mockGeolocationSuccess = (callback: PositionCallback) => {
  callback({
    coords: {
      latitude: 40.7128,
      longitude: -74.006,
      accuracy: 10,
      altitude: null,
      altitudeAccuracy: null,
      heading: null,
      speed: null,
      toJSON: () => ({}),
    },
    timestamp: Date.now(),
    toJSON: () => ({}),
  } as GeolocationPosition);
};

// Mock geolocation error
export const mockGeolocationError = (callback: PositionErrorCallback) => {
  callback({
    code: 1,
    message: 'User denied Geolocation',
    PERMISSION_DENIED: 1,
    POSITION_UNAVAILABLE: 2,
    TIMEOUT: 3,
  });
};

// Re-export commonly used utilities from React Testing Library
export { screen, waitFor, within, fireEvent } from '@testing-library/react';
export { renderWithProviders as render };

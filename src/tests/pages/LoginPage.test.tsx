import { describe, it, expect, vi, beforeEach } from 'vitest';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { LoginPage } from '../../pages/LoginPage';
import { renderWithProviders } from '../../test-utils';
import * as userMetadataUtils from '../../utils/userMetadata';

// Mock the user metadata utilities
vi.mock('../../utils/userMetadata', () => ({
  getDeviceInfo: vi.fn(),
  getGeolocation: vi.fn(),
}));

describe('LoginPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    
    // Setup default mocks
    vi.mocked(userMetadataUtils.getDeviceInfo).mockReturnValue({
      browser: 'Chrome',
      os: 'Windows',
      deviceType: 'desktop',
    });
    
    vi.mocked(userMetadataUtils.getGeolocation).mockResolvedValue({
      lat: 40.7128,
      lon: -74.006,
      accuracy: 10,
      timestamp: Date.now(),
    });
  });

  it('should render login form', () => {
    renderWithProviders(<LoginPage />);

    expect(screen.getByRole('heading', { name: /TaskTrackr/i })).toBeInTheDocument();
    expect(screen.getByText(/Welcome! Please login to continue/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/^Email$/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Login/i })).toBeInTheDocument();
  });

  it('should show error when submitting empty email', async () => {
    const user = userEvent.setup();
    renderWithProviders(<LoginPage />);

    const submitButton = screen.getByRole('button', { name: /Login/i });
    await user.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/Please enter both email and password/i)).toBeInTheDocument();
    });
  });

  it('should successfully login with valid email', async () => {
    const user = userEvent.setup();
    const { store } = renderWithProviders(<LoginPage />);

    const emailInput = screen.getByLabelText(/^Email$/i);
    const passwordInput = screen.getByLabelText(/Password/i);
    const submitButton = screen.getByRole('button', { name: /Login/i });

    await user.type(emailInput, 'test@example.com');
    await user.type(passwordInput, 'password123');
    await user.click(submitButton);

    await waitFor(() => {
      const state = store.getState();
      expect(state.session.userSession).not.toBeNull();
      expect(state.session.userSession?.email).toBe('test@example.com');
    });
  });

  it('should capture device information on login', async () => {
    const user = userEvent.setup();
    const { store } = renderWithProviders(<LoginPage />);

    const emailInput = screen.getByLabelText(/^Email$/i);
    const passwordInput = screen.getByLabelText(/Password/i);
    const submitButton = screen.getByRole('button', { name: /Login/i });

    await user.type(emailInput, 'test@example.com');
    await user.type(passwordInput, 'password123');
    await user.click(submitButton);

    await waitFor(() => {
      const state = store.getState();
      expect(state.session.userSession?.deviceInfo).toEqual({
        browser: 'Chrome',
        os: 'Windows',
        deviceType: 'desktop',
      });
    });

    expect(userMetadataUtils.getDeviceInfo).toHaveBeenCalled();
  });

  it('should capture location information on login', async () => {
    const user = userEvent.setup();
    const { store } = renderWithProviders(<LoginPage />);

    const emailInput = screen.getByLabelText(/^Email$/i);
    const passwordInput = screen.getByLabelText(/Password/i);
    const submitButton = screen.getByRole('button', { name: /Login/i });

    await user.type(emailInput, 'test@example.com');
    await user.type(passwordInput, 'password123');
    await user.click(submitButton);

    await waitFor(() => {
      const state = store.getState();
      expect(state.session.userSession?.location).toEqual({
        lat: 40.7128,
        lon: -74.006,
        accuracy: 10,
        timestamp: expect.any(Number),
      });
    });

    expect(userMetadataUtils.getGeolocation).toHaveBeenCalled();
  });

  it('should handle location permission denial gracefully', async () => {
    const user = userEvent.setup();
    vi.mocked(userMetadataUtils.getGeolocation).mockResolvedValue(null);
    
    const { store } = renderWithProviders(<LoginPage />);

    const emailInput = screen.getByLabelText(/^Email$/i);
    const passwordInput = screen.getByLabelText(/Password/i);
    const submitButton = screen.getByRole('button', { name: /Login/i });

    await user.type(emailInput, 'test@example.com');
    await user.type(passwordInput, 'password123');
    await user.click(submitButton);

    await waitFor(() => {
      const state = store.getState();
      expect(state.session.userSession?.location).toBeNull();
    });
  });

  it('should disable submit button while loading', async () => {
    const user = userEvent.setup();
    vi.mocked(userMetadataUtils.getGeolocation).mockImplementation(
      () => new Promise((resolve) => setTimeout(() => resolve(null), 100))
    );

    renderWithProviders(<LoginPage />);

    const emailInput = screen.getByLabelText(/^Email$/i);
    const passwordInput = screen.getByLabelText(/Password/i);
    const submitButton = screen.getByRole('button', { name: /Login/i });

    await user.type(emailInput, 'test@example.com');
    await user.type(passwordInput, 'password123');
    await user.click(submitButton);

    expect(submitButton).toBeDisabled();

    await waitFor(() => {
      expect(submitButton).not.toBeDisabled();
    }, { timeout: 2000 });
  });

  it('should trim email input', async () => {
    const user = userEvent.setup();
    const { store } = renderWithProviders(<LoginPage />);

    const emailInput = screen.getByLabelText(/^Email$/i);
    const passwordInput = screen.getByLabelText(/Password/i);
    const submitButton = screen.getByRole('button', { name: /Login/i });

    await user.type(emailInput, '  test@example.com  ');
    await user.type(passwordInput, 'password123');
    await user.click(submitButton);

    await waitFor(() => {
      const state = store.getState();
      expect(state.session.userSession?.email).toBe('test@example.com');
    });
  });
});

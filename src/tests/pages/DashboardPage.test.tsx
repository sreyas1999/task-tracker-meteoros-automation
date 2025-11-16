import { describe, it, expect, vi } from 'vitest';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { DashboardPage } from '../../pages/DashboardPage';
import { renderWithProviders } from '../../test-utils';

// Mock useNavigate
const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

describe('DashboardPage', () => {
  const mockUserSession = {
    email: 'test@example.com',
    loginTime: '2024-01-01T12:00:00.000Z',
    deviceInfo: {
      browser: 'Chrome 120.0.0',
      os: 'Windows 10',
      deviceType: 'desktop',
    },
    location: {
      lat: 40.7128,
      lon: -74.006,
      accuracy: 10,
      timestamp: Date.now(),
    },
  };

  it('should render user email', () => {
    const preloadedState = {
      session: {
        userSession: mockUserSession,
      },
      tasks: {
        tasks: [],
      },
    };

    renderWithProviders(<DashboardPage />, { preloadedState });

    // Should display username (part before @) in header
    const usernameElement = screen.getByText('test');
    expect(usernameElement).toBeInTheDocument();
    
    // Should display full email in login info card
    const emailElement = screen.getByText('test@example.com');
    expect(emailElement).toBeInTheDocument();
  });

  it('should render login time', () => {
    const preloadedState = {
      session: {
        userSession: mockUserSession,
      },
      tasks: {
        tasks: [],
      },
    };

    renderWithProviders(<DashboardPage />, { preloadedState });

    // Check for "Login Time" label
    expect(screen.getByText(/Login Time/i)).toBeInTheDocument();
  });

  it('should render device information', () => {
    const preloadedState = {
      session: {
        userSession: mockUserSession,
      },
      tasks: {
        tasks: [],
      },
    };

    renderWithProviders(<DashboardPage />, { preloadedState });

    expect(screen.getByText(/Chrome 120.0.0/i)).toBeInTheDocument();
    expect(screen.getByText(/Windows 10/i)).toBeInTheDocument();
    expect(screen.getByText(/desktop/i)).toBeInTheDocument();
  });

  it('should render location coordinates', () => {
    const preloadedState = {
      session: {
        userSession: mockUserSession,
      },
      tasks: {
        tasks: [],
      },
    };

    renderWithProviders(<DashboardPage />, { preloadedState });

    expect(screen.getByText(/40.7128/)).toBeInTheDocument();
    expect(screen.getByText(/-74.006/)).toBeInTheDocument();
  });

  it('should show location unavailable when location is null', () => {
    const preloadedState = {
      session: {
        userSession: {
          ...mockUserSession,
          location: null,
        },
      },
      tasks: {
        tasks: [],
      },
    };

    renderWithProviders(<DashboardPage />, { preloadedState });

    expect(screen.getByText(/Location permission denied or unavailable/i)).toBeInTheDocument();
  });

  it('should logout and clear session when logout button is clicked', async () => {
    const user = userEvent.setup();
    const preloadedState = {
      session: {
        userSession: mockUserSession,
      },
      tasks: {
        tasks: [
          {
            id: '1',
            title: 'Test Task',
            description: 'Test Description',
            createdAt: '2024-01-01T12:00:00.000Z',
            updatedAt: null,
          },
        ],
      },
    };

    const { store } = renderWithProviders(<DashboardPage />, { preloadedState });

    const logoutButton = screen.getByRole('button', { name: /Logout/i });
    await user.click(logoutButton);

    await waitFor(() => {
      const state = store.getState();
      expect(state.session.userSession).toBeNull();
      expect(state.tasks.tasks).toHaveLength(0);
    });

    expect(mockNavigate).toHaveBeenCalledWith('/');
  });

  it('should render all metadata cards', () => {
    const preloadedState = {
      session: {
        userSession: mockUserSession,
      },
      tasks: {
        tasks: [],
      },
    };

    renderWithProviders(<DashboardPage />, { preloadedState });

    // Check for metadata section headings
    expect(screen.getByText(/Login Information/i)).toBeInTheDocument();
    expect(screen.getByText(/Device Information/i)).toBeInTheDocument();
    expect(screen.getByText(/Location Information/i)).toBeInTheDocument();
  });
});

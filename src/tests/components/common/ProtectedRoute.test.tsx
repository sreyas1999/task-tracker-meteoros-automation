import { describe, it, expect } from 'vitest';
import { Route, Routes } from 'react-router-dom';
import { ProtectedRoute } from '../../../components/common/ProtectedRoute';
import { renderWithProviders } from '../../../test-utils';

describe('ProtectedRoute', () => {
  it('should render outlet content when user is authenticated', () => {
    const preloadedState = {
      session: {
        userSession: {
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
        },
      },
      tasks: {
        tasks: [],
      },
    };

    const { container } = renderWithProviders(
      <Routes>
        <Route element={<ProtectedRoute />}>
          <Route path="/" element={<div>Protected Content</div>} />
        </Route>
      </Routes>,
      { preloadedState }
    );

    expect(container.textContent).toContain('Protected Content');
  });

  it('should not render protected content when user is not authenticated', () => {
    const preloadedState = {
      session: {
        userSession: null,
      },
      tasks: {
        tasks: [],
      },
    };

    const { container } = renderWithProviders(
      <Routes>
        <Route element={<ProtectedRoute />}>
          <Route path="/" element={<div>Protected Content</div>} />
        </Route>
      </Routes>,
      { preloadedState }
    );

    expect(container.textContent).not.toContain('Protected Content');
  });

  it('should handle null location in user session', () => {
    const preloadedState = {
      session: {
        userSession: {
          email: 'test@example.com',
          loginTime: '2024-01-01T12:00:00.000Z',
          deviceInfo: {
            browser: 'Chrome',
            os: 'Windows',
            deviceType: 'desktop',
          },
          location: null,
        },
      },
      tasks: {
        tasks: [],
      },
    };

    const { container } = renderWithProviders(
      <Routes>
        <Route element={<ProtectedRoute />}>
          <Route path="/" element={<div>Protected Content</div>} />
        </Route>
      </Routes>,
      { preloadedState }
    );

    expect(container.textContent).toContain('Protected Content');
  });
});

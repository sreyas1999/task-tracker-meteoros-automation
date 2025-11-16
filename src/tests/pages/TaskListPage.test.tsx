import { describe, it, expect, vi } from 'vitest';
import { screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { TaskListPage } from '../../pages/TaskListPage';
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

describe('TaskListPage', () => {
  const mockUserSession = {
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

  it('should render empty state when no tasks exist', () => {
    const preloadedState = {
      session: {
        userSession: mockUserSession,
      },
      tasks: {
        tasks: [],
      },
    };

    renderWithProviders(<TaskListPage />, { preloadedState });

    expect(screen.getByText(/No Tasks Yet/i)).toBeInTheDocument();
    expect(screen.getByText(/Add Your First Task/i)).toBeInTheDocument();
  });

  it('should render tasks list when tasks exist', () => {
    const preloadedState = {
      session: {
        userSession: mockUserSession,
      },
      tasks: {
        tasks: [
          {
            id: '1',
            title: 'Task 1',
            description: 'Description 1',
            createdAt: '2024-01-01T12:00:00.000Z',
            updatedAt: null,
          },
          {
            id: '2',
            title: 'Task 2',
            description: 'Description 2',
            createdAt: '2024-01-01T13:00:00.000Z',
            updatedAt: null,
          },
        ],
      },
    };

    renderWithProviders(<TaskListPage />, { preloadedState });

    expect(screen.getByText('Task 1')).toBeInTheDocument();
    expect(screen.getByText('Description 1')).toBeInTheDocument();
    expect(screen.getByText('Task 2')).toBeInTheDocument();
    expect(screen.getByText('Description 2')).toBeInTheDocument();
  });

  it('should open add task dialog when add button is clicked', async () => {
    const user = userEvent.setup();
    const preloadedState = {
      session: {
        userSession: mockUserSession,
      },
      tasks: {
        tasks: [],
      },
    };

    renderWithProviders(<TaskListPage />, { preloadedState });

    const addButton = screen.getByRole('button', { name: /Add Your First Task/i });
    await user.click(addButton);

    await waitFor(() => {
      expect(screen.getByRole('dialog')).toBeInTheDocument();
      expect(screen.getByText(/Add New Task/i)).toBeInTheDocument();
    });
  });

  it('should open edit dialog when edit button is clicked', async () => {
    const user = userEvent.setup();
    const preloadedState = {
      session: {
        userSession: mockUserSession,
      },
      tasks: {
        tasks: [
          {
            id: '1',
            title: 'Existing Task',
            description: 'Existing Description',
            createdAt: '2024-01-01T12:00:00.000Z',
            updatedAt: null,
          },
        ],
      },
    };

    renderWithProviders(<TaskListPage />, { preloadedState });

    const editButton = screen.getByTestId('EditIcon').closest('button') as HTMLButtonElement;
    await user.click(editButton);

    await waitFor(() => {
      const dialog = screen.getByRole('dialog');
      expect(within(dialog).getByDisplayValue('Existing Task')).toBeInTheDocument();
      expect(within(dialog).getByDisplayValue('Existing Description')).toBeInTheDocument();
    });
  });

  it('should delete a task when delete button is clicked', async () => {
    const user = userEvent.setup();
    const preloadedState = {
      session: {
        userSession: mockUserSession,
      },
      tasks: {
        tasks: [
          {
            id: '1',
            title: 'Task to Delete',
            description: 'This will be deleted',
            createdAt: '2024-01-01T12:00:00.000Z',
            updatedAt: null,
          },
        ],
      },
    };

    const { store } = renderWithProviders(<TaskListPage />, { preloadedState });

    const deleteButton = screen.getByTestId('DeleteIcon').closest('button') as HTMLButtonElement;
    await user.click(deleteButton);

    await waitFor(() => {
      const state = store.getState();
      expect(state.tasks.tasks).toHaveLength(0);
    });
  });

  it('should navigate to dashboard when back button is clicked', async () => {
    const user = userEvent.setup();
    const preloadedState = {
      session: {
        userSession: mockUserSession,
      },
      tasks: {
        tasks: [],
      },
    };

    renderWithProviders(<TaskListPage />, { preloadedState });

    const backButton = screen.getByTestId('ArrowBackIcon').closest('button') as HTMLButtonElement;
    await user.click(backButton);

    expect(mockNavigate).toHaveBeenCalledWith('/dashboard');
  });

  it('should display user email in app bar', () => {
    const preloadedState = {
      session: {
        userSession: mockUserSession,
      },
      tasks: {
        tasks: [],
      },
    };

    renderWithProviders(<TaskListPage />, { preloadedState });

    expect(screen.getByText('test')).toBeInTheDocument();
  });

  it('should close dialog when cancel button is clicked', async () => {
    const user = userEvent.setup();
    const preloadedState = {
      session: {
        userSession: mockUserSession,
      },
      tasks: {
        tasks: [],
      },
    };

    renderWithProviders(<TaskListPage />, { preloadedState });

    const addButton = screen.getByRole('button', { name: /Add Your First Task/i });
    await user.click(addButton);

    const dialog = screen.getByRole('dialog');
    const cancelButton = within(dialog).getByRole('button', { name: /Cancel/i });
    await user.click(cancelButton);

    await waitFor(() => {
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    });
  });

  it('should show task count in header', () => {
    const preloadedState = {
      session: {
        userSession: mockUserSession,
      },
      tasks: {
        tasks: [
          {
            id: '1',
            title: 'Task 1',
            description: 'Description 1',
            createdAt: '2024-01-01T12:00:00.000Z',
            updatedAt: null,
          },
          {
            id: '2',
            title: 'Task 2',
            description: 'Description 2',
            createdAt: '2024-01-01T13:00:00.000Z',
            updatedAt: null,
          },
        ],
      },
    };

    renderWithProviders(<TaskListPage />, { preloadedState });

    expect(screen.getByText(/2 tasks/i)).toBeInTheDocument();
  });
});

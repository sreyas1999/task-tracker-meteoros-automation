import { describe, it, expect, beforeEach, vi } from 'vitest';
import tasksReducer, {
  addTask,
  updateTask,
  deleteTask,
  clearTasks,
} from '../../../redux/slices/tasksSlice';
import type { TaskEntry } from '../../../types/task';

describe('tasksSlice', () => {
  const initialState = {
    tasks: [],
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should return the initial state', () => {
    expect(tasksReducer(undefined, { type: 'unknown' })).toEqual(initialState);
  });

  describe('addTask', () => {
    it('should add a new task', () => {
      const newTask = {
        title: 'Test Task',
        description: 'Test Description',
      };

      const actual = tasksReducer(initialState, addTask(newTask));

      expect(actual.tasks).toHaveLength(1);
      expect(actual.tasks[0].title).toBe('Test Task');
      expect(actual.tasks[0].description).toBe('Test Description');
      expect(actual.tasks[0].id).toBeDefined();
      expect(actual.tasks[0].createdAt).toBeDefined();
      expect(actual.tasks[0].updatedAt).toBeNull();
    });

    it('should generate unique IDs for multiple tasks', () => {
      let state = tasksReducer(initialState, addTask({ title: 'Task 1', description: 'Desc 1' }));
      state = tasksReducer(state, addTask({ title: 'Task 2', description: 'Desc 2' }));

      expect(state.tasks).toHaveLength(2);
      expect(state.tasks[0].id).not.toBe(state.tasks[1].id);
    });

    it('should add task with empty description', () => {
      const newTask = {
        title: 'Task without description',
        description: '',
      };

      const actual = tasksReducer(initialState, addTask(newTask));

      expect(actual.tasks).toHaveLength(1);
      expect(actual.tasks[0].description).toBe('');
    });
  });

  describe('updateTask', () => {
    const existingTask: TaskEntry = {
      id: 'test-id-1',
      title: 'Original Title',
      description: 'Original Description',
      createdAt: '2024-01-01T12:00:00.000Z',
      updatedAt: null,
    };

    it('should update task title', () => {
      const stateWithTask = {
        tasks: [existingTask],
      };

      const actual = tasksReducer(
        stateWithTask,
        updateTask({
          id: 'test-id-1',
          updates: { title: 'Updated Title' },
        })
      );

      expect(actual.tasks[0].title).toBe('Updated Title');
      expect(actual.tasks[0].description).toBe('Original Description');
      expect(actual.tasks[0].updatedAt).not.toBeNull();
    });

    it('should update task description', () => {
      const stateWithTask = {
        tasks: [existingTask],
      };

      const actual = tasksReducer(
        stateWithTask,
        updateTask({
          id: 'test-id-1',
          updates: { description: 'Updated Description' },
        })
      );

      expect(actual.tasks[0].title).toBe('Original Title');
      expect(actual.tasks[0].description).toBe('Updated Description');
      expect(actual.tasks[0].updatedAt).not.toBeNull();
    });

    it('should update both title and description', () => {
      const stateWithTask = {
        tasks: [existingTask],
      };

      const actual = tasksReducer(
        stateWithTask,
        updateTask({
          id: 'test-id-1',
          updates: {
            title: 'New Title',
            description: 'New Description',
          },
        })
      );

      expect(actual.tasks[0].title).toBe('New Title');
      expect(actual.tasks[0].description).toBe('New Description');
      expect(actual.tasks[0].updatedAt).not.toBeNull();
    });

    it('should not modify other tasks', () => {
      const stateWithTasks = {
        tasks: [
          existingTask,
          {
            id: 'test-id-2',
            title: 'Task 2',
            description: 'Description 2',
            createdAt: '2024-01-01T13:00:00.000Z',
            updatedAt: null,
          },
        ],
      };

      const actual = tasksReducer(
        stateWithTasks,
        updateTask({
          id: 'test-id-1',
          updates: { title: 'Updated Title' },
        })
      );

      expect(actual.tasks[1].title).toBe('Task 2');
      expect(actual.tasks[1].updatedAt).toBeNull();
    });

    it('should not modify state if task ID does not exist', () => {
      const stateWithTask = {
        tasks: [existingTask],
      };

      const actual = tasksReducer(
        stateWithTask,
        updateTask({
          id: 'non-existent-id',
          updates: { title: 'Updated Title' },
        })
      );

      expect(actual.tasks[0].title).toBe('Original Title');
      expect(actual.tasks[0].updatedAt).toBeNull();
    });
  });

  describe('deleteTask', () => {
    it('should delete a task by ID', () => {
      const stateWithTasks = {
        tasks: [
          {
            id: 'test-id-1',
            title: 'Task 1',
            description: 'Description 1',
            createdAt: '2024-01-01T12:00:00.000Z',
            updatedAt: null,
          },
          {
            id: 'test-id-2',
            title: 'Task 2',
            description: 'Description 2',
            createdAt: '2024-01-01T13:00:00.000Z',
            updatedAt: null,
          },
        ],
      };

      const actual = tasksReducer(stateWithTasks, deleteTask('test-id-1'));

      expect(actual.tasks).toHaveLength(1);
      expect(actual.tasks[0].id).toBe('test-id-2');
    });

    it('should not modify state if task ID does not exist', () => {
      const stateWithTask = {
        tasks: [
          {
            id: 'test-id-1',
            title: 'Task 1',
            description: 'Description 1',
            createdAt: '2024-01-01T12:00:00.000Z',
            updatedAt: null,
          },
        ],
      };

      const actual = tasksReducer(stateWithTask, deleteTask('non-existent-id'));

      expect(actual.tasks).toHaveLength(1);
      expect(actual.tasks[0].id).toBe('test-id-1');
    });

    it('should handle deleting all tasks one by one', () => {
      let state = tasksReducer(
        {
          tasks: [
            {
              id: 'test-id-1',
              title: 'Task 1',
              description: 'Description 1',
              createdAt: '2024-01-01T12:00:00.000Z',
              updatedAt: null,
            },
            {
              id: 'test-id-2',
              title: 'Task 2',
              description: 'Description 2',
              createdAt: '2024-01-01T13:00:00.000Z',
              updatedAt: null,
            },
          ],
        },
        { type: 'unknown' }
      );

      state = tasksReducer(state, deleteTask('test-id-1'));
      expect(state.tasks).toHaveLength(1);

      state = tasksReducer(state, deleteTask('test-id-2'));
      expect(state.tasks).toHaveLength(0);
    });
  });

  describe('clearTasks', () => {
    it('should clear all tasks', () => {
      const stateWithTasks = {
        tasks: [
          {
            id: 'test-id-1',
            title: 'Task 1',
            description: 'Description 1',
            createdAt: '2024-01-01T12:00:00.000Z',
            updatedAt: null,
          },
          {
            id: 'test-id-2',
            title: 'Task 2',
            description: 'Description 2',
            createdAt: '2024-01-01T13:00:00.000Z',
            updatedAt: null,
          },
        ],
      };

      const actual = tasksReducer(stateWithTasks, clearTasks());

      expect(actual.tasks).toHaveLength(0);
    });

    it('should work on empty tasks array', () => {
      const actual = tasksReducer(initialState, clearTasks());

      expect(actual.tasks).toHaveLength(0);
    });
  });
});

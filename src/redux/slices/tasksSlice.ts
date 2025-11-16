import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { TaskEntry } from '../../types/task';

interface TasksState {
  tasks: TaskEntry[];
}

const initialState: TasksState = {
  tasks: [],
};

const tasksSlice = createSlice({
  name: 'tasks',
  initialState,
  reducers: {
    addTask: (state, action: PayloadAction<Omit<TaskEntry, 'id' | 'createdAt' | 'updatedAt'>>) => {
      const newTask: TaskEntry = {
        ...action.payload,
        id: crypto.randomUUID(),
        createdAt: new Date().toISOString(),
        updatedAt: null,
      };
      state.tasks.push(newTask);
    },
    updateTask: (
      state,
      action: PayloadAction<{ id: string; updates: Partial<Pick<TaskEntry, 'title' | 'description'>> }>
    ) => {
      const { id, updates } = action.payload;
      const taskIndex = state.tasks.findIndex((task) => task.id === id);
      if (taskIndex !== -1) {
        state.tasks[taskIndex] = {
          ...state.tasks[taskIndex],
          ...updates,
          updatedAt: new Date().toISOString(),
        };
      }
    },
    deleteTask: (state, action: PayloadAction<string>) => {
      state.tasks = state.tasks.filter((task) => task.id !== action.payload);
    },
    clearTasks: (state) => {
      state.tasks = [];
    },
  },
});

export const { addTask, updateTask, deleteTask, clearTasks } = tasksSlice.actions;
export default tasksSlice.reducer;

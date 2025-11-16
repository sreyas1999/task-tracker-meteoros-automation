import { combineReducers } from '@reduxjs/toolkit';
import sessionReducer from '../slices/sessionSlice';
import tasksReducer from '../slices/tasksSlice';

const rootReducer = combineReducers({
  session: sessionReducer,
  tasks: tasksReducer,
});

export default rootReducer;

import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { UserSession } from '../../types/user';

interface SessionState {
  userSession: UserSession | null;
}

const initialState: SessionState = {
  userSession: null,
};

const sessionSlice = createSlice({
  name: 'session',
  initialState,
  reducers: {
    setUserSession: (state, action: PayloadAction<UserSession>) => {
      state.userSession = action.payload;
    },
    clearUserSession: (state) => {
      state.userSession = null;
    },
  },
});

export const { setUserSession, clearUserSession } = sessionSlice.actions;
export default sessionSlice.reducer;

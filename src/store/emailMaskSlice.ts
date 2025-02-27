import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface EmailMaskState {
  visibleEmails: { [key: number]: boolean };
}

const initialState: EmailMaskState = {
  visibleEmails: {},
};

const emailMaskSlice = createSlice({
  name: 'emailMask',
  initialState,
  reducers: {
    toggleEmailVisibility: (state, action: PayloadAction<number>) => {
      const id = action.payload;
      state.visibleEmails[id] = !state.visibleEmails[id];
    },
    resetEmailVisibility: (state) => {
      state.visibleEmails = {};
    },
    setEmailVisibility: (state, action: PayloadAction<{ id: number; visible: boolean }>) => {
      const { id, visible } = action.payload;
      state.visibleEmails[id] = visible;
    }
  },
});

export const { toggleEmailVisibility, resetEmailVisibility, setEmailVisibility } = emailMaskSlice.actions;
export default emailMaskSlice.reducer;

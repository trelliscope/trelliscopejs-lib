import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

export interface SelectedDisplayState {
  name: string;
  group: string;
  desc: string;
}

const initialState: SelectedDisplayState = {
  name: '',
  group: '',
  desc: '',
};

export const selectedDisplaySlice = createSlice({
  name: 'selectedDisplay',
  initialState,
  reducers: {
    setSelectedDisplay: (state, action: PayloadAction<SelectedDisplayState>) => {
      state.name = action.payload.name;
      state.group = action.payload.group;
      state.desc = action.payload.desc;
    },
  },
});

export const { setSelectedDisplay } = selectedDisplaySlice.actions;

export default selectedDisplaySlice.reducer;

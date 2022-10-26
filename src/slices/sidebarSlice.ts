import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

export interface SidebarState {
  active: SidebarType;
}

const initialState: SidebarState = {
  active: '',
}

export const sidebarSlice = createSlice({
  name: 'sidebar',
  initialState,
  reducers: {
    setActiveSidebar: (state, action: PayloadAction<SidebarState['active']>) => {
      state.active = action.payload === state.active ? '' : action.payload;
    },
  },
});

export const { setActiveSidebar } = sidebarSlice.actions;

export default sidebarSlice.reducer;
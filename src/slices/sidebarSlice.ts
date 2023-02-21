import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import { selectHashSidebar } from '../selectors/hash';

export interface SidebarState {
  active: SidebarType;
}

const initialState: SidebarState = {
  ...selectHashSidebar(),
};

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

import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import { useSelector } from 'react-redux';
import type { RootState } from '../store';
import { displayListAPI, useDisplayList } from './displayListAPI';

export type SelectedDisplayState = string;

const initialState: SelectedDisplayState = '';

export const selectedDisplaySlice = createSlice({
  name: 'selectedDisplay',
  initialState,
  reducers: {
    setSelectedDisplay: (state, action: PayloadAction<SelectedDisplayState>) => action.payload,
  },
  extraReducers: (builder) => {
    builder.addMatcher(displayListAPI.endpoints.getDisplayList.matchFulfilled, (state, action) => {
      if (state === '') {
        state = action.payload[0].name;
      }

      return state;
    });
  },
});

export const { setSelectedDisplay } = selectedDisplaySlice.actions;

export const selectSelectedDisplay = (state: RootState) => state.selectedDisplay;

export const useSelectedDisplay = () => {
  const { data: displayList } = useDisplayList();
  console.log(displayList);

  const selectedDisplay = useSelector(selectSelectedDisplay);
  return displayList?.find((display) => display.name === selectedDisplay);
};

export default selectedDisplaySlice.reducer;

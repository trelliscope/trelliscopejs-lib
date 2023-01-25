import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import { useSelector } from 'react-redux';
import type { RootState } from '../store';
import { displayListAPI, useDisplayList } from './displayListAPI';
import { selectHashDisplay } from '../selectors/hash';

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
      // If the hash display is set, use it instead of the first display from the API
      const hashDisplay = selectHashDisplay();
      if (hashDisplay) {
        return hashDisplay;
      }

      if (state === '') {
        return action.payload[0].name;
      }

      return state;
    });
  },
});

export const { setSelectedDisplay } = selectedDisplaySlice.actions;

export const selectSelectedDisplay = (state: RootState) => state.selectedDisplay;

export const useSelectedDisplay = () => {
  const { data: displayList } = useDisplayList();
  const selectedDisplay = useSelector(selectSelectedDisplay);
  return displayList?.find((display) => display.name === selectedDisplay) || ({} as IDisplayListItem);
};

export const useRelatedDisplaysGroup = () => {
  const selectedDisplay = useSelectedDisplay();
  const { data: displayList } = useDisplayList();
  const keysig = selectedDisplay?.keysig;
  const group: IDisplayListItem[] = [];
  const dispID = [selectedDisplay?.description, selectedDisplay?.name].join('/');
  displayList?.forEach((d: IDisplayListItem) => {
    const sameKey = d.keysig === keysig;
    const curID = [d.description, d.name].join('/');
    if (sameKey && curID !== dispID) {
      group.push(d);
    }
  });
  return group;
};

export default selectedDisplaySlice.reducer;

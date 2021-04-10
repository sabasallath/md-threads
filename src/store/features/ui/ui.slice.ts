import { createSlice } from '@reduxjs/toolkit';
import Constant from '../../../config/constant';

const initialState = {
  openedNavigationDrawer: Constant.NAVIGATION_DRAWER_START_OPEN,
  expandedNavigationDrawer: Constant.NAVIGATION_DRAWER_START_EXPANDED,
  expandedRightDrawer: Constant.RIGHT_DRAWER_START_EXPANDED,
  searchBar: Constant.SEARCH_BAR_START_VISIBLE,
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    setOpenNavigationDrawer(state, action) {
      state.openedNavigationDrawer = action.payload;
    },
    setExpandedNavigationDrawer(state, action) {
      state.expandedNavigationDrawer = action.payload;
    },
    setExpandedRightDrawer(state, action) {
      state.expandedRightDrawer = action.payload;
    },
    setSearchBar(state, action) {
      state.searchBar = action.payload;
    },
  },
});

export const uiActions = uiSlice.actions;
export default uiSlice.reducer;

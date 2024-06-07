import { createSlice } from '@reduxjs/toolkit';

const dataSlice = createSlice({
  name: 'data',
  initialState: {},
  reducers: {
    updateData(state, action) {
      const { endpoint, data } = action.payload;
      state[endpoint] = data;
    },
  },
});

export const { updateData } = dataSlice.actions;
export default dataSlice.reducer;


import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  allOrder: [],
};

const allOrderSlice = createSlice({
  name: "allOrder",
  initialState,
  reducers: {
    setAllOrders: (state, action) => {
      state.allOrder = [...action.payload];
    },
  },
});

export const { setAllOrders } = allOrderSlice.actions;
export default allOrderSlice.reducer;

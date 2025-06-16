import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  addressList: [],
};

const addressSlice = createSlice({
  name: "address",
  initialState,
  reducers: {
    handleAddaddress: (state, action) => {
      state.addressList = [...action.payload];
    },
  },
});

export const { handleAddaddress } = addressSlice.actions;
export default addressSlice.reducer;

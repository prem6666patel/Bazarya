import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  allCategory: [],
  loadingCategory: false,
  allsubCategory: [],
  product: [],
};

const prodductSlice = createSlice({
  name: "product",
  initialState,
  reducers: {
    setAllCategory: (state, action) => {
      state.allCategory = [...action.payload];
    },
    setLoadingCategory: (state, action) => {
      state.loadingCategory = action.payload;
    },
    setAllSubCategory: (state, action) => {
      state.allsubCategory = [...action.payload];
    },
  },
});

export const { setAllCategory, setAllSubCategory, setLoadingCategory } =
  prodductSlice.actions;
export default prodductSlice.reducer;

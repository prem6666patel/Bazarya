// src/store/store.js
import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./userSlice";
import productReducer from "./productSlice";
import cartReducer from "./cartProduct";
import addressReducer from "./addressSlice";
import orderReducer from "./orderSlice";
import allOrderReducer from "./allOrdersSlice";

export const store = configureStore({
  reducer: {
    user: userReducer,
    product: productReducer,
    cartItem: cartReducer,
    addresses: addressReducer,
    orders: orderReducer,
    allorders: allOrderReducer,
  },
});

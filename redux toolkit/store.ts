import { configureStore } from "@reduxjs/toolkit";
import cartReducer from "./cartSlice";
import staffReducer from "./staffSlice";

const store = configureStore({
  reducer: {
    cart: cartReducer,
    staff: staffReducer,
  },
});

export default store;

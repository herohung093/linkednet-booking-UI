import { configureStore } from "@reduxjs/toolkit";
import cartReducer from "./cartSlice";
import staffReducer from "./staffSlice";
import storeInfoReducer from "./storeInfo";
const store = configureStore({
  reducer: {
    cart: cartReducer,
    staff: staffReducer,
    storeInfo: storeInfoReducer,
  },
});
export type RootState = ReturnType<typeof store.getState>;
export default store;

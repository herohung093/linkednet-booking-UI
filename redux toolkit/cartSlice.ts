import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const initialState: CartState = {
  items: [],
  total: 0,
  totalEstimatedTime: 0,
  selectedDate: null,
  selectedStaff: "",
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addToCart(state, action: PayloadAction<CartItem>) {
      const { id, servicePrice, estimatedTime } = action.payload;
      const existingItem = state.items.find((item) => item.id === id);
      if (existingItem) {
        existingItem.quantity++;
      } else {
        state.items.push({ ...action.payload, quantity: 1 });
      }
      state.total += servicePrice;
      state.totalEstimatedTime += estimatedTime;
    },
    removeFromCart(
      state,
      action: PayloadAction<{
        id: number;
        servicePrice: number;
        estimatedTime: number;
      }>
    ) {
      const { id, servicePrice, estimatedTime } = action.payload;
      const existingItem = state.items.find((item) => item.id === id);
      if (existingItem) {
        if (existingItem.quantity === 1) {
          state.items = state.items.filter((item) => item.id !== id);
        } else {
          existingItem.quantity--;
        }
        state.total -= servicePrice;
        state.totalEstimatedTime -= estimatedTime;
      }
    },
    clearCart(state) {
      state.items = [];
      state.total = 0;
      state.totalEstimatedTime = 0;
      state.selectedDate = null;
      state.selectedStaff = "";
    },
    setSelectedDate(state, action: PayloadAction<string | null>) {
      state.selectedDate = action.payload;
    },
    setSelectedStaff(state, action: PayloadAction<Staff | "" | null>) {
      state.selectedStaff = action.payload;
    },
  },
});

export const {
  addToCart,
  removeFromCart,
  clearCart,
  setSelectedDate,
  setSelectedStaff,
} = cartSlice.actions;

export default cartSlice.reducer;

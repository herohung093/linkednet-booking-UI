import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface StoreInfoSlice {
  storeInfo: StoreInfo | null;
}

const initialState: StoreInfoSlice = {
  storeInfo: null,
};

const storeInfoSlice = createSlice({
  name: "storeInfo",
  initialState,
  reducers: {
    setSelectedStoreInfo(state, action: PayloadAction<StoreInfo | null>) {
      state.storeInfo = action.payload;
    },
  },
});

export const { setSelectedStoreInfo } = storeInfoSlice.actions;

export default storeInfoSlice.reducer;

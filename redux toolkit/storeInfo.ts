import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface StoreInfoSlice {
  storeInfo: StoreInfo | null;
  serviceData: NailSalonService[] | null;
}

const initialState: StoreInfoSlice = {
  storeInfo: null,
  serviceData: null,
};

const storeInfoSlice = createSlice({
  name: "storeInfo",
  initialState,
  reducers: {
    setSelectedStoreInfo(state, action: PayloadAction<StoreInfo | null>) {
      state.storeInfo = action.payload;
    },
    setServiceData(state, action: PayloadAction<NailSalonService[] | null>) {
      state.serviceData = action.payload;
    },
  },
});

export const { setSelectedStoreInfo, setServiceData } = storeInfoSlice.actions;

export default storeInfoSlice.reducer;

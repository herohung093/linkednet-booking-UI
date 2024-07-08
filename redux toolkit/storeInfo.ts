import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface StoreInfoSlice {
  storeInfo: StoreInfo | null;
  serviceData: NailSalonService[] | null;
  storeUuid: string | null;
}

const initialState: StoreInfoSlice = {
  storeInfo: null,
  serviceData: null,
  storeUuid: null,
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
    setStoreUuid(state, action: PayloadAction<string | null>) {
      state.storeUuid = action.payload;
    },
  },
});

export const { setSelectedStoreInfo, setServiceData, setStoreUuid } = storeInfoSlice.actions;

export default storeInfoSlice.reducer;

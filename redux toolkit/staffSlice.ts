import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface StaffSlice {
  selectedStaffList: Staff[] | null;
  selectedStaffByHour: Staff | null;
}

const initialState: StaffSlice = {
  selectedStaffList: null,
  selectedStaffByHour: null,
};

const staffSlice = createSlice({
  name: "staff",
  initialState,
  reducers: {
    setSelectedStaffList(state, action: PayloadAction<Staff[] | null>) {
      state.selectedStaffList = action.payload;
    },
    setSelectedStaffByHour(state, action: PayloadAction<Staff | null>) {
      if (state.selectedStaffByHour !== action.payload) {
        state.selectedStaffByHour = action.payload;
      }
    },
  },
});

export const { setSelectedStaffList, setSelectedStaffByHour } =
  staffSlice.actions;

export default staffSlice.reducer;

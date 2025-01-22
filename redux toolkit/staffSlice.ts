import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const initialState: StaffSlice = {
  selectedStaffList: null,
  selectedStaffByHour: null,
  allStaff: null,
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
    setAllStaff(state, action: PayloadAction<Staff[] | null>) {
      state.allStaff = action.payload;
    },
  },
});

export const { setSelectedStaffList, setSelectedStaffByHour, setAllStaff } =
  staffSlice.actions;

  export const getStaffById = (state: { staff: StaffSlice }, id: number): Staff | null => {
    return state.staff.selectedStaffList?.find(staff => staff.id === id) || null;
  };

export default staffSlice.reducer;

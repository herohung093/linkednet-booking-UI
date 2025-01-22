import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { getStaffById } from "./staffSlice"; 
import { all } from "axios";

const initialState: CartState = {
  total: 0,
  totalEstimatedTime: 0,
  selectedDate: null,
  selectedHour: null,
  timeZone: null,
  StoreConfig: null,
  guests: [],
  isGroupBooking: null,
  currentGuestName: "Me",
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    
    clearCart(state) {
      state.total = 0;
      state.totalEstimatedTime = 0;
      state.selectedDate = null;
      state.selectedHour = null;
      state.timeZone = null;
      state.guests = [];
      state.isGroupBooking = null;
      state.currentGuestName = "Me";
    },
    setSelectedDate(state, action: PayloadAction<string | null>) {
      state.selectedDate = action.payload;
    },
    setSelectedHour(state, action: PayloadAction<string | null>) {
      state.selectedHour = action.payload;
    },
    setTimeZone(state, action: PayloadAction<string | null>) {
      state.timeZone = action.payload;
    },
    setStoreConfig(state, action: PayloadAction<StoreConfig>) {
      state.StoreConfig = action.payload;
    },
    addGuest(state, action: PayloadAction<Guest>) {
      if (!state.guests.some(guest => guest.name === action.payload.name)){
        state.guests.push(action.payload);
      }
      state.currentGuestName = action.payload.name;
    },
    removeGuest(state, action: PayloadAction<string>) {
      state.guests = state.guests.filter(
        (guest) => guest.name !== action.payload
      );
    },
    addServiceItemToGuest(
      state,
      action: PayloadAction<{ guestName: "", serviceItem: ServiceItem }>
    ) {
      const { guestName, serviceItem } = action.payload;
      const guest = state.guests.find((guest) => guest.name === guestName);
      if (guest && guest.guestServices) {
        guest.guestServices.push({ serviceItem, staff: null });
        guest.totalEstimatedTime += serviceItem.estimatedTime;
        guest.totalPrice += serviceItem.servicePrice;
      }
    },
    removeServiceItemFromGuest(
      state,
      action: PayloadAction<{ guestName: "", serviceItemId: number }>
    ) {
      const { guestName, serviceItemId } = action.payload;
      const guest = state.guests.find((guest) => guest.name === guestName);
      if (guest && guest.guestServices) {
        const serviceItem = guest.guestServices.find(
          (service) => service.serviceItem.id === serviceItemId
        );
        if (serviceItem) {
          guest.guestServices = guest.guestServices.filter(
            (service) => service.serviceItem.id !== serviceItemId
          );
          guest.totalEstimatedTime -= serviceItem.serviceItem.estimatedTime;
          guest.totalPrice -= serviceItem.serviceItem.servicePrice;
        }
      }
    },
    setIsGroupBooking(state, action: PayloadAction<boolean>) {
      state.isGroupBooking = action.payload;
    },
    setCurrentGuestName(state, action: PayloadAction<string>) {
      state.currentGuestName = action.payload;
    },
    setStaffIdForGuestServices(state, action: PayloadAction<{ staffIds: number[], allStaff: Staff[] }>) {
      const { staffIds, allStaff } = action.payload;
      for (let i = 0; i < staffIds.length; i++) {
        const guest = state.guests[i];
        if (guest?.guestServices) {
          for (let j = 0; j < guest.guestServices.length; j++) {
            const guestService = guest.guestServices[j];
        const staff = allStaff.find(staff => staff.id === staffIds[i]);
        if (staff) {
          guestService.staff = staff;
        }
          }
        }
      }
    },
    setSelectedStaffForFirstGuest(state, action: PayloadAction<Staff>) {
      // only availabe for single booking
      const guest = state.guests[0];
      if (!guest) return;
      if (guest.guestServices) {
        for (let j = 0; j < guest.guestServices.length; j++) {
          const guestService = guest.guestServices[j];
          guestService.staff = action.payload;
        }
      }
    },
  },
});

export const {
  clearCart,
  setSelectedDate,
  setSelectedHour,
  setTimeZone,
  setStoreConfig,
  addGuest,
  removeGuest,
  addServiceItemToGuest,
  removeServiceItemFromGuest,
  setIsGroupBooking,
  setCurrentGuestName,
  setStaffIdForGuestServices,
  setSelectedStaffForFirstGuest,
} = cartSlice.actions;

export const getGuests = (state: { cart: CartState }) => state.cart.guests;

// this function only works for single booking. For group booking, it will return 0 (Any staff)
export const getSelectedStaffId = (state: { cart: CartState }): number | null => {
  if (state.cart.isGroupBooking && state.cart.guests.length > 1) {
    return 0; // 'Any' staff
  }
  if (state.cart.guests.length === 0) {
    return null;
  }

  const firstGuest = state.cart.guests[0];
  if (!firstGuest?.guestServices?.[0]?.staff) {
    return null;
  }

  return firstGuest.guestServices[0].staff.id;
};

// this function only works for single booking. For group booking, it will return 0 (Any staff)
export const getSelectedStaff = (state: { cart: CartState, staff: StaffSlice }): Staff | null => {
  if (state.cart.isGroupBooking && state.cart.guests.length > 1) {
    return null; // 'Any' staff
  }
  if (state.cart.guests.length === 0) {
    return null;
  }

  const firstGuest = state.cart.guests[0];
  if (!firstGuest?.guestServices?.[0]?.staff) {
    return null;
  }

  const staffId = firstGuest.guestServices[0].staff.id;
  return getStaffById(state, staffId);
};

export default cartSlice.reducer;

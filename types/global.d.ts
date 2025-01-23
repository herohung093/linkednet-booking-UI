declare interface ServiceItem {
  id: number;
  serviceName: string;
  serviceDescription: string;
  servicePrice: number;
  estimatedTime: number;
  serviceType: ServiceType
  displayOrder: number;
  active: boolean;
}

declare interface Guest {
  id: number | null;
  name: string;
  guestServices: GuestService[] | null;
  totalPrice: number;
  totalEstimatedTime: number;
}

declare interface GuestService {
  serviceItem: ServiceItem;
  staff: Staff | null;
}

declare interface ServiceType {
  id: number;
  type: string;
  levelType: number;
  description: string;
  displayOrder: number;
  active: boolean;
}
declare interface CartItem {
  id: number;
  serviceName: string;
  serviceDescription: string;
  servicePrice: number;
  estimatedTime: number;
  serviceType: {
    id: number;
  };
  guests: Guest[];
}

declare interface Category {
  services: ServiceItem[];
}

declare interface Staff {
  id: number;
  firstName: string;
  lastName: string;
  nickname: string;
  phone: string;
  skillLevel: number;
  dateOfBirth: string;
  rate: number;
  workingDays: string;
  active: boolean;
}

declare interface CartState {
  total: number;
  totalEstimatedTime: number;
  selectedDate: string | null;
  selectedHour: string | null;
  timeZone: string | null;
  StoreConfig: StoreConfig | null;
  guests: Guest[];
  isGroupBooking: boolean | null;
  currentGuestName: string;
}
declare interface StoreConfig {
  businessHoursList: {
    id: number;
    dayOfWeek: string;
    openingTime: string;
    closingTime: string;
  }[];
  shortStoreName: string;
  storeAddress: string;
  storeEmail: string;
  storeName: string;
  storePhoneNumber: string;
  zoneId: string;
  enableInDayBooking: boolean;
  maxGuestsForGroupBooking: number;
}

declare interface StoreInfo {
  id: number;
  storeName: string;
  shortStoreName: string;
  zoneId: string;
  storeAddress: string;
  storePhoneNumber: string;
  storeEmail: string;
  instagramLink: string;
  facebookLink: string;
  businessHoursList: BusinessHours[];
  enableInDayBooking: boolean;
  maxGuestsForGroupBooking: number;
}

declare interface BusinessHours {
  id: number;
  dayOfWeek: string;
  openingTime: string;
  closingTime: string;
  dayOff: boolean;
}

declare interface StaffSlice {
  selectedStaffList: Staff[] | null;
  selectedStaffByHour: Staff | null;
  allStaff: Staff[] | null;
}

interface StoreInfoSlice {
  storeInfo: StoreInfo | null;
  serviceData: ServiceItem[] | null;
  storeUuid: string | null;
}

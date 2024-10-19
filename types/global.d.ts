declare interface NailSalonService {
  id: number;
  serviceName: string;
  serviceDescription: string;
  servicePrice: number;
  estimatedTime: number;
  serviceType: ServiceType
  active: boolean;
}

declare interface ServiceType {
  id: number;
    type: string;
    levelType: number;
    description: string;
    active: boolean
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
  quantity: 1;
}

declare interface Category {
  services: NailSalonService[];
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
  items: CartItem[];
  total: number;
  totalEstimatedTime: number;
  selectedDate: string | null;
  selectedHour: string | null;
  timeZone: string | null;
  selectedStaff: null | Staff;
  StoreConfig: StoreConfig | null;
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
}

declare interface BusinessHours {
  id: number;
  dayOfWeek: string;
  openingTime: string;
  closingTime: string;
  dayOff: boolean;
}

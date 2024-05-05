declare interface NailSalonService {
  id: number;
  serviceName: string;
  serviceDescription: string;
  servicePrice: number;
  estimatedTime: number;
  serviceType: {
    id: number;
    type: string;
    levelType: number;
    description: string;
  };
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
  quantity: 1;
}

declare interface Category {
  services: NailSalonService[];
}

declare interface Staff {
  id: number;
  firstName: string;
  lastName: string;
  nickName: string;
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
  selectedStaff: number | "" | null | Staff;
}

declare interface NailSalonService {
  serviceName: string;
  serviceDescription: string;
  servicePrice: number;
  estimatedTime: number;
  serviceType: {
    id: number;
  };
}
declare interface CartItem {
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
  category: string;
  services: NailSalonService[];
}

declare interface Staff {
  firstName: string;
  lastName: string;
  nickname: string;
  phone: string;
  skillLevel: number;
  dateOfBirth: string;
  rate: number;
  workingDays: string;
}

declare interface CartState {
  items: CartItem[];
  total: number;
  totalEstimatedTime: number;
  selectedDate: string | null;
  selectedStaff: Staff | null;
}

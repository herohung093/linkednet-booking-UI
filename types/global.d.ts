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
  quantity: 1
}


declare interface Category {
  category: string;
  services: NailSalonService[];
}

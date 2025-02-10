import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import ServiceItemCard from "@/components/ServiceItemCard";
import { User } from "lucide-react";

interface ServiceSelectionProps {
  serviceDataInfo: ServiceItem[] | null;
}

const ServiceSelection: React.FC<ServiceSelectionProps> = ({
  serviceDataInfo,
}) => {
  const [serviceTypes, setServiceTypes] = useState<ServiceType[]>([]);
  const [selectedTab, setSelectedTab] = useState(0);
  const [selectedServiceTypeServices, setSelectedServiceTypeServices] = useState<ServiceItem[]>([]);
  const currentGuestName = useSelector((state: any) => state.cart.currentGuestName);

  useEffect(() => {
    if (serviceDataInfo) {
      setServiceTypes(getUniqueServiceTypes(serviceDataInfo));
      const filteredServices = serviceDataInfo.filter(
        (service) =>
          service.serviceType.active &&
          service.serviceType.id === getUniqueServiceTypes(serviceDataInfo)[0].id
      );
      setSelectedServiceTypeServices(filteredServices);
    }
  }, [serviceDataInfo]);

  function getUniqueServiceTypes(services: ServiceItem[]): ServiceType[] {
    const serviceTypeMap = new Map<string, ServiceType>();
    services.forEach((service) => {
      if (service.active && service.serviceType.active) {
        if (!serviceTypeMap.has(String(service.serviceType.id))) {
          serviceTypeMap.set(String(service.serviceType.id), service.serviceType);
        }
      }
    });
    const serviceTypes = Array.from(serviceTypeMap.values());
    serviceTypes.sort((a, b) => a.displayOrder - b.displayOrder);
    return serviceTypes;
  }

  const handleTabChange = (index: number) => {
    const selectedServiceType = serviceTypes[index];
    setSelectedTab(index);
    const servicesFilterResults = serviceDataInfo?.filter(
      (service) => service.serviceType.id === selectedServiceType.id
    );
    setSelectedServiceTypeServices(servicesFilterResults ?? []);
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      {/* Guest Info - Different styles for mobile and desktop */}
      <div className="mb-8">
        {/* Title - Different sizes for mobile and desktop */}
        <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-4 md:mb-6">
          Select Services
        </h2>
        
        {/* Desktop version */}
        <div className="hidden md:flex items-center gap-3 p-4 bg-gray-50 rounded-xl">
          <div className="flex items-center justify-center w-10 h-10 bg-black rounded-full">
            <User className="w-5 h-5 text-white" />
          </div>
          <div>
            <span className="text-sm text-gray-500">Booking for</span>
            <h3 className="text-lg font-semibold text-gray-900">{currentGuestName}</h3>
          </div>
        </div>

        {/* Mobile version - more compact */}
        <div className="md:hidden flex items-center gap-2 px-3 py-2 bg-gray-50 rounded-lg">
          <div className="flex items-center justify-center w-8 h-8 bg-black rounded-lg">
            <User className="w-4 h-4 text-white" />
          </div>
          <div className="min-w-0">
            <div className="flex items-baseline gap-2">
              <span className="text-xs text-gray-500">Booking for</span>
              <h3 className="text-sm font-medium text-gray-900 truncate">{currentGuestName}</h3>
            </div>
          </div>
        </div>
      </div>

      {/* Service Type Tabs */}
      <div className="mb-6">
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
          {serviceTypes.map((serviceType, index) => (
            <button
              key={index}
              onClick={() => handleTabChange(index)}
              className={`
                px-4 py-2 rounded-full whitespace-nowrap transition-all
                ${selectedTab === index 
                  ? "bg-black text-white" 
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"}
              `}
            >
              {serviceType.type}
            </button>
          ))}
        </div>
      </div>

      {/* Service Items */}
      <div className="space-y-4">
        {selectedServiceTypeServices
          .sort((a, b) => a.displayOrder - b.displayOrder)
          .map((service, index) => (
            <div
              key={index}
              className="p-4 bg-white rounded-xl border border-gray-100 hover:border-gray-200 transition-all"
            >
              <ServiceItemCard service={service} />
            </div>
          ))}
      </div>
    </div>
  );
};

export default ServiceSelection;
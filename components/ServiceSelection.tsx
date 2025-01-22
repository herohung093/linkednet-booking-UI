import React, { useState, useEffect } from "react";
import { Box, Typography, Tabs, Tab, Divider, Avatar } from "@mui/material";
import ServiceItemCard from "@/components/ServiceItemCard";
import { useSelector } from "react-redux";
import PersonIcon from "@mui/icons-material/Person";

import { deepOrange } from "@mui/material/colors";

interface ServiceSelectionProps {
  serviceDataInfo: ServiceItem[] | null;
}

const ServiceSelection: React.FC<ServiceSelectionProps> = ({
  serviceDataInfo,
}) => {
  const [serviceTypes, setServiceTypes] = useState<ServiceType[]>([]);
  const [selectedTab, setSelectedTab] = useState(0);
  const [selectedServiceTypeServices, setSelectedServiceTypeServices] =
    useState<ServiceItem[]>([]);
  const currentGuestName = useSelector(
    (state: any) => state.cart.currentGuestName
  );

  useEffect(() => {
    if (serviceDataInfo) {
      setServiceTypes(getUniqueServiceTypes(serviceDataInfo));
      const filteredServices = serviceDataInfo.filter(
        (service) =>
          service.serviceType.active &&
          service.serviceType.id ===
            getUniqueServiceTypes(serviceDataInfo)[0].id
      );
      setSelectedServiceTypeServices(filteredServices);
    }
  }, [serviceDataInfo]);

  function getUniqueServiceTypes(services: ServiceItem[]): ServiceType[] {
    const serviceTypeMap = new Map<string, ServiceType>();

    services.forEach((service) => {
      if (service.active && service.serviceType.active) {
        if (!serviceTypeMap.has(String(service.serviceType.id))) {
          serviceTypeMap.set(
            String(service.serviceType.id),
            service.serviceType
          );
        }
      }
    });

    return Array.from(serviceTypeMap.values());
  }

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    const selectedServiceType = serviceTypes[newValue];
    setSelectedTab(newValue);
    const servicesFilterResults = serviceDataInfo?.filter(
      (service) => service.serviceType.id === selectedServiceType.id
    );
    setSelectedServiceTypeServices(servicesFilterResults ?? []);
  };

  return (
    <Box>
      <Typography variant="h5" fontWeight="bold" gutterBottom sx={{ mt: 2 }}>
        Select services
      </Typography>
      <Box sx={{ display: "flex", alignItems: "center", mb: 2, mt: 2 }}>
        <Avatar sx={{ marginRight: 2, bgcolor: deepOrange[300] }}>
          {currentGuestName === "Me" ? (
            currentGuestName.charAt(0)
          ) : (
            <PersonIcon />
          )}
        </Avatar>
        <Typography variant="h6">{currentGuestName}</Typography>
      </Box>

      <Tabs
        value={selectedTab}
        onChange={handleTabChange}
        aria-label="service tabs"
        variant="scrollable"
        scrollButtons="auto"
        allowScrollButtonsMobile
      >
        {serviceTypes
          .sort((a, b) => a.displayOrder - b.displayOrder)
          .map((serviceType, index) => (
            <Tab wrapped key={index} label={serviceType.type} />
          ))}
      </Tabs>
      <Divider sx={{ my: 0, borderBottomWidth: 2 }} />
      <Box mt={2}>
        {selectedServiceTypeServices
          .sort((a, b) => a.displayOrder - b.displayOrder)
          .map((service, index) => (
            <Box
              key={index}
              display="flex"
              justifyContent="space-between"
              alignItems="center"
              py={1}
              borderBottom={index < 2 ? "1px solid #e0e0e0" : "none"}
            >
              <ServiceItemCard service={service} />
            </Box>
          ))}
      </Box>
    </Box>
  );
};

export default ServiceSelection;

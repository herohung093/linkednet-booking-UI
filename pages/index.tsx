"use client";
import { CartSide } from "@/components/CartSide";
import Error from "@/components/Error";
import { StoreInfo } from "@/components/StoreInfo";
import {
  setSelectedStoreInfo,
  setServiceData,
  setStoreUuid,
} from "@/redux toolkit/storeInfo";

import axios from "@/ulti/axios";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/router";
import BookingCart from "@/components/BookingCart";
import { Box, Typography, Tabs, Tab, Divider } from "@mui/material";
import { Facebook, Instagram } from "@mui/icons-material";
import NailSalonServiceCard from "@/components/NailSalonServiceCard";

export default function Home() {
  const [serviceDataInfo, setServiceDataInfo] = useState<
    NailSalonService[] | null
  >(null);
  const [storeConfig, setStoreConfig] = useState<StoreInfo | null>(null);
  const [error, setError] = useState<unknown | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const dispatch = useDispatch();
  const urlStoreUuid = router.query;
  const [serviceTypes, setServiceTypes] = useState<ServiceType[]>([]);
  const [selectedTab, setSelectedTab] = useState(0);
  const [selectedServiceTypeServices, setSelectedServiceTypeServices] =
    useState<NailSalonService[]>([]);
  const [cartHasItem, setCartHasItem] = useState<boolean>(true);

  const bookingInfo = useSelector((state: { cart: CartState }) => state.cart);
  const cartItems = bookingInfo.items.length;
  useEffect(() => {
    setCartHasItem(cartItems !== 0);
  }, [cartItems]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const serviceResponse = await axios.get("service/", {
          headers: {
            "X-StoreID": urlStoreUuid.storeUuid,
          },
        });
        setServiceDataInfo(serviceResponse.data);
        setServiceTypes(getUniqueServiceTypes(serviceResponse.data));
        const filteredServices = serviceResponse.data.filter(
          (service: { serviceType: ServiceType }) =>
            service.serviceType.active &&
            service.serviceType.id ===
              getUniqueServiceTypes(serviceResponse.data)[0].id
        );
        setSelectedServiceTypeServices(filteredServices);

        const storeConfigResponse = await axios.get(
          "storeConfig/" + urlStoreUuid.storeUuid,
          {
            headers: {
              "X-StoreID": urlStoreUuid.storeUuid,
            },
          }
        );
        setStoreConfig(storeConfigResponse.data);

        setIsLoading(false);
      } catch (error: unknown) {
        setError(error);
        setIsLoading(false);
      }
    };

    if (urlStoreUuid.storeUuid) {
      dispatch(setStoreUuid(urlStoreUuid.storeUuid as string));
      fetchData();
    }
  }, [urlStoreUuid]);

  useEffect(() => {
    dispatch(setSelectedStoreInfo(storeConfig));
    dispatch(setServiceData(serviceDataInfo));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [storeConfig]);

  function getUniqueServiceTypes(services: NailSalonService[]): ServiceType[] {
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

  if (error) return <Error />;

  return (
    <Box>
      <Box display="flex" minHeight="100vh" bgcolor="#FFFFFF" p={1.5}>
        <Box flex={{ xs: 10, lg: 1 }} overflow="auto">
          <StoreInfo storeConfig={storeConfig} />

          <Typography variant="h5" fontWeight="bold" gutterBottom>
            Services
          </Typography>

          <Tabs
            value={selectedTab}
            onChange={handleTabChange}
            aria-label="service tabs"
            variant="scrollable"
            scrollButtons="auto"
            allowScrollButtonsMobile
          >
            {serviceTypes.map((serviceType, index) => (
              <Tab wrapped key={index} label={serviceType.type} />
            ))}
          </Tabs>
          <Divider sx={{ my: 0, borderBottomWidth: 2 }} />
          <Box mt={2}>
            {selectedServiceTypeServices.map((service, index) => (
              <Box
                key={index}
                display="flex"
                justifyContent="space-between"
                alignItems="center"
                py={1}
                borderBottom={index < 2 ? "1px solid #e0e0e0" : "none"}
              >
                <NailSalonServiceCard service={service} />
              </Box>
            ))}
          </Box>

          <Divider sx={{ my: 3 }} />

          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            py={2}
            px={5}
          >
            <Typography variant="body2" color="textSecondary">
              Privacy Policy
            </Typography>
            <Typography variant="body2" color="textSecondary">
              Terms of Service
            </Typography>
          </Box>

          <Box display="flex" justifyContent="center" gap={2} mb={3}>
            {storeConfig?.facebookLink && (
              <a
                href={storeConfig.facebookLink}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Facebook sx={{ color: '#1877F2', fontSize: 30 }} />
              </a>
            )}
            {storeConfig?.instagramLink && (
              <a
                href={storeConfig!.instagramLink}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Instagram  sx={{ color: '#E1306C', fontSize: 30 }}/>
              </a>
            )}
          </Box>

          <Typography variant="body2" color="textSecondary" align="center">
            © 2023 Service Booking App. All rights reserved.
          </Typography>
        </Box>

        <Box
          flex={{ xs: 0, md: 1 }}
          ml={{ xs: 0, md: 3 }}
          className="mt-20 top-20"
          sx={{ display: { xs: "none", md: "none", lg: "block" } }}
        >
          <CartSide disableContinueButton={false} />
        </Box>
      </Box>
      <Box sx={{ display: { xs: "block", md: "block", lg: "none" } }}>
        {cartHasItem && <BookingCart disableContinueButton={!cartHasItem} />}
      </Box>
    </Box>
  );
}

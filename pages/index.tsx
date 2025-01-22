"use client";
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
import { Box, Typography, Divider, Dialog, DialogContent } from "@mui/material";
import { Facebook, Instagram } from "@mui/icons-material";
import ServiceSelection from "@/components/ServiceSelection";
import BookingTypeSelection from "@/components/BookingTypeSelection";
import { addGuest, setCurrentGuestName, setIsGroupBooking } from "@/redux toolkit/cartSlice";

export default function Home() {
  const [serviceDataInfo, setServiceDataInfo] = useState<
    ServiceItem[] | null
  >(null);
  const [storeConfig, setStoreConfig] = useState<StoreInfo | null>(null);
  const [error, setError] = useState<unknown | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const dispatch = useDispatch();
  const urlStoreUuid = router.query;
  
  const bookingInfo = useSelector((state: { cart: CartState }) => state.cart);
  const [openDialog, setOpenDialog] = useState(bookingInfo.isGroupBooking === null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const serviceResponse = await axios.get("service/active", {
          headers: {
            "X-StoreID": urlStoreUuid.storeUuid,
          },
        });
        setServiceDataInfo(serviceResponse.data);

        const storeConfigResponse = await axios.get(
          "storeConfig/" + urlStoreUuid.storeUuid,
          {
            headers: {
              "X-StoreID": urlStoreUuid.storeUuid,
            },
          }
        );
        setStoreConfig(storeConfigResponse.data);

        // If maxGuestsForGroupBooking is 1, add a guest named "Me" and set isGroupBooking to false
        // No need to display the booking type selection dialog
        if (storeConfigResponse.data.maxGuestsForGroupBooking == 1) {
          if (!bookingInfo.guests.some(guest => guest.name === "Me")) {
            dispatch(
              addGuest({
                id: null,
                name: "Me",
                guestServices: [],
                totalPrice: 0,
                totalEstimatedTime: 0,
              })
            );
            dispatch(setIsGroupBooking(false));
            dispatch(setCurrentGuestName("Me"));
          }
              setOpenDialog(false);
        }

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

  const handleCloseModal = (event: object, reason: string) => {
    if (reason !== "backdropClick") {
      setOpenDialog(false);
    }
  };

  const handleBookingTypeSelectionClose = () => {
    setOpenDialog(false);
  };

  if (error) return <Error />;

  return (
    <Box>
      <Dialog 
        open={openDialog} 
        onClose={handleCloseModal} 
        disableEscapeKeyDown
      >
        <DialogContent>
          <Box
            display="flex"
            flexDirection="column"
            alignItems="center"
            justifyContent="center"
            height="50vh"
            bgcolor="background.paper"
            p={4}
          >
            <BookingTypeSelection onClose={handleBookingTypeSelectionClose} />
          </Box>
        </DialogContent>
      </Dialog>
      <Box display="flex" minHeight="100vh" bgcolor="#FFFFFF" p={1.5}>
        <Box flex={{ xs: 10, lg: 1 }} overflow="auto">
          <StoreInfo storeConfig={storeConfig} />

          <ServiceSelection
            serviceDataInfo={serviceDataInfo}
          />

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
                <Facebook sx={{ color: "#1877F2", fontSize: 30 }} />
              </a>
            )}
            {storeConfig?.instagramLink && (
              <a
                href={storeConfig!.instagramLink}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Instagram sx={{ color: "#E1306C", fontSize: 30 }} />
              </a>
            )}
          </Box>

          <Typography variant="body2" color="textSecondary" align="center">
            © 2023 Service Booking App. All rights reserved.
          </Typography>
        </Box>
      </Box>
    </Box>
  );
}

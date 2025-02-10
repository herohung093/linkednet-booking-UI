"use client";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/router";
import Link from "next/link";
import {
  Box,
  Typography,
  Divider,
  Dialog,
  DialogContent,
  Container,
} from "@mui/material";
import { Facebook, Instagram } from "@mui/icons-material";

// Components
import Error from "@/components/Error";
import { StoreInfo } from "@/components/StoreInfo";
import ServiceSelection from "@/components/ServiceSelection";
import BookingTypeSelection from "@/components/BookingTypeSelection";

// Redux actions
import {
  setSelectedStoreInfo,
  setServiceData,
  setStoreUuid,
} from "@/redux toolkit/storeInfo";
import {
  addGuest,
  setCurrentGuestName,
  setIsGroupBooking,
} from "@/redux toolkit/cartSlice";

// Utils
import axios from "@/ulti/axios";

export default function Home() {
  // State
  const [error, setError] = useState<unknown | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  // Hooks
  const router = useRouter();
  const dispatch = useDispatch();
  const urlStoreUuid = router.query;

  // Selectors
  const bookingInfo = useSelector((state: { cart: CartState }) => state.cart);
  const serviceDataInfo = useSelector(
    (state: { storeInfo: StoreInfoSlice }) => state.storeInfo.serviceData
  );
  const storeConfig = useSelector(
    (state: { storeInfo: StoreInfoSlice }) => state.storeInfo.storeInfo
  );

  // Dialog state
  const [openDialog, setOpenDialog] = useState(bookingInfo.isGroupBooking === null);

  // Effects
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch service data if not available
        if (!serviceDataInfo || serviceDataInfo.length === 0) {
          const serviceResponse = await axios.get("service/active", {
            headers: { "X-StoreID": urlStoreUuid.storeUuid },
          });
          dispatch(setServiceData(serviceResponse.data));
        }

        // Fetch store config if not available
        if (!storeConfig) {
          const storeConfigResponse = await axios.get(
            "storeConfig/" + urlStoreUuid.storeUuid,
            {
              headers: { "X-StoreID": urlStoreUuid.storeUuid },
            }
          );
          dispatch(setSelectedStoreInfo(storeConfigResponse.data));
        }

        // Handle single guest booking
        if (storeConfig?.maxGuestsForGroupBooking === 1) {
          if (!bookingInfo.guests.some((guest) => guest.name === "Me")) {
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
  }, [urlStoreUuid, storeConfig, serviceDataInfo]);

  // Handlers
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
    <Container maxWidth="lg">
      {/* Booking Type Dialog */}
      <Dialog 
        open={openDialog} 
        onClose={handleCloseModal} 
        disableEscapeKeyDown
        PaperProps={{
          sx: {
            borderRadius: 3,
            width: '100%',
            maxWidth: '440px',
            margin: '16px'
          }
        }}
      >
        <DialogContent sx={{ p: 0 }}>
          <BookingTypeSelection onClose={handleBookingTypeSelectionClose} />
        </DialogContent>
      </Dialog>

      {/* Main Content */}
      <Box display="flex" minHeight="100vh" bgcolor="#FFFFFF" p={1.5}>
        <Box flex={{ xs: 10, lg: 1 }} overflow="auto">
          {/* Store Info Section */}
          <StoreInfo storeConfig={storeConfig} />

          {/* Service Selection Section */}
          <ServiceSelection serviceDataInfo={serviceDataInfo} />

          <Divider sx={{ my: 3 }} />

          {/* Footer Section */}
          <Box component="footer">
            {/* Links */}
            <Box
              display="flex"
              justifyContent="space-between"
              alignItems="center"
              py={2}
              px={5}
            >
              <Link href="/privacy">
                <Typography variant="body2" color="textSecondary">
                  Privacy Policy
                </Typography>
              </Link>
              <Link href="/terms-of-service">
                <Typography variant="body2" color="textSecondary">
                  Terms of Service
                </Typography>
              </Link>
            </Box>

            {/* Social Media Links */}
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
                  href={storeConfig.instagramLink}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Instagram sx={{ color: "#E1306C", fontSize: 30 }} />
                </a>
              )}
            </Box>

            {/* Copyright */}
            <Typography 
              variant="body2" 
              color="textSecondary" 
              align="center"
              pb={2}
            >
              © {new Date().getFullYear()} Service Booking App. All rights reserved.
            </Typography>
          </Box>
        </Box>
      </Box>
    </Container>
  );
}
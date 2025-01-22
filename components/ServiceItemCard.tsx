"use client";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import "@radix-ui/themes/styles.css";
import { Spinner } from "@radix-ui/themes";
import { Box, Button, Typography } from "@mui/material";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import {
  addServiceItemToGuest,
  removeServiceItemFromGuest,
} from "@/redux toolkit/cartSlice";

interface ServiceItemCardProps {
  service: ServiceItem;
}

const ServiceItemCard = ({ service }: ServiceItemCardProps) => {
  const {
    id,
    serviceType,
    serviceName,
    estimatedTime,
    servicePrice,
    serviceDescription,
  } = service;

  const dispatch = useDispatch();
  const guests = useSelector((state: any) => state.cart.guests);
  const currentGuestName = useSelector((state: any) => state.cart.currentGuestName);

  const guest = guests.find((guest: any) => guest.name === currentGuestName);
  const isServiceInCart: boolean = guest?.guestServices.some(
    (guestService: any) => guestService.serviceItem.id === id
  );

  const handleClickAdd = () => {
    dispatch(
      addServiceItemToGuest({
        guestName: currentGuestName,
        serviceItem: service,
      })
    );
  };

  const handleClickRemove = () => {
    dispatch(
      removeServiceItemFromGuest({
        guestName: currentGuestName,
        serviceItemId: id,
      })
    );
  };

  return (
    <div className="w-full ">
      {!service ? (
        <Spinner />
      ) : (
        <>
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            py={0}
          >
            <Box>
              <Typography variant="body1" fontWeight="medium">
                {service.serviceName}
              </Typography>
              <Typography variant="body2" color="textSecondary">
                Est Time: {service.estimatedTime} mins
              </Typography>
              <Typography variant="body2" color="textSecondary">
                ${service.servicePrice}
              </Typography>
            </Box>
            <Box display="flex" justifyContent="flex-end">
              {!isServiceInCart ? (
                <Button
                  variant="contained"
                  color="inherit"
                  className="rounded-full truncate"
                  onClick={handleClickAdd}
                >
                  Select
                </Button>
              ) : (
                <Button
                  variant="contained"
                  color="inherit"
                  className="rounded-full truncate"
                  onClick={handleClickRemove}
                >
                  <DeleteOutlineOutlinedIcon sx={{ color: "black" }} />
                </Button>
              )}
            </Box>
          </Box>
        </>
      )}
    </div>
  );
};

export default ServiceItemCard;

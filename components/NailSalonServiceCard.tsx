"use client";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { addToCart, removeFromCart } from "@/redux toolkit/cartSlice";
import "@radix-ui/themes/styles.css";
import { Spinner } from "@radix-ui/themes";
import { Box, Button, Typography } from "@mui/material";
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';



const NailSalonServiceCard = ({ service }: { service: NailSalonService }) => {
  const {
    id,
    serviceType,
    serviceName,
    estimatedTime,
    servicePrice,
    serviceDescription,
  } = service;

  const dispatch = useDispatch();
  const cartItems = useSelector((state: any) => state.cart.items);

  const isServiceInCart: boolean | null = cartItems?.some(
    (item: any) => item.id === id
  );

  const handleClickAdd = () => {
    dispatch(
      addToCart({
        id: id,
        serviceType: serviceType,
        serviceName: serviceName,
        serviceDescription: serviceDescription,
        estimatedTime: estimatedTime,
        servicePrice: servicePrice,
        quantity: 1,
      })
    );
  };

  const handleClickRemove = () => {
    dispatch(
      removeFromCart({
        id: id,
        estimatedTime: estimatedTime,
        servicePrice: servicePrice,
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
                <Button variant="contained" color="inherit" className="rounded-full truncate" onClick={handleClickAdd}>
                  Select
                </Button>
              ) : (
                <Button variant="contained" color="inherit" className="rounded-full truncate" onClick={handleClickRemove}>
                  <DeleteOutlineOutlinedIcon sx={{ color: 'black' }} />
                </Button>
              )}
            </Box>
          </Box>
        </>
      )}
    </div>
  );
};

export default NailSalonServiceCard;

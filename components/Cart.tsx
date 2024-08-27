"use client";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { removeFromCart } from "@/redux toolkit/cartSlice";
import { Box, Typography, IconButton, List, ListItem, ListItemAvatar, ListItemText, Avatar } from '@mui/material';
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import moment from "moment";
import { RootState } from "@/redux toolkit/store";

const Cart: React.FC = () => {
  const cartRedux = useSelector((state: any) => state.cart);
  const dispatch = useDispatch();

  const staffRedux = useSelector((state: RootState) => state.cart.selectedStaff);

  const [selectedStaff, setSelectedStaff] = useState(staffRedux);
  const [selectedHour, setSelectedHour] = useState<string>(cartRedux.selectedHour);
  const [selectedDate, setSelectedDate] = useState<string>(cartRedux.selectedDate);
  const [cartItems, setCartItems] = useState<CartItem[]>(cartRedux.items);
  const [totalPrice, setTotalPrice] = useState<number>(cartRedux.total);
  const [totalEstimatedTime, setTotalEstimatedTime] = useState<number>(
    cartRedux.totalEstimatedTime
  );

  useEffect(() => {
    setCartItems(cartRedux.items);
    setTotalPrice(cartRedux.total);
    setTotalEstimatedTime(cartRedux.totalEstimatedTime);
    setSelectedStaff(staffRedux);
    setSelectedHour(cartRedux.selectedHour);
    setSelectedDate(cartRedux.selectedDate);
  }, [cartRedux.items, cartRedux.total, cartRedux.totalEstimatedTime, staffRedux, cartRedux.selectedHour, cartRedux.selectedDate]);

  const handleRemoveFromCart = (
    id: number,
    servicePrice: number,
    estimatedTime: number
  ) => {
    dispatch(
      removeFromCart({
        id: id,
        servicePrice: servicePrice,
        estimatedTime: estimatedTime,
      })
    );
  };

  const formatDate = (): string => {
    return moment(selectedDate, 'DD/MM/YYYY').format('DD MMM YYYY');
  }
  const dateString = selectedDate;
  const formattedDate: string = moment(dateString, 'DD/MM/YYYY').format('DD MMM YYYY');

  return (
    <Box maxWidth="400px" margin="0 auto">
      <List>
        {cartItems.map((item) => (
          <ListItem
            key={item.id}
            secondaryAction={
              <IconButton edge="end" onClick={() => handleRemoveFromCart(item.id, item.servicePrice, item.estimatedTime)}>
                <DeleteOutlineOutlinedIcon sx={{ color: 'black' }} />
              </IconButton>
            }
          >
            <ListItemAvatar>
              <Avatar>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48"><path d="M40 27.28A3 3 0 0 0 37 24h-2a3 3 0 0 0-3 3c0 .56.1 0-.94 1.05-.38.37 1-3.95-3.06-6.77A3 3 0 0 0 25 18h-2a3 3 0 0 0-3 3.28c-3.47 2.41-3 5.75-3 8.83a6.68 6.68 0 0 0-1-.83A3 3 0 0 0 13 26h-2a3 3 0 0 0-3 3c0 .56.1 0-.94 1.05A6.89 6.89 0 0 0 5 35v12a1 1 0 0 0 2 0c0-12.66-.33-13.19 1-15v1a4 4 0 0 0 8 0v-1c1.33 1.78 1 2.1 1 15a1 1 0 0 0 2 0c0-22.08-.34-21.19 1-23v1a4 4 0 0 0 8 0v-1c1.34 1.79 1 .94 1 23a1 1 0 0 0 2 0c0-15.19-.33-15.19 1-17v1a4 4 0 0 0 8 0v-1c1.33 1.78 1 1.81 1 17a1 1 0 0 0 2 0V33a7 7 0 0 0-3-5.72zM14 33a2 2 0 0 1-4 0v-4a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1zm12-8a2 2 0 0 1-4 0v-4a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1zm12 6a2 2 0 0 1-4 0v-4a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1zM44 0H33a2 2 0 0 0-2 2v1H21c0-1-.73-1-3.52-1.66A2 2 0 0 0 15 3.28v1.44a2 2 0 0 0 .77 1.58c.93.72 1.46.42 4.47-.33A1 1 0 0 0 21 5h10v1a2 2 0 0 0 2 2h11a4 4 0 0 0 0-8zM19 4.22l-2 .5V3.28l2 .5zM33 2h2v4h-2zm11 4h-7V2h7a2 2 0 0 1 0 4zM11 13h1v1a1 1 0 0 0 2 0v-1h1a1 1 0 0 0 0-2h-1v-1a1 1 0 0 0-2 0v1h-1a1 1 0 0 0 0 2zM31 13v1h-1a1 1 0 0 0 0 2h1v1a1 1 0 0 0 2 0v-1h1a1 1 0 0 0 0-2h-1v-1a1 1 0 0 0-2 0zM45 20h-1v-1a1 1 0 0 0-2 0v1h-1a1 1 0 0 0 0 2h1v1a1 1 0 0 0 2 0v-1h1a1 1 0 0 0 0-2zM5 23a1 1 0 0 0 0-2H4v-1a1 1 0 0 0-2 0v1H1a1 1 0 0 0 0 2h1v1a1 1 0 0 0 2 0v-1z" /><path d="M25 40a1 1 0 0 0 0-2h-2a1 1 0 0 0 0 2zM26 42h-4a1 1 0 0 0 0 2h4a1 1 0 0 0 0-2zM37 42a1 1 0 0 0 0-2h-2a1 1 0 0 0 0 2zM38 44h-4a1 1 0 0 0 0 2h4a1 1 0 0 0 0-2zM13 44a1 1 0 0 0 0-2h-2a1 1 0 0 0 0 2zM14 46h-4a1 1 0 0 0 0 2h4a1 1 0 0 0 0-2z" /></svg>
              </Avatar>
            </ListItemAvatar>
            <ListItemText
              primary={item.serviceName}
              secondary={`$${item.servicePrice.toFixed(2)}`}
            />
          </ListItem>
        ))}
      </List>

      <Box display="flex" justifyContent="space-between" mt={4}>
        <Typography color="text.secondary" mr={3}>Total Price:</Typography>
        <Typography color="text.secondary" >${totalPrice.toFixed(2)}</Typography>
      </Box>
      <Box display="flex" justifyContent="space-between">
        <Typography color="text.secondary" mr={3}>Total EST: </Typography>
        <Typography color="text.secondary">{totalEstimatedTime} minutes</Typography>
      </Box>
      <Box display="flex" justifyContent="space-between">
        <Typography color="text.secondary" mr={3}>Staff: </Typography>
        {selectedStaff && <Typography color="text.secondary" >{selectedStaff?.nickname}</Typography>}
      </Box>
      <Box display="flex" justifyContent="space-between">
        <Typography color="text.secondary" mr={3}>Time: </Typography>
        {selectedDate && <div style={{ display: 'flex', alignItems: 'center' }}>
          <span style={{ marginRight: selectedHour ? '8px' : undefined  }}><Typography color="text.secondary">{formatDate()}</Typography></span>
          {selectedHour && <span><Typography color="text.secondary">at {selectedHour}</Typography></span>}
        </div>}
      </Box>
    </Box>
  );
};

export default Cart;

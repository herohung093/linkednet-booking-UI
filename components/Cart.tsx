"use client";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import {
  Box,
  Typography,
  List,
  ListItem,
  ListItemText,
  Divider,
  Button,
} from "@mui/material";
import moment from "moment";
import { RootState } from "@/redux toolkit/store";

interface CartProps {
  onContinue?: () => void;
  disableContinueButton?: boolean;
}

const Cart: React.FC<CartProps> = ({ onContinue, disableContinueButton }) => {
  const cartRedux = useSelector((state: RootState) => state.cart);

  const [guests, setGuests] = useState(cartRedux.guests);
  const [selectedDate, setSelectedDate] = useState<string | null>(
    cartRedux.selectedDate
  );
  const [selectedHour, setSelectedHour] = useState<string | null>(
    cartRedux.selectedHour
  );
  const totalPrice = guests.reduce((sum, guest) => sum + guest.totalPrice, 0);

  useEffect(() => {
    setGuests(cartRedux.guests);
    setSelectedDate(cartRedux.selectedDate);
    setSelectedHour(cartRedux.selectedHour);
  }, [cartRedux.guests, cartRedux.selectedDate, cartRedux.selectedHour]);

  const formatDate = (): string => {
    return selectedDate
      ? moment(selectedDate, "DD/MM/YYYY").format("DD MMM YYYY")
      : "";
  };

  return (
    <Box display="flex" flexDirection="column" height="100%">
      <Box flexGrow={1}>
        <Box maxWidth="600px" margin="0 auto" p={1}>
          {guests.map((guest) => (
            <Box key={guest.name + guest.id} mb={4}>
              {/* Guest Header */}
              <Box
                display="flex"
                justifyContent="space-between"
                alignItems="center"
              >
                <Typography variant="h6">
                  {guest.name || "Guest"} - {guest.totalEstimatedTime} mins
                </Typography>
              </Box>

              <List>
                {/* Guest Services */}
                {guest.guestServices?.map((guestService) => (
                  <React.Fragment key={guest.name + guestService.serviceItem.id}>
                    <ListItem>
                      <ListItemText
                        primary={
                          <Box
                            display="flex"
                            justifyContent="space-between"
                            width="100%"
                          >
                            <Typography variant="body2">
                              {guestService.serviceItem.serviceName}
                            </Typography>
                            <Typography variant="caption">
                              ${guestService.serviceItem.servicePrice.toFixed(2)}
                            </Typography>
                          </Box>
                        }
                      />
                    </ListItem>

                    {guestService.staff && (
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        ml={7} // Align with text offset
                      >
                        Staff: { guestService.staff.nickname}
                      </Typography>
                    )}
                  </React.Fragment>
                ))}
              </List>
              <Divider sx={{ my: 1 }} />
            </Box>
          ))}
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            mt={2}
          >
            <Typography variant="h6" color="text.primary">
              Total
            </Typography>
            <Typography variant="h6" color="text.primary">
              A ${totalPrice.toFixed(2)}
            </Typography>
          </Box>
          {/* Booking Details */}
          <Box mt={4}>
            <Box display="flex" justifyContent="space-between" mb={1}>
              <Typography color="text.secondary">Date:</Typography>
              <Typography color="text.secondary">
                {formatDate() || " Not Selected"}
              </Typography>
            </Box>
            <Box display="flex" justifyContent="space-between">
              <Typography color="text.secondary">Time:</Typography>
              <Typography color="text.secondary">
                {selectedHour || "Not Selected"}
              </Typography>
            </Box>
          </Box>
        </Box>
      </Box>
      {onContinue && (
        <Box p={2} display={'flex'} justifyContent={'center'}>
          <Button
            disabled={disableContinueButton}
            onClick={onContinue}
            style={{
              backgroundColor: disableContinueButton ? "gray" : "black",
              color: "white",
              padding: "0.5rem 1rem",
              borderRadius: "20px",
              border: "none",
              cursor: disableContinueButton ? "not-allowed" : "pointer",
              minWidth: "15rem",
            }}
          >
            Continue
          </Button>
        </Box>
      )}
    </Box>
  );
};

export default Cart;

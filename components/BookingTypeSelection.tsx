import React, { useState } from "react";
import { Box, Button, Typography } from "@mui/material";
import { useDispatch } from "react-redux";
import {
  addGuest,
  setCurrentGuestName,
  setIsGroupBooking,
} from "@/redux toolkit/cartSlice";
import { getGuests } from "@/redux toolkit/cartSlice";
import { useSelector } from "react-redux";
import PersonIcon from "@mui/icons-material/Person";
import GroupsIcon from "@mui/icons-material/Groups";

interface BookingTypeSelectionProps {
  onClose: () => void;
}

const BookingTypeSelection: React.FC<BookingTypeSelectionProps> = ({
  onClose,
}) => {
  const [bookingType, setBookingType] = useState<string | null>(null);

  const dispatch = useDispatch();
  const guests = useSelector(getGuests);

  const handleClick = (type: string) => {
    setBookingType(type);
    const guestName = guests.length === 0 ? "Me" : `Guest ${guests.length + 1}`;
    dispatch(
      addGuest({
        id: null,
        name: guestName,
        guestServices: [],
        totalPrice: 0,
        totalEstimatedTime: 0,
      })
    );
    dispatch(setIsGroupBooking(type === "selfAndOthers"));
    dispatch(setCurrentGuestName(guestName));
    onClose();
  };

  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      height="100vh"
    >
      <Typography variant="h4" gutterBottom>
        Who is this booking for?
      </Typography>
      <Box display="flex" flexDirection="column" alignItems="center" mt={2}>
        <Button
          variant={bookingType === "self" ? "contained" : "outlined"}
          color="primary"
          onClick={() => handleClick("self")}
          style={{ marginBottom: "20px", width: "200px" }}
        >
          <PersonIcon style={{ marginRight: "8px" }} />
          For Myself
        </Button>
        <Button
          variant={bookingType === "selfAndOthers" ? "contained" : "outlined"}
          color="primary"
          onClick={() => handleClick("selfAndOthers")}
          style={{ marginBottom: "20px", width: "200px" }}
        >
          <GroupsIcon style={{ marginRight: "8px" }} />
          For Myself and Others
        </Button>
      </Box>
    </Box>
  );
};

export default BookingTypeSelection;

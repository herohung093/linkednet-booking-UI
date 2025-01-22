import { useDispatch, useSelector } from "react-redux";
import {
  Box,
  Button,
  Card,
  IconButton,
  Menu,
  MenuItem,
  Typography,
  Avatar,
} from "@mui/material";
import {
  MoreVert as MoreVertIcon,
  Person as PersonIcon,
} from "@mui/icons-material";
import { deepOrange, blueGrey } from "@mui/material/colors";
import { useState } from "react";
import {
  addGuest,
  getGuests,
  removeGuest,
  setCurrentGuestName,
} from "@/redux toolkit/cartSlice";
import { RootState } from "@/redux toolkit/store";
import { useRouter } from "next/router";

const AddGuestPage = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const guests = useSelector(getGuests);
  const storeConfig = useSelector((state: RootState) => state.storeInfo);
  const currentGuestName = useSelector(
    (state: RootState) => state.cart.currentGuestName
  );
  const maxGuests = storeConfig?.storeInfo?.maxGuestsForGroupBooking || 0;

  const [menuAnchorEl, setMenuAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedGuest, setSelectedGuest] = useState<number | null>(null);

  const handleAddGuest = () => {
    const newGuest = {
      id: null,
      name: `Guest ${guests.length + 1}`,
      guestServices: [],
      totalPrice: 0,
      totalEstimatedTime: 0,
    };
    dispatch(addGuest(newGuest));
    dispatch(setCurrentGuestName(newGuest.name));
    router.push("/?storeUuid=" + storeConfig.storeUuid);
  };

  const handleMenuOpen = (
    event: React.MouseEvent<HTMLElement>,
    guestIndex: number
  ) => {
    setMenuAnchorEl(event.currentTarget);
    setSelectedGuest(guestIndex);
  };

  const handleMenuClose = () => {
    setMenuAnchorEl(null);
    setSelectedGuest(null);
  };

  const handleRemoveGuest = (guestName: string) => {
    dispatch(removeGuest(guestName));
    if (currentGuestName === guestName) {
      const nextGuest = guests.find(
        (guest) => guest.name !== guestName && guest.name !== "Me"
      );
      if (nextGuest) {
        dispatch(setCurrentGuestName(nextGuest.name));
      } else {
        dispatch(setCurrentGuestName("Me"));
      }
    }
    handleMenuClose();
  };

  const handleEditGuest = (guestName: string) => {
    dispatch(setCurrentGuestName(guestName));
    router.push("/?storeUuid=" + storeConfig.storeUuid);
  };

  return (
    <Box p={2}>
      <Typography variant="h4" gutterBottom>
        Add guests and services
      </Typography>
      <Typography variant="body1" gutterBottom sx={{ color: "text.secondary" }}>
        Book a group appointment for up to {maxGuests} guests
      </Typography>
      <Box display="flex" flexDirection="column" gap={2} sx={{ marginTop: 4 }}>
        {guests.map((guest, index) => (
          <Card
            key={index}
            variant="outlined"
            sx={{
              display: "flex",
              alignItems: "center",
              padding: 2,
              borderRadius: 2,
              maxWidth: 500,
            }}
          >
            <Avatar
              sx={{
                width: 56,
                height: 56,
                marginRight: 2,
                bgcolor: deepOrange[300],
              }}
            >
              {guest.name === "Me" ? guest.name.charAt(0) : <PersonIcon />}
            </Avatar>
            <Box flexGrow={1}>
              <Typography variant="h6">{guest.name}</Typography>
              <Typography variant="body2">
                {guest.guestServices?.length}{" "}
                {guest.guestServices?.length === 1 ? "service" : "services"}
              </Typography>
            </Box>
            <IconButton
              onClick={(event) => handleMenuOpen(event, index)}
              aria-controls={menuAnchorEl ? "guest-options-menu" : undefined}
              aria-haspopup="true"
              aria-expanded={menuAnchorEl ? "true" : undefined}
            >
              <MoreVertIcon />
            </IconButton>
            {selectedGuest === index && (
              <Menu
                id="guest-options-menu"
                anchorEl={menuAnchorEl}
                open={Boolean(menuAnchorEl)}
                onClose={handleMenuClose}
              >
                <MenuItem onClick={() => handleEditGuest(guest.name)}>
                  Edit Guest
                </MenuItem>
                {guest.name !== "Me" && (
                  <MenuItem onClick={() => handleRemoveGuest(guest.name)}>
                    Remove Guest
                  </MenuItem>
                )}
              </Menu>
            )}
          </Card>
        ))}
      </Box>
      {guests.length < maxGuests && (
        <Box mt={2}>
          <Button
            variant="outlined"
            onClick={handleAddGuest}
            sx={{
              borderRadius: 2,
              borderColor: "black",
              color: "black",
              backgroundColor: "white",
              "&:hover": {
                backgroundColor: blueGrey[50],
                borderColor: "black",
              },
            }}
          >
            + Add guest
          </Button>
        </Box>
      )}
    </Box>
  );
};

export default AddGuestPage;

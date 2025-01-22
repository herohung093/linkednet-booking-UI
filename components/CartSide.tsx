import React, { useState } from "react";
import Cart from "./Cart";
import { useRouter } from "next/router";
import { useSelector } from "react-redux";
import { RootState } from "@/redux toolkit/store";
import { Button, Box } from "@mui/material";

interface CartSideProps {
  disableContinueButton: boolean;
}

export const CartSide: React.FC<CartSideProps> = ({
  disableContinueButton,
}) => {
  const router = useRouter();
  const slug = router.route;
  const storeInfo = useSelector((state: RootState) => state.storeInfo);
  const cart = useSelector((state: any) => state.cart);
  const selectedHour = useSelector((state: any) => state.cart.selectedHour);
  const [showDialog, setShowDialog] = useState(false);
  const [dialogMessage, setDialogMessage] = useState("");

  const currentGuestName = (cart as CartState).currentGuestName;
  const maxGuestsForGroupBooking =
    storeInfo.storeInfo?.maxGuestsForGroupBooking ?? 1;
  const currentGuestHasSelectedItem = (cart as CartState).guests.some(
    (guest) =>
      (guest.guestServices?.length ?? 0) > 0 && guest.name === currentGuestName
  );
  const allGuestsHaveSelectedServices = (cart as CartState).guests.every(
    (guest) => guest.guestServices && guest.guestServices.length > 0
  );

  const handleRoute = () => {
    switch (slug) {
      case "/":
        if (
          cart.guests.length > 0 &&
          currentGuestHasSelectedItem &&
          cart.guests.length < maxGuestsForGroupBooking &&
          cart.isGroupBooking
        ) {
          router.push("/add-guests/?storeUuid=" + storeInfo.storeUuid);
        } else if (cart.guests.length > 0 && allGuestsHaveSelectedServices) {
          router.push("/staff/?storeUuid=" + storeInfo.storeUuid);
        } else if (cart.guests.length > 0 && !currentGuestHasSelectedItem) {
          setDialogMessage("Please select a service");
          setShowDialog(true);
        }
        break;
      case "/staff":
        router.push("/time/?storeUuid=" + storeInfo.storeUuid);
        break;
      case "/time":
        if (selectedHour) {
          router.push("/confirmation/?storeUuid=" + storeInfo.storeUuid);
        } else {
          setDialogMessage("Please select a time");
          setShowDialog(true);
        }
        break;
      case "/add-guests":
        if (cart.guests.length > 0 && allGuestsHaveSelectedServices) {
          router.push("/staff/?storeUuid=" + storeInfo.storeUuid);
        }
        break;
      default:
        router.push("/?storeUuid=" + storeInfo.storeUuid);
    }
  };

  const closeDialog = () => {
    setShowDialog(false);
  };
  return (
    <Box className="hidden lg:flex lg:flex-col lg:border-2 lg:rounded-lg p-5 h-[600px] w-[300px] xl:w-[350px]">
      <div className="flex-grow">
        <Cart
          onContinue={handleRoute}
          disableContinueButton={disableContinueButton}
        />
      </div>
      {showDialog && (
        <div className="fixed top-0 left-0 w-screen h-screen z-[9]">
          <div className="fixed top-0 left-0 w-screen h-screen bg-slate-600 opacity-55 z-[9]"></div>
          <div className="fixed top-20 left-0 w-full h-full flex items-center justify-center z-[10]">
            <div className="bg-white border border-gray-200 rounded p-6 shadow-md flex flex-col">
              <p className="mb-6 text-lg z-[99]]">{dialogMessage}</p>
              <Button
                variant="contained" // Use 'contained' to have a solid background color
                className="mt-4 px-4 py-2 w-full"
                onClick={closeDialog}
                size="large"
                sx={{
                  backgroundColor: "black",
                  color: "white",
                  borderRadius: "20px",
                  textTransform: "none", // Keep the text casing as it is
                  "&:hover": {
                    backgroundColor: "black", // Keep the same background color on hover
                  },
                }}
              >
                Ok
              </Button>
            </div>
          </div>
        </div>
      )}
    </Box>
  );
};

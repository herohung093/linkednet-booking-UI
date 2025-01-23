import React, { useState } from "react";
import CartDialog from "./CartDialog";
import { useRouter } from "next/router";
import { useSelector } from "react-redux";
import { RootState } from "@/redux toolkit/store";
import { Button } from "@mui/material";

interface BookingCartProps {
  disableContinueButton: boolean;
}

const BookingCart: React.FC<BookingCartProps> = ({ disableContinueButton }) => {
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
    <>
      <div
        className={`lg:hidden fixed bottom-0 w-full flex mx-auto bg-white p-[4px] rounded-md shadow-[0_2px_10px] shadow-blackA4 transition-transform duration-300 ease-in-out z-[10] `}
      >
        {slug != "/confirmation" && (
          <div className="mx-4 flex justify-between items-center w-full">
            <CartDialog />
            <Button
              disabled={disableContinueButton}
              variant="contained"
              onClick={handleRoute}
              style={{
                backgroundColor: disableContinueButton ? "gray" : "black",
                color: "white",
                borderRadius: "20px",
                minWidth: "10rem",
                cursor: disableContinueButton ? "not-allowed" : "pointer",
              }}
            >
              Continue
            </Button>
            {showDialog && (
              <div className="fixed top-0 left-0 w-screen h-screen z-[9]">
                <div className="fixed top-0 left-0 w-screen h-screen bg-slate-600 opacity-55 z-[9]"></div>
                <div className="fixed top-24 left-0 w-full h-full flex items-center justify-center z-[10] ">
                  <div className="bg-white border border-gray-200 rounded p-6 shadow-md flex flex-col  ">
                    <p className="mb-6 text-lg z-[99]]">{dialogMessage}</p>
                    <button
                      onClick={closeDialog}
                      className="bg-pink-700 hover:bg-pink-500 text-white font-bold py-2 px-4 rounded-lg mt-2"
                    >
                      OK
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </>
  );
};

export default BookingCart;

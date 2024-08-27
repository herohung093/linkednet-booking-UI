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
  const storeUuid = useSelector((state: RootState) => state.storeInfo.storeUuid);
  const cart = useSelector((state: any) => state.cart);
  const selectedHour = useSelector((state: any) => state.cart.selectedHour);
  const [showDialog, setShowDialog] = useState(false);
  const [dialogMessage, setDialogMessage] = useState("");

  const handleRoute = () => {
    switch (slug) {
      case "/":
        if (cart.items.length > 0) {
          router.push("/staffs/?storeUuid=" + storeUuid);
        } else {
          setDialogMessage("Please select a service");
          setShowDialog(true);
        }
        break;
      case "/staffs":
        router.push("/time/?storeUuid=" + storeUuid);
        break;
      case "/time":
        if (selectedHour) {
          router.push("/confirmation/?storeUuid=" + storeUuid);
        } else {
          setDialogMessage("Please select a time");
          setShowDialog(true);
        }
        break;
      default:
        router.push("/?storeUuid=" + storeUuid);
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
              variant="contained" // Use 'contained' to have a solid background color
              className="px-4 py-2 md:w-1/3 lg:w-1/4"
              onClick={handleRoute}
              sx={{
                backgroundColor: 'black',
                color: 'white',
                borderRadius: '20px',
                textTransform: 'none', // Keep the text casing as it is
                '&:hover': {
                  backgroundColor: 'black', // Keep the same background color on hover
                },
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

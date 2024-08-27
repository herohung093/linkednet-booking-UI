import React, { useState } from "react";
import Cart from "./Cart";
import { useRouter } from "next/router";
import { useSelector } from "react-redux";
import { RootState } from "@/redux toolkit/store";
import { Button } from "@mui/material";

interface CartSideProps {
  disableContinueButton: boolean;
}

export const CartSide:  React.FC<CartSideProps> = ({ disableContinueButton }) => {
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
        router.push("/time/?storeUuid=" +storeUuid);
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
    <div className="hidden lg:flex lg:flex-col lg:border-2 lg:rounded-lg p-5 h-[600px] w-[300px] xl:w-[350px]">
      <div className="flex-grow">
        <Cart />
      </div>
      {slug !== "/confirmation" && (
        <div className="flex justify-center items-center">
          <Button
              disabled={disableContinueButton}
              variant="contained" // Use 'contained' to have a solid background color
              className="mt-4 px-4 py-2 w-full"
              onClick={handleRoute}
              size="large"
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
        </div>
      )}
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
                backgroundColor: 'black',
                color: 'white',
                borderRadius: '20px',
                textTransform: 'none', // Keep the text casing as it is
                '&:hover': {
                  backgroundColor: 'black', // Keep the same background color on hover
                },
              }}
            >
              Ok
            </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
import React, { useState } from "react";
import CartDialog from "./CartDialog";
import { CartIcon } from "@/icons/CartIcon";
import { useRouter } from "next/router";
import { useSelector } from "react-redux";

const BookingCart: React.FC<{ bookingInfo: CartState }> = ({ bookingInfo }) => {
  const router = useRouter();
  const slug = router.route;
  const cart = useSelector((state: any) => state.cart);
  const selectedHour = useSelector((state: any) => state.cart.selectedHour);
  const [showDialog, setShowDialog] = useState(false);
  const [dialogMessage, setDialogMessage] = useState("");

  const handleRoute = () => {
    switch (slug) {
      case "/":
        if (cart.items.length > 0) {
          router.push("/staffs");
        } else {
          setDialogMessage("Please select a service.");
          setShowDialog(true);
        }
        break;
      case "/staffs":
        router.push("/time");
        break;
      case "/time":
        if (selectedHour) {
          router.push("/confirmation");
        } else {
          setDialogMessage("Please select a time.");
          setShowDialog(true);
        }
        break;
      default:
        router.push("/");
    }
  };

  const closeDialog = () => {
    setShowDialog(false);
  };

  return (
    <div className="fixed bottom-0 w-full flex mx-auto bg-white p-[4px] rounded-md shadow-[0_2px_10px] shadow-blackA4 transition-transform duration-300 ease-in-out ">
      {slug != "/confirmation" && (
        <div className="mx-4 flex justify-between items-center w-full">
          <CartDialog />
          <CartIcon onClick={handleRoute} />
          {showDialog && (
            <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center">
              <div className="bg-white border border-gray-200 rounded p-6 shadow-md flex flex-col ">
                <p className="mb-6 text-lg">{dialogMessage}</p>
                <button
                  onClick={closeDialog}
                  className="bg-pink-400 hover:bg-pink-700 text-white font-bold py-2 px-4 rounded mt-2"
                >
                  OK
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default BookingCart;

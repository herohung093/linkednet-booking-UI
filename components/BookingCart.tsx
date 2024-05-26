import React, { useState } from "react";
import CartDialog from "./CartDialog";
import { useRouter } from "next/router";
import { useSelector } from "react-redux";

const BookingCart: React.FC = () => {
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
          setDialogMessage("Please select a service");
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
          setDialogMessage("Please select a time");
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
    <>
      <div
        className={`lg:hidden fixed bottom-0 w-full flex mx-auto bg-white p-[4px] rounded-md shadow-[0_2px_10px] shadow-blackA4 transition-transform duration-300 ease-in-out z-[10] `}
      >
        {slug != "/confirmation" && (
          <div className="mx-4 flex justify-between items-center w-full">
            <CartDialog />

            <button
              className={`
      px-5 py-2 border-2 h-[35px] rounded-lg font-bold text-xl shadow-green7 inline-flex items-center justify-center leading-none focus:outline-none 
      ${
        cart.items.length == 0
          ? "opacity-50 border-slate-300 text-slate-500 "
          : " border-primary-700 text-white bg-primary-500"
      }
      `}
              disabled={cart.items.length == 0}
              onClick={handleRoute}
            >
              Continue
            </button>
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

import React, { useState } from "react";
import Cart from "./Cart";
import { useRouter } from "next/router";
import { useSelector } from "react-redux";
import { RootState } from "@/redux toolkit/store";

export const CartSide = () => {
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
    <div className="relative hidden lg:flex lg:flex-col lg:border-2 lg:rounded-lg  p-10 h-[600px] w-[300px] lg:w-[300px] xl:w-[350px]">
      <div className="flex-grow">
        <Cart />
      </div>
      {slug !== "/confirmation" && (
        <div className="mt-auto">
          <button
            className={`-mb-5 w-full px-5 py-5 border-2 h-[35px] rounded-xl font-bold text-xl shadow-green7 inline-flex items-center justify-center leading-none focus:outline-none ${
              cart.items.length === 0
                ? "opacity-50 border-slate-300 text-slate-500"
                : "border-primary-700 text-white bg-primary-500"
            }`}
            disabled={cart.items.length === 0}
            onClick={handleRoute}
          >
            Continue
          </button>
        </div>
      )}
      {showDialog && (
        <div className="fixed top-0 left-0 w-screen h-screen z-[9]">
          <div className="fixed top-0 left-0 w-screen h-screen bg-slate-600 opacity-55 z-[9]"></div>
          <div className="fixed top-20 left-0 w-full h-full flex items-center justify-center z-[10]">
            <div className="bg-white border border-gray-200 rounded p-6 shadow-md flex flex-col">
              <p className="mb-6 text-lg z-[99]]">{dialogMessage}</p>
              <button
                onClick={closeDialog}
                className="bg-primary-700 hover:bg-primary-400 text-white font-bold py-2 px-4 rounded mt-2"
              >
                OK
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
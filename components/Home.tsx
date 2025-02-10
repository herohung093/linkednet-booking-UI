import React from "react";
import * as AlertDialog from "@radix-ui/react-alert-dialog";
import { useRouter } from "next/router";
import { useDispatch, useSelector } from "react-redux";
import { clearCart, addGuest } from "@/redux toolkit/cartSlice";
import { RootState } from "@/redux toolkit/store";
import { Home as HomeIcon, AlertTriangle } from "lucide-react";

const Home = () => {
  const router = useRouter();
  const storeUuid = useSelector((state: RootState) => state.storeInfo.storeUuid);
  const storeInfo = useSelector((state: RootState) => state.storeInfo.storeInfo);
  const dispatch = useDispatch();

  const handleReset = () => {
    dispatch(clearCart());
    
    // If store config indicates single guest booking, initialize with "Me" guest
    if (storeInfo?.maxGuestsForGroupBooking === 1) {
      dispatch(addGuest({
        id: null,
        name: "Me",
        guestServices: [],
        totalPrice: 0,
        totalEstimatedTime: 0,
      }));
    }
    
    router.push("/?storeUuid=" + storeUuid);
  };

  return (
    <AlertDialog.Root>
      <AlertDialog.Trigger asChild>
        <button
          className="p-2 rounded-full hover:bg-gray-100 transition-colors"
          aria-label="Return to home"
        >
          <HomeIcon className="w-5 h-5 text-gray-600" />
        </button>
      </AlertDialog.Trigger>

      <AlertDialog.Portal>
        <AlertDialog.Overlay 
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 
            data-[state=open]:animate-fadeIn"
        />
        
        <AlertDialog.Content
          className="fixed top-[50%] left-[50%] max-h-[85vh] w-[90vw] max-w-[500px] 
            translate-x-[-50%] translate-y-[-50%] rounded-xl bg-white p-6
            shadow-xl focus:outline-none z-50 data-[state=open]:animate-contentShow"
        >
          <div className="flex flex-col items-center text-center">
            <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center mb-4">
              <AlertTriangle className="w-6 h-6 text-red-600" />
            </div>

            <AlertDialog.Title className="text-xl font-semibold text-gray-900 mb-2">
              Reset Booking
            </AlertDialog.Title>
            
            <AlertDialog.Description className="text-gray-500 mb-6">
              This will clear your current selection and return you to the home page.
              Are you sure you want to continue?
            </AlertDialog.Description>

            <div className="flex gap-3 w-full">
              <AlertDialog.Cancel asChild>
                <button className="flex-1 px-4 py-2 border border-gray-200 text-gray-700 
                  rounded-lg font-medium hover:bg-gray-50 transition-colors">
                  Cancel
                </button>
              </AlertDialog.Cancel>

              <AlertDialog.Action asChild>
                <button
                  onClick={handleReset}
                  className="flex-1 px-4 py-3 bg-red-600 text-white rounded-lg 
                    font-medium hover:bg-red-700 transition-colors"
                >
                  Reset
                </button>
              </AlertDialog.Action>
            </div>
          </div>
        </AlertDialog.Content>
      </AlertDialog.Portal>
    </AlertDialog.Root>
  );
};

export default Home;
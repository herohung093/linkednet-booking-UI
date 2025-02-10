import React from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { Cross2Icon } from "@radix-ui/react-icons";
import Cart from "./Cart";
import { useSelector } from "react-redux";
import { ShoppingBag } from "lucide-react";

const CartDialog = () => {
  const bookingInfo = useSelector((state: { cart: CartState }) => state.cart);
  const totalServices = bookingInfo.guests.reduce(
    (sum, guest) => sum + (guest.guestServices ? guest.guestServices.length : 0),
    0
  );
  const totalPrice = bookingInfo.guests.reduce(
    (sum, guest) => sum + guest.totalPrice,
    0
  );

  return (
    <Dialog.Root>
      <Dialog.Trigger asChild>
        <button className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors">
          <div>
            <div className="text-lg font-medium">${totalPrice.toFixed(2)}</div>
            <div className="text-sm text-gray-600">
              {totalServices} service{totalServices !== 1 ? 's' : ''} in cart
            </div>
          </div>
          <div className="p-2 bg-black rounded-lg">
            <ShoppingBag className="w-5 h-5 text-white" />
          </div>
        </button>
      </Dialog.Trigger>

      <Dialog.Portal>
        <Dialog.Overlay 
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50
            data-[state=open]:animate-fadeIn"
        />
        
        <Dialog.Content
          className="fixed top-[50%] left-[50%] max-h-[85vh] w-[90vw] max-w-[450px]
            translate-x-[-50%] translate-y-[-50%] rounded-xl bg-white p-6
            shadow-xl focus:outline-none z-50 data-[state=open]:animate-contentShow"
        >
          <div className="flex items-center justify-between mb-6">
            <Dialog.Title className="text-xl font-semibold">
              Your Cart
            </Dialog.Title>
            <Dialog.Close asChild>
              <button
                className="p-2 rounded-full hover:bg-gray-100 transition-colors"
                aria-label="Close"
              >
                <Cross2Icon className="w-4 h-4" />
              </button>
            </Dialog.Close>
          </div>

          <div className="overflow-auto max-h-[calc(85vh-120px)]">
            <Cart />
          </div>

          <Dialog.Close asChild>
            <button
              className="w-full mt-6 px-6 py-3 bg-black text-white rounded-xl
                font-medium hover:bg-gray-900 transition-colors"
            >
              Close
            </button>
          </Dialog.Close>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};

export default CartDialog;
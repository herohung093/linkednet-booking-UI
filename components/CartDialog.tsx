"use client";
import React from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { Cross2Icon } from "@radix-ui/react-icons";
import Cart from "./Cart";
import { useSelector } from "react-redux";
import { Button } from "@mui/material";

const CartDialog = () => {
  const bookingInfo = useSelector((state: { cart: CartState }) => state.cart);
  const totalServices = bookingInfo.guests.reduce(
    (sum, guest) =>
      sum + (guest.guestServices ? guest.guestServices.length : 0),
    0
  );
  const totalPrice = bookingInfo.guests.reduce(
    (sum, guest) => sum + guest.totalPrice,
    0
  );

  return (
    <Dialog.Root>
      <Dialog.Trigger>
        <div className="xs:mx-4">
          <div className="text-xl">from ${totalPrice}</div>
          <div className="xs:text-lg text-slate-600">
            {totalServices} service(s) in cart
          </div>
        </div>
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className=" bg-slate-700 bg-opacity-70 data-[state=open]:animate-overlayShow fixed inset-0 z-[9]" />
        <Dialog.Content className="data-[state=open]:animate-contentShow fixed top-[50%] left-[50%] max-h-[85vh] w-[90vw] max-w-[450px] translate-x-[-50%] translate-y-[-50%] rounded-[6px] bg-white p-[25px] shadow-[hsl(206_22%_7%_/_35%)_0px_10px_38px_-10px,_hsl(206_22%_7%_/_20%)_0px_10px_20px_-15px] focus:outline-none z-[10]">
          <Dialog.Title className="text-mauve12 m-0 text-[17px] font-medium">
            Cart
          </Dialog.Title>
          <Cart />
          <div className="mt-[25px] flex justify-center">
            <Dialog.Close asChild>
              <Button
                style={{
                  backgroundColor: "black",
                  color: "white",
                  padding: "0.5rem 1rem",
                  borderRadius: "20px",
                  border: "none",
                  minWidth: "15rem",
                }}
              >
                Ok
              </Button>
            </Dialog.Close>
          </div>
          <Dialog.Close asChild>
            <button
              className="text-violet11 hover:bg-violet4 focus:shadow-violet7 absolute top-[10px] right-[10px] inline-flex h-[25px] w-[25px] appearance-none items-center justify-center rounded-full focus:shadow-[0_0_0_2px] focus:outline-none"
              aria-label="Close"
            >
              <Cross2Icon />
            </button>
          </Dialog.Close>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};

export default CartDialog;

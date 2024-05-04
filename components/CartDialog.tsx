"use client";
import React from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { Cross2Icon } from "@radix-ui/react-icons";
import { CartIcon } from "@/icons/CartIcon";
import Cart from "./Cart";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { clearCart } from "@/redux toolkit/cartSlice";

const CartDialog = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const handleClear = () => {
    dispatch(clearCart());
  };

  return (
    <Dialog.Root>
      <Dialog.Trigger>
        <CartIcon />
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className=" bg-slate-700 bg-opacity-70 data-[state=open]:animate-overlayShow fixed inset-0" />
        <Dialog.Content className="data-[state=open]:animate-contentShow fixed top-[50%] left-[50%] max-h-[85vh] w-[90vw] max-w-[450px] translate-x-[-50%] translate-y-[-50%] rounded-[6px] bg-white p-[25px] shadow-[hsl(206_22%_7%_/_35%)_0px_10px_38px_-10px,_hsl(206_22%_7%_/_20%)_0px_10px_20px_-15px] focus:outline-none">
          <Dialog.Title className="text-mauve12 m-0 text-[17px] font-medium">
            Cart
          </Dialog.Title>
          <Cart />
          <div className="mt-[25px] flex justify-between">
            <Dialog.Close asChild>
              <button
                onClick={handleClear}
                className="text-blue-900 border-2 border-blue-900 rounded-lg font-bold w-[100px]   shadow-green7 inline-flex h-[35px] items-center justify-center px-[15px] leading-none focus:shadow-[0_0_0_2px] "
              >
                Clear
              </button>
            </Dialog.Close>
            <Dialog.Close asChild>
              <button
                onClick={() => {
                  router.push("/staffs");
                }}
                className="text-blue-900 border-2 border-blue-900 rounded-lg font-bold w-[100px]   shadow-green7 inline-flex h-[35px] items-center justify-center px-[15px] leading-none focus:shadow-[0_0_0_2px] "
              >
                Book
              </button>
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

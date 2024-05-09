"use client";
import React from "react";
import CartDialog from "./CartDialog";
import { CartIcon } from "@/icons/CartIcon";
import { useRouter } from "next/router";

const BookingCart: React.FC<{ bookingInfo: CartState }> = ({ bookingInfo }) => {
  const router = useRouter();
  const slug = router.route;

  const handleRoute = () => {
    switch (slug) {
      case "/":
        router.push("/staffs");
        break;
      case "/staffs":
        router.push("/time");
        break;
      case "/time":
        router.push("/confirmation");
        break;
      default:
        router.push("/");
    }
  };
  return (
    <div className="fixed bottom-0 w-full md:bottom-5 flex mx-auto bg-white p-[4px] rounded-md shadow-[0_2px_10px] shadow-blackA4 transition-transform duration-300 ease-in-out md:w-[80%]">
      {slug != "/confirmation" && (
        <div className="mx-4 flex justify-between items-center w-full">
          <CartDialog />
          <CartIcon onClick={handleRoute} />
        </div>
      )}
    </div>
  );
};

export default BookingCart;

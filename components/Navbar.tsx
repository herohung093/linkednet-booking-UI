"use client";
import React from "react";
import CartDialog from "./CartDialog";

const Navbar: React.FC<{ bookingInfo: CartState }> = ({ bookingInfo }) => {
  return (
    <div className="fixed bottom-0 left-0 w-full flex items-center justify-between bg-white p-[4px] rounded-md shadow-[0_2px_10px] shadow-blackA4 transition-transform duration-300 ease-in-out">
      <div className="mx-4">
        <div className="text-xl">from A ${bookingInfo.total}</div>
        <div className="text-lg text-slate-600">
          {bookingInfo.items.length} services - {bookingInfo.totalEstimatedTime}{" "}
          minutes
        </div>
      </div>
      <div className="mx-4">
        <CartDialog />
      </div>
    </div>
  );
};

export default Navbar;



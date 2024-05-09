import React from "react";
import Cart from "./Cart";

export const CartSide = () => {
  return (
    <div className="hidden md:block md:border-2 md:rounded-lg md:bg-white p-10 h-[600px] w-[300px]">
      <Cart />
    </div>
  );
};

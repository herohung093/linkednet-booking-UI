"use client";
import React from "react";

export const CartIcon:React.FC<{onClick: ()=>void}> = ({onClick}) => {
  return (
    <div className="cursor-pointer px-3 py-2 border-2 border-blue-900 text-blue-900 h-[35px]  my-3 rounded-lg font-bold  text-xl   shadow-green7 inline-flex items-center justify-center leading-none focus:shadow-[0_0_0_2px] "
    onClick= {onClick}>
      Continue
    </div>
  );
};

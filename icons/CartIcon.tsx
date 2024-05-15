"use client";
import React from "react";

export const CartIcon: React.FC<{ onClick: () => void; disabled: boolean }> = ({
  onClick,
  disabled,
}) => {
  return (
    <div
      className={`
      px-3 py-2 border-2 h-[35px] my-3 rounded-lg font-bold text-xl shadow-green7 inline-flex items-center justify-center leading-none focus:shadow-[0_0_0_2px] 
      ${
        disabled
          ? "opacity-50 border-blue-300 text-slate-500 "
          : " border-blue-900 text-blue-900"
      }
      `}
    >
      <button disabled={disabled} onClick={onClick}>
        Continue
      </button>
    </div>
  );
};

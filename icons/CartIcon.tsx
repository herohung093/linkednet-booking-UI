"use client";
import React from "react";

export const CartIcon: React.FC<{ onClick: () => void; disabled: boolean }> = ({
  onClick,
  disabled,
}) => {
  return (
    <div>
      <button
        className={`
      px-3 py-2 border-1 h-[35px] my-3 rounded-lg font-bold text-xl shadow-green7 inline-flex items-center justify-center leading-none focus:outline-none
      ${
        disabled
          ? "opacity-50 text-slate-500 "
          : " border-pink-700 text-pink-900"
      }
      `}
        disabled={disabled}
        onClick={onClick}
      >
        Continue
      </button>
    </div>
  );
};

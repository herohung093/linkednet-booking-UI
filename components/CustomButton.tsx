import React, { ReactNode } from "react";

interface Props {
  children: ReactNode;
}

const CustomButton = ({ children }: Props, onclick: () => void) => {
  return (
    <button
      onClick={onclick}
      className="text-blue-900 border-2 border-black rounded-lg font-bold   shadow-green7 inline-flex h-[35px] items-center justify-center px-[15px] leading-none focus:shadow-[0_0_0_2px] "
    >
      {children}
    </button>
  );
};

export default CustomButton;

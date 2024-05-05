import React from "react";

interface ButtonProps {
  onClick?: () => void;
  type?: "submit" | "reset" | "button" | undefined;
  disabled?: boolean;
  text: string;
  width?: string;
  height?: string;
}

const CustomButton: React.FC<ButtonProps> = ({
  onClick,
  text,
  type,
  disabled = false,
  width = "100px",
  height = "35px",
}) => {
  return (
    <button
      onClick={onClick}
      type={type}
      disabled={disabled}
      className={`text-blue-900 border-2 border-blue-900 rounded-lg font-bold w-[${width}] h-[${height}] shadow-green7 inline-flex items-center justify-center px-[15px] leading-none focus:shadow-[0_0_0_2px] `}
    >
      {text}
    </button>
  );
};

export default CustomButton;

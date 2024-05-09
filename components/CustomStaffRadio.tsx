import React, { useEffect, useState } from "react";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import Loading from "./Loading";
import Error from "./Error";

interface CustomStaffRadio {
  id: number;
  firstName: string;
  lastName: string;
  nickName: string;
  selected: boolean;
  onSelect: (id: number) => void;
  error: unknown;
  isLoading: boolean;
}

const CustomStaffRadio: React.FC<CustomStaffRadio> = ({
  id,
  firstName,
  lastName,
  nickName,
  selected,
  onSelect,
  error,
  isLoading,
}) => {
  if (error) return <Error />;
  if (isLoading) return <Loading />;
  return (
    <label>
      <input
        type="radio"
        checked={selected}
        onChange={() => onSelect(id)}
        value={id}
        name="staff-radio"
        className="hidden"
      />
      <div
        className={` bg-white border-2 rounded-lg shadow-md py-2 mx-5 flex flex-col justify-center items-center cursor-pointer ${
          selected ? "border-blue-500" : ""
        }`}
      >
        <div className="text-base xs:text-sm font-semibold flex flex-col justify-center gap-2 mb-2 items-center">
          <AccountCircleIcon />
          {firstName} {lastName}
        </div>
        <p className="text-gray-600 mb-4 text-base">Nickname: {nickName}</p>
      </div>
    </label>
  );
};

export default CustomStaffRadio;

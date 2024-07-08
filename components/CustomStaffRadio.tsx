import React, { useEffect, useState } from "react";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import Loading from "./Loading";
import Error from "./Error";

interface CustomStaffRadio {
  staff: Staff;
  selected: boolean;
  onSelect: (staff: Staff) => void;
  error: unknown;
  isLoading: boolean;
}

const CustomStaffRadio: React.FC<CustomStaffRadio> = ({
  staff,
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
        onChange={() => onSelect(staff)}
        value={staff.id}
        name="staff-radio"
        className="hidden"
      />
      <div
        className={`lg:p-4 bg-white border-2 rounded-lg shadow-md py-2 mx-5 flex flex-col justify-center items-center cursor-pointer ${
          selected ? "border-primary-500" : ""
        }`}
      >
        <div className="text-base xs:text-sm  font-semibold flex flex-col justify-center gap-2 mb-2 items-center">
          <AccountCircleIcon />
          {staff.firstName} {staff.lastName}
        </div>
        <div className="text-gray-600 mb-4 text-base flex justify-center flex-col-1 gap-x-2">
          <div>Nickname: </div>
          <div> {staff.nickname} </div>
        </div>
      </div>
    </label>
  );
};

export default CustomStaffRadio;

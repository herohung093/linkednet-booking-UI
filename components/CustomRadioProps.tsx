import React from "react";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";

interface CustomRadioProps {
  id: number;
  firstName: string;
  lastName: string;
  nickName: string;
  selected: boolean;
  onSelect: (id: number) => void;
}

const CustomRadio: React.FC<CustomRadioProps> = ({
  id,
  firstName,
  lastName,
  nickName,
  selected,
  onSelect,
}) => {
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
        className={`bg-white rounded-lg shadow-md p-8 mx-5 flex flex-col justify-center items-center cursor-pointer ${
          selected ? "border border-blue-500" : ""
        }`}
      >
        <div className="text-lg font-semibold flex justify-center gap-2 mb-2 items-center">
          <AccountCircleIcon />
          {firstName} {lastName}
        </div>
        <p className="text-gray-600 mb-4">Nickname: {nickName}</p>
      </div>
    </label>
  );
};

export default CustomRadio;

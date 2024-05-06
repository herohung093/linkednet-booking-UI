import { CheckIcon } from "@/icons/CheckIcon";
import React from "react";

interface CustomHourRadioProps {
  hour: string;
  selected: boolean | undefined; // Update type to allow null
  onSelect: () => void;
}

const CustomHourRadio: React.FC<CustomHourRadioProps> = ({
  hour,
  selected,
  onSelect,
}) => {
  return (
    <div className="mx-5">
      <label
        className={`flex justify-between w-full  py-2  p-3 mb-2 cursor-pointer border-2 rounded-md ${
          selected ? "border-blue-500 " : "border-gray-300"
        }`}
      >
        <div className="flex justify-between items-center ">
          {hour}
          <input
            type="radio"
            checked={selected}
            onChange={onSelect}
            value={hour}
            className="hidden"
          />
        </div>
        {selected ? <CheckIcon /> : null}
      </label>
    </div>
  );
};

export default CustomHourRadio;

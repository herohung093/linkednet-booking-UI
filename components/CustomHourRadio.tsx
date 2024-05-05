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
        className={`flex justify-between w-full border-gray-300 py-2  p-3 mb-2 cursor-pointer border rounded-md ${
          selected ? "border-blue-500 border-2 " : ""
        }`}
      >
        <div className="flex justify-between items-center ">
          <input
            type="radio"
            checked={selected}
            onChange={onSelect}
            value={hour}
            className="hidden"
          />
          {hour}
          <button className="px-3 py-1 rounded"></button>
        </div>
      </label>
    </div>
  );
};

export default CustomHourRadio;

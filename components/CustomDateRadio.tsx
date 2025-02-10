import React from "react";

interface CustomRadioProps {
  index: number;
  id: number;
  label: string;
  date: string;
  selected: boolean | undefined;
  onSelect: () => void;
  unavailable: boolean;
}

const CustomRadio: React.FC<CustomRadioProps> = ({
  id,
  label,
  date,
  selected,
  onSelect,
  unavailable,
}) => {
  return (
    <div className="flex flex-col items-center">
      <label>
        <input
          type="radio"
          checked={selected}
          onChange={onSelect}
          value={id}
          name="day-radio"
          className="hidden"
          disabled={unavailable}
        />
        <div
          className={`
            rounded-full shadow-md w-[65px] h-[65px] border flex flex-row justify-center items-center cursor-pointer
            transition-all duration-200
            ${selected && !unavailable
              ? "bg-black border-black"
              : unavailable
                ? "bg-gray-100 border-gray-200 cursor-not-allowed line-through"
                : "bg-white border-gray-200 hover:border-black"
            }
          `}
        >
          <div className="text-lg font-semibold flex justify-center items-center">
            <p className={`text-2xl ${selected && !unavailable ? "text-white" : "text-gray-900"}`}>
              {date}
            </p>
          </div>
        </div>
      </label>
      <h3 className={`mt-2 font-medium ${selected ? "text-black" : "text-gray-600"}`}>
        {label}
      </h3>
    </div>
  );
};

export default CustomRadio;
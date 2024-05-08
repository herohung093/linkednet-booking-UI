import { CheckIcon } from "@/icons/CheckIcon";
import React from "react";
import Error from "./Error";
import Loading from "./Loading";

interface CustomHourRadioProps {
  error: unknown;
  isLoading: boolean;
  hour: string;
  selected: boolean | undefined;
  onSelect: () => void;
}

const CustomHourRadio: React.FC<CustomHourRadioProps> = ({
  error,
  isLoading,
  hour,
  selected,
  onSelect,
}) => {
  if (error) return <Error />;

  return (
    <div className="mx-5">
      {!isLoading ? (
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
      ) : (
        <Loading />
      )}
    </div>
  );
};

export default CustomHourRadio;

import React from "react";

interface CustomRadioProps {
  index: number;
  id: number;
  label: string;
  date: string;
  selected: boolean | undefined;
  onSelect: () => void;
}

const CustomRadio: React.FC<CustomRadioProps> = ({
  id,
  label,
  date,
  selected,
  onSelect,
}) => {
  const currentDate = new Date();
  const currentDateString = currentDate.getDate().toLocaleString("en-GB");

  React.useEffect(() => {
    if (date == currentDateString) {
      onSelect();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
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
        />
        <div
          className={`rounded-full shadow-md w-[65px] h-[65px] border flex flex-row justify-center items-center cursor-pointer ${
            selected ? " bg-blue-700 border-blue-500 " : "bg-white"
          } `}
        >
          <div className="text-lg font-semibold flex justify-center items-center">
            <p
              className={`text-2xl ${
                selected ? "text-white" : "text-slate-950"
              } `}
            >
              {date}
            </p>
          </div>
        </div>
      </label>
      <h3 className="font-bold">{label}</h3>
    </div>
  );
};

export default CustomRadio;

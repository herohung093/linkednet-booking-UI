import CustomRadioDate from "@/components/CustomDateRadio";
import CustomHourRadio from "@/components/CustomHourRadio";
import { setSelectedDate, setSelectedHour } from "@/redux toolkit/cartSlice";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import useSWR from "swr";

type FetcherFunction = (...args: Parameters<typeof fetch>) => Promise<any>;

const fetcher: FetcherFunction = (...args) =>
  fetch(...args).then((res) => res.json());

const StaffsPage: React.FC = () => {
  const dayLabels = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const monthNames = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [selectedDay, setSelectedDay] = useState<string | null>(null);
  const [selectHour, setSelectHour] = useState<string | null>(null);
  const [startDate, setStartDate] = useState(new Date());
  const days = [...Array(5)].map((_, index) => {
    const date = new Date(startDate);
    date.setDate(date.getDate() + index);
    return date;
  });

  const currentDate = new Date();
  const selectedDate =
    selectedIndex !== null ? days[selectedIndex] : currentDate;
  const selectedMonth = monthNames[selectedDate.getMonth()];
  const selectedYear = selectedDate.getFullYear();
  const staffId = useSelector((state: any) => state.cart.selectedStaff);

  const { data: availability } = useSWR(
    `https://big-umbrella-c5c3450b8837.herokuapp.com/staff/allStaffAvailability?staffId=5&date=${selectedDate.toLocaleDateString(
      "en-GB"
    )}`,
    fetcher
  );

  const hourArray: string[] = Object.keys(availability || {}).map(
    (time: string) => time
  );

  const handleNext = () => {
    setSelectedIndex(null);
    setStartDate((prevDate) => {
      const nextDate = new Date(prevDate);
      nextDate.setDate(nextDate.getDate() + 5);
      return nextDate;
    });
  };

  const handlePrevious = () => {
    setSelectedIndex(null);
    setStartDate((prevDate) => {
      const previousDate = new Date(prevDate);
      previousDate.setDate(previousDate.getDate() - 5);
      return previousDate;
    });
  };

  const dispatch = useDispatch();

  const handleSelectedDate = (index: number, date: Date) => {
    setSelectedIndex(index);
    setSelectedDay(date.toLocaleDateString("en-GB"));
    dispatch(setSelectedDate(date.toLocaleDateString("en-GB")));
  };

  const handleSelectedHour = (hour: string) => {
    setSelectHour(hour);
    console.log(hour);
    dispatch(setSelectedHour(hour));
  };
  return (
    <div className="mt-10">
      <div className="flex justify-between mx-5 mb-5">
        <div>
          <h2 className="text-2xl font-bold">{`${selectedMonth} ${selectedYear}`}</h2>
        </div>
        <div className="flex gap-x-5">
          <button
            className="border-2 p4 bg-white h-8 w-8 rounded-md "
            onClick={handlePrevious}
          >
            {"<"}
          </button>
          <button
            className="border-2 p4 bg-white h-8 w-8 rounded-md "
            onClick={handleNext}
          >
            {">"}
          </button>
        </div>
      </div>
      <div className="flex items-center justify-center gap-4 mb-4">
        <div className="flex gap-4">
          {days.map((date, index) => (
            <CustomRadioDate
              key={index}
              index={index}
              id={index}
              label={dayLabels[date.getDay()]}
              date={date.getDate().toString()}
              selected={selectedIndex === index}
              onSelect={() => handleSelectedDate(index, date)}
            />
          ))}
        </div>
      </div>
      <div>
        {hourArray?.map((hour: string, index: number) => (
          <CustomHourRadio
            hour={hour}
            key={index}
            onSelect={() => handleSelectedHour(hour)}
            selected={selectHour === hour}
          />
        ))}
      </div>
    </div>
  );
};

export default StaffsPage;

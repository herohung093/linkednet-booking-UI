import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import useSWR from "swr";
import CustomRadioDate from "@/components/CustomDateRadio";
import CustomHourRadio from "@/components/CustomHourRadio";
import {
  setSelectedDate,
  setSelectedHour,
  setTimeZone,
} from "@/redux toolkit/cartSlice";
import { Swiper, SwiperSlide } from "swiper/react";
import Error from "@/components/Error";
import Loading from "@/components/Loading";

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
  const currentDate = new Date();
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [selectDay, setSelectDay] = useState<string | null>(
    currentDate.toLocaleDateString("en-GB")
  );
  const [selectHour, setSelectHour] = useState<string | null>(null);
  const days = [...Array(31)].map((_, index) => {
    const date = new Date();
    date.setDate(date.getDate() + index);
    return date;
  });

  const selectedDate =
    selectedIndex !== null ? days[selectedIndex] : currentDate;
  const selectedMonth = monthNames[selectedDate.getMonth()];

  const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

  const selectedYear = currentDate.getFullYear();
  const staffId = useSelector((state: any) => state.cart.selectedStaff);

  const {
    data: availability,
    error,
    isLoading,
  } = useSWR(
    `https://big-umbrella-c5c3450b8837.herokuapp.com/staff/staffAvailability?staffId=${staffId}&date=${selectDay}`,
    fetcher
  );

  const hour: string[] = availability?.timeSlots;
  const hourArray = hour?.map((time) => {
    const [hour, minute] = time.split(":").map(Number);
    return `${hour.toString().padStart(2, "0")}:${minute
      .toString()
      .padStart(2, "0")}`;
  });

  const dispatch = useDispatch();

  const handleSelectedDate = (index: number, date: Date) => {
    setSelectedIndex(index);
    dispatch(setSelectedDate(date.toLocaleDateString("en-GB")));
    setSelectDay(date.toLocaleDateString("en-GB"));
  };

  useEffect(() => {
    setSelectedIndex(0);
    dispatch(setSelectedDate(currentDate.toLocaleDateString("en-GB")));
    dispatch(setTimeZone(timezone));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (hourArray?.length > 0 && selectHour === null) {
      setSelectHour(hourArray[0]);
      dispatch(setSelectedHour(hourArray[0]));
    }
  }, [hourArray, selectHour, dispatch]);

  const handleSelectedHour = (hour: string) => {
    setSelectHour(hour);
    dispatch(setSelectedHour(hour));
  };

  return (
    <div className="mt-10">
      <h1 className="mt-10 mb-5 text-3xl mx-5 font-bold">Select time</h1>
      <div className="flex justify-between mx-5 mb-5">
        <div>
          <h2 className="text-xl font-bold">{`${selectedMonth} ${selectedYear}`}</h2>
        </div>
      </div>
      <div className="flex items-center justify-center gap-4 mb-4">
        <Swiper spaceBetween={0} slidesPerView={6}>
          <div className="flex gap-4">
            {days.map((date, index) => (
              <SwiperSlide key={index}>
                <CustomRadioDate
                  index={index}
                  id={index}
                  label={dayLabels[date.getDay()]}
                  date={date.getDate().toString()}
                  selected={selectedIndex === index}
                  onSelect={() => handleSelectedDate(index, date)}
                />
              </SwiperSlide>
            ))}
          </div>
        </Swiper>
      </div>
      <div className="mb-24">
        {hourArray?.map((hour: string, index: number) => (
          <CustomHourRadio
            error={error}
            isLoading={isLoading}
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

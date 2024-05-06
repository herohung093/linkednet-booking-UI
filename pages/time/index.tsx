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
  const [selectedIndex, setSelectedIndex] = useState<number | null>(0);
  const [selectedDay, setSelectedDay] = useState<string | null>(null);
  const [selectHour, setSelectHour] = useState<string | null>(null);
  const [startDate, setStartDate] = useState(new Date());
  const days = [...Array(90)].map((_, index) => {
    const date = new Date(startDate);
    date.setDate(date.getDate() + index);
    return date;
  });
  const currentDate = new Date();
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
    `https://big-umbrella-c5c3450b8837.herokuapp.com/staff/allStaffAvailability?staffId=5&date=${currentDate.toLocaleDateString(
      "en-GB"
    )}`,
    fetcher
  );
  const hourArray: string[] = Object.keys(availability || {}).map(
    (time: string) => time
  );

  const dispatch = useDispatch();

  const handleSelectedDate = (index: number, date: Date) => {
    setSelectedIndex(index);
    setSelectedDay(date.toLocaleDateString("en-GB"));
    dispatch(setSelectedDate(date.toLocaleDateString("en-GB")));
  };

  useEffect(() => {
    const today = new Date();
    setSelectedIndex(0);
    setSelectedDay(today.toLocaleDateString("en-GB"));
    dispatch(setSelectedDate(today.toLocaleDateString("en-GB")));
    dispatch(setTimeZone(timezone));
  }, []);

  useEffect(() => {
    if (hourArray.length > 0 && selectHour === null) {
      setSelectHour(hourArray[0]);
      dispatch(setSelectedHour(hourArray[0]));
    }
  }, [hourArray, selectHour, dispatch]);

  const handleSelectedHour = (hour: string) => {
    setSelectHour(hour);
    dispatch(setSelectedHour(hour));
  };

  if (error) return <Error />;
  if (isLoading) return <Loading />;
  return (
    <div className="mt-10">
      <div className="flex justify-between mx-5 mb-5">
        <div>
          <h2 className="text-2xl font-bold">{`${selectedMonth} ${selectedYear}`}</h2>
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

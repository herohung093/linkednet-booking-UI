'use-client'
import React, { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import useSWR from "swr";
import CustomRadioDate from "@/components/CustomDateRadio";
import { setSelectedDate, setSelectedHour } from "@/redux toolkit/cartSlice";
import { Swiper, SwiperSlide } from "swiper/react";
import CustomHourRadio from "@/components/CustomHourRadio";
import { setSelectedStaffByHour } from "@/redux toolkit/staffSlice";
import { useRouter } from "next/router";

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
  const dispatch = useDispatch();
  const bookingInfo = useSelector((state: any) => state.cart);
  const router = useRouter();
  useEffect(() => {
    if (bookingInfo?.items.length === 0) {
      router.push("/");
    }
  }, [bookingInfo,router]);
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

  const selectedYear = currentDate.getFullYear();
  const staff = useSelector((state: any) => state.cart.selectedStaff);
  const staffList = useSelector((state: any) => state.staff.selectedStaffList);

  const {
    data: availability,
    error,
    isLoading,
  } = useSWR(
    `https://big-umbrella-c5c3450b8837.herokuapp.com/staff/allStaffAvailability?staffId=${staff?.id}&date=${selectDay}`,
    fetcher
  );

  const hourArray: { time: string; staffs: number[] }[] = useMemo(() => {
    if (!availability) return [];
    return Object.entries(availability).map(([time, staffs]) => ({
      time,
      staffs: staffs as number[],
    }));
  }, [availability]);

  const handleSelectedDate = (index: number, date: Date) => {
    setSelectedIndex(index);
    dispatch(setSelectedDate(date.toLocaleDateString("en-GB")));
    setSelectDay(date.toLocaleDateString("en-GB"));
  };

  useEffect(() => {
    setSelectedIndex(0);
    dispatch(setSelectedDate(currentDate.toLocaleDateString("en-GB")));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSelectedHour = (hour: { time: string; staffs: number[] }) => {
    setSelectHour(hour.time);
    dispatch(setSelectedHour(hour.time));
    const randomIndex = Math.floor(Math.random() * hour.staffs?.length);
    const randomStaffId = hour.staffs[randomIndex];
    const selectedRandomStaff = [...staffList]?.find(
      (staff: any) => staff.id == randomStaffId
    );
    dispatch(setSelectedStaffByHour(selectedRandomStaff));
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
            {days.map((date, index) => {
              return (
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
              );
            })}
          </div>
        </Swiper>
      </div>
      <div className="mb-24">
        {hourArray?.map(
          (hour: { time: string; staffs: number[] }, index: number) => (
            <CustomHourRadio
              staffs={hour.staffs}
              error={error}
              isLoading={isLoading}
              hour={hour.time}
              key={index}
              onSelect={() => handleSelectedHour(hour)}
              selected={selectHour === hour.time}
            />
          )
        )}
      </div>
    </div>
  );
};

export default StaffsPage;

"use-client";
import React, { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import useSWR from "swr";
import CustomRadioDate from "@/components/CustomDateRadio";
import {
  setSelectedDate,
  setSelectedHour,
  setSelectedStaff,
} from "@/redux toolkit/cartSlice";
import { Swiper, SwiperSlide } from "swiper/react";
import CustomHourRadio from "@/components/CustomHourRadio";
import { setSelectedStaffByHour } from "@/redux toolkit/staffSlice";
import { useRouter } from "next/router";
import Select from "react-select";
import { RootState } from "@/redux toolkit/store";
import moment from "moment";
import { CartSide } from "@/components/CartSide";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import axios from "@/ulti/axios";
<<<<<<< HEAD
import BookingCart from "@/components/BookingCart";
=======
>>>>>>> 6a71ad5431d92425c915b3d00f734ccb4b5e150e

type FetcherFunction = (url: string) => Promise<any>;

const TimePage: React.FC = () => {
  const dayLabels: { [key: number]: string } = {
    0: "Sun",
    1: "Mon",
    2: "Tue",
    3: "Wed",
    4: "Thu",
    5: "Fri",
    6: "Sat",
  };

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
  const storeUuid = useSelector((state: RootState) => state.storeInfo.storeUuid);
  const router = useRouter();

  const fetcher: FetcherFunction = (url) =>
    axios.get(url, {
      headers: {
        'X-StoreID': storeUuid,
      }
    }).then(res => res.data);

  useEffect(() => {
    if (bookingInfo?.items.length === 0) {
      router.push("/?storeUuid=" + storeUuid);
    }
  }, [bookingInfo, router]);

  const currentDate = new Date();
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [selectDay, setSelectDay] = useState<string | null>(
    moment(currentDate).format("DD/MM/YYYY")
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

  const staff = useSelector((state: RootState) => state.cart.selectedStaff);
  const staffList = useSelector(
    (state: RootState) => state.staff.selectedStaffList
  );

  const {
    data: availability,
    error,
    isLoading,
  } = useSWR(
    `/staff/allStaffAvailability?staffId=${staff?.id}&date=${selectDay}`,
    fetcher
  );

  const currentHour = currentDate.getHours();

  const hourArray: { time: string; staffs: number[] }[] = useMemo(() => {
    if (!availability) return [];
    return Object.entries(availability)
      .map(([time, staffs]) => ({
        time,
        staffs: staffs as number[],
      }))
      .filter(({ time }) => {
        const hour = parseInt(time.split(":")[0]);
        return selectedDate.getDate() === currentDate.getDate()
          ? hour >= currentHour
          : true;
      });
  }, [availability, currentHour, selectedDate, currentDate]);

  const handleSelectedDate = (index: number, date: Date) => {
    setSelectedIndex(index);
    setSelectHour(null);
    dispatch(setSelectedHour(null));
    const formattedDate = moment(date).format("DD/MM/YYYY");
    dispatch(setSelectedDate(formattedDate));
    setSelectDay(formattedDate);
  };

  const unavailableDates = useMemo(() => {
    if (!staff || !staff.workingDays || !availability) return [];
    const workingDays = staff.workingDays.split(",");
    const normalizedWorkingDays = workingDays.map((day: any) => parseInt(day));
    return days.filter((date) => {
      const dayIndex = date.getDay();
      return !normalizedWorkingDays.includes(dayIndex === 0 ? 7 : dayIndex);
    });
  }, [staff, availability, days]);
  const [swiper, setSwiper] = useState<any>(null);

  useEffect(() => {
    const slideTo = (index: any) => swiper.slideTo(index);
    const isCurrentDateUnavailable = unavailableDates.some(
      (unavailableDate) => unavailableDate.getTime() === selectedDate.getTime()
    );

    if (isCurrentDateUnavailable) {
      const firstAvailableIndex = days.findIndex((date) => {
        const isUnavailable = unavailableDates.some(
          (unavailableDate) => unavailableDate.getTime() === date.getTime()
        );
        return !isUnavailable;
      });

      if (firstAvailableIndex !== -1) {
        const firstAvailableDate = days[firstAvailableIndex];
        setSelectedIndex(firstAvailableIndex);
        const formattedDate = moment(firstAvailableDate).format("DD/MM/YYYY");
        slideTo(firstAvailableIndex);
        dispatch(setSelectedDate(formattedDate));
        setSelectDay(formattedDate);
      }
    }
  }, [unavailableDates, days, selectedDate, dispatch,swiper]);

  const handleSelectedHour = (hour: { time: string; staffs: number[] }) => {
    setSelectHour(hour.time);
    dispatch(setSelectedHour(hour.time));
    const randomIndex = Math.floor(Math.random() * hour.staffs?.length);
    const randomStaffId = hour.staffs[randomIndex];
    const selectedRandomStaff =
      staffList?.find((staff) => staff.id == randomStaffId) || null;

    dispatch(setSelectedStaffByHour(selectedRandomStaff));
  };

  const [selectStaff, setSelectStaff] = useState<any>({
    value: staff?.id,
    label: `${staff?.firstName} ${staff?.lastName}`,
  });

  const handleStaffChange = (selectedOption: any) => {
    setSelectStaff(selectedOption);
    setSelectHour(null);
    dispatch(setSelectedHour(null));
    const selectedStaffMember =
      staffList?.find((staff) => staff.id === selectedOption.value) || null;

    dispatch(setSelectedStaff(selectedStaffMember));
  };
  const CustomRadioDateSkeleton = () => (
    <div className="w-16 h-16 bg-gray-200 rounded-full"></div>
  );

  const CustomHourRadioSkeleton = () => (
    <div className="w-90 h-12 bg-gray-200 rounded-lg mb-3 mx-4"></div>
  );

  return (
    <div className="mt-10 md:w-[80%] mx-auto lg:grid lg:grid-cols-2 ">
      <div>
        <div className="w-[90%] mx-auto ">
          <h1 className="text-lg font-bold mb-3">Select Staff</h1>
          <Select
            isSearchable={false}
            options={staffList?.map((staff) => ({
              value: staff.id,
              label: `${staff.firstName} ${staff.lastName}`,
            }))}
            value={selectStaff}
            onChange={handleStaffChange}
            className="z-[2]"
          />
        </div>
        <h1 className="mt-10 mb-5 text-3xl mx-5 font-bold">Select time</h1>
        <div className="flex justify-between mx-5 mb-5">
          <div>
            <h2 className="text-xl font-bold">{`${selectedMonth} ${selectedYear}`}</h2>
          </div>
        </div>
        <div className="flex items-center justify-center gap-4 mb-4">
          <Swiper
            spaceBetween={0}
            slidesPerView={5}
            style={{ zIndex: 1 }}
            onSwiper={setSwiper}
          >
            <div className="flex gap-4 z-[1]">
              {days.map((date, index) => {
                const isUnavailable = unavailableDates.some(
                  (unavailableDate) =>
                    unavailableDate.getTime() === date.getTime()
                );
                return (
                  <SwiperSlide key={index}>
                    <CustomRadioDate
                      index={index}
                      id={index}
                      label={dayLabels[date.getDay()]}
                      date={date.getDate().toString()}
                      selected={selectedIndex === index}
                      onSelect={() => handleSelectedDate(index, date)}
                      unavailable={isUnavailable}
                    />
                  </SwiperSlide>
                );
              })}
            </div>
          </Swiper>
        </div>
        {isLoading && (
          <div className="mb-24">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((_, index) => (
              <div key={index}>
                <CustomHourRadioSkeleton />
              </div>
            ))}
          </div>
        )}
        {hourArray?.length == 0 && (
          <div className="mb-5 flex-col text-primary-700 font-bold w-full h-[400px] flex justify-center items-center">
            <div className="text-[50px]">
              <CalendarMonthIcon fontSize="inherit" />
            </div>
            <div>Fully booked on this date</div>
          </div>
        )}
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
      <div className="sticky top-20 self-start ml-auto mt-28">
        <CartSide />
      </div>
      <BookingCart />
    </div>
  );
};

export default TimePage;

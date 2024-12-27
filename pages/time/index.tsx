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
import BookingCart from "@/components/BookingCart";
import { Grid } from "@mui/material";

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
  const storeInfo = useSelector((state: RootState) => state.storeInfo);
  const router = useRouter();
  const urlStoreUuid = router.query;

  const fetcher: FetcherFunction = (url) =>
    axios
      .get(url, {
        headers: {
          "X-StoreID": urlStoreUuid.storeUuid,
        },
      })
      .then((res) => res.data);

  useEffect(() => {
    if (bookingInfo?.items.length === 0 && urlStoreUuid.storeUuid) {
      router.push("/?storeUuid=" + urlStoreUuid.storeUuid);
    }
  }, [bookingInfo, router]);

  const currentDate = new Date();
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [selectDay, setSelectDay] = useState<string | null>(
    moment(currentDate).format("DD/MM/YYYY")
  );
  const [showDenyInDayBookingMessage, setShowDenyInDayBookingMessage] =
    useState<boolean>(false);
  const [selectHour, setSelectHour] = useState<string | null>(null);

  const days = [...Array(31)].map((_, index) => {
    const date = new Date();
    date.setDate(date.getDate() + index);
    return date;
  });

  const selectedDate =
    selectedIndex !== null ? days[selectedIndex] : currentDate;
  const selectedDateMoment = moment(selectedDate);

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

  const convertTimeToMoment = (
    time: string,
    selectedDate: Date
  ): moment.Moment => {
    const date = moment(selectedDate);

    const [hours, minutes] = time.split(":").map(Number);

    date.set({ hour: hours, minute: minutes });

    return date;
  };

  const currentHour = currentDate.getHours();

  const hourArray: { time: string; staffs: number[] }[] = useMemo(() => {
    if (!availability) return [];
    return Object.entries(availability)
      .map(([time, staffs]) => ({
        time,
        staffs: staffs as number[],
      }))
      .filter(({ time }) => {
        const selectedDateWithTime = convertTimeToMoment(time, selectedDate);
        const currentTimePlus1Hour = moment().add(1, "hour");
        return selectedDate.getDate() === currentDate.getDate()
          ? selectedDateWithTime.isSameOrAfter(currentTimePlus1Hour)
          : true;
      });
  }, [availability, currentHour, selectedDate, currentDate]);

  const handleSelectedDate = (index: number, date: Date) => {
    setSelectedIndex(index);
    const today = moment().startOf("day");
    const selectedDate = moment(date).startOf("day");
    setShowDenyInDayBookingMessage(
      selectedDate.isSame(today) && !storeInfo?.storeInfo?.enableInDayBooking
    );

    setSelectHour(null);
    dispatch(setSelectedHour(null));
    const formattedDate = moment(date).format("DD/MM/YYYY");
    dispatch(setSelectedDate(formattedDate));
    setSelectDay(formattedDate);
  };

  const unavailableDates = useMemo(() => {
    if (!storeInfo || !staff || !staff.workingDays || !availability) return [];
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
  }, [unavailableDates, days, selectedDate, dispatch, swiper]);

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
            <h2 className="text-xl font-bold">{`${selectedDateMoment.format(
              "dddd, DD MMM YYYY"
            )}`}</h2>
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
        {showDenyInDayBookingMessage && (
          <div className="mb-5 flex-col text-black font-bold w-full h-[400px] flex justify-center items-center">
            <div className="text-[50px]">
              <CalendarMonthIcon fontSize="inherit" />
            </div>
            <div className="px-4 text-center">
              Please call us to make bookings for today{" "}
              <a
                href={`tel:${storeInfo?.storeInfo?.storePhoneNumber}`}
                className="text-blue-500 underline"
              >
                {storeInfo?.storeInfo?.storePhoneNumber}
              </a>
            </div>
          </div>
        )}
        {isLoading && (
          <div className="mb-24">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((_, index) => (
              <div key={index}>
                <CustomHourRadioSkeleton />
              </div>
            ))}
          </div>
        )}
        {hourArray?.length == 0 && !showDenyInDayBookingMessage && (
          <div className="mb-5 flex-col text-black font-bold w-full h-[400px] flex justify-center items-center">
            <div className="text-[50px]">
              <CalendarMonthIcon fontSize="inherit" />
            </div>
            <div>Fully booked on this date</div>
          </div>
        )}
        {!showDenyInDayBookingMessage && (
          <Grid container spacing={2}>
            {hourArray?.map(
              (hour: { time: string; staffs: number[] }, index: number) => (
                <Grid
                  item
                  xs={3} // 4 items per row on small screens
                  sm={2} // 6 items per row on medium screens
                  lg={1.5} // 8 items per row on large screens
                  key={index}
                >
                  <CustomHourRadio
                    staffs={hour.staffs}
                    error={error}
                    isLoading={isLoading}
                    hour={hour.time}
                    key={index}
                    onSelect={() => handleSelectedHour(hour)}
                    selected={selectHour === hour.time}
                  />
                </Grid>
              )
            )}
          </Grid>
        )}
      </div>
      <div className="sticky top-20 self-start ml-auto mt-28">
        <CartSide disableContinueButton={!bookingInfo.selectedHour} />
      </div>
      <BookingCart disableContinueButton={!bookingInfo.selectedHour} />
    </div>
  );
};

export default TimePage;

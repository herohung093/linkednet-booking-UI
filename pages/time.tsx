import React, { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/router";
import useSWR from "swr";
import moment from "moment";
import Select from "react-select";
import { Calendar, Clock, AlertCircle, Users, User, ChevronLeft, ChevronRight } from "lucide-react";
import axios from "@/ulti/axios";

// Components
import CustomRadioDate from "@/components/CustomDateRadio";
import CustomHourRadio from "@/components/CustomHourRadio";

// Redux
import {
  setSelectedDate,
  setSelectedHour,
  setStaffIdForGuestServices,
  setSelectedStaffForFirstGuest,
  getSelectedStaffId,
} from "@/redux toolkit/cartSlice";
import { RootState } from "@/redux toolkit/store";

// Types
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

  // Redux state
  const dispatch = useDispatch();
  const bookingInfo = useSelector((state: RootState) => state.cart);
  const storeInfo = useSelector((state: RootState) => state.storeInfo);
  const staffList = useSelector((state: RootState) => state.staff.selectedStaffList);
  const allStaff = useSelector((state: RootState) => state.staff.allStaff);
  const staffId = useSelector(getSelectedStaffId);

  // Router
  const router = useRouter();
  const urlStoreUuid = router.query;

  // State
  const [scrollPosition, setScrollPosition] = useState(0);
  const scrollRef = React.useRef<HTMLDivElement>(null);
  
    // Date calculations
    const currentDate = new Date();
    const days = [...Array(31)].map((_, index) => {
      const date = new Date();
      date.setDate(date.getDate() + index);
      return date;
    });

    
  // Update selectedIndex initialization to use stored date
  const [selectedIndex, setSelectedIndex] = useState<number | null>(() => {
    if (bookingInfo.selectedDate) {
      const storedDate = moment(bookingInfo.selectedDate, "DD/MM/YYYY").toDate();
      const index = days.findIndex(
        (day) => 
          day.getDate() === storedDate.getDate() &&
          day.getMonth() === storedDate.getMonth() &&
          day.getFullYear() === storedDate.getFullYear()
      );
      return index >= 0 ? index : 0;
    }
    return 0;
  });

  // Update selectDay initialization to use stored date
  const [selectDay, setSelectDay] = useState<string | null>(
    bookingInfo.selectedDate || moment(new Date()).format("DD/MM/YYYY")
  );
  
  const [showDenyInDayBookingMessage, setShowDenyInDayBookingMessage] = useState<boolean>(false);
  const [selectHour, setSelectHour] = useState<string | null>(
    bookingInfo.selectedHour || null
  );
  const [selectStaff, setSelectStaff] = useState<any>({
    value: staffId,
    label: staffList?.find(staff => staff.id === staffId)
      ? `${staffList.find(staff => staff.id === staffId)?.firstName} ${staffList.find(staff => staff.id === staffId)?.lastName}`
      : "Any Professional"
  });

  // Calculate unavailable dates
  const unavailableDates = useMemo(() => {
    if (!storeInfo || !staffList) return [];
    const staff = staffList.find(s => s.id === staffId);
    if (!staff || !staff.workingDays) return [];
    
    const workingDays = staff.workingDays.split(",");
    const normalizedWorkingDays = workingDays.map((day: any) => parseInt(day));
    return days.filter((date) => {
      const dayIndex = date.getDay();
      return !normalizedWorkingDays.includes(dayIndex === 0 ? 7 : dayIndex);
    });
  }, [staffId, staffList, days, storeInfo]);

  // Data fetching
  const fetcher: FetcherFunction = (url) =>
    axios
      .get(url, {
        headers: {
          "X-StoreID": urlStoreUuid.storeUuid,
        },
      })
      .then((res) => res.data);

  const {
    data: availability,
    error,
    isLoading,
  } = useSWR(
    `/staff/allStaffAvailability?staffId=${staffId}&date=${selectDay}`,
    fetcher
  );

  const selectedDate = selectedIndex !== null ? days[selectedIndex] : currentDate;
  const selectedDateMoment = moment(selectedDate);

  // Effect to handle initial date selection
  useEffect(() => {
    if (selectedIndex === null) {
      const today = new Date();
      const todayIndex = days.findIndex(
        (day) => day.getDate() === today.getDate() &&
                 day.getMonth() === today.getMonth() &&
                 day.getFullYear() === today.getFullYear()
      );
      
      if (todayIndex !== -1) {
        const isUnavailable = unavailableDates.some(
          (unavailableDate) => unavailableDate.getTime() === days[todayIndex].getTime()
        );
        
        if (!isUnavailable) {
          handleSelectedDate(todayIndex, days[todayIndex]);
        } else {
          // Find next available date
          const nextAvailableIndex = days.findIndex((date, index) => {
            return index > todayIndex && !unavailableDates.some(
              (unavailableDate) => unavailableDate.getTime() === date.getTime()
            );
          });
          
          if (nextAvailableIndex !== -1) {
            handleSelectedDate(nextAvailableIndex, days[nextAvailableIndex]);
          }
        }
      }
    }
  }, [days, unavailableDates]);

  // Initial setup effect to respect stored date
  useEffect(() => {
    const today = moment().startOf("day");
    const selectedMoment = selectDay 
      ? moment(selectDay, "DD/MM/YYYY").startOf("day") 
      : today;
    
    setShowDenyInDayBookingMessage(
      selectedMoment.isSame(today) && !storeInfo?.storeInfo?.enableInDayBooking
    );

    // Only set initial date if no date is selected
    if (!selectDay && !bookingInfo.selectedDate) {
      const formattedDate = moment(today).format("DD/MM/YYYY");
      dispatch(setSelectedDate(formattedDate));
      setSelectDay(formattedDate);
    }

    // Check if current date is unavailable
    if (staffList) {
      const staff = staffList.find(s => s.id === staffId);
      if (staff?.workingDays) {
        const workingDays = staff.workingDays.split(",");
        const normalizedWorkingDays = workingDays.map((day: any) => parseInt(day));
        const currentDayIndex = selectedMoment.day();
        const normalizedCurrentDay = currentDayIndex === 0 ? 7 : currentDayIndex;
        
        if (!normalizedWorkingDays.includes(normalizedCurrentDay)) {
          const nextAvailableIndex = days.findIndex((date) => {
            const dayIndex = date.getDay();
            const normalizedDayIndex = dayIndex === 0 ? 7 : dayIndex;
            return normalizedWorkingDays.includes(normalizedDayIndex);
          });
          
          if (nextAvailableIndex !== -1) {
            setSelectedIndex(nextAvailableIndex);
            const nextDate = moment(days[nextAvailableIndex]).format("DD/MM/YYYY");
            dispatch(setSelectedDate(nextDate));
            setSelectDay(nextDate);
            setShowDenyInDayBookingMessage(false);
          }
        }
      }
    }
  }, [staffList, staffId, storeInfo?.storeInfo?.enableInDayBooking, selectDay]);

  // Scroll handlers
  const handleScroll = (direction: 'left' | 'right') => {
    const container = scrollRef.current;
    if (!container) return;

    const scrollAmount = 200;
    const newPosition = direction === 'left' 
      ? scrollPosition - scrollAmount 
      : scrollPosition + scrollAmount;

    container.scrollTo({
      left: newPosition,
      behavior: 'smooth'
    });
    setScrollPosition(newPosition);
  };

  // Handlers
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

  // Update handleSelectedHour to handle preselected staff
  const handleSelectedHour = (hour: { time: string; staff: number[] }) => {
    setSelectHour(hour.time);
    dispatch(setSelectedHour(hour.time));
    
    // Only update staff if the hour is different from the preselected one
    if (hour.time !== bookingInfo.selectedHour) {
      if (!bookingInfo.isGroupBooking) {
        const randomIndex = Math.floor(Math.random() * hour.staff?.length);
        const randomStaffId = hour.staff[randomIndex];

        if (staffList) {
          dispatch(setStaffIdForGuestServices({staffIds: [randomStaffId], allStaff: staffList}));
        }
      } else {
        if (allStaff) {
          dispatch(setStaffIdForGuestServices({staffIds: hour.staff, allStaff: allStaff}));
        }
      }
    }
  };

  const handleStaffChange = (selectedOption: any) => {
    setSelectStaff(selectedOption);
    setSelectHour(null);
    dispatch(setSelectedHour(null));
    const selectedStaffMember =
      staffList?.find((staff) => staff.id === selectedOption.value) || null;

    if (selectedStaffMember) {
      dispatch(setSelectedStaffForFirstGuest(selectedStaffMember));
    }
  };

  // Effects
  useEffect(() => {
    if (bookingInfo?.guests.length === 0 && urlStoreUuid.storeUuid) {
      router.push("/?storeUuid=" + urlStoreUuid.storeUuid);
    }
  }, [bookingInfo, router, urlStoreUuid.storeUuid]);

  // Add effect to handle preselected hour
  useEffect(() => {
    if (availability && bookingInfo.selectedHour) {
      const preselectedHourData = Object.entries(availability)
        .find(([time]) => time === bookingInfo.selectedHour);
      
      if (preselectedHourData) {
        const [time, staff] = preselectedHourData;
        handleSelectedHour({ time, staff: staff as number[] });
      }
    }
  }, [availability]);

  // Memoized values
  const hourArray = useMemo(() => {
    if (!availability) return [];
    return Object.entries(availability)
      .map(([time, staff]) => ({
        time,
        staff: staff as number[],
      }))
      .filter(({ time }) => {
        const selectedDateWithTime = moment(selectedDate)
          .hours(parseInt(time.split(":")[0]))
          .minutes(parseInt(time.split(":")[1]));
        const currentTimePlus1Hour = moment().add(1, "hour");
        return selectedDate.getDate() === currentDate.getDate()
          ? selectedDateWithTime.isSameOrAfter(currentTimePlus1Hour)
          : true;
      });
  }, [availability, selectedDate, currentDate]);

  const filteredHoursForGroupBooking = useMemo(() => 
    hourArray?.filter((hour) => {
      if (!bookingInfo.isGroupBooking) return true;
      return hour.staff.length >= bookingInfo.guests.length;
    }),
    [hourArray, bookingInfo.isGroupBooking, bookingInfo.guests.length]
  );

  if (!staffList) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/2 mb-4"></div>
          <div className="h-12 bg-gray-200 rounded mb-8"></div>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-16 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Staff Selection */}
      <div className="mb-8">
        <h2 className="text-lg font-semibold text-gray-900 mb-3">Select Staff</h2>
        <Select
          isSearchable={false}
          options={staffList?.map((staff) => ({
            value: staff.id,
            label: `${staff.firstName} ${staff.lastName}`,
          }))}
          value={selectStaff}
          onChange={handleStaffChange}
          className="z-[2]"
          styles={{
            control: (base) => ({
              ...base,
              padding: '4px',
              borderRadius: '0.75rem',
              borderColor: '#e5e7eb',
              '&:hover': {
                borderColor: '#000000'
              }
            }),
            option: (base, state) => ({
              ...base,
              backgroundColor: state.isSelected ? '#000000' : base.backgroundColor,
              '&:hover': {
                backgroundColor: state.isSelected ? '#000000' : '#f3f4f6'
              }
            })
          }}
        />
      </div>

      {/* Date Selection */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Select Time</h2>
        <div className="flex items-center gap-2 mb-6">
          <Calendar className="w-5 h-5 text-gray-500" />
          <span className="text-lg text-gray-700">
            {selectedDateMoment.format("dddd, DD MMM YYYY")}
          </span>
        </div>

        {/* Date Slider with Navigation Buttons */}
        <div className="relative flex items-center justify-center h-[90px]">
          <button
            onClick={() => handleScroll('left')}
            className="absolute left-0 z-10 p-2 bg-white rounded-full shadow-md hover:bg-gray-50 -translate-x-4 top-[33%]"
            aria-label="Scroll left"
          >
            <ChevronLeft className="w-5 h-5 text-gray-600" />
          </button>

          <div 
            ref={scrollRef}
            className="overflow-x-auto scrollbar-hide pb-4 px-4 flex-1"
            style={{ scrollBehavior: 'smooth' }}
          >
            <div className="flex gap-2 min-w-max">
              {days.map((date, index) => {
                const isUnavailable = unavailableDates.some(
                  (unavailableDate) => unavailableDate.getTime() === date.getTime()
                );
                return (
                  <CustomRadioDate
                    key={index}
                    index={index}
                    id={index}
                    label={dayLabels[date.getDay()]}
                    date={date.getDate().toString()}
                    selected={selectedIndex === index}
                    onSelect={() => handleSelectedDate(index, date)}
                    unavailable={isUnavailable}
                  />
                );
              })}
            </div>
          </div>

          <button
            onClick={() => handleScroll('right')}
            className="absolute right-0 z-10 p-2 bg-white rounded-full shadow-md hover:bg-gray-50 translate-x-4 top-[33%]"
            aria-label="Scroll right"
          >
            <ChevronRight className="w-5 h-5 text-gray-600" />
          </button>
        </div>
      </div>

      {/* Same Day Booking Message - Now displayed before time slots */}
      {showDenyInDayBookingMessage && (
        <div className="mb-8 text-center p-8 bg-yellow-50 rounded-xl border border-yellow-100">
          <AlertCircle className="w-12 h-12 text-yellow-500 mx-auto mb-4" />
          <p className="text-lg font-medium text-gray-900 mb-2">
            Same-day booking unavailable
          </p>
          <p className="text-gray-600">
            Please call us at{" "}
            <a
              href={`tel:${storeInfo?.storeInfo?.storePhoneNumber}`}
              className="text-blue-600 font-medium hover:underline"
            >
              {storeInfo?.storeInfo?.storePhoneNumber}
            </a>
          </p>
        </div>
      )}

      {/* Time Slots - Only shown if same-day booking message is not displayed */}
      {!showDenyInDayBookingMessage && (
        <div className="mb-8">
          {isLoading ? (
            <div className="grid grid-cols-4 gap-4">
              {[1, 2, 3, 4, 5, 6, 7, 8].map((index) => (
                <div
                  key={index}
                  className="h-12 bg-gray-100 rounded-xl animate-pulse"
                />
              ))}
            </div>
          ) : hourArray?.length === 0 ? (
            <div className="text-center p-8 bg-gray-50 rounded-xl">
              <Clock className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-lg font-medium text-gray-900">
                No available time slots
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
              {filteredHoursForGroupBooking.map((hour, index) => (
                <button
                  key={index}
                  onClick={() => handleSelectedHour(hour)}
                  disabled={hour.staff.length === 0}
                  className={`
                    relative px-4 py-3 rounded-xl text-center transition-all
                    ${selectHour === hour.time
                      ? 'bg-black text-white shadow-lg'
                      : hour.staff.length === 0
                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed opacity-50 line-through'
                        : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
                    }
                  `}
                >
                  <span className="text-sm font-medium">
                    {moment(hour.time, "HH:mm").format("h:mm A")}
                  </span>
                  
                  {/* Staff availability indicator */}
                  <div className="absolute -top-2 -right-2">
                    {hour.staff.length > 0 && (
                      bookingInfo.isGroupBooking ? (
                        <div className="flex items-center justify-center w-6 h-6 bg-green-100 rounded-full">
                          <Users className="w-3 h-3 text-green-600" />
                        </div>
                      ) : (
                        <div className="flex items-center justify-center w-6 h-6 bg-blue-100 rounded-full">
                          <User className="w-3 h-3 text-blue-600" />
                        </div>
                      )
                    )}
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default TimePage;
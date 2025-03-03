/**
 * Time Selection Page
 * 
 * This component handles the booking time selection process, allowing users to:
 * - Select a date from a scrollable calendar
 * - Choose an available staff member
 * - Select from available time slots based on staff availability
 * - Handle group bookings with appropriate staff availability checks
 * 
 * The component integrates with Redux for global state management and
 * uses SWR for efficient data fetching and caching.
 */
import React, { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/router";
import useSWR from "swr";
import moment from "moment";
import Select from "react-select";
import { Calendar, Clock, AlertCircle, Users, User, ChevronLeft, ChevronRight, Sun, Moon } from "lucide-react";
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

// This component displays a page for selecting schedules and staff.
// It uses Redux for global state management and SWR for data fetching.
const TimePage: React.FC = () => {
  // Maps day numbers (0-6) to abbreviated day names
  const dayLabels: { [key: number]: string } = {
    0: "Sun",
    1: "Mon",
    2: "Tue",
    3: "Wed",
    4: "Thu",
    5: "Fri",
    6: "Sat",
  };

  // Redux state and router initializations handle store and booking data.
  // It also sets default selected date and time when available.
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
  const [scrollPosition, setScrollPosition] = useState(0);  // Tracks horizontal scroll position of date selector
  const scrollRef = React.useRef<HTMLDivElement>(null);     // Reference to scrollable date container
  
  // Date calculations - Generate an array of dates for the next 31 days
  const currentDate = new Date();
  const days = [...Array(31)].map((_, index) => {
    const date = new Date();
    date.setDate(date.getDate() + index);
    return date;
  });

    
  // Initialize selectedIndex based on previously stored date from Redux state
  // This maintains selection when navigating back to this page
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

  // Initialize selectDay using stored date from Redux or default to current date
  const [selectDay, setSelectDay] = useState<string | null>(
    bookingInfo.selectedDate || moment(new Date()).format("DD/MM/YYYY")
  );
  
  // Controls visibility of same-day booking restriction message
  const [showDenyInDayBookingMessage, setShowDenyInDayBookingMessage] = useState<boolean>(false);
  
  // Initialize time selection from Redux or null if not previously selected
  const [selectHour, setSelectHour] = useState<string | null>(
    bookingInfo.selectedHour || null
  );
  
  // Initialize staff selection dropdown value based on Redux state
  const [selectStaff, setSelectStaff] = useState<any>({
    value: staffId,
    label: staffList?.find(staff => staff.id === staffId)
      ? `${staffList.find(staff => staff.id === staffId)?.firstName} ${staffList.find(staff => staff.id === staffId)?.lastName}`
      : "Any Professional"
  });

  // Calculate unavailable dates based on staff working days
  // This memoized value prevents unnecessary recalculations
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

  // SWR data fetcher function for API calls
  const fetcher: FetcherFunction = (url) =>
    axios
      .get(url, {
        headers: {
          "X-StoreID": urlStoreUuid.storeUuid,
        },
      })
      .then((res) => res.data);

  // Fetch store closed dates (holidays, special closures) from API
  const { data: storeClosedDates } = useSWR("/storeConfig/closedDate/future", fetcher);

  // Convert closed dates to a format easier to work with (moment ranges)
  const closedDateRanges = useMemo(() => {
    if (!storeClosedDates) return [];
    return storeClosedDates.map((cd: StoreClosedDate) => ({
      start: moment(cd.closedStartDate, "DD/MM/YYYY"),
      end: moment(cd.closedEndDate, "DD/MM/YYYY"),
    }));
  }, [storeClosedDates]);

  interface ClosedDateRange {
    start: moment.Moment;
    end: moment.Moment;
  }

  // Helper function to check if a date falls within closed date ranges
  const isClosedDate = (date: Date): boolean =>
    closedDateRanges.some((range: ClosedDateRange): boolean =>
      moment(date).isBetween(range.start, range.end, "day", "[]")
    );

  // Fetch staff availability for the selected date
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

  // Effect to handle initial date selection and find first available date
  // if current selection is unavailable
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
        ) || isClosedDate(days[todayIndex]);
        
        if (!isUnavailable) {
          handleSelectedDate(todayIndex, days[todayIndex]);
        } else {
          // Find next available date
          const nextAvailableIndex = days.findIndex((date, index) => {
            return index > todayIndex && !unavailableDates.some(
              (unavailableDate) => unavailableDate.getTime() === date.getTime()
            ) && !isClosedDate(date);
          });
          
          if (nextAvailableIndex !== -1) {
            handleSelectedDate(nextAvailableIndex, days[nextAvailableIndex]);
          }
        }
      }
    }
  }, [days, unavailableDates]);

  // Handle same-day booking restrictions and staff working days
  useEffect(() => {
    const today = moment().startOf("day");
    const selectedMoment = selectDay 
      ? moment(selectDay, "DD/MM/YYYY").startOf("day") 
      : today;
    
    // Show warning if same-day booking is disabled in store settings
    setShowDenyInDayBookingMessage(
      selectedMoment.isSame(today) && !storeInfo?.storeInfo?.enableInDayBooking
    );

    // Only set initial date if no date is selected
    if (!selectDay && !bookingInfo.selectedDate) {
      const formattedDate = moment(today).format("DD/MM/YYYY");
      dispatch(setSelectedDate(formattedDate));
      setSelectDay(formattedDate);
    }

    // Check if current date is unavailable for selected staff
    // and find next available date if needed
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

  // Scroll handlers for date navigation
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

  // Handler for date selection in the calendar
  // Updates local state and Redux store
  const handleSelectedDate = (index: number, date: Date) => {
    setSelectedIndex(index);
    const today = moment().startOf("day");
    const selectedDate = moment(date).startOf("day");
    setShowDenyInDayBookingMessage(
      selectedDate.isSame(today) && !storeInfo?.storeInfo?.enableInDayBooking
    );

    // Reset time selection when date changes
    setSelectHour(null);
    dispatch(setSelectedHour(null));
    const formattedDate = moment(date).format("DD/MM/YYYY");
    dispatch(setSelectedDate(formattedDate));
    setSelectDay(formattedDate);
  };

  // Handler for time slot selection
  // Updates both local state and Redux store
  // Also handles staff assignment logic based on group booking status
  const handleSelectedHour = (hour: { time: string; staff: number[] }) => {
    setSelectHour(hour.time);
    dispatch(setSelectedHour(hour.time));
    
    // Only update staff if the hour is different from the preselected one
    if (hour.time !== bookingInfo.selectedHour) {
      if (!bookingInfo.isGroupBooking) {
        // For single bookings, randomly assign one available staff member
        const randomIndex = Math.floor(Math.random() * hour.staff?.length);
        const randomStaffId = hour.staff[randomIndex];

        if (staffList) {
          dispatch(setStaffIdForGuestServices({staffIds: [randomStaffId], allStaff: staffList}));
        }
      } else {
        // For group bookings, make all available staff members options
        if (allStaff) {
          dispatch(setStaffIdForGuestServices({staffIds: hour.staff, allStaff: allStaff}));
        }
      }
    }
  };

  // Handler for staff selection dropdown
  const handleStaffChange = (selectedOption: any) => {
    setSelectStaff(selectedOption);
    // Reset time selection when staff changes
    setSelectHour(null);
    dispatch(setSelectedHour(null));
    const selectedStaffMember =
      staffList?.find((staff) => staff.id === selectedOption.value) || null;

    if (selectedStaffMember) {
      dispatch(setSelectedStaffForFirstGuest(selectedStaffMember));
    }
  };

  // Redirect to home page if no guests in booking info
  useEffect(() => {
    if (bookingInfo?.guests.length === 0 && urlStoreUuid.storeUuid) {
      router.push("/?storeUuid=" + urlStoreUuid.storeUuid);
    }
  }, [bookingInfo, router, urlStoreUuid.storeUuid]);

  // Handle preselected hour when availability data loads
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

  // Process availability data into a more usable format
  // Filter out past hours if booking for today
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

  // Get day name and store business hours for selected day
  const dayName = selectedDateMoment.format("dddd");
  const storeBusinessHoursForSelectedDay = storeInfo?.storeInfo?.businessHoursList?.find(
    (b) => b.dayOfWeek.toLowerCase() === dayName.toLowerCase()
  );
  const closingTimeMoment = storeBusinessHoursForSelectedDay
    ? moment(storeBusinessHoursForSelectedDay.closingTime, "HH:mm")
    : null;

  // Filter time slots based on group booking requirements and store closing time
  const filteredHoursForGroupBooking = useMemo(() =>
    hourArray
      .filter(hour => {
        // For group bookings, ensure enough staff are available
        if (!bookingInfo.isGroupBooking) return true;
        return hour.staff.length >= bookingInfo.guests.length;
      })
      .filter(hour => {
        // Ensure service will finish before store closes
        if (!closingTimeMoment) return true;
        const hourMoment = moment(hour.time, "HH:mm");
        return !bookingInfo.guests.some(g =>
          hourMoment.clone().add(g.totalEstimatedTime, "minutes").isAfter(closingTimeMoment)
        );
      }),
    [hourArray, bookingInfo.isGroupBooking, bookingInfo.guests, closingTimeMoment]
  );

  // Show loading state if staff data isn't available yet
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
                ) || isClosedDate(date);
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

      {/* Same Day Booking Message - Displayed when store doesn't allow same-day bookings */}
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
            // Loading skeleton for time slots
            <div className="grid grid-cols-4 gap-4">
              {[1, 2, 3, 4, 5, 6, 7, 8].map((index) => (
                <div
                  key={index}
                  className="h-12 bg-gray-100 rounded-xl animate-pulse"
                />
              ))}
            </div>
          ) : hourArray?.length === 0 ? (
            // No availability message
            <div className="text-center p-8 bg-gray-50 rounded-xl">
              <Clock className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-lg font-medium text-gray-900">
                No available time slots
              </p>
            </div>
          ) : (
            // Time slots organized by morning and afternoon
            <div className="space-y-6">
              {/* Morning Section - Times before noon */}
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-3 flex items-center gap-2">
                  <Sun className="w-4 h-4" />
                  Morning
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
                  {filteredHoursForGroupBooking
                    .filter(hour => {
                      const hourNum = parseInt(hour.time.split(':')[0]);
                      return hourNum < 12;
                    })
                    .map((hour, index) => (
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
                        
                        {/* Staff availability indicator - Shows different icons for group vs individual */}
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
              </div>

              {/* Afternoon Section - Times noon and after */}
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-3 flex items-center gap-2">
                  <Moon className="w-4 h-4" />
                  Afternoon
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
                  {filteredHoursForGroupBooking
                    .filter(hour => {
                      const hourNum = parseInt(hour.time.split(':')[0]);
                      return hourNum >= 12;
                    })
                    .map((hour, index) => (
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
                        
                        {/* Staff availability indicator with different UI for group vs individual bookings */}
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
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default TimePage;
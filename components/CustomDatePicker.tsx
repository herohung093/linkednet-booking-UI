import React from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

interface DatePickerProps {
  selectedDate: Date | null;
  onSelectDate: (date: Date) => void;
}

const CustomDatePicker: React.FC<DatePickerProps> = ({
  selectedDate,
  onSelectDate,
}) => {
  const handleSelectDate = (date: Date) => {
    onSelectDate(date as Date);
  };

  const today = new Date();
  const twoWeeksFromNow = new Date(today.getTime() + 14 * 24 * 60 * 60 * 1000); // 2 weeks from now
  const minTime = new Date();
  minTime.setHours(9, 0, 0); // 9am 
  const maxTime = new Date();
  maxTime.setHours(17, 0, 0); // 5pm 
  return (
    <DatePicker
      selected={selectedDate}
      onChange={handleSelectDate}
      dateFormat="dd/MM/yyyy HH:mm"
      placeholderText="Select a date and time"
      showTimeSelect
      timeFormat="HH:mm"
      minDate={today}
      maxDate={twoWeeksFromNow}
      minTime={minTime}
      maxTime={maxTime}
      className="border border-gray-300 rounded-md px-3 py-1 focus:outline-none focus:border-blue-500"
    />
  );
};

export default CustomDatePicker;

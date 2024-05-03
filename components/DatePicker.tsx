"use client";
import React, { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

interface DatePickerProps {
  selectedDate: Date | null;
  onSelectDate: (date: Date) => void;
}

const CustomDatePicker: React.FC<DatePickerProps> = (
  {
    selectedDate,
    onSelectDate,
  }
) => {

  return (
    <DatePicker
      selected={selectedDate}
      onChange={(date) => onSelectDate(date as Date)}
      dateFormat="dd/MM/yyyy"
      placeholderText="Select a date"
      className="border border-gray-300 rounded-md px-3 py-1 focus:outline-none focus:border-blue-500"
    />
  );
};

export default CustomDatePicker;

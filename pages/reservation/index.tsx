"use client";
import Cart from "@/components/Cart";
import CustomDatePicker from "@/components/CustomDatePicker";
import { setSelectedDate } from "@/redux toolkit/cartSlice";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { useDispatch } from "react-redux";

const CartPage: React.FC = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const [selectDate, setSelectDate] = useState<Date | null>(null);

  const handleDateSelect = (date: Date) => {
    setSelectDate(date);
  };
  const handleSelectedDateRedux = () => {
    if (selectDate) {
      const formattedDate = selectDate.toLocaleString("en-GB");
      dispatch(setSelectedDate(formattedDate));
    }
    router.push("/confirmation");
  };

  return (
    <div className="w-[90%] mx-auto mt-9">
      <Cart />
      <div className="flex justify-center mt-5 mb-[40px]">
        <CustomDatePicker
          selectedDate={selectDate}
          onSelectDate={handleDateSelect}
        />
      </div>
      <div className="flex justify-between mx-5 ">
        <button
          onClick={() => {
            router.push("/");
          }}
          className="text-blue-900 border-2 border-blue-900 rounded-lg font-bold w-[140px]   shadow-green7 inline-flex h-[35px] items-center justify-center px-[15px] leading-none focus:shadow-[0_0_0_2px] "
        >
          Go Back
        </button>
        <button
          onClick={handleSelectedDateRedux}
          disabled={!selectDate}
          className="text-blue-900 border-2 border-blue-900 rounded-lg font-bold w-[140px]  shadow-green7 inline-flex h-[35px] items-center justify-center px-[15px] leading-none focus:shadow-[0_0_0_2px] "
        >
          Select Date
        </button>
      </div>
    </div>
  );
};

export default CartPage;

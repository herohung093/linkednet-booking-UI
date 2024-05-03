import Cart from "@/components/Cart";
import { log } from "console";
import React from "react";
import { useSelector } from "react-redux";

const ConfirmationPage: React.FC = () => {
  const bookingInfo = useSelector((state: any) => state.cart);

  return (
    <div className="w-[90%] mx-auto mt-9">
      <div>
        <h1 className="text-2xl font-semibold mb-5">Booking confirmation</h1>
        <Cart />
        <h2 className="text-xl font-semibold mb-3 mt-3">
          Date: {bookingInfo.selectedDate}
        </h2>
        <h2 className="text-xl font-semibold mb-3">
          Staff:{" "}
          {bookingInfo.selectedStaff.firstName +
            bookingInfo.selectedStaff.lastName}
        </h2>
      </div>
      <div className="flex justify-between items-center mx-10 mt-10">
        <button className="text-blue-900 border-2 border-black rounded-lg font-bold w-[100px]  shadow-green7 inline-flex h-[35px] items-center justify-center px-[15px] leading-none focus:shadow-[0_0_0_2px] ">
          Cancel
        </button>
        <button className="text-blue-900 border-2 border-black rounded-lg font-bold w-[100px]  shadow-green7 inline-flex h-[35px] items-center justify-center px-[15px] leading-none focus:shadow-[0_0_0_2px] ">
          Confirm
        </button>
      </div>
    </div>
  );
};

export default ConfirmationPage;

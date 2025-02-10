import React from "react";
import { useDispatch } from "react-redux";
import {
  addGuest,
  setCurrentGuestName,
  setIsGroupBooking,
} from "@/redux toolkit/cartSlice";
import { getGuests } from "@/redux toolkit/cartSlice";
import { useSelector } from "react-redux";
import { User, Users } from "lucide-react";

interface BookingTypeSelectionProps {
  onClose: () => void;
}

const BookingTypeSelection: React.FC<BookingTypeSelectionProps> = ({
  onClose,
}) => {
  const dispatch = useDispatch();
  const guests = useSelector(getGuests);

  const handleClick = (type: string) => {
    const guestName = guests.length === 0 ? "Me" : `Guest ${guests.length + 1}`;
    dispatch(
      addGuest({
        id: null,
        name: guestName,
        guestServices: [],
        totalPrice: 0,
        totalEstimatedTime: 0,
      })
    );
    dispatch(setIsGroupBooking(type === "selfAndOthers"));
    dispatch(setCurrentGuestName(guestName));
    onClose();
  };

  return (
    <div className="w-full max-w-md">
      <div className="px-4 py-6">
        <h2 className="text-2xl font-bold text-gray-900 text-center mb-8">
          Who is this booking for?
        </h2>
        
        <div className="space-y-4">
          {/* For Myself Button */}
          <button
            onClick={() => handleClick("self")}
            className="w-full group relative flex items-center px-6 py-4 bg-white border-2 border-gray-200 rounded-xl hover:border-black hover:shadow-lg transition-all duration-200"
          >
            <div className="flex items-center justify-center w-10 h-10 bg-black rounded-lg shrink-0">
              <User className="w-5 h-5 text-white" />
            </div>
            <div className="ml-4 text-left">
              <h3 className="text-lg font-semibold text-gray-900">For Myself</h3>
              <p className="text-sm text-gray-500">Book a single appointment</p>
            </div>
          </button>

          {/* For Myself and Others Button */}
          <button
            onClick={() => handleClick("selfAndOthers")}
            className="w-full group relative flex items-center px-6 py-4 bg-white border-2 border-gray-200 rounded-xl hover:border-black hover:shadow-lg transition-all duration-200"
          >
            <div className="flex items-center justify-center w-10 h-10 bg-black rounded-lg shrink-0">
              <Users className="w-5 h-5 text-white" />
            </div>
            <div className="ml-4 text-left">
              <h3 className="text-lg font-semibold text-gray-900">Group Booking</h3>
              <p className="text-sm text-gray-500">Book for multiple people</p>
            </div>
          </button>
        </div>

        <p className="mt-6 text-sm text-gray-500 text-center">
          Choose an option to proceed with your booking
        </p>
      </div>
    </div>
  );
};

export default BookingTypeSelection;
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Box, Typography, Divider } from "@mui/material";
import moment from "moment";
import { Clock, DollarSign, User, Calendar } from "lucide-react";
import { RootState } from "@/redux toolkit/store";

interface CartProps {
  onContinue?: () => void;
  disableContinueButton?: boolean;
}

const Cart: React.FC<CartProps> = ({ onContinue, disableContinueButton }) => {
  // Redux state
  const cartRedux = useSelector((state: RootState) => state.cart);

  // Local state
  const [guests, setGuests] = useState(cartRedux.guests);
  const [selectedDate, setSelectedDate] = useState<string | null>(cartRedux.selectedDate);
  const [selectedHour, setSelectedHour] = useState<string | null>(cartRedux.selectedHour);
  
  // Calculate total price
  const totalPrice = guests.reduce((sum, guest) => sum + guest.totalPrice, 0);

  // Update local state when Redux state changes
  useEffect(() => {
    setGuests(cartRedux.guests);
    setSelectedDate(cartRedux.selectedDate);
    setSelectedHour(cartRedux.selectedHour);
  }, [cartRedux.guests, cartRedux.selectedDate, cartRedux.selectedHour]);

  return (
    <Box className="flex flex-col h-full">
      {/* Guest Services Section */}
      <Box flex={1} className="space-y-6">
        {guests.map((guest) => (
          <Box key={guest.name + guest.id} className="bg-gray-50 rounded-xl p-4">
            {/* Guest Header */}
            <Box className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-black rounded-lg">
                <User className="w-4 h-4 text-white" />
              </div>
              <div>
                <Typography variant="subtitle1" fontWeight="medium">
                  {guest.name}
                </Typography>
                <Typography variant="caption" color="text.secondary" className="flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {guest.totalEstimatedTime} mins
                </Typography>
              </div>
            </Box>

            {/* Guest Services */}
            <Box className="space-y-3">
              {guest.guestServices?.map((guestService) => (
                <Box
                  key={guest.name + guestService.serviceItem.id}
                  className="bg-white rounded-lg p-3"
                >
                  <Box className="flex justify-between items-start mb-1">
                    <Typography variant="body2" fontWeight="medium">
                      {guestService.serviceItem.serviceName}
                    </Typography>
                    <Typography variant="body2" className="flex items-center gap-1">
                      <DollarSign className="w-3 h-3" />
                      {guestService.serviceItem.servicePrice.toFixed(2)}
                    </Typography>
                  </Box>

                  {guestService.staff && (
                    <Typography
                      variant="caption"
                      color="text.secondary"
                      className="flex items-center gap-1"
                    >
                      <User className="w-3 h-3" />
                      {guestService.staff.nickname}
                    </Typography>
                  )}
                </Box>
              ))}
            </Box>
          </Box>
        ))}
      </Box>

      {/* Summary Section */}
      <Box className="mt-6 pt-4 border-t border-gray-100 px-4">
        {/* Total */}
        <Box className="flex justify-between items-center mb-6">
          <Typography variant="h6" fontWeight="bold">
            Total
          </Typography>
          <Typography variant="h6" fontWeight="bold">
            ${totalPrice.toFixed(2)}
          </Typography>
        </Box>

        {/* Date and Time */}
        <Box className="space-y-4">
          <Box className="flex items-center justify-between text-gray-600">
            <Typography className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              Date
            </Typography>
            <Typography>
              {selectedDate ? moment(selectedDate, "DD/MM/YYYY").format("DD MMM YYYY") : "Not Selected"}
            </Typography>
          </Box>
          <Box className="flex items-center justify-between text-gray-600">
            <Typography className="flex items-center gap-2">
              <Clock className="w-4 h-4" />
              Time
            </Typography>
            <Typography>
              {selectedHour ? moment(selectedHour, "HH:mm").format("h:mm A") : "Not Selected"}
            </Typography>
          </Box>
        </Box>

        {/* Continue Button */}
        {onContinue && (
          <Box className="mt-6 mb-4"> {/* Added mb-4 here for bottom spacing */}
            <button
              onClick={onContinue}
              disabled={disableContinueButton}
              className={`
                w-full px-6 py-3 rounded-xl font-medium transition-all
                ${disableContinueButton
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : 'bg-black text-white hover:bg-gray-900'
                }
              `}
            >
              Continue
            </button>
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default Cart;
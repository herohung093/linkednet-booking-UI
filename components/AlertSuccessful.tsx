import React, { useState } from "react";
import * as AlertDialog from "@radix-ui/react-alert-dialog";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { clearCart } from "@/redux toolkit/cartSlice";
import { RootState } from "@/redux toolkit/store";
import moment from "moment";
import { 
  Calendar, 
  Copy, 
  Check, 
  Clock, 
  CheckCircle2, 
  AlertCircle,
  Loader2
} from "lucide-react";
import { Snackbar, Alert } from "@mui/material";

const AlertSuccessful: React.FC<{
  id: string | number;
  ok: boolean;
  bookingInfo: CartState;
  status: string;
  isLoading: boolean;
}> = ({ bookingInfo, ok, id, status, isLoading }) => {
  const router = useRouter();
  const dispatch = useDispatch();
  const [showCopyToast, setShowCopyToast] = useState<boolean>(false);
  const storeUuid = useSelector((state: RootState) => state.storeInfo.storeUuid);

  const handleCopyClick = () => {
    navigator.clipboard.writeText(id.toString());
    setShowCopyToast(true);
  };

  const handleDone = () => {
    dispatch(clearCart());
    router.push("/?storeUuid=" + storeUuid);
  };

  return (
    <AlertDialog.Root open={ok}>
      <AlertDialog.Portal>
        <AlertDialog.Overlay 
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50
            data-[state=open]:animate-fadeIn"
        />
        
        <AlertDialog.Content
          className="fixed top-[50%] left-[50%] max-h-[85vh] w-[90vw] max-w-[500px]
            translate-x-[-50%] translate-y-[-50%] rounded-xl bg-white
            shadow-xl focus:outline-none z-50 data-[state=open]:animate-contentShow
            overflow-hidden"
        >
          {/* Success Icon and Header */}
          <div className="text-center p-6 pb-0">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-green-100 
              flex items-center justify-center">
              <CheckCircle2 className="w-8 h-8 text-green-600" />
            </div>
            <h2 className="text-2xl font-semibold text-gray-900 mb-2">
              Booking Confirmed
            </h2>
            <p className="text-gray-600">
              Thank you for your booking. We look forward to seeing you!
            </p>
          </div>

          {/* Booking Details */}
          <div className="p-6 space-y-4">
            {/* Date and Time */}
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-center gap-3 mb-3">
                <Calendar className="w-5 h-5 text-gray-500" />
                <div>
                  <p className="text-sm text-gray-500">Appointment Date</p>
                  <p className="font-medium">
                    {moment(bookingInfo.selectedDate, "DD/MM/YY").format("dddd, D MMM YYYY")}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Clock className="w-5 h-5 text-gray-500" />
                <div>
                  <p className="text-sm text-gray-500">Appointment Time</p>
                  <p className="font-medium">
                    {moment(bookingInfo.selectedHour, "HH:mm").format("h:mm A")}
                  </p>
                </div>
              </div>
            </div>

            {/* Booking ID */}
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Booking ID</p>
                  <p className="font-medium">{id}</p>
                </div>
                <button
                  onClick={handleCopyClick}
                  className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
                  aria-label="Copy booking ID"
                >
                  <Copy className="w-4 h-4 text-gray-500" />
                </button>
              </div>
            </div>

            {/* Status */}
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Status</p>
                  <div className="flex items-center gap-2">
                    {status === "APPROVED" ? (
                      <>
                        <Check className="w-4 h-4 text-green-600" />
                        <span className="font-medium text-green-600">Approved</span>
                      </>
                    ) : (
                      <>
                        <AlertCircle className="w-4 h-4 text-yellow-600" />
                        <span className="font-medium text-yellow-600">Pending Approval</span>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Action Button */}
          <div className="p-6 pt-0">
            <button
              onClick={handleDone}
              disabled={isLoading}
              className="w-full py-3 px-4 bg-black text-white rounded-xl font-medium
                hover:bg-gray-900 transition-colors disabled:opacity-50 
                disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Processing...
                </>
              ) : (
                'Done'
              )}
            </button>
          </div>
        </AlertDialog.Content>
      </AlertDialog.Portal>

      {/* Copy Success Toast */}
      <Snackbar
        open={showCopyToast}
        autoHideDuration={2000}
        onClose={() => setShowCopyToast(false)}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert 
          onClose={() => setShowCopyToast(false)} 
          severity="success"
          sx={{ 
            alignItems: 'center',
            '& .MuiAlert-message': { display: 'flex', alignItems: 'center', gap: 1 }
          }}
        >
          <Check className="w-4 h-4" />
          Copied to clipboard!
        </Alert>
      </Snackbar>
    </AlertDialog.Root>
  );
};

export default AlertSuccessful;
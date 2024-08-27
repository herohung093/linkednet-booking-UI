import React, { useState } from "react";
import * as AlertDialog from "@radix-ui/react-alert-dialog";
import { useRouter } from "next/navigation";
import { clearCart } from "@/redux toolkit/cartSlice";
import { useDispatch, useSelector } from "react-redux";
import moment from "moment";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import CheckIcon from "@mui/icons-material/Check";
import { grey } from "@mui/material/colors";
import { Snackbar, Alert, Button } from "@mui/material";
import PendingIcon from "@mui/icons-material/Pending";
import { RootState } from "@/redux toolkit/store";

const AlertSuccessful: React.FC<{
  id: string | number;
  ok: boolean;
  bookingInfo: CartState;
  status: string;
  isLoading: boolean;
}> = ({ bookingInfo, ok, id, status }) => {
  const router = useRouter();
  const dispatch = useDispatch();
  const [open, setOpen] = useState<boolean>(false);
  const storeUuid = useSelector((state: RootState) => state.storeInfo.storeUuid);

  const handleCopyClick = () => {
    navigator.clipboard.writeText(id.toString());
    setOpen(true);
    setTimeout(() => {
      setOpen(false);
    }, 2000);
  };

  return (
    <AlertDialog.Root open={ok}>
      <AlertDialog.Trigger asChild>
      </AlertDialog.Trigger>
      <AlertDialog.Portal>
        <AlertDialog.Overlay className="bg-slate-700 bg-opacity-70 data-[state=open]:animate-overlayShow fixed inset-0" />
        <AlertDialog.Content className="data-[state=open]:animate-contentShow fixed top-[50%] left-[50%] max-h-[85vh] w-[80vw] max-w-[500px] translate-x-[-50%] translate-y-[-50%] rounded-[10px] bg-white p-[25px] shadow-[hsl(206_22%_7%_/_35%)_0px_10px_38px_-10px,_hsl(206_22%_7%_/_20%)_0px_10px_20px_-15px] focus:outline-none z-10">
          <>
            <AlertDialog.Title className="text-mauve12 m-0 text-md font-bold  flex justify-center items-center">
              Confirmation
            </AlertDialog.Title>
            <AlertDialog.Description className="flex justify-center  xs:text-xl  mb-3 mt-3 font-bold">
              Your reservation is confirmed
            </AlertDialog.Description>
            <AlertDialog.Description className="text-lg font-semibold mt-5">
              {`We'll see you on`}
            </AlertDialog.Description>
            <AlertDialog.Description className="flex justify-between text-md font-semibold mb-3 text-gray-500">
              {`${moment(bookingInfo.selectedDate, "DD/MM/YY").format(
                "ddd D MMM"
              )} at ${moment(bookingInfo.selectedHour, "HH:mm").format(
                "h.mm a"
              )}`}
              <CalendarMonthIcon sx={{ color: grey[900] }} />
            </AlertDialog.Description>
            <AlertDialog.Description className="text-lg  mt-5 font-bold">
              Booking ID:
            </AlertDialog.Description>
            <AlertDialog.Description className="flex justify-between text-md font-semibold mb-3 text-gray-500">
              {id}{" "}
              <ContentCopyIcon
                sx={{ color: grey[900], cursor: "pointer" }}
                onClick={handleCopyClick}
              />
              <Snackbar
                open={open}
                autoHideDuration={2000}
                onClose={() => setOpen(false)}
                anchorOrigin={{ vertical: "top", horizontal: "center" }}
              >
                <Alert onClose={() => setOpen(false)} severity="success">
                  Copied to clipboard!
                </Alert>
              </Snackbar>
            </AlertDialog.Description>

            <AlertDialog.Description className="text-lg  mt-5 font-bold">
              Status:
            </AlertDialog.Description>
            <AlertDialog.Description className="flex justify-between text-md font-semibold mb-3 text-gray-500">
              {status}
              {status == "APPROVED" && (
                <CheckIcon sx={{ color: grey[900] }} />
              )}
              {status == "PENDING" && (
                <PendingIcon sx={{ color: grey[900] }} />
              )}
            </AlertDialog.Description>
          </>

          <div className="flex justify-center">
            <AlertDialog.Action asChild>
              <Button
                onClick={() => {
                  dispatch(clearCart());

                  router.push("/?storeUuid=" + storeUuid);
                }}
                variant="contained" // Use 'contained' to have a solid background color
                className="mt-4 px-4 py-2 w-full"
                sx={{
                  backgroundColor: 'black',
                  color: 'white',
                  borderRadius: '20px',
                  textTransform: 'none', // Keep the text casing as it is
                  '&:hover': {
                    backgroundColor: 'black', // Keep the same background color on hover
                  },
                }}
              >
                Done
              </Button>
            </AlertDialog.Action>
          </div>
        </AlertDialog.Content>
      </AlertDialog.Portal>
    </AlertDialog.Root>
  );
};

export default AlertSuccessful;
